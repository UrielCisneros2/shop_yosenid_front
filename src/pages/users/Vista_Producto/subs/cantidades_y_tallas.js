import React, { useState, useEffect, useContext } from 'react';
import { InputNumber, Button, Form, Badge, Divider, notification, Modal, Select, Alert, List, Avatar } from 'antd';
import { ShoppingCartOutlined, TagsOutlined, BellOutlined, WhatsAppOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import { AgregarCarrito, AgregarApartado, AgregarPedido } from './services';
import { formatoMexico } from '../../../../config/reuserFunction';
import { withRouter } from 'react-router-dom';
import { MenuContext } from '../../../../context/carritoContext';
import DatosCliente from './datos_cliente';
import clienteAxios from '../../../../config/axios';
import aws from '../../../../config/aws';
import Spin from '../../../../components/Spin';

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 }
	}
};
const { Option } = Select;

function TallasCantidades(props) {
	const { active, setActive } = useContext(MenuContext);
	const productos = props.producto;
	const [ categoria, setCategoria ] = useState();
	/* 	const [ cantidad, setCantidad ] = useState(); */
	const [ promocion, setPromocion ] = useState('');
	const [ tallas, setTallas ] = useState([]);
	const [ numeros, setNumeros ] = useState([]);
	const [ render, setRender ] = useState([]);
	const [ validateStatus, setValidateStatus ] = useState('validating');
	const [ cantidadFinal, setCantidadFinal ] = useState(1);
	const [ tipoEnvio, setTipoEnvio ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ visible, setVisible ] = useState(false);
	const [ disabled, setDisabled ] = useState(false);
/* 	const [ datosUser, setDatosUser ] = useState([]); */
	const [ tienda, setTienda ] = useState([]);

	const token = localStorage.getItem('token');
	var decoded = Jwt(token);
	var total = 0;
	var precio = 0;

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	async function obtenerTienda() {
		setLoading(true);
		await clienteAxios
			.get(`/tienda/`)
			.then((res) => {
				res.data.forEach((element) => setTienda(element));
				setLoading(false);
			})
			.catch((res) => {
				setLoading(false);
			});
	}

	/* async function obtenerDatosUser() {
		if (!decoded) {
			return null;
		}
		await clienteAxios
			.get(`/cliente/${decoded._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setDatosUser(res.data);
			})
			.catch((err) => {});
	} */

	useEffect(() => {
		if (token) {
			/* obtenerDatosUser(); */
			obtenerTienda();
		}
	}, []);

	useEffect(
		() => {
			if (productos.promocion && productos.promocion.length) {
				productos.promocion.forEach((res) => setPromocion(res.precioPromocion));
			}
			if (productos.tipoCategoria === 'Calzado') {
				setCategoria('calzado');
				setRender(
					productos.numeros.map((numeros) => {
						return numeros.cantidad > 0 ? (
							<Badge key={numeros._id} count={numeros.cantidad}>
								<Button
									type="dashed"
									className="talla-vista-producto d-inline-block"
									onClick={() => setNumeros(numeros)}
								>
									{numeros.numero}
								</Button>
							</Badge>
						) : (
							<Badge
								key={numeros._id}
								showZero
								count={numeros.cantidad}
								//style={{ backgroundColor: '#F5F5F5', color: '#7D7D7D' }}
							>
								<Button type="dashed" disabled className="talla-vista-producto d-inline-block">
									{numeros.numero}
								</Button>
							</Badge>
						);
					})
				);
			} else if (productos.tipoCategoria === 'Ropa') {
				setCategoria('ropa');
				setRender(
					productos.tallas.map((tallas) => {
						return tallas.cantidad > 0 ? (
							<Badge key={tallas._id} count={tallas.cantidad}>
								<Button
									type="dashed"
									className="talla-vista-producto d-inline-block"
									onClick={() => setTallas(tallas)}
								>
									{tallas.talla}
								</Button>
							</Badge>
						) : (
							<Badge
								key={tallas._id}
								count={tallas.cantidad}
								showZero
								style={{ backgroundColor: '#F5F5F5', color: '#7D7D7D' }}
							>
								<Button type="dashed" disabled className="talla-vista-producto d-inline-block">
									{tallas.talla}
								</Button>
							</Badge>
						);
					})
				);
			} else if (productos.tipoCategoria === 'Otros') {
				setCategoria('otros');
			}
			if (productos && productos.activo === false) {
				setDisabled(true);
			}
		},
		[ productos ]
	);

	function obtenerCantidad(cantidad) {
		if (cantidad <= 0 || cantidad > productos.cantidad) {
			setValidateStatus('error');
		} else {
			setValidateStatus('validating');
			setCantidadFinal(cantidad);
		}
	}
	function obtenerCantidadNumero(cantidad) {
		if (cantidad <= 0 || cantidad > numeros.cantidad) {
			setValidateStatus('error');
		} else {
			setValidateStatus('validating');
			setCantidadFinal(cantidad);
		}
	}
	function obtenerCantidadTalla(cantidad) {
		if (cantidad <= 0 || cantidad > tallas.cantidad) {
			setValidateStatus('error');
		} else {
			setValidateStatus('validating');
			setCantidadFinal(cantidad);
		}
	}

	function obtenerTipoEnvio(value) {
		setTipoEnvio(value);
	}

	const showModal = () => {
		if (!token) {
			localStorage.setItem('vistas', `/vista_producto/${productos._id}`);
			props.history.push('/entrar');
			notification.info({
				message: 'inicia sesión para poder realizar tus compras',
				duration: 2
			});
		} else {
			if (categoria === 'ropa' && !tallas.talla) {
				notification.info({
					message: 'Selecciona una talla',
					duration: 2
				});
			} else if (categoria === 'calzado' && !numeros.numero) {
				notification.info({
					message: 'Selecciona una talla',
					duration: 2
				});
			} else {
				setVisible(true);
			}
		}
	};

	const handleOk = () => {
		if (!tipoEnvio) {
			notification.info({
				message: 'Selecciona un tipo de envio',
				duration: 2
			});
		} else {
			setVisible(false);
			Apartado();
		}
	};

	const handleCancel = (e) => {
		setVisible(false);
	};

	function modalMensaje() {
		Modal.success({
			icon: '',
			content: (
				<div className="text-center">
					<p style={{ fontSize: 18 }}>¡Tu apartado a sido recibido y sera despachado próximamente!</p>
					{tienda.length !== 0 && tienda.telefono ? (
						<div className="text-center">
							<p style={{ fontSize: 18 }}>Si tienes dudas te puedes comunicar al</p>
							<p
								style={{ fontSize: 18 }}
								className="d-flex justify-content-center align-items-center font-weight-bold"
							>
								<WhatsAppOutlined style={{ color: '#25d366' }} />
								{tienda.telefono}
							</p>
							<Button
								className="mt-3 color-boton"
								type="default"
								onClick={() => (window.location.href = '/pedidos')}
							>
								Ver mis pedidos
							</Button>
						</div>
					) : (
						<p />
					)}
				</div>
			),
			onOk() {}
		});
	}

	async function Carrito() {
		////AGREGAR CARRITO
		if (!token) {
			localStorage.setItem('vistas', `/vista_producto/${productos._id}`);

			props.history.push('/entrar');
			notification.info({
				message: 'inicia sesión para poder realizar tus compras',
				duration: 2
			});
		} else {
			setLoading(true);
			if (categoria === 'calzado') {
				if (!numeros.numero) {
					setLoading(false);
					notification.info({
						message: 'Selecciona una talla',
						duration: 2
					});
				} else {
					const talla = '';
					if (AgregarCarrito(decoded._id, productos._id, cantidadFinal, talla, numeros.numero, token)) {
						setActive(!active);
					}
					setLoading(false);
				}
			} else if (categoria === 'ropa') {
				if (!tallas.talla) {
					setLoading(false);
					notification.info({
						message: 'Selecciona una talla',
						duration: 2
					});
				} else {
					const numero = '';
					setLoading(false);
					if (AgregarCarrito(decoded._id, productos._id, cantidadFinal, tallas.talla, numero, token)) {
						setActive(!active);
					}
				}
			} else if (categoria === 'otros') {
				const talla = '';
				const numero = '';
				if (AgregarCarrito(decoded._id, productos._id, cantidadFinal, talla, numero, token)) {
					setActive(!active);
				}
				setLoading(false);
			}
		}
	}

	async function Apartado() {
		let precio;
		if(productos.promocion.length !== 0){
			precio = productos.promocion[0].precioPromocion;
		}else{
			precio = productos.precio;
		}
		////AGREGAR APARTADO
		setLoading(true);
		if (categoria === 'calzado') {
			const talla = '';
			AgregarApartado(decoded._id, productos._id, cantidadFinal, precio, talla, numeros.numero, tipoEnvio, token);
			setLoading(false);
			modalMensaje();
		} else if (categoria === 'ropa') {
			const numero = '';
			setLoading(false);
			AgregarApartado(decoded._id, productos._id, cantidadFinal, precio, tallas.talla, numero, tipoEnvio, token);
			modalMensaje();
		} else if (categoria === 'otros') {
			const talla = '';
			const numero = '';
			AgregarApartado(decoded._id, productos._id, cantidadFinal, precio, talla, numero, tipoEnvio, token);
			setLoading(false);
			modalMensaje();
		}
	}

	async function Pedido() {
		////AGREGAR PEDIDO
		if (!token) {
			localStorage.setItem('vistas', `/vista_producto/${productos._id}`);
			props.history.push('/entrar');
			notification.info({
				message: 'inicia sesión para poder realizar tus compras',
				duration: 2
			});
		} else {
			setLoading(true);
			if (categoria === 'calzado') {
				if (!numeros.numero) {
					setLoading(false);
					notification.info({
						message: 'Selecciona una talla',
						duration: 2
					});
				} else {
					const talla = '';
					if (promocion.length !== 0) {
						total = cantidadFinal * promocion;
						precio = promocion;
					} else {
						total = cantidadFinal * productos.precio;
						precio = productos.precio;
					}
					AgregarPedido(
						decoded._id,
						productos._id,
						cantidadFinal,
						talla,
						numeros.numero,
						precio,
						total,
						token
					);
					setLoading(false);
				}
			} else if (categoria === 'ropa') {
				if (!tallas.talla) {
					setLoading(false);
					notification.info({
						message: 'Selecciona una talla',
						duration: 2
					});
				} else {
					const numero = '';
					if (promocion.length !== 0) {
						total = cantidadFinal * promocion;
						precio = promocion;
					} else {
						total = cantidadFinal * productos.precio;
						precio = productos.precio;
					}
					setLoading(false);
					AgregarPedido(
						decoded._id,
						productos._id,
						cantidadFinal,
						tallas.talla,
						numero,
						precio,
						total,
						token
					);
				}
			} else if (categoria === 'otros') {
				const talla = '';
				const numero = '';
				if (promocion.length !== 0) {
					total = cantidadFinal * promocion;
					precio = promocion;
				} else {
					total = cantidadFinal * productos.precio;
					precio = productos.precio;
				}
				AgregarPedido(decoded._id, productos._id, cantidadFinal, talla, numero, precio, total, token);
				setLoading(false);
			}
		}
	}

	return (
		<Spin spinning={loading}>
			<div className="contenedor-p-seleccion-compra">
				<div className="contenedor-p-seleccion-compra mb-4">
					{disabled ? (
						<p className="font-vista-prod disponibilidad-p mb-3">En este momento no hay articulos disponibles</p>
					) : (
						<p className="font-vista-prod mb-3">¡Articulos disponibles!</p>
					)}
					{categoria !== 'otros' ? <p className="mb-3 font-vista-prod font-weight-bold">Tallas:</p> : <p />}
					<div>{render}</div>
				</div>

				<Form initialValues={{ cantidad: 1 }} {...formItemLayout}>
					{categoria !== 'otros' ? (
						<Form.Item
							name="cantidad"
							label="Cantidad"
							className="font-vista-prod"
							validateStatus={validateStatus}
							help={
								categoria === 'ropa' && tallas.length !== 0 ? (
									<p className="font-vista-prod">Solo hay {tallas.cantidad} disponibles</p>
								) : categoria === 'calzado' && numeros.length !== 0 ? (
									<p className="font-vista-prod">Solo hay {numeros.cantidad} disponibles</p>
								) : (
									<p>Elige una talla</p>
								)
							}
						>
							<InputNumber
								type="number"
								size="middle"
								min={1}
								max={categoria === 'ropa' ? tallas.cantidad : numeros.cantidad}
								/* defaultValue={1} */
								onChange={categoria === 'ropa' ? obtenerCantidadTalla : obtenerCantidadNumero}
								style={{ width: 70 }}
								disabled={tallas.length !== 0 || numeros.length !== 0 ? false : true}
							/>
						</Form.Item>
					) : (
						<Form.Item
							className="font-vista-prod"
							label="Cantidad"
							validateStatus={validateStatus}
							help={<p>Solo hay {productos.cantidad} disponibles</p>}
						>
							<InputNumber
								size="large"
								min={1}
								max={productos.cantidad}
								/* defaultValue={1} */
								onChange={obtenerCantidad}
								style={{ width: 130 }}
							/>
						</Form.Item>
					)}
				</Form>

				<Divider />
				{decoded && decoded.rol === true ? (
					<Alert
						className="font-peque"
						description="Como Administrador tienes desabilitadas las opciones de comprar, apartar y agregar al carrito"
						type="info"
						showIcon
					/>
				) : (
					<div className="contenedor-button-vista">
						<div>
							<Button
								className="d-block size-button-vista color-boton font-vista-prod"
								//type="primary"
								size="large"
								onClick={() => Pedido()}
								disabled={disabled}
							>
								<TagsOutlined style={{ fontSize: 20 }} />
								Comprar ahora
							</Button>
							<Button
								className="mt-3 d-block size-button-vista color-boton-sec font-vista-prod"
								size="large"
								onClick={() => showModal()}
								disabled={disabled}
							>
								<BellOutlined style={{ fontSize: 20 }} />
								Apartar
							</Button>
							<Button
								className="mt-3 d-block size-button-vista color-boton-sec font-vista-prod"
								size="large"
								disabled={disabled}
								onClick={() => Carrito()}
							>
								<ShoppingCartOutlined style={{ fontSize: 20 }} />
								Agregar al carrito
							</Button>
						</div>

					</div>

					
				)}
			</div>
			<Modal
				title="Aparta tu producto"
				visible={visible}
				/* onOk={handleOk} */
				onCancel={handleCancel}
				/* cancelText="Cancelar" */
				/* okText="Apartar ahora" */
				footer={null}
				width={700}
			>
				<List>
					<List.Item className="row">
						<div className="col-lg-2">
							<Avatar size={64} src={aws + productos.imagen} />
						</div>
						<div className="col-lg-10">
							<h5 className="font-secun" >{productos.nombre}</h5>
							<div className="row">
								<div className="col-lg-3">
									<h6 className="font-vista-prod">Cantidad: {cantidadFinal}</h6>
								</div>
								{numeros.length !== 0 ? (
									<div className="col-lg-3">
										<h6 className="font-vista-prod">Talla: {numeros.numero}</h6>
									</div>
								) : tallas.length !== 0 ? (
									<div className="col-lg-3">
										<h6 className="font-vista-prod">Talla: {tallas.talla}</h6>
									</div>
								) : (
									<div className="d-none" />
								)}
								<div className="col-lg-3">
									{!productos.promocion ? (
										<h6>Precio: ${formatoMexico(productos.precio)}</h6>
									) : (
										productos.promocion.map((res) => {
											return <h6 key={res._id}>Precio: ${formatoMexico(res.precioPromocion)}</h6>;
										})
									)}
								</div>
							</div>
						</div>
					</List.Item>
				</List>
				<div className="d-flex justify-content-end mt-3 border-bottom">
					{!productos.promocion ? (
						<h4>Total: ${formatoMexico(cantidadFinal * productos.precio)}</h4>
					) : (
						productos.promocion.map((res) => {
							return <h4 key={res._id}>Total: ${formatoMexico(cantidadFinal * res.precioPromocion)}</h4>;
						})
					)}
				</div>
				<div className="row mt-4">
					<div className="col-lg-6 text-center">
						<h6 className="font-vista-prod font-weight-bold">Elegir tipo de envío: </h6>
						<div>
							<Select style={{ width: 200 }} placeholder="Selecciona un tipo" onChange={obtenerTipoEnvio}>
								<Option value="ENVIO">Envío por paquetería</Option>
								<Option value="REGOGIDO">Recoger a sucursal</Option>
							</Select>
						</div>
					</div>
					<div className="col-lg-6">
						<Alert description="Para apartar un producto completa tus datos." type="info" showIcon />
					</div>
				</div>
				<Divider  className="font-vista-prod">Tus datos</Divider>
				{decoded && decoded._id ? (
					<DatosCliente
						token={token}
						clienteID={decoded._id}
						tipoEnvio={tipoEnvio}
						enviarDatos={[ handleOk ]}
					/>
				) : (
					<div />
				)}
			</Modal>
		</Spin>
	);
}
export default withRouter(TallasCantidades);
