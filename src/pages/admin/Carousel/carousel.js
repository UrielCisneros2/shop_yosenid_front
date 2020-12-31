import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import { Button, Input, Space, Modal, List, Row, Upload, Result, notification, Spin, Alert } from 'antd';
import {
	EyeOutlined,
	EditOutlined,
	DeleteOutlined,
	PlusCircleOutlined,
	ExclamationCircleOutlined
} from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import CarouselImages from './services/carousel';
import './carousel.scss';
import aws from '../../../config/aws';

const { Search } = Input;
const { confirm } = Modal;

function Carousel(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	/* const [ productoCarousel, setProductoCarousel ] = useState([]); */
	const [ producto, setProducto ] = useState([]);
	const [ productos, setProductos ] = useState([]);
	const [ search, setSearch ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);
	const [ modalVisible, setModalVisible ] = useState(false);
	const [ modalCrearVisible, setModalCrearVisible ] = useState(false);

	const [ reload, setReload ] = useState(false);

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
			obtenerCarouseles();
			setReload(false);
		},
		[ reload ]
	);

	useEffect(
		() => {
			setProductosFiltrados(
				productos.filter((producto) => {
					if (producto.nombre) {
						return producto.nombre.toLowerCase().includes(search.toLowerCase());
					}
					return producto;
				})
			);
		},
		[ search, productos ]
	);

	///*** OBTENER DATOS DE LA BASE DE DATOS
	const obtenerCarouseles = async () => {
		setLoading(true);
		await clienteAxios
			.get(`/carousel/`)
			.then((res) => {
				/* res.data.forEach((item) => {
					if(item.producto){
						setProductoCarousel(item.producto)
					}else{
						setProductoCarousel('')
					}
				}); */
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

	///ACTUALIZAR IMAGEN
	const propsActualizar = {
		beforeUpload: async (file) => {
			const formData = new FormData();
			formData.append('imagen', file);
			await actualizarImagen(formData);
		}
	};

	const actualizarImagen = async (formdata) => {
		setLoading(true);
		await clienteAxios
			.put(`/carousel/${producto}/`, formdata, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerCarouseles();
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
	};

	///ELIMINAR IMAGEN
	const eliminarImagen = async (carouselID) => {
		setLoading(true);
		await clienteAxios
			.delete(`/carousel/${carouselID}/`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerCarouseles();
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
	};

	const showModal = () => {
		setModalVisible(true);
	};
	const closeModal = () => {
		setModalVisible(false);
	};

	function closeModalCrear() {
		setModalCrearVisible(false);
		setReload(true);
	}
	function showModalCrear() {
		setModalCrearVisible(true);
	}

	function showDeleteConfirm(carouselID) {
		confirm({
			title: '¿Quieres eliminarla?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				eliminarImagen(carouselID);
			}
		});
	}

	const render = productosFiltrados.map((carousel) => (
		<List.Item
			key={carousel._id}
			actions={[
				<Space>
					<Button
						className="d-flex justify-content-center align-items-center"
						style={{ fontSize: 16 }}
						type="primary"
						onClick={() => {
							setProducto(carousel);
							showModal();
						}}
						size={window.screen.width > 768 ? 'middle' : 'small'}
					>
						<EyeOutlined />
						Ver
					</Button>
					<Upload {...propsActualizar} className="upload-text-display d-inline">
						<Button
							className="d-flex justify-content-center align-items-center"
							style={{ fontSize: 16 }}
							type="primary"
							onClick={() => {
								setProducto(carousel._id);
							}}
							size={window.screen.width > 768 ? 'middle' : 'small'}
						>
							<EditOutlined />
							Editar
						</Button>
					</Upload>
					<Button
						className="d-flex justify-content-center align-items-center"
						style={{ fontSize: 16 }}
						danger
						onClick={() => {
							showDeleteConfirm(carousel._id);
						}}
						size={window.screen.width > 768 ? 'middle' : 'small'}
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
						<img className="imagen-promocion-principal" alt="producto" src={aws + carousel.imagen} />
					</div>
				}
				title={
					<div className="mt-4 titulo-producto">
						<h1 className="h5 font-weight-bold">
							{carousel.nombre ? carousel.nombre : 'imagen sin nombre'}
						</h1>
					</div>
				}
			/>
		</List.Item>
	));

	return (
		<Spin size="large" spinning={loading}>
			<p className="text-center font-weight-bold" style={{ fontSize: 20 }}>
				Banner principal
			</p>
			<p className="text-center" style={{ fontSize: 15 }}>
				En esta sección puedes subir una imagen al banner en la pagina principal.
			</p>
			<div className="d-flex justify-content-center m-2">
				<Alert message="Tamaño recomendado para la imagen es: 1710x330px" type="info" showIcon />
			</div>
			<Row justify="center mt-5">
				<Search
					placeholder="Busca un producto"
					onChange={(e) => setSearch(e.target.value)}
					style={{ height: 40, marginBottom: 10 }}
					size="large"
					enterButton="Buscar"
					className="search-width"
				/>

				<Button
					onClick={showModalCrear}
					type="primary"
					size="large"
					className="ml-3 mb-3 d-flex justify-content-center align-items-center"
					icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}
				>
					Nueva imagen de publicidad
				</Button>
			</Row>
			{productosFiltrados.length === 0 ? (
				<div className="w-100 d-flex justify-content-center align-items-center">
					<Result status="404" title="No hay resultados" />
				</div>
			) : (
				<List>{render}</List>
			)}
			<Modal
				title={producto.nombre ? producto.nombre : 'Imagen sin nombre'}
				visible={modalVisible}
				onCancel={closeModal}
				footer={false}
				width={1200}
				style={{ top: 20 }}
			>
				<div className="d-flex justify-content-center align-items-center">
					<img
						style={{ maxWidth: '100%', maxHeight: '100%' }}
						alt="imagen-promocion-modal"
						src={aws + producto.imagen}
					/>
				</div>
			</Modal>

			<Modal
				title="Crear nueva imagen publicitaria para el Carousel"
				visible={modalCrearVisible}
				onCancel={closeModalCrear}
				footer={false}
				centered
				width={800}
				style={{ top: 20 }}
			>
				<CarouselImages reload={reload} />
			</Modal>
		</Spin>
	);
}
export default withRouter(Carousel);
