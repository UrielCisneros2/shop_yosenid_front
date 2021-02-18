import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './carrito.scss';
import { List, InputNumber, Button, Select, Form, Tag, Modal } from 'antd';
import { ShoppingCartOutlined, ExportOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { formatoMexico, agregarPorcentaje } from '../../../config/reuserFunction';
import { CarritoContext } from './context_carrito/context-carrito';
import { MenuContext } from '../../../context/carritoContext';
import { actualizarCantidad } from './services/consultasCarrito';
import { obtenerSubtotal } from './services/obtenerStock';
import { AgregarPedido, EliminarArticuloCarrito } from './services/consultas_individuales';
import ModalApartado from './modal_apartado';
import aws from '../../../config/aws';
import { verificarArticulos } from './verificarArticulos';

const { Option } = Select;
const styles = { fontSize: 20 };
const { confirm } = Modal;

function ListaCarrito(props) {
	const [ form ] = Form.useForm();
	const [ medida, setMedida ] = useState([]);
	const [ cantidad, setCantidad ] = useState();
	const [ disponible, setDisponible ] = useState('');
	const { carrito, cliente, token } = props;
	const [ medidaDisponible, setMedidaDisponible ] = useState('');
	const [ validateStatus, setValidateStatus ] = useState('validating');
	const { activador, setActivador, setValidacion } = useContext(CarritoContext);
	const { active, setActive } = useContext(MenuContext);
	const [ visible, setVisible ] = useState(false);
	const [ precio, setPrecio ] = useState(0);
	const [ eliminado, setEliminado ] = useState(false);

	useEffect(
		() => {
			setDisponible('');
			setCantidad(carrito.cantidad);
			verificar();

			if (carrito.idarticulo.activo === false) {
				setValidateStatus('error');
				setMedidaDisponible('No esta disponible');
				setDisponible('disponibilidad-carrito');
			} else if (carrito.idarticulo.eliminado && carrito.idarticulo.eliminado === true) {
				setDisponible('disponibilidad-carrito');
				setEliminado(true);
			}

			if (carrito.promocion) {
				setPrecio(carrito.promocion.precioPromocion);
			} else {
				setPrecio(carrito.idarticulo.precio);
			}
		},
		[ carrito ]
	);

	function verificar() {
		if (carrito.idarticulo.tallas.length !== 0) {
			const talla = carrito.idarticulo.tallas.filter((tallas) => carrito.medida[0].talla === tallas.talla);
			const tallaCantidad = carrito.idarticulo.tallas.filter(
				(tallas) => carrito.medida[0].talla === tallas.talla && tallas.cantidad !== 0
			);
			if (talla.length === 0 || tallaCantidad.length === 0) {
				setValidateStatus('error');
				setMedidaDisponible('No esta disponible');
				if (carrito.idarticulo.eliminado && carrito.idarticulo.eliminado === true) {
					setValidacion(false);
				}else{
					setValidacion(true);
				}
			} else {
				setMedida([ talla[0].talla, tallaCantidad[0].cantidad ]);
			}
		} else if (carrito.idarticulo.numeros.length !== 0) {
			const numero = carrito.idarticulo.numeros.filter((numeros) => carrito.medida[0].numero === numeros.numero);
			const numeroCantidad = carrito.idarticulo.numeros.filter(
				(numeros) => carrito.medida[0].numero === numeros.numero && numeros.cantidad !== 0
			);

			if (numero.length === 0 || numeroCantidad.length === 0) {
				setValidateStatus('error');
				setMedidaDisponible('No esta disponible');
				if (carrito.idarticulo.eliminado && carrito.idarticulo.eliminado === true) {
					setValidacion(false);
				}else{
					setValidacion(true);
				}
			} else {
				setMedida([ numero[0].numero, numeroCantidad[0].cantidad ]);
			}
		}
	}

	function medidaChange(medida) {
		setCantidad(carrito.cantidad);
		setMedida(medida);
		setValidacion(true);
		setMedidaDisponible('');
		setValidateStatus('warning');
		setMedidaDisponible('Guarda los cambios');
	}
	function cantidadChange(cantidad) {
		setCantidad(cantidad);
		if (cantidad !== 0) {
			setValidacion(true);
			setValidateStatus('warning');
			setMedidaDisponible('Guarda los cambios');
		}
	}

	function actualizar(articulo, categoria) {
		if (actualizarCantidad(cliente._id, articulo, categoria, cantidad, medida[0], token)) {
			setActivador(!activador);
			setValidacion(false);
			setValidateStatus('validating');
			setMedidaDisponible('');
		}
	}
	function comprar() {
		AgregarPedido(
			cliente._id,
			carrito.idarticulo._id,
			carrito.idarticulo.tipoCategoria,
			carrito.cantidad,
			carrito.medida,
			precio,
			carrito.subtotal,
			token
		);
	}

	function eliminar() {
		confirm({
			title: 'Eliminar articulo?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				if (EliminarArticuloCarrito(cliente._id, carrito._id, token)) {
					setActivador(!activador);
					setActive(!active);
				}
			}
		});
	}

	function apartado() {
		setVisible(true);
	}

	return (
		<List.Item className="d-block p-4" key={carrito._id}>
			<div className={`row ${disponible}`}>
				<div className="col-lg-3">
					<div className="contenedor-imagen-vista-carrito">
						<img
							alt="articulo producto"
							className="imagen-vista-carrito"
							src={aws + carrito.idarticulo.imagen}
						/>
					</div>
				</div>

				<div className="col-lg-9">
					<div className="row">
						<div className="col-lg-8">
							<div>
								<Link to={`/vista_producto/${carrito.idarticulo._id}`}>
									<h3 className="font-carrito">{carrito.idarticulo.nombre}</h3>
								</Link>
								{!carrito.promocion ? (
									<p className="precio-carrito">${formatoMexico(carrito.idarticulo.precio)}</p>
								) : (
									<div>
										<p className="precio-anterior-carrito">
											${formatoMexico(carrito.idarticulo.precio)}
										</p>
										<p className="precio-promocion-carrito mr-2">
											${formatoMexico(carrito.promocion.precioPromocion)}
										</p>
										<p className="porcentaje-promocion-carrito">
											{agregarPorcentaje(
												carrito.promocion.precioPromocion,
												carrito.idarticulo.precio
											)}% OFF
										</p>
									</div>
								)}
								<div className="d-block d-lg-flex">
									<Tag className="font-des-car detalles-carrito color-border-tags">
										Categoria: {carrito.idarticulo.categoria}
									</Tag>
									<Tag className="font-des-car detalles-carrito color-border-tags">
										Género: {carrito.idarticulo.genero}
									</Tag>
									{carrito.idarticulo.color && carrito.idarticulo.color !== '' ? (
										<Tag className="font-des-car detalles-carrito color-border-tags">
											Color: {carrito.idarticulo.color}
										</Tag>
									) : (
										''
									)}

									{carrito.idarticulo.colorHex && carrito.idarticulo.colorHex !== '' ? (
										<Tag
											style={{
												backgroundColor: carrito.idarticulo.colorHex,
												height: 30,
												width: 30
											}}
										/>
									) : (
										''
									)}
								</div>
								{disponible.length ? (
									<p className="titulo-disponible font-des-car">Producto no disponible</p>
								) : eliminado === true ? (
									<p className="titulo-disponible font-des-car">Este producto ya no existe</p>
								) : (
									<p />
								)}
							</div>
						</div>
						<div className="col-lg-4">
							<div className="justify-content-center">
								<div className="col">
									<Form form={form} initialValues={{ cantidad: carrito.cantidad }} className="row">
										<Form.Item
											className="inputs-carrito col-6 col-lg-12"
											labelCol={{ span: 8 }}
											label="Cantidad"
											name="cantidad"
											id={carrito.idarticulo._id}
											help={medidaDisponible}
											validateStatus={validateStatus}
										>
											{carrito.idarticulo.tipoCategoria !== 'Otros' ? (
												<InputNumber
													id={carrito.idarticulo._id}
													size="large"
													min={1}
													max={medida[1]}
													onChange={cantidadChange}
												/>
											) : (
												<InputNumber
													id={carrito.idarticulo._id}
													size="large"
													min={1}
													max={carrito.idarticulo.cantidad}
													onChange={cantidadChange}
												/>
											)}
										</Form.Item>
										{carrito.idarticulo.tipoCategoria !== 'Otros' ? (
											<Form.Item
												className="inputs-carrito-talla col-6 col-lg-12"
												label="Talla"
												labelCol={{ span: 8 }}
												validateStatus={validateStatus}
											>
												<Select
													defaultValue={verificarArticulos(carrito)}
													size="large"
													style={{ width: 90 }}
													onChange={medidaChange}
												>
													{carrito.idarticulo.tallas.length !== 0 ? (
														carrito.idarticulo.tallas.map((res) => {
															return res.cantidad !== 0 ? (
																<Option
																	key={res._id}
																	value={[ res.talla, res.cantidad ]}
																>
																	{res.talla}
																</Option>
															) : (
																<Option key={res._id} disabled value={res.talla}>
																	{res.talla}
																</Option>
															);
														})
													) : carrito.idarticulo.numeros.length !== 0 ? (
														carrito.idarticulo.numeros.map((res) => {
															return res.cantidad !== 0 ? (
																<Option
																	key={res._id}
																	value={[ res.numero, res.cantidad ]}
																>
																	{res.numero}
																</Option>
															) : (
																<Option key={res._id} disabled value={res.numero}>
																	{res.numero}
																</Option>
															);
														})
													) : (
														<Option>-</Option>
													)}
												</Select>
											</Form.Item>
										) : (
											<Form.Item className="d-none" />
										)}
										{/* <Form.Item className="inputs-carrito" />
										<Form.Item
											label="Subtotal"
											labelCol={{ offset: 1, span: 10 }}
											className="inputs-carrito"
										/> */}
									</Form>
									<div className="text-center">
										<Button
											className="color-boton-sec color-font-boton font-des-car"
											size="large"
											onClick={() => actualizar(carrito._id, carrito.idarticulo.tipoCategoria)}
										>
											Modificar
										</Button>
										<p className="precio-vista-carrito font-carrito">
											${formatoMexico(obtenerSubtotal(carrito.cantidad, precio))}
										</p>
									</div>
									{/* <div className="float-right" /> */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="d-flex justify-content-center">
				{disponible.length !== 0 ? (
					<div>
						<Button type="link" className="d-block d-lg-inline font-des-car" onClick={() => eliminar()}>
							<DeleteOutlined style={styles} />Eliminar producto
						</Button>
					</div>
				) : (
					<div className="d-flex justify-content-center">
						<Button
							type="link"
							className="color-fonts font-des-car"
							onClick={() => comprar()}
							disabled={medidaDisponible !== '' ? true : false}
						>
							<ShoppingCartOutlined style={styles} />Comprar
						</Button>
						<Button type="link" className="color-fonts font-des-car" onClick={() => eliminar()}>
							<DeleteOutlined style={styles} />Eliminar
						</Button>
						<Button
							type="link"
							className="color-fonts font-des-car"
							onClick={() => apartado()}
							disabled={medidaDisponible !== '' ? true : false}
						>
							<ExportOutlined style={styles} />Apartar
						</Button>
					</div>
				)}
			</div>
			<ModalApartado visible={[ visible, setVisible ]} carrito={carrito} cliente={cliente} token={token} />
		</List.Item>
	);
}
export default ListaCarrito;
