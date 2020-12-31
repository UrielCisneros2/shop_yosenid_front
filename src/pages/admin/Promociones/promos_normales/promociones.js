import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../../config/axios';
import jwt_decode from 'jwt-decode';
import { Button, Row, Input, Drawer, Space, Modal, notification, List, Result, Spin } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import RegistrarPromocion from './services/registrar_promocion';
import ActualizarPromocion from './services/actualizar_promocion';
import { IdProductoContext } from '../../contexts/ProductoContext';
import '../promociones.scss';
import '../registrar_promocion.scss';
import { formatoMexico, agregarPorcentaje } from '../../../../config/reuserFunction';
import aws from '../../../../config/aws';

const { Search } = Input;
const { confirm } = Modal;

function PromocionesNormales(props) {
	const token = localStorage.getItem('token');
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ search, setSearch ] = useState('');
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);
	const [ visible, setVisible ] = useState(false);
	const [ accion, setAccion ] = useState(false);
	const [ productoID, setProductoID ] = useState('');
	const [ reload, setReload ] = useState(false);
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	if (token === '' || token === null) {
		props.history.push('/entrar');
	} else if (decoded['rol'] !== true) {
		props.history.push('/');
	}

	useEffect(
		() => {
			obtenerProductos();
			setReload(false);
		},
		[ reload ]
	);

	useEffect(
		() => {
			setProductosFiltrados(
				productos.filter((producto) => {
					return producto.productoPromocion.nombre.toLowerCase().includes(search.toLowerCase());
				})
			);
		},
		[ search, productos ]
	);

	function drawnerClose() {
		setVisible(false);
		setReload(true);
	}

	function setActualizar() {
		setAccion(true);
		setVisible(true);
	}
	function setRegistrar() {
		setAccion(false);
		setVisible(true);
	}

	const obtenerProductos = async () => {
		setLoading(true);
		await clienteAxios
			.get('/productos/promocion')
			.then((res) => {
				setProductos(res.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				if (err.response) {
					notification.error({
						message: 'Error',
						description: err.response.data.message,
						duration: 2
					});
				} else {
					notification.error({
						message: 'Error de conexion',
						description: 'Al parecer no se a podido conectar al servidor.',
						duration: 2
					});
				}
			});
	};

	async function eliminarPromocion(idProducto) {
		setLoading(true);
		await clienteAxios
			.delete(`/productos/promocion/${idProducto}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerProductos();
				setLoading(false);
				notification.success({
					message: '¡Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((err) => {
				setLoading(false);
				if (err.response) {
					notification.error({
						message: 'Error',
						description: err.response.data.message,
						duration: 2
					});
				} else {
					notification.error({
						message: 'Error de conexion',
						description: 'Al parecer no se a podido conectar al servidor.',
						duration: 2
					});
				}
			});
	}

	function showDeleteConfirm(productoID) {
		confirm({
			title: 'estas seguro de eliminar esto?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				eliminarPromocion(productoID);
			}
		});
	}

	const render = productosFiltrados.map((productos) => (
		<List.Item
			key={productos._id}
			className="d-flex justify-content-center align-items-center"
			actions={[
				<Space>
					<Button
						className="d-flex justify-content-center align-items-center"
						style={{ fontSize: 16 }}
						type="primary"
						onClick={() => {
							setActualizar();
							setProductoID(productos._id);
						}}
					>
						<EditOutlined />
						Editar
					</Button>

					<Button
						className="d-flex justify-content-center align-items-center"
						danger
						style={{ fontSize: 16 }}
						onClick={() => {
							showDeleteConfirm(productos._id);
						}}
					>
						<DeleteOutlined />
						Eliminar
					</Button>
				</Space>
			]}
		>
			<List.Item.Meta
				avatar={
					<div
						className="d-flex justify-content-center align-items-center mr-2"
						style={{ width: 100, height: 100 }}
					>
						<img
							className="imagen-promocion-principal"
							alt="producto"
							src={aws + productos.productoPromocion.imagen}
						/>
					</div>
				}
				title={
					<div className="mt-4 titulo-producto">
						<h1 className="h5 font-weight-bold">{productos.productoPromocion.nombre}</h1>
						<p className="h4 precio-producto d-inline mr-2">
							$ {formatoMexico(productos.productoPromocion.precio)}
						</p>
						<p className="h4 precio-rebaja d-inline mr-2">$ {formatoMexico(productos.precioPromocion)}</p>
						<p className="h4 porcentaje-descuento d-inline mr-2">
							{agregarPorcentaje(productos.precioPromocion, productos.productoPromocion.precio)}%OFF
						</p>
					</div>
				}
			/>
		</List.Item>
	));
	return (
		<Spin size="large" spinning={loading}>
			<div>
				<Row justify="center mt-2">
					<Search
						className="search-width"
						placeholder="Busca un producto"
						onChange={(e) => setSearch(e.target.value)}
						style={{ height: 40, marginBottom: 10 }}
						size="large"
						enterButton="Buscar"
					/>
					<Button
						type="primary"
						size="large"
						className="ml-3 mb-3 d-flex justify-content-center align-items-center mb-3"
						onClick={setRegistrar}
						icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}
					>
						Crear nueva promocion
					</Button>
				</Row>
				<div>
					{productos.length === 0 || productosFiltrados.length === 0 ? (
						<div className="w-100 d-flex justify-content-center align-items-center">
							<Result
								status="404"
								title="Articulo no encontrado"
								subTitle="Lo sentimo no pudimos encontrar lo que buscabas, intenta ingresar el nombre del producto."
							/>
						</div>
					) : (
						<List>{render}</List>
					)}
				</div>

				<Drawer
					title={accion === true ? 'Actualizar promoción' : 'Registrar nueva promoción'}
					width={window.screen.width > 768 ? 1000 : window.screen.width}
					placement={'right'}
					onClose={drawnerClose}
					visible={visible}
					bodyStyle={{ paddingBottom: 30 }}
					footer={
						<div
							style={{
								textAlign: 'right'
							}}
						>
							<Space>
								<Button type="primary" onClick={drawnerClose} >
									Cerrar
								</Button>
							</Space>
						</div>
					}
				>
					{accion === true ? (
						<IdProductoContext.Provider value={productoID}>
							<ActualizarPromocion reload={reload} drawnerClose={drawnerClose}/>
						</IdProductoContext.Provider>
					) : (
						<RegistrarPromocion reload={reload} drawnerClose={drawnerClose}/>
					)}
				</Drawer>
			</div>
		</Spin>
	);
}
export default withRouter(PromocionesNormales);
