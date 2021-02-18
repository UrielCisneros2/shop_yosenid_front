import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, List, Avatar, Input, Space, Result, notification, Spin, Alert, Form } from 'antd';
import { UploadOutlined, PictureOutlined, RollbackOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import './carousel.scss';
import aws from '../../../../config/aws';

const { Search } = Input;
const layout = {
	labelCol: { span: 10 },
	wrapperCol: { span: 16 }
};

function CarouselImages(props) {
	const token = localStorage.getItem('token');
	const [ imagen, setImagen ] = useState();
	const [ imagenPreview, setImagenPreview ] = useState('');
	//states de obtener producto y obtener todos los productos
	const [ producto, setProducto ] = useState([]);
	//modal para crear una imagen de carousel
	const [ loading, setLoading ] = useState(false);
	const [ visible, setVisible ] = useState('d-none');

	//infiniteScroll
	const [ data, setData ] = useState([]);
	const [ hasMore, setHasMore ] = useState(true);
	const [ page, setPage ] = useState(1);
	const [ totalDocs, setTotalDocs ] = useState();
	const [ loadingList, setLoadingList ] = useState(false);
	const [ reloadData, setReloadData ] = useState(false);
	const [ nombreImagen, setNombreImagen ] = useState('');

	const reload = props.reload;

	const formData = new FormData();

	useEffect(
		() => {
			if (reload) {
				setPage(1);
				setHasMore(true);
				setProducto([]);
				setImagenPreview('');
			}
			obtenerTodosProductos((res) => {
				setData(res.data.posts.docs);
				setTotalDocs(res.data.posts.totalDocs);
				setPage(res.data.posts.nextPage);
			});
		},
		[ reloadData, reload ]
	);

	const obtenerProductosFiltrados = async (busqueda) => {
		if (!busqueda) {
			setVisible('d-none');
			setPage(1);
			setHasMore(true);
			setReloadData(true);
		} else {
			setVisible('ml-1 d-flex justify-content-center align-items-center');
			setLoading(true);
			clienteAxios
				.get(
					`/productos/search?nombre=${busqueda}&categoria=${busqueda}&subcategoria=${busqueda}&genero=${busqueda}&color=${busqueda}&temporada=${busqueda}`
				)
				.then((res) => {
					setData(res.data.posts);
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

	const antdProps = {
		beforeUpload: async (file) => {
			setImagen(file);
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function() {
				setImagenPreview(reader.result);
			};
		}
	};

	const obtenerNombreImagen = (e) => {
		setNombreImagen(e.target.value);
	};

	const crearCarousel = async () => {
		setLoading(true);
		if (producto.length !== 0) {
			formData.append('producto', producto._id);
			formData.append('nombre', producto.nombre);
			formData.append('imagen', imagen);
		} else {
			formData.append('nombre', nombreImagen);
			formData.append('imagen', imagen);
		}
		if (producto.length === 0 && nombreImagen === '') {
			notification.error({
				message: 'Error',
				description: 'El nombre de la imagen no debe ir vacío',
				duration: 2
			});
			setLoading(false);
		} else {
			await clienteAxios
				.post('/carousel/nuevo/', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					notification.success({
						message: '¡Hecho!',
						description: res.data.message,
						duration: 2
					});
					setTimeout(() => {
						window.location.reload();
					}, 1500);
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

	const render = data.map((productos) => (
		<List.Item
			key={productos._id}
			className={producto._id === productos._id ? 'list-item-carousel' : ''}
			actions={[
				<Button
					onClick={() => {
						setProducto(productos);
					}}
				>
					Seleccionar
				</Button>
			]}
		>
			<List.Item.Meta avatar={<Avatar src={aws + productos.imagen} />} title={productos.nombre} />
		</List.Item>
	));

	return (
		<Spin size="large" spinning={loading}>
			<div className="d-flex justify-content-center m-2">
				<Alert
					message="Puedes subir una imagen de carousel ya sea que esta tenga referencia a un producto o no. Si hace referencia a un producto selecciona uno de la lista, si no hace referencia, la imagen debe llevar un nombre."
					type="info"
					showIcon
				/>
			</div>
			<div className="row d-sm-block d-lg-flex">
				<div className="col-12 col-lg-6">
					<p className="text-center my-3">Elige un producto y después una imagen</p>
					<div className="row justify-content-center mt-1">
						<Search
							className="search-width-modal"
							placeholder="Busca un producto"
							onSearch={(value) => obtenerProductosFiltrados(value)}
							style={{ height: 40, marginBottom: 10 }}
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
					<div>
						{data.length === 0 ? (
							<div className="w-100 d-flex justify-content-center align-items-center">
								<Result status="404" title="Articulo no encontrado" />
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
					</div>
				</div>
				<div className="col-12 col-lg-6">
					{!producto.nombre ? (
						<Form {...layout}>
							<Form.Item label="Nombre de la imagen">
								<Form.Item
									name="nombreImagen"
									rules={[ { required: true, message: 'El nombre de la imagen no puede ir vacío' } ]}
									noStyle
								>
									<Input placeholder="nombre de la imagen" onChange={(e) => obtenerNombreImagen(e)} />
								</Form.Item>
							</Form.Item>
						</Form>
					) : (
						<h5>{producto.nombre}</h5>
					)}
					<div className="d-flex justify-content-center align-items-center my-4">
						<Space>
							<Upload {...antdProps} className="upload-text-display">
								<Button type="primary" /* disabled={producto.length !== 0 ? false : true} */>
									<UploadOutlined />Subir
								</Button>
							</Upload>
							<Button
								type="primary"
								onClick={() => {
									crearCarousel();
								}}
								disabled={imagenPreview !== '' ? false : true}
							>
								Crear
							</Button>
						</Space>
					</div>
					<div className="d-flex justify-content-center m-2">
						<Alert message="Tamaño recomendado para la imagen es: 1650x565px" type="info" showIcon />
					</div>
					<div className="shadow imagen-preview-carousel d-flex justify-content-center align-items-center">
						{imagenPreview === '' ? (
							<PictureOutlined style={{ fontSize: 80 }} />
						) : (
							<img
								className="imagen"
								src={imagenPreview}
								alt="preview-imagen"
								style={{ maxWidth: '100%', maxHeight: '100%' }}
							/>
						)}
					</div>
				</div>
			</div>
		</Spin>
	);
}
export default CarouselImages;
