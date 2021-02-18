import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import RegistrarProducto from './services/registrar_producto';
import ActualizarProducto from './services/actualizar_producto';
import { Card, Row, Input, Button, Modal, Drawer, Result, notification, Spin } from 'antd';
import Pagination from '../../../components/Pagination/pagination';
/* import { StepsContext, StepsProvider } from '../contexts/stepsContext'; */
import { formatoMexico, agregarPorcentaje } from '../../../config/reuserFunction';
import { IdProductoContext } from '../contexts/ProductoContext';
import {
	ExclamationCircleOutlined,
	EditOutlined,
	DeleteOutlined,
	PlusCircleOutlined,
	RollbackOutlined
} from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import queryString from 'query-string';
import './productos.scss';
import aws from '../../../config/aws';

const { Search } = Input;
const { confirm } = Modal;
const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

function RegistrarProductos(props) {
	//Tomar la paginacion actual
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);

	const [ productoID, setProductoID ] = useState('');
	/* const [ disabled, setDisabled ] = useContext(StepsContext); */
	const [ disabled, setDisabled ] = useState(true);
	const [ productos, setProductos ] = useState([]);
	const [ productosRender, setProductosRender ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ visible, setVisible ] = useState(false);
	const [ accion, setAccion ] = useState(false);
	const [ reload, setReload ] = useState(false);
	const token = localStorage.getItem('token');
	const [ reloadData, setReloadData ] = useState(false);
	const [ visibleButton, setVisibleButton ] = useState('d-none');
	const [ closeDraw, setCloseDraw ] = useState(false);

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

	function closeConfirm() {
		confirm({
			title: 'Estás seguro de cerrar esta ventana?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				drawnerClose();
			}
		});
	}

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

	const eventoCloseConfirm = () => {
		if (accion) {
			drawnerClose();
		} else {
			closeConfirm();
		}
	};
	
	if(closeDraw){
		drawnerClose();
		setCloseDraw(false);
	}

	function showDeleteConfirm(idproducto) {
		confirm({
			title: 'Estas seguro de eliminar este articulo?',
			icon: <ExclamationCircleOutlined />,
			content: 'Este articulo sera borrado permanentemente',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			async onOk() {
				setLoading(true);
				await clienteAxios
					.delete(`/productos/${idproducto}`, {
						headers: {
							Authorization: `bearer ${token}`
						}
					})
					.then((res) => {
						setLoading(false);
						if(window.screen.width < 768){
							obtenerProductos(12, page)
						}else{
							obtenerProductos(28, page)
						}
						notification.success({
							message: res.data.message,
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
		});
	}

	const obtenerProductosFiltrados = async (busqueda) => {
		if (!busqueda) {
			setVisibleButton('d-none');
			if (window.screen.width < 768) {
				obtenerProductos(12, page);
			} else {
				obtenerProductos(28, page);
			}
		} else {
			setVisibleButton('ml-3 d-flex justify-content-center align-items-center');
			setLoading(true);
			await clienteAxios
				.get(
					`/productos/search/admin?codigo=${busqueda}&nombre=${busqueda}&categoria=${busqueda}&subcategoria=${busqueda}&genero=${busqueda}&color=${busqueda}&temporada=${busqueda}`
				)
				.then((res) => {
					setProductosRender(res.data.posts);
					setProductos(res.data.posts);
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
		}
	};

	const obtenerProductos = async (limit, page) => {
		setReloadData(false);
		setVisibleButton('d-none');
		setLoading(true);
		await clienteAxios
			.get(`/productos?limit=${limit}&page=${page}`)
			.then((res) => {
				setProductosRender(res.data.posts.docs);
				setProductos(res.data.posts);
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

	useEffect(
		() => {
			if (window.screen.width < 768) {
				obtenerProductos(12, page);
			} else {
				obtenerProductos(28, page);
			}
			setReload(false);
		},
		[ page, reload, reloadData ]
	);

	const render = productosRender.map((productos) => (
		<div key={productos._id} className="size-col col-lg-2 col-6">
			<Card.Grid hoverable style={gridStyle} className="card-card">
				<Card
					style={{ /* width: 200, */ maxHeight: 420 }}
					bodyStyle={{ padding: 5 }}
					className="card-cover"
					cover={
						<div className="d-flex justify-content-center align-items-center cont-imagen-producto-admin">
							<img className="imagen-producto-admin" alt="producto" src={aws + productos.imagen} />
						</div>
					}
					actions={[
						<Button
							type="link"
							onClick={() => {
								setActualizar();
								setProductoID(productos._id);
							}}
							className="text-decoration-none"
						>
							<EditOutlined style={{ fontSize: 22 }} />
						</Button> ,

						<Button
							type="link"
							onClick={() => showDeleteConfirm(productos._id)}
							className="text-decoration-none"
						>
							<DeleteOutlined style={{ fontSize: 22 }} />
						</Button>
					]}
				>
					<div className="contenedor-titulos-productos">
						<h1 className="titulo-producto-admin titulo-producto-admin-responsivo font-weight-bold">
							{productos.nombre}
						</h1>
						{!productos.promocion.length ? (
							<h2 className="h5 ">$ {formatoMexico(productos.precio)}</h2>
						) : (
							productos.promocion.map((promo) => {
								return (
									<div className="" key={promo._id}>
										<h2 className="h5 precio-producto rebajado mr-2">
											${formatoMexico(productos.precio)}
										</h2>
										<h2 className="h5 precio-rebaja d-inline mr-1">
											${formatoMexico(promo.precioPromocion)}
										</h2>
										<p className="h4 porcentaje-descuento d-inline">
											{agregarPorcentaje(promo.precioPromocion, productos.precio)}%OFF
										</p>
									</div>
								);
							})
						)}
					</div>
				</Card>
			</Card.Grid>
		</div>
	));

	return (
		<Spin size="large" spinning={loading}>
			<Drawer
				forceRender
				title={accion === true ? 'Actualizar un producto' : 'Registra un nuevo producto'}
				width={window.screen.width > 768 ? 1000 : window.screen.width}
				placement={'right'}
				onClose={eventoCloseConfirm}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right'
						}}
					>
						<Button onClick={eventoCloseConfirm} type="primary">
							Cerrar
						</Button>
					</div>
				}
			>
				{accion === true ? (
					<IdProductoContext.Provider value={productoID}>
						<ActualizarProducto reloadProductos={reload} closeDraw={setCloseDraw} />
					</IdProductoContext.Provider>
				) : (
					<RegistrarProducto reloadProductos={reload} disabledButtons={[ disabled, setDisabled ]} closeDraw={setCloseDraw}/>
					/* <StepsProvider value={[ disabled, setDisabled ]}>
						<RegistrarProducto reloadProductos={reload} disabledButtons={[ disabled, setDisabled ]} />
					</StepsProvider> */
				)}
			</Drawer>
			<Row justify="center">
				<Search
					placeholder="Busca un producto"
					onSearch={(value) => obtenerProductosFiltrados(value)}
					style={{ height: 40, marginBottom: 10 }}
					enterButton="Buscar"
					className="search-width"
					size="large"
				/>
				<Button
					type="primary"
					size="large"
					className={`${visibleButton} mb-1`}
					onClick={() => {
						if (window.screen.width < 768) {
							obtenerProductos(12, page);
						} else {
							obtenerProductos(28, page);
						}
					}}
					icon={<RollbackOutlined style={{ fontSize: 24 }} />}
				>
					Volver
				</Button>
				<Button
					type="primary"
					size="large"
					className="ml-3 d-flex justify-content-center align-items-center"
					onClick={setRegistrar}
					icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}
				>
					Registrar un producto
				</Button>
			</Row>
			<div className="d-flex justify-content-center align-items-center">
				<Row style={{ maxWidth: '95vw' }} className="mt-4">
					{productos.length === 0 ? (
						<div className="w-100 d-flex justify-content-center align-items-center">
							<Result
								status="404"
								title="Articulo no encontrado"
								subTitle="Lo sentimo no pudimos encontrar lo que buscabas, intenta ingresar el nombre del producto."
							/>
						</div>
					) : (
						render
					)}
				</Row>
			</div>

			<Pagination
				blogs={productos}
				location={location}
				history={history}
				limite={window.screen.width < 768 ? 12 : 28}
			/>
		</Spin>
	);
}
export default withRouter(RegistrarProductos);
