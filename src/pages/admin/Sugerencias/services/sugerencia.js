import React, { useState, useEffect, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Button, Input, Space, notification, Modal, List, Avatar, Card, Result, Empty, Spin } from 'antd';
import { ExclamationCircleOutlined, RollbackOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { IdProductoContext } from '../../contexts/ProductoContext';
import InfiniteScroll from 'react-infinite-scroller';
import './sugerencia.scss';
import aws from '../../../../config/aws';

const { Search } = Input;
const { Meta } = Card;
const { confirm } = Modal;

const Sugerencia = (props) => {
	const {drawnerClose} = props;

	const token = localStorage.getItem('token');
	const productoContext = useContext(IdProductoContext);
	//states de obtener producto
	const [ producto, setProducto ] = useState([]);
	//states de obtener productos sugeridos de base, crear producto sugerido y para mapear el producto sugerido
	const [ sugerencia, setSugerencia ] = useState([]);
	const [ productoSugerido, setProductoSugerido ] = useState([]);
	//modal para crear un producto sugerido
	const [ modalVisible, setModalVisible ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ visible, setVisible ] = useState('d-none');
	///state para saber si va a actualizar o registrar
	const [ actualizar, setActualizar ] = useState(false);

	//infiniteScroll
	const [ data, setData ] = useState([]);
	const [ hasMore, setHasMore ] = useState(true);
	const [ page, setPage ] = useState(1);
	const [ totalDocs, setTotalDocs ] = useState();
	const [ loadingList, setLoadingList ] = useState(false);
	const [ reloadData, setReloadData ] = useState(false);

	useEffect(
		() => {
			obtenerProducto();
			obtenerSugerencia();
		},
		[ productoContext ]
	);
	useEffect(
		() => {
			obtenerTodosProductos((res) => {
				setData(res.data.posts.docs);
				setTotalDocs(res.data.posts.totalDocs);
				setPage(res.data.posts.nextPage);
			});
		},
		[ reloadData ]
	);

	const obtenerProductosFiltrados = async (busqueda) => {
		if (!busqueda) {
			setVisible('d-none');
			setPage(1);
			setHasMore(true);
			setReloadData(true);
		} else {
			setVisible('ml-1 d-flex justify-content-center align-items-center');
			setLoadingList(true);
			await clienteAxios
				.get(
					`/productos/search?nombre=${busqueda}&categoria=${busqueda}&subcategoria=${busqueda}&genero=${busqueda}&color=${busqueda}&temporada=${busqueda}`
				)
				.then((res) => {
					setData(res.data.posts);
					setLoadingList(false);
				})
				.catch((err) => {
					setLoadingList(false);
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
	///*** OBTENER DATOS DE LA BASE DE DATOS
	const obtenerTodosProductos = (callback) => {
		setReloadData(false);
		setVisible('d-none');
		setLoadingList(true);
		clienteAxios
			.get(`/productos?limit=${12}&page=${page}`)
			.then((res) => {
				callback(res);
				setLoadingList(false);
			})
			.catch((err) => {
				setLoadingList(false);
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
	const handleInfiniteOnLoad = () => {
		setLoadingList(true);
		if (data.length === totalDocs) {
			setLoadingList(false);
			setHasMore(false);
			return;
		}
		obtenerTodosProductos((res) => {
			setPage(res.data.posts.nextPage);
			setData(data.concat(res.data.posts.docs));
		});
	};

	const obtenerProducto = async () => {
		await clienteAxios
			.get(`/productos/${productoContext}`)
			.then((res) => {
				setProducto(res.data);
			})
			.catch((err) => {
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

	const obtenerSugerencia = async () => {
		setLoading(true);
		await clienteAxios
			.get(`/sugerencia/${productoContext}`)
			.then((res) => {
				if (res.data.sugerencias) {
					res.data.sugerencias.forEach((item) => setSugerencia(item.producto));
				} else {
					setSugerencia('No hay sugerencia');
				}
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				if (err.response) {
					if (err.response.status === 404) {
						setSugerencia('No hay sugerencia');
					} else {
						notification.error({
							message: 'Error',
							description: err.response.data.message,
							duration: 2
						});
					}
				} else {
					notification.error({
						message: 'Error de conexion',
						description: 'Al parecer no se a podido conectar al servidor.',
						duration: 2
					});
				}
			});
	};
	///// CREAR, ACTUALIZAR Y ELIMINAR SUGERENCIAS DE LA BASE DE DATOS
	const crearSugerencia = async () => {
		setLoading(true);
		const datos = {
			producto: productoContext,
			sugerencias: [
				{
					producto: productoSugerido
				}
			]
		};
		await clienteAxios
			.post(`/sugerencia/nueva/${productoContext}`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setPage(1);
				setHasMore(true);
				setReloadData(true);
				setModalVisible(false);
				obtenerSugerencia();
				setLoading(false);
				setTimeout(() => {
					drawnerClose();
				}, 400);
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
	};

	const actualizarSugerencia = async () => {
		setLoading(true);
		const datos = {
			producto: productoContext,
			sugerencias: [
				{
					producto: productoSugerido
				}
			]
		};
		await clienteAxios
			.put(`/sugerencia/${productoContext}`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setPage(1);
				setHasMore(true);
				setReloadData(true);
				setModalVisible(false);
				obtenerSugerencia();
				setLoading(false);
				setTimeout(() => {
					drawnerClose();
				}, 400);
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
	};

	const eliminarSugerencia = async () => {
		setLoading(true);
		await clienteAxios
			.delete(`/sugerencia/${productoContext}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				obtenerSugerencia();
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
	};
	///MODAL ALERTA ELIMINAR
	function showDeleteConfirm() {
		confirm({
			title: 'Estás seguro de eliminar esta sugerencia?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				eliminarSugerencia();
				setTimeout(() => {
					drawnerClose();
				}, 400);
			}
		});
	}
	/////MODAL
	const showModal = (accion) => {
		if (accion === 'actualizar') {
			setModalVisible(true);
			setActualizar(true);
		} else {
			setModalVisible(true);
		}
	};
	const handleCancel = () => {
		setModalVisible(false);
		setPage(1);
		setHasMore(true);
		setReloadData(true);
		setProductoSugerido([]);
	};

	const render = data.map((productos) => (
		<List.Item
			className={productoSugerido._id === productos._id ? 'list-item-sugerencia' : ''}
			key={productos._id}
			actions={[
				<Button
					onClick={() => {
						setProductoSugerido(productos);
					}}
				>
					Agregar
				</Button>
			]}
		>
			<List.Item.Meta avatar={<Avatar src={aws + productos.imagen} />} title={productos.nombre} />
		</List.Item>
	));

	return (
		<Spin size="large" spinning={loading}>
			<Modal
				closable={false}
				style={{ top: 30 }}
				title="Sugerencias de producto"
				visible={modalVisible}
				footer={[
					<Button danger key="back" onClick={handleCancel}>
						<div className="d-flex align-items-center">
							<CloseOutlined className="mr-1" />Cerrar
						</div>
					</Button>,
					actualizar === false ? (
						<Button key="crear" type="primary" onClick={crearSugerencia}>
							<div className="d-flex align-items-center">
								<CheckOutlined className="mr-1" />Crear
							</div>
						</Button>
					) : (
						<Button key="actualizar" type="primary" onClick={actualizarSugerencia}>
							<div className="d-flex align-items-center">
								<CheckOutlined className="mr-1" />Actualizar
							</div>
						</Button>
					)
				]}
			>
				<Spin size="large" spinning={loading}>
					<p className="text-center my-3">Elige un producto que quieres sugerir.</p>
					<div className="row justify-content-center">
						<Search
							placeholder="Busca un producto"
							onSearch={(value) => obtenerProductosFiltrados(value)}
							style={{ width: 350, height: 40, marginBottom: 10 }}
							enterButton="Buscar"
							size="large"
						/>
						<Button
							type="primary"
							size="large"
							className={visible}
							onClick={() => {
								setPage(1);
								setHasMore(true);
								setReloadData(true);
							}}
							icon={<RollbackOutlined style={{ fontSize: 24 }} />}
						>
							Volver
						</Button>
					</div>
					{data.length === 0 ? (
						<div className="w-100 d-flex justify-content-center align-items-center">
							<Result status="404" title="No hay resultados" />
						</div>
					) : (
						<Spin className="spin-sugerencia-list" size="large" spinning={loadingList}>
							<div className="contenedor-lista">
								<InfiniteScroll
									initialLoad={false}
									pageStart={0}
									loadMore={handleInfiniteOnLoad}
									hasMore={!loading && hasMore}
									useWindow={false}
									threshold={5}
								>
									<List className="m-1">{render}</List>
								</InfiniteScroll>
							</div>
						</Spin>
					)}
				</Spin>
			</Modal>
			<div>
				{sugerencia === 'No hay sugerencia' ? (
					<p className="text-center" style={{ fontSize: 18 }}>
						¡Que esperas, crea una sugerencia ahora mismo!.
					</p>
				) : (
					<div>
						<p className="text-center" style={{ fontSize: 20 }}>
							Crea sugerencias de productos para tu tienda.
						</p>
						<p className="text-center" style={{ fontSize: 15 }}>
							Estas sugerencias aparecerán en la vista del producto.
						</p>
					</div>
				)}
			</div>

			{sugerencia === 'No hay sugerencia' ? (
				<div className="d-flex justify-content-center align-items-center mt-3">
					<Button onClick={showModal}>Crear sugerencia</Button>
				</div>
			) : (
				<div className="d-flex justify-content-center align-items-center mt-3">
					<Space>
						<Button
							onClick={() => {
								showModal('actualizar');
							}}
						>
							Editar sugerencia
						</Button>
						<Button onClick={showDeleteConfirm}>Quitar sugerencia</Button>
					</Space>
				</div>
			)}
			<div className="d-lg-flex d-sm-block justify-content-center align-items-center mt-4">
				<Card
					className="shadow card-contenedor"
					cover={
						<div className="contenedor-imagen-sugerencia">
							<img
								className="imagen-producto-sugerencia"
								alt="producto actual"
								src={aws + producto.imagen}
							/>
						</div>
					}
				>
					<Meta title={producto.nombre} />
				</Card>
				<div className="contenedor-span d-flex justify-content-center align-items-center">
					<span>+</span>
				</div>
				{sugerencia === 'No hay sugerencia' ? (
					<Empty description="No hay sugerencia" />
				) : (
					<Card
						className="shadow card-contenedor"
						cover={
							<div className="contenedor-imagen-sugerencia">
								<img
									className="imagen-producto-sugerencia"
									alt="producto sugerido"
									src={aws + sugerencia.imagen}
								/>
							</div>
						}
					>
						<Meta title={sugerencia.nombre} />
					</Card>
				)}
			</div>
		</Spin>
	);
};

export default Sugerencia;
