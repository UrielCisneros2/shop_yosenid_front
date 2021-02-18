import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import {
	Drawer,
	Button,
	Input,
	Slider,
	Table,
	Avatar,
	notification,
	Result,
	Spin,
	Col,
	Alert,
	Select,
	Tooltip,
	Tag
} from 'antd';
import { ClearOutlined, PlusOutlined } from '@ant-design/icons';
import aws from '../../../../config/aws';

const { Search } = Input;
const { Option } = Select;

export default function RegistroPromocionMasiva(props) {
	const token = localStorage.getItem('token');

	const [ data, setData ] = useState([]);
	const [ reloadData, setReloadData ] = useState(true);
	const [ dataPromocion, setDataPromocion ] = useState([]);

	const [ loading, setLoading ] = useState(false);
	const [ loadingList, setLoadingList ] = useState(true);
	const [ loadingSelect, setLoadingSelect ] = useState(false);
	const [ inputValue, setInputValue ] = useState(0);
	const [ reload, setReload ] = props.reload;
	const [ visible, setVisible ] = props.visible;
	const [ actualizar, setActualizar ] = props.actualizar;
	const { promoMasiva } = props;
/* 	const [ checkall, setCheckAll ] = useState(false); */

	const [ categoriasDB, setCategoriasDB ] = useState([]);
	const [ categoria, setCategoria ] = useState();
	const [ subcategoriasDB, setSubcategoriasDB ] = useState([]);
	const [ subcategoria, setSubcategoria ] = useState();
	const [ generosDB, setGenerosDB ] = useState([]);
	const [ genero, setGenero ] = useState();

	const showDrawer = () => {
		setVisible(true);
		obtenerCategorias();
		obtenerGeneros();
	};

	const onClose = () => {
		setVisible(false);
		limpiar();
	};

	useEffect(
		() => {
			obtenerProductos();
		},
		[ reloadData ]
	);

	const limpiarFiltros = () => {
		setCategoria();
		setSubcategoria();
		setGenero();
		setReloadData(!reloadData);
	};

	const limpiar = () => {
		setCategoria();
		setSubcategoria();
		setGenero();
		setInputValue(0);
		setSelectedRowKeys([]);
		setDataPromocion([]);
		setPromocionMasiva([]);
		setReloadData(!reloadData);
		setActualizar(false);
	};

	const error = (err) => {
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
	};

	const obtenerProductos = () => {
		setLoadingList(true);
		clienteAxios
			.get(`/productos/sinPaginacion`)
			.then((res) => {
				setData(res.data);
				setLoadingList(false);
			})
			.catch((err) => {
				setLoadingList(false);
				error(err);
			});
	};

	const formatter = (value) => `${value}%`;

	const onChange = (value) => setInputValue(value);

	const obtenerProductosFiltrados = async (busqueda) => {
		if (!busqueda) {
			setReloadData(!reloadData);
		} else {
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
					error(err);
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
				
				if(actualizar){
					const checks = [];
					const data = [];
					const listaBD = [];
					res.data.posts.forEach((res) => {
						promoMasiva.forEach((promo) => {
							if(res._id === promo.productoPromocion._id){
								checks.push(res._id)
								data.push(res);
								listaBD.push({ idProducto: res._id })
							}
						})
					})
					setSelectedRowKeys(checks);
					setDataPromocion(data); 
					setPromocionMasiva(listaBD);
					
				}else{
					limpiarChecks()
				}
				
			})
			.catch((err) => {
				setLoadingList(false);
				error(err);
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
			.catch((err) => {
				error(err);
			});
	}

	const selectCategoria = (categoria) => {
		setCategoria(categoria);
		setSubcategoria(null);
		if (genero && genero.length !== 0) {
			obtenerFiltrosDivididos(categoria, undefined, genero);
		} else {
			obtenerFiltrosDivididos(categoria);
		}
		categoriasDB.forEach((res) => {
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

	/* Checklist */
	const columns = [
		{
			title: 'Imagen',
			dataIndex: 'imagen',
			render: (imagen) => <Avatar src={aws + imagen} />
		},
		{
			title: 'Producto',
			dataIndex: 'nombre'
		},
		{
			title: 'Promoción',
			dataIndex: 'promocion',
			render: (promocion) =>
				promocion && promocion.length !== 0 ? <Tag color="green">activa</Tag> : <div className="d-none" />
		}
	];
	const [ promocionMasiva, setPromocionMasiva ] = useState([]);
	const [ selectedRowKeys, setSelectedRowKeys ] = useState([]);
	const hasSelected = selectedRowKeys.length > 0;

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
		const listaIDs = selectedRowKeys.map((res) => {
			return { idProducto: res };
		});
		setPromocionMasiva(listaIDs);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		getCheckboxProps: (producto) => {
			if (actualizar) {
				return {
					disabled:
						producto.promocion &&
						producto.promocion.length !== 0 &&
						producto.promocion[0].idPromocionMasiva !== promoMasiva[0].idPromocionMasiva, // Column configuration not to be checked
					name: producto.nombre
				};
			} else {
				return {
					disabled: producto.promocion && producto.promocion.length !== 0, // Column configuration not to be checked
					name: producto.nombre
				};
			}
		},
		onSelect: (record, selected, selectedRows) => {
			setDataPromocion(selectedRows);
		},
		onSelectAll: (selected, selectedRows) => {
			setDataPromocion(selectedRows);
		}
	};
	/* Checklist fin */

	/* Actualizar datos */
	useEffect(
		() => {
			if (actualizar) {
				checkearChecks();
			}
			if(visible){
				showDrawer();
			}
		},
		[ actualizar, promoMasiva ]
	);

	const limpiarChecks = () => {
		setSelectedRowKeys([]);
		setDataPromocion([]);
		setPromocionMasiva([]);
	}

	const checkearChecks = () => {
		setInputValue(parseInt(promoMasiva[0].porsentajePromocionMasiva));
		const listaPromosActuales = promoMasiva.map((producto) => {
			return producto.productoPromocion._id;
		});
		setSelectedRowKeys(listaPromosActuales);

		const listaIDs = promoMasiva.map((res) => {
			return { idProducto: res.productoPromocion._id };
		});
		setPromocionMasiva(listaIDs);
		const listaPromosData = promoMasiva.map((producto) => {
			return producto.productoPromocion;
		});
		setDataPromocion(listaPromosData);
	};
	/* Actualizar datos */

	const subirPromocion = async () => {
		const listaPromociones = {
			productos: promocionMasiva,
			descuento: inputValue
		};
		setLoading(true);
		if (actualizar) {
			await clienteAxios
				.put(`/promocion/masiva/${promoMasiva[0].idPromocionMasiva}`, listaPromociones, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					notification.success({
						message: '¡Listo!',
						description: res.data.message,
						duration: 2
					});
					onClose();
					limpiar();
					setReload(!reload);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
					error(err);
				});
		} else {
			await clienteAxios
				.post(`/promocion/masiva/`, listaPromociones, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					notification.success({
						message: '¡Listo!',
						description: res.data.message,
						duration: 2
					});
					onClose();
					limpiar();
					setReload(!reload);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
					error(err);
				});
		}
	};

	return (
		<div>
			<div className="d-flex justify-content-end">
				<Button
					className="d-flex justify-content-center align-items-center"
					type="primary"
					onClick={showDrawer}
					size="large"
				>
					<PlusOutlined /> Nueva promoción masiva
				</Button>
			</div>
			<Drawer
				title="Crear promoción masiva"
				width={window.screen.width > 768 ? 1000 : window.screen.width}
				onClose={onClose}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right'
						}}
					>
						<Button onClick={onClose} style={{ marginRight: 8 }}>
							Cancelar
						</Button>
						<Button
							type="primary"
							disabled={inputValue > 0 && selectedRowKeys.length !== 0 ? false : true}
							onClick={subirPromocion}
						>
							Guardar promoción masiva
						</Button>
					</div>
				}
			>
				<Spin size="large" spinning={loading}>
					<div className="row d-flex">
						<div className="order-1 order-lg-0  col-12 col-lg-6 border-bottom">
							<Spin size="large" spinning={loadingList}>
								<div className=" mt-2 row justify-content-center">
									<Search
										placeholder="Busca un producto"
										onSearch={(value) => obtenerProductosFiltrados(value)}
										style={{ width: 350, height: 40, marginBottom: 10 }}
										enterButton="Buscar"
										size="large"
									/>
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
										<ClearOutlined
											className="ml-2"
											style={{ fontSize: 20 }}
											onClick={limpiarFiltros}
										/>
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
									<div className="tabla-promociones">
										<div className="my-2">
											<span style={{ marginLeft: 8 }}>
												{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
											</span>
										</div>
										<Table
											rowKey={(producto) => producto._id}
											rowSelection={rowSelection}
											columns={columns}
											dataSource={data}
											pagination={false}
										/>
									</div>
								)}
							</Spin>
						</div>
						<div className="order-0 order-lg-1 col-12 col-lg-6">
							<div className=" mt-2 d-flex justify-content-center">
								<Alert
									showIcon
									message="En este apartado puedes agregar promociones masivas, por categoria elegida"
									type="info"
								/>
							</div>
							<div className="mt-5">
								<div className="d-flex justify-content-center my-3">
									{dataPromocion.length !== 0 ? (
										<Avatar.Group
											maxCount={5}
											size={64}
											maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
										>
											{dataPromocion.map((res, index) => {
												return <Avatar key={index} src={aws + res.imagen} />;
											})}
										</Avatar.Group>
									) : (
										<h3>Selecciona los productos que quieres aplicarles una promoción</h3>
									)}
								</div>
								<div className="d-flex justify-content-center">
									<Col>
										<div className="precio-box porcentaje-descuento d-inline text-center">
											<p style={{ fontSize: 25 }}> {inputValue} %OFF</p>
										</div>

										<Slider
											min={0}
											max={100}
											tipFormatter={formatter}
											onChange={onChange}
											value={typeof inputValue === 'number' ? inputValue : 0}
											marks={{ 0: '0%', 50: '50%', 100: '100%' }}
										/>
									</Col>
								</div>
							</div>
						</div>
					</div>
				</Spin>
			</Drawer>
		</div>
	);
}
