import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import {
	Button,
	Input,
	Slider,
	Upload,
	List,
	Avatar,
	notification,
	Result,
	Spin,
	Form,
	Col,
	Alert,
	Select,
	Tooltip,
	Checkbox
} from 'antd';
import { RollbackOutlined, ClearOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import { formatoMexico } from '../../../../config/reuserFunction';
import aws from '../../../../config/aws';

const { Search } = Input;
const demo = { height: '100%', overflow: 'auto' };
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const Promo_unitaria = (props) => {
	const token = localStorage.getItem('token');
	const [ content, setContent ] = useState(false);

	const [ data, setData ] = useState([]);
	const [ hasMore, setHasMore ] = useState(true);
	const [ page, setPage ] = useState(1);
	const [ totalDocs, setTotalDocs ] = useState();
	const [ reloadData, setReloadData ] = useState(false);
	const [ visible, setVisible ] = useState('d-none');

	const [ loading, setLoading ] = useState(false);
	const [ loadingList, setLoadingList ] = useState(true);
	const [ loadingSelect, setLoadingSelect ] = useState(false);
	const [ disabled, setDisabled ] = useState(true);
	const [ imagen, setImagen ] = useState([]);
	const [ producto, setProducto ] = useState([]);
	const [ promocion, setPromocion ] = useState([]);
	const [ precioPromocion, setPrecioPromocion ] = useState();
	const [ disabledSumit, setDisabledSumit ] = useState(true);
	const [ validateStatus, setValidateStatus ] = useState('validating');
	const [ validateCant, setValidateCant ] = useState('validar');
	const [ inputValue, setInputValue ] = useState(0);
	const [ form ] = Form.useForm();
	const reload = props.reload;

	const [ categoriasDB, setCategoriasDB ] = useState([]);
	const [ categoria, setCategoria ] = useState();
	const [ subcategoriasDB, setSubcategoriasDB ] = useState([]);
	const [ subcategoria, setSubcategoria ] = useState();
	const [ generosDB, setGenerosDB ] = useState([]);
	const [ genero, setGenero ] = useState();

	useEffect(
		() => {
			if (reload) {
				setPage(1);
				setHasMore(true);
				setProducto([]);
				setContent(false);
				setInputValue(0);
				setPromocion([]);
				setPrecioPromocion();
				setDisabledSumit(true);
				form.resetFields();
			}
			obtenerCategorias();
			obtenerGeneros();
			obtenerProductos((res) => {
				setData(res.data.posts.docs);
				setTotalDocs(res.data.posts.totalDocs);
				setPage(res.data.posts.nextPage);
			});
		},
		[ reload, reloadData, form ]
	);

	const obtenerProductos = (callback) => {
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
		obtenerProductos((res) => {
			setPage(res.data.posts.nextPage);
			setData(data.concat(res.data.posts.docs));
		});
	};

	const propsUpload = {
		beforeUpload: async (file) => {
			const formDataImagen = new FormData();
			formDataImagen.append('imagen', file);
			subirImagen(formDataImagen);
		}
	};

	const formatter = (value) => `${value}%`;

	const onChange = (value) => {
		setInputValue(value);
		var porcentaje = 100 - value;
		var descuento = Math.round(producto.precio * porcentaje / 100);
		if (descuento >= producto.precio || descuento <= 0 ) {
			setValidateCant('error');
			setValidateStatus('error');
			setDisabledSumit(true);
			form.setFieldsValue({ precio: descuento });
		} else {
			form.setFieldsValue({ precio: descuento });
			setPrecioPromocion(descuento);
			setValidateCant('validar');
			setValidateStatus('validating');
			setDisabledSumit(false);
		}
	};

	const obtenerCampo = (e) => {
		if (e.target.value >= producto.precio || e.target.value <= 0) {
			setValidateCant('error');
			setValidateStatus('error');
			setDisabledSumit(true);
		} else {
			setPrecioPromocion(e.target.value);
			setValidateCant('validar');
			setValidateStatus('validating');
			setDisabledSumit(false);
			var porcentaje = Math.round(e.target.value / producto.precio * 100);
			var descuento = 100 - porcentaje;
			setInputValue(descuento);
		}
	};

	const subirImagen = async (formDataImagen) => {
		setLoading(true);
		await clienteAxios
			.put(`/productos/promocion/${promocion._id}`, formDataImagen, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setImagen(res.data.promocionBase.imagenPromocion);
				setLoading(false);
				setDisabled(true);
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

	const subirPromocion = async () => {
		setLoading(true);
		const formData = new FormData();
		formData.append('productoPromocion', producto._id);
		formData.append('precioPromocion', precioPromocion);
		await clienteAxios
			.post(`/productos/promocion/`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setPromocion(res.data.userStored);
				setDisabled(false);
				setDisabledSumit(true);
				setLoading(false);
				notification.success({
					message: '¡Hecho!',
					description: res.data.message,
					duration: 2
				});
				setPage(1);
				setHasMore(true);
				setReloadData(true);
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

	const obtenerFiltrosDivididos = async (categoria, subcategoria, genero) => {
		var cat = categoria;
		var sub = subcategoria;
		var gen = genero;

		if (categoria === undefined) {
			cat = '';
		}
		if (subcategoria === undefined) {
			sub = '';
		}
		if (genero === undefined) {
			gen = '';
		}

		setLoadingList(true);
		await clienteAxios
			.get(`/productos/filter?categoria=${cat}&subcategoria=${sub}&genero=${gen}`)
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
	};

	async function obtenerCategorias() {
		setLoadingSelect(true);
		await clienteAxios
			.get('/productos/filtrosNavbar', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setCategoriasDB(res.data);
				setLoadingSelect(false);
			})
			.catch((res) => {
				setLoadingSelect(false);
			});
	}
	async function obtenerGeneros() {
		await clienteAxios
			.get('/productos/agrupar/generos')
			.then((res) => {
				setGenerosDB(res.data);
			})
			.catch((res) => {});
	}

	const selectCategoria = (categoria) => {
		setCategoria(categoria);
		setSubcategoria(null);
		if (genero && genero.length !== 0) {
			obtenerFiltrosDivididos(categoria, undefined, genero);
		} else {
			obtenerFiltrosDivididos(categoria);
		}
		categoriasDB.map((res) => {
			if (categoria === res.categoria) {
				setSubcategoriasDB(res.subcCategoria);
			}
		});
	};
	const selectSubCategoria = (subcategoria) => {
		setSubcategoria(subcategoria);
		if (genero && genero.length !== 0) {
			obtenerFiltrosDivididos(categoria, subcategoria, genero);
		} else {
			obtenerFiltrosDivididos(categoria, subcategoria);
		}
	};
	const selectGenero = (genero) => {
		setGenero(genero);
		if (categoria && categoria.length !== 0 && !subcategoria) {
			obtenerFiltrosDivididos(categoria, undefined, genero);
		} else if (categoria && subcategoria && categoria.length !== 0 && subcategoria.length !== 0) {
			obtenerFiltrosDivididos(categoria, subcategoria, genero);
		} else if (!categoria && !subcategoria && genero) {
			obtenerFiltrosDivididos(undefined, undefined, genero);
		}
	};

	const limpiarFiltros = () => {
		setCategoria();
		setSubcategoria();
		setGenero();
		setPage(1);
		setHasMore(true);
		setReloadData(true);
	};

	const limpiar = () => {
		setInputValue(0);
		setImagen([]);
		form.resetFields();
	};



	return (
		<Spin size="large" spinning={loading}>
			<div className="d-lg-flex d-sm-block">
				<div className="col-12 col-lg-6 border-bottom">
					<div className=" mt-2 d-flex justify-content-center">
						<Alert showIcon message="En este apartado puedes agregar promociones por limite de productos" type="info" />
					</div>
					<Spin size="large" spinning={loadingList}>
						<div className="mt-3 row justify-content-center">
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
						<div className="d-flex justify-content-center">
							<Select
								value={categoria}
								size="small"
								placeholder="Categoria"
								style={{ width: 120 }}
								onChange={selectCategoria}
								loading={loadingSelect}
							>
								{categoriasDB.length !== 0 ? (
									categoriasDB.map((res) => {
										return (
											<Option key={res.categoria} value={res.categoria}>
												{res.categoria}
											</Option>
										);
									})
								) : (
									<Option />
								)}
							</Select>
							<Select
								disabled={!categoria ? true : false}
								value={subcategoria}
								size="small"
								placeholder="Subcategoria"
								style={{ width: 120 }}
								onChange={selectSubCategoria}
								value={subcategoria}
							>
								{subcategoriasDB.length !== 0 ? (
									subcategoriasDB.map((res) => {
										return (
											<Option key={res._id} value={res._id}>
												{res._id}
											</Option>
										);
									})
								) : (
									<Option />
								)}
							</Select>
							<Select
								value={genero}
								size="small"
								placeholder="Genero"
								style={{ width: 120 }}
								onChange={selectGenero}
							>
								{generosDB.length !== 0 ? (
									generosDB.map((res) => {
										return (
											<Option key={res._id} value={res._id}>
												{res._id}
											</Option>
										);
									})
								) : (
									<Option />
								)}
							</Select>
							<Tooltip placement="bottom" title="Limpiar filtros">
								<ClearOutlined className="ml-2" style={{ fontSize: 20 }} onClick={limpiarFiltros} />
							</Tooltip>
						</div>
						
						{loading ? (
							<div />
						) : data.length === 0 ? (
							<div className="w-100 d-flex justify-content-center align-items-center">
								<Result
									status="404"
									title="Articulo no encontrado"
									subTitle="Lo sentimo no pudimos encontrar lo que buscabas, intenta ingresar el nombre del producto."
								/>
							</div>
						) : (
							<div style={demo}>
								<InfiniteScroll
									initialLoad={false}
									pageStart={1}
									loadMore={handleInfiniteOnLoad}
									hasMore={!loading && hasMore}
									useWindow={false}
									threshold={5}
								>
									<List
										className="m-1"
										dataSource={data}
										renderItem={(productos) => (
											<List.Item
												className={producto._id === productos._id ? 'list-item-promocion' : ''}
												key={productos._id}
												actions={[
													!productos.promocion.length ? (
														<Button
															onClick={() => {
																setProducto(productos);
																setContent(true);
																limpiar();
															}}
														>
															Seleccionar
														</Button>
													) : (
														<Button className="button-disabled-promocion" disabled>
															Promoción activa
														</Button>
													)
												]}
											>
												<List.Item.Meta
													avatar={<Avatar size={40} src={aws + productos.imagen} />}
													title={productos.nombre}
												/>
											</List.Item>
										)}
									/>
								</InfiniteScroll>
							</div>
						)}
					</Spin>
				</div>
				{content === false ? (
					<div className="col-12 col-lg-6 d-flex justify-content-center mt-5" />
				) : (
					<div className="col-12 col-lg-6">
						<List className="shadow contenedor-articulo-detalles">
							<List.Item>
								<List.Item.Meta
									className="list-item-producto"
									avatar={
										<div
											className="d-flex justify-content-center align-items-center mr-2"
											style={{ width: 100, height: 100 }}
										>
											<img
												className="imagen-promocion-principal"
												alt="producto"
												src={aws + producto.imagen}
											/>
										</div>
									}
									title={
										<div className="precio-box">
											<div className="titulo-box">
												<h2>{producto.nombre}</h2>
											</div>
											{promocion.length !== 0 || disabledSumit === false ? (
												<div>
													<p className="precio-producto d-inline mr-2">
														${formatoMexico(producto.precio)}
													</p>
													<p className="precio-rebaja d-inline mr-2">
														${formatoMexico(precioPromocion)}
													</p>
													<p className="porcentaje-descuento d-inline">{inputValue}%OFF</p>
												</div>
											) : (
												<p className="precio-rebaja d-inline">
													${formatoMexico(producto.precio)}
												</p>
											)}
										</div>
									}
								/>
							</List.Item>
						</List>
						<div className="mt-5">
							<div className="d-flex justify-content-center">
								<Col>
									<Slider
										min={0}
										max={100}
										tipFormatter={formatter}
										onChange={onChange}
										value={typeof inputValue === 'number' ? inputValue : 0}
										//tooltipVisible
										marks={{ 0: '0%', 50: '50%', 100: '100%' }}
									/>
									<Form form={form}>
										<Form.Item
											name="precio"
											validateStatus={validateStatus}
											help="La promoción no debe ser mayor al precio del producto"
										>
											<Input
												prefix="$"
												type="number"
												label="Precio"
												onChange={obtenerCampo}
												min={0}
												max={producto.cantidad}
											/>
										</Form.Item>
										<Form.Item
											name="cantidad"
											validateStatus={validateCant}
											help="La cantidad de productos no debe exeder el inventario"
										>
											<p className="mt-3">Cantidad de productos a poner en promocion:</p>
											<Input
												type="number"
												label="Cantidad"
												onChange={obtenerCampo}
												min={0}
												//max={producto.precio}
											/>
										</Form.Item>
										<Form.Item className="text-center">
											<Button disabled={disabledSumit} onClick={subirPromocion}>
												Guardar promoción
											</Button>
										</Form.Item>
									</Form>
								</Col>
							</div>
							<div className="row d-none">
								<p className="mt-2 texto-imagen">
									Sube una imagen para la promoción, esta imagen aparecerá en el carrucel de
									promociones
								</p>
								<div className="d-flex justify-content-center m-2">
									<Alert
										message="Tamaño recomendado para la imagen es: 1710x330px"
										type="info"
										showIcon
									/>
								</div>
								<Upload {...propsUpload} className="d-flex justify-content-center mt-3 mr-3">
									<Button disabled={disabled}>Subir</Button>
								</Upload>
								{imagen.length !== 0 ? (
									<div className="imagen-box-promocion shadow-sm border">
										<img className="img-producto-promocion" alt="img-producto" src={aws + imagen} />
									</div>
								) : (
									<div />
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</Spin>
	);
};

export default Promo_unitaria;