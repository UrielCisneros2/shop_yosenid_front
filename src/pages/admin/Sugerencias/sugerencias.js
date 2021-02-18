import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import { Row, Input, Button, Drawer, notification, Space, List, Result, Spin } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { IdProductoContext } from '../contexts/ProductoContext';
import jwt_decode from 'jwt-decode';
import Sugerencia from './services/sugerencia';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';
import './sugerencias.scss';
import aws from '../../../config/aws';

const { Search } = Input;

function Sugerencias(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);
	//Tomar la paginacion actual
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);

	const [ productoID, setProductoID ] = useState('');
	const [ productos, setProductos ] = useState([]);
	const [ productosPaginacion, setProductosPaginacion ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ visible, setVisible ] = useState(false);
	const [ visibleReload, setVisibleReload ] = useState('d-none');

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

	function drawnerClose() {
		setVisible(false);
	}
	function drawnerOpen() {
		setVisible(true);
	}

	const obtenerProductosFiltrados = async (busqueda) => {
		if (!busqueda) {
			setVisibleReload('d-none');
			obtenerProductos(20, page);
		} else {
			setVisibleReload('ml-3 d-flex justify-content-center align-items-center');
			setLoading(true);
			await clienteAxios
				.get(
					`/productos/search/admin?codigo=${busqueda}&nombre=${busqueda}&categoria=${busqueda}&subcategoria=${busqueda}&genero=${busqueda}&color=${busqueda}&temporada=${busqueda}`
				)
				.then((res) => {
					setProductosPaginacion(res.data.posts);
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
		setVisibleReload('d-none');
		setLoading(true);
		await clienteAxios
			.get(`/productos?limit=${limit}&page=${page}`)
			.then((res) => {
				setProductosPaginacion(res.data.posts);
				setProductos(res.data.posts.docs);
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
			obtenerProductos(20, page);
		},
		[ page ]
	);

	const render = productos.map((productos) => (
		<List.Item
			key={productos._id}
			className="d-flex justify-content-center align-items-center mt-3"
			actions={[
				<Space>
					<Button
						className="mt-3"
						style={{ fontSize: 16 }}
						type="primary"
						onClick={() => {
							drawnerOpen();
							setProductoID(productos._id);
						}}
					>
						Ver / Crear Sugerencia
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
						<img className="imagen-promocion-principal" alt="producto" src={aws + productos.imagen} />
					</div>
				}
				title={
					<div className="mt-4 titulo-producto">
						<h1 className="h5 font-weight-bold">{productos.nombre}</h1>
					</div>
				}
			/>
		</List.Item>
	));

	return (
		<Spin size="large" spinning={loading}>
			<p className="text-center font-weight-bold" style={{ fontSize: 20 }}>
				PRODUCTOS SUGERIDOS
			</p>
			<p className="text-center" style={{ fontSize: 15 }}>
				En este apartado puedes agregar sugerencias de compra de otro producto a un producto
			</p>
			<Row justify="center mt-5">
				<Search
					placeholder="Busca un producto"
					onSearch={(value) => obtenerProductosFiltrados(value)}
					style={{ height: 40, marginBottom: 10 }}
					className="search-width"
					enterButton="Buscar"
					size="large"
				/>

				<Button
					type="primary"
					size="large"
					className={visibleReload}
					onClick={() => obtenerProductos(20, page)}
					icon={<RollbackOutlined style={{ fontSize: 24 }} />}
				>
					Volver
				</Button>
			</Row>
			{productos.length === 0 ? (
				<div className="w-100 d-flex justify-content-center align-items-center">
					<Result status="404" title="No hay resultados" />
				</div>
			) : (
				<div>
					<List>{render}</List>
					<Pagination blogs={productosPaginacion} location={location} history={history} limite={20} />
				</div>
			)}
			<Drawer
				title={'Sugerencias'}
				width={window.screen.width > 768 ? 1000 : window.screen.width}
				placement={'right'}
				onClose={drawnerClose}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right'
						}}
					>
						<Space>
							<Button onClick={drawnerClose}>Cancelar</Button>
							{/* <Button
								onClick={() => {
									window.location.reload();
								}}
								type="primary"
							>
								Guardar
							</Button> */}
						</Space>
					</div>
				}
			>
				<IdProductoContext.Provider value={productoID}>
					<Sugerencia drawnerClose={drawnerClose}/>
				</IdProductoContext.Provider>
			</Drawer>
		</Spin>
	);
}
export default withRouter(Sugerencias);
