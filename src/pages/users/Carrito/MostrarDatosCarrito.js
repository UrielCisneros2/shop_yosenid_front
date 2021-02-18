import React, { useState, useEffect, useContext } from 'react';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import { Link, withRouter } from 'react-router-dom';
import './carrito.scss';
import { List, Button, message, Result, Space } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { formatoMexico } from '../../../config/reuserFunction';
import { CarritoContext } from './context_carrito/context-carrito';
import { obtenerStockCarrito } from './services/obtenerStock';
import { AgregarPedidoCarrito } from './services/pedido_carrito';
import ApartadoCarrito from './services/apartado_carrito';
import ListaCarrito from './lista_carrito';
import Spin from '../../../components/Spin';

const styles = { fontSize: 20 };

function MostrarDatosProductos(props) {
	const [ carrito, setCarrito ] = useState([]);
	const [ cliente, setCliente ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ nuevoCarrito, setNuevoCarrito ] = useState([]);
	const [ total, setTotal ] = useState(0);
	const { activador, setActivador, validacion } = useContext(CarritoContext);
	const [ visible, setVisible ] = useState(false);

	//toma del token para el usuario
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	async function obtenerDatosCarrito() {
		setLoading(true);
		await clienteAxios
			.get(`/carrito/${decoded._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setCliente(res.data.cliente);
				setCarrito(res.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
			});
	}

	useEffect(
		() => {
			if (token === '' || token === null) {
				props.history.push('/entrar');
			} else {
				obtenerDatosCarrito();
				setActivador(true);
			}
		},
		[ activador ]
	);

	useEffect(
		() => {
			if (carrito.articulos) {
				var nuevo = obtenerStockCarrito(carrito);
				const result = nuevo.filter((arr) => arr.length !== 0);
				setNuevoCarrito(result);
			}
		},
		[ carrito ]
	);

	useEffect(
		() => {
			var subtotal = 0;
			var total = 0;

			nuevoCarrito.forEach((res) => {
				if (res.promocion) {
					subtotal += res.promocion.precioPromocion * res.cantidad;
				} else {
					subtotal += res.idarticulo.precio * res.cantidad;
				}
				total = subtotal;
				setTotal(total);
			});
		},
		[ nuevoCarrito ]
	);

	function crearPedido() {
		if (validacion) {
			message.error('Aun no se ha modificado la cantidad');
		} else {
			AgregarPedidoCarrito(cliente._id, token);
		}
	}

	function apartarCarrito() {
		if (validacion) {
			message.error('Aun no se ha modificado la cantidad');
		} else {
			setVisible(true);
		}
	}

	if (carrito.length === 0 || carrito.articulos.length === 0) {
		return (
			<Spin spinning={loading}>
				<Result
					className="mt-5"
					status="404"
					title="Aun no tienes articulos en tu carrito"
					extra={<Link to="/productos">¡Empieza a comprar ahora!</Link>}
				/>
			</Spin>
		);
	}

	return (
		<Spin spinning={loading}>
			<div className="mt-5">
				<h1 className="principal navbar-menu-general font-carrito">Bievenido a tu carrito {cliente.nombre}</h1>
				<List
					itemLayout="horizontal"
					size="large"
					dataSource={carrito.articulos}
					renderItem={(carrito) => <ListaCarrito carrito={carrito} cliente={cliente} token={token} />}
				/>
				<div className="row mt-5 justify-content-center p-5">
					<div className="col-lg-5 d-flex justify-content-center align-items-center">
						<div>
							<div>
								<p className="font-sec-car" style={{display: 'inline' }}>Cantidad de productos: </p>
								<p className="font-sec-car" style={{ display: 'inline', fontWeight: 'bold' }}>
									{' '}
									{nuevoCarrito.length}
								</p>
							</div>
							<div>
								<p  className="font-sec-car" style={{ display: 'inline' }}>Total: </p>
								<p  className="font-sec-car" style={{ display: 'inline', fontWeight: 'bold' }}>
									{' '}
									${total !== 0 ? formatoMexico(total) : 0}
								</p>
							</div>
						</div>
					</div>
					<div className="col-lg-5 d-flex justify-content-center align-items-center mt-4">
						<Space>
						<Button
							size="large"
							className="color-boton color-font-boton font-des-car"
							style={{ width: 250, textAlign: 'center' }}
							onClick={() => crearPedido()}
						>
							<ShoppingCartOutlined style={styles} /> Comprar ahora
						</Button>
						<Button
							size="large"
							className="color-boton color-font-boton font-des-car"
							style={{ width: 250, textAlign: 'center' }}
							onClick={() => apartarCarrito()}
						>
							<ShoppingCartOutlined style={styles} /> Apartar carrito
						</Button>
						</Space>
					</div>
				</div>
			</div>
			<ApartadoCarrito cliente={cliente._id} token={token} modal={[ visible, setVisible ]} />
		</Spin>
	);
}

export default withRouter(MostrarDatosProductos);
