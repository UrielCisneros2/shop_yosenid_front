import React, { useState, useContext, useEffect, useCallback } from 'react';
import clienteAxios from '../../../../config/axios';
import { Tabs, Form, Input, Upload, Button, notification, Select, Spin, Divider, Alert } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { IdProductoContext } from '../../contexts/ProductoContext';
import ActualizarGaleria from './actualizar_galeria';
import ActualizarTalla from './actualizar_talla';
import ActualizarNumero from './actualizar_numero';
import { Editor } from '@tinymce/tinymce-react';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
import aws from '../../../../config/aws';

const { TabPane } = Tabs;
const { Option } = Select;

const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 16 }
};

function ActualizarProducto(props) {
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ files, setFiles ] = useState([]);
	const [ select, setSelect ] = useState('');
	const [ editor, setEditor ] = useState();
	const [ loading, setLoading ] = useState(false);
	const [ loadingCombo, setLoadingCombo ] = useState(false);
	const reload = props.reloadProductos;
	const setCloseDraw = props.closeDraw;
	const [ upload, setUpload ] = useState(false);

	const [ item, setItem ] = useState();
	const [ buttonCat, setButtonCat ] = useState(true);
	const [ subcategoriasDefault, setSubcategoriasDefault ] = useState([]);
	const [ subCategoriasBD, setSubCategoriasBD ] = useState([]);
	const [ subCategoria, setSubCategoria ] = useState([]);
	const [ genero, setGenero ] = useState('');
	const [ valueSelect, setValueSelect ] = useState();
	const [ valueSelectCat, setValueSelectCat ] = useState();

	const [ categoriasDefault, setCategoriasDefault ] = useState([]);
	const [ itemCat, setItemCat ] = useState();
	/* const [ buttonCat, setButtonCat ] = useState(true); */
	const [ categoriasBD, setCategoriasBD ] = useState([]);

	const [ temporadasBD, setTemporadasBD ] = useState([]);

	const [ productos, setProductos ] = useState([
		{
			codigo: '',
			nombre: '',
			precio: '',
			cantidad: '',
			imagen: '',
			color: ''
		}
	]);
	const [ displayColorPicker, setDisplayColorPicker ] = useState(false);
	const [ color, setColor ] = useState('');
	const styles = reactCSS({
		default: {
			color: {
				width: '36px',
				height: '14px',
				borderRadius: '2px',
				background: color
				/* background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` */
			},
			swatch: {
				padding: '5px',
				background: '#fff',
				borderRadius: '1px',
				boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
				display: 'inline-block',
				cursor: 'pointer'
			},
			popover: {
				position: 'absolute',
				zIndex: '2'
			},
			cover: {
				position: 'fixed',
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '0px'
			}
		}
	});

	const handleClick = () => {
		setDisplayColorPicker(true);
	};

	const handleClose = () => {
		setDisplayColorPicker(false);
	};

	const handleChange = (color) => {
		setColor(color.hex);
	};

	const resetColor = () => {
		setColor('');
		form.setFieldsValue({ color: '' });
		productos.color = '';
	};

	///UPLOAD ANTD PRODUCTO
	const antprops = {
		listType: 'picture',
		beforeUpload: (file) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				file.thumbUrl = e.target.result;
				setFiles(file);
			};
			setUpload(true);
			return false;
		},
		onRemove: (file) => {
			setUpload(false);
			setFiles([]);
		}
	};

	const obtenerDatos = useCallback(
		async () => {
			setLoading(true);
			await clienteAxios
				.get(`/productos/${productoID}`)
				.then((res) => {
					setLoading(false);
					form.setFieldsValue({
						codigo: res.data.codigo,
						nombre: res.data.nombre,
						categoria: res.data.categoria,
						subCategoria: res.data.subCategoria,
						temporada: res.data.temporada ? res.data.temporada : '',
						genero: res.data.genero,
						precio: res.data.precio,
						color: res.data.color,
						cantidad: res.data.cantidad,
						descripcion: res.data.descripcion
					});
					setSelect(res.data.categoria);
					setEditor(res.data.descripcion);
					setFiles(res.data.imagen);
					setProductos(res.data);
					setColor(res.data.colorHex);
					setGenero(res.data.genero);
					setSubCategoria(res.data.subCategoria);
					setTemporada(res.data.temporada ? res.data.temporada : '');
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
		},
		[ form, productoID ]
	);

	const generoOnChange = (value) => {
		setGenero(value);
	};
	const obtenerEditor = (value) => {
		setEditor(value);
	};
	const obtenerValores = (e) => {
		setProductos({
			...productos,
			[e.target.name]: e.target.value
		});
	};

	const onCategoriaChange = (e) => {
		if (e.target.value.length !== 0) {
			setItemCat(e.target.value.capitalize());
			setButtonCat(false);
		} else {
			setButtonCat(true);
		}
	};
	const addItemCategoria = () => {
		if (itemCat === 'Ropa' || itemCat === 'Calzado') {
			notification.error({
				message: 'Categoria no valida',
				duration: 2
			});
		} else {
			form.setFieldsValue({ categoria: itemCat });
			setValueSelectCat(itemCat);
			setCategoriasDefault([ ...categoriasDefault, itemCat ]);
			setSelect(itemCat);

			/* reset subcategoria */
			setValueSelect();
			setSubCategoria([]);
			form.resetFields([ 'subCategoria' ]);
		}
	};

	const onSelect = (value) => {
		setSelect(value);
		setValueSelectCat(value);

		/* reset subcategoria */
		setValueSelect();
		setSubCategoria([]);
		form.resetFields([ 'subCategoria' ]);
	};

	const addItemSubCategoria = () => {
		setSubcategoriasDefault([ ...subcategoriasDefault, item ]);
		form.setFieldsValue({ subCategoria: item });
		setSubCategoria(item);
		setValueSelect(item);
	};
	const onSelectSubCategoria = (value) => {
		setSubCategoria(value);
	};
	const onSubCategoriaChange = (e) => {
		if (e.target.value.length !== 0) {
			setItem(e.target.value.capitalize());
			setSubCategoria(e.target.value);
			setButtonCat(false);
		} else {
			setButtonCat(true);
		}
	};

	/* temporadas */
	const [ temporada, setTemporada ] = useState();
	const [ valueSelectTemporada, setValueSelectTemporada ] = useState();
	const [ temporadaDefault, setTemporadaDefault ] = useState([]);

	const onSelectTemporada = (value) => {
		setTemporada(value);
	};
	const onTemporadaChange = (e) => {
		if (e.target.value.length !== 0) {
			setItem(e.target.value.capitalize());
			setTemporada(e.target.value);
			setButtonCat(false);
		} else {
			setButtonCat(true);
		}
	};
	const addItemTemporada = () => {
		setTemporadaDefault([ ...temporadaDefault, item ]);
		form.setFieldsValue({ temporada: item });
		setTemporada(item);
		setValueSelectTemporada(item);
	};

	async function obtenerCategorias() {
		setLoadingCombo(true);
		await clienteAxios
			.get('/productos/categorias', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoadingCombo(false);
				setCategoriasBD(res.data);
			})
			.catch((err) => {
				setLoadingCombo(false);
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

	async function obtenerSubcategorias() {
		if (!select) {
			return null;
		}
		await clienteAxios
			.get(`/productos/Subcategorias/${select}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setSubCategoriasBD(res.data);
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
	}

	async function obtenerTemporadasBD() {
		setLoadingCombo(true);
		await clienteAxios
			.get(`/productos/agrupar/temporadas`)
			.then((res) => {
				setLoadingCombo(false);
				setTemporadasBD(res.data);
			})
			.catch((err) => {
				setLoadingCombo(false);
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

	const onError = (error) => {
		error.errorFields.forEach((err) => {
			notification.error({
				message: `[${err.name}]`,
				description: err.errors,
				duration: 5
			});
		});
	};

	const subirDatos = async () => {
		const formData = new FormData();
		if (productos.tipoCategoria === 'Otros') {
			formData.append('codigo', productos.codigo);
			formData.append('nombre', productos.nombre);
			formData.append('categoria', select);
			formData.append('subCategoria', subCategoria);
			formData.append('temporada', temporada);
			formData.append('genero', genero);
			formData.append('color', productos.color);
			formData.append('colorHex', color);
			formData.append('cantidad', productos.cantidad);
			formData.append('precio', productos.precio);
			formData.append('descripcion', editor);
			formData.append('imagen', files);
		} else {
			formData.append('codigo', productos.codigo);
			formData.append('nombre', productos.nombre);
			formData.append('categoria', select);
			formData.append('subCategoria', subCategoria);
			formData.append('temporada', temporada);
			formData.append('genero', genero);
			formData.append('color', productos.color);
			formData.append('colorHex', color);
			formData.append('precio', productos.precio);
			formData.append('descripcion', editor);
			formData.append('imagen', files);
		}

		/* for (var pair of formData.entries()) {
			console.log(pair[0]+ ', ' + pair[1]); 
		} */

		setLoading(true);
		await clienteAxios
			.put(`/productos/${productoID}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerDatos();
				setLoading(false);
				notification.success({
					message: '¡Hecho!',
					description: res.data.message,
					duration: 2
				});
				setCloseDraw(true);
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
			if (reload) {
				form.resetFields();
				setFiles([]);
				setUpload(false);
				setColor('');
			}
			obtenerDatos();
			obtenerSubcategorias();
			obtenerCategorias();
			obtenerTemporadasBD();
		},
		[ productoID, reload, form, obtenerDatos ]
	);
	useEffect(
		() => {
			obtenerSubcategorias();
		},
		[ select ]
	);

	return (
		<Tabs defaultActiveKey="1">
			<TabPane tab="Actualizar datos del producto" key="1">
				<Spin size="large" spinning={loading}>
					{productos.tipoCategoria === 'Ropa' ? (
						<div className="d-flex justify-content-center">{<ActualizarTalla />}</div>
					) : (
						<div />
					)}
					{productos.tipoCategoria === 'Calzado' ? <div>{<ActualizarNumero />}</div> : <div />}
					<Form {...layout} name="nest-messages" onFinish={subirDatos} onFinishFailed={onError} form={form}>
						<Form.Item name="codigo" label="Código de barras" onChange={obtenerValores}>
							<Input name="codigo" placeholder="Campo opcional" />
						</Form.Item>
						<Form.Item label="Nombre del producto" onChange={obtenerValores}>
							<Form.Item
								rules={[ { required: true, message: 'Este campo es requerido' } ]}
								noStyle
								name="nombre"
							>
								<Input name="nombre" />
							</Form.Item>
						</Form.Item>
						<Form.Item label="Categoria" onChange={obtenerValores}>
							<Form.Item name="categoria">
								<Select
									disabled={loadingCombo}
									loading={loadingCombo}
									value={valueSelectCat}
									style={{ width: 300 }}
									placeholder="Seleciona una categoria"
									onChange={onSelect}
									dropdownRender={(menu) => (
										<div>
											{menu}
											<Divider style={{ margin: '4px 0' }} />
											<div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
												<Input style={{ flex: 'auto' }} onChange={onCategoriaChange} />
												<Button disabled={buttonCat} onClick={addItemCategoria}>
													<PlusOutlined style={{ fontSize: 20 }} /> Nueva
												</Button>
											</div>
										</div>
									)}
								>
									{categoriasDefault.map((item) => <Option key={item}>{item}</Option>)}
									{categoriasBD.length === 0 ? (
										<Option />
									) : (
										categoriasBD.map((item) => {
											if (item._id === 'Ropa' || item._id === 'Calzado') {
												return null;
											} else {
												return <Option key={item._id}>{item._id}</Option>;
											}
										})
									)}
								</Select>
							</Form.Item>
						</Form.Item>
						<Form.Item label="Subcategoria" name="categoria" onChange={obtenerValores}>
							<Form.Item
								name="subCategoria"
								rules={[ { required: true, message: 'Este campo es requerido' } ]}
								noStyle
							>
								<Select
									style={{ width: 300 }}
									placeholder="Seleciona una subcategoria"
									value={valueSelect}
									onChange={onSelectSubCategoria}
									dropdownRender={(menu) => (
										<div>
											{menu}
											<Divider style={{ margin: '4px 0' }} />
											<div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
												<Input style={{ flex: 'auto' }} onChange={onSubCategoriaChange} />
												<Button disabled={buttonCat} onClick={addItemSubCategoria}>
													<PlusOutlined style={{ fontSize: 20 }} /> Nueva
												</Button>
											</div>
										</div>
									)}
								>
									{subcategoriasDefault.map((item) => <Option key={item}>{item}</Option>)}
									{subCategoriasBD.length === 0 ? (
										<Option />
									) : (
										subCategoriasBD.map((item) => {
											if (item._id === null) {
												return null;
											} else {
												return <Option key={item._id}>{item._id}</Option>;
											}
										})
									)}
								</Select>
							</Form.Item>
						</Form.Item>
						<Form.Item label="Temporada" name="temporada" onChange={obtenerValores}>
							<Form.Item name="temporada">
								<Select
									style={{ width: 300 }}
									placeholder="Seleciona una temporada"
									value={valueSelectTemporada}
									onChange={onSelectTemporada}
									dropdownRender={(menu) => (
										<div>
											{menu}
											<Divider style={{ margin: '4px 0' }} />
											<div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
												<Input style={{ flex: 'auto' }} onChange={onTemporadaChange} />
												<Button disabled={buttonCat} onClick={addItemTemporada}>
													<PlusOutlined style={{ fontSize: 20 }} /> Nueva
												</Button>
											</div>
										</div>
									)}
								>
									{temporadaDefault.map((item) => <Option key={item}>{item}</Option>)}
									{temporadasBD.length === 0 ? (
										<Option />
									) : (
										temporadasBD.map((item) => {
											if (item._id === null) {
												return null;
											} else {
												return <Option key={item._id}>{item._id}</Option>;
											}
										})
									)}
								</Select>
							</Form.Item>
						</Form.Item>
						<Form.Item label="Género" onChange={obtenerValores}>
							<Form.Item name="genero">
								<Select
									name="genero"
									placeholder="Selecciona género"
									style={{ width: 250 }}
									onChange={generoOnChange}
								>
									<Option value="Ninguno">Ninguno</Option>
									<Option value="Niño">Niño</Option>
									<Option value="Niña">Niña</Option>
									<Option value="Hombre">Hombre</Option>
									<Option value="Mujer">Mujer</Option>
									<Option value="Mixto">Mixto</Option>
								</Select>
							</Form.Item>
						</Form.Item>
						<Form.Item label="Color del producto" onChange={obtenerValores}>
							<Input.Group compact>
								<Form.Item name="colorHex">
									<div className="d-flex align-items-center">
										<div className="d-inline">
											<div style={styles.swatch} onClick={handleClick}>
												<div style={styles.color} />
											</div>
											{displayColorPicker ? (
												<div style={styles.popover}>
													<div style={styles.cover} onClick={handleClose} />
													<SketchPicker color={color} onChange={handleChange} />
												</div>
											) : null}
										</div>
									</div>
								</Form.Item>
								<Form.Item wrapperCol={{ span: 22, offset: 0 }} name="color">
									<Input
										className="d-inline ml-2"
										type="text"
										name="color"
										placeholder="Escribe el color, por ejemplo: Verde"
									/>
								</Form.Item>
								<Form.Item>
									<Button className="d-inline ml-2" size="middle" type="text" onClick={resetColor}>
										Quitar color
									</Button>
								</Form.Item>
							</Input.Group>
						</Form.Item>
						{productos.tipoCategoria === 'Otros' ? (
							<Form.Item label="Stock actual" onChange={obtenerValores}>
								<Form.Item
									rules={[ { required: true, message: 'Este campo es requerido' } ]}
									noStyle
									name="cantidad"
								>
									<Input type="number" name="cantidad" />
								</Form.Item>
							</Form.Item>
						) : (
							<div />
						)}
						<Form.Item label="Precio del producto" onChange={obtenerValores}>
							<Form.Item
								rules={[ { required: true, message: 'Este campo es requerido' } ]}
								noStyle
								name="precio"
							>
								<Input type="number" name="precio" />
							</Form.Item>
						</Form.Item>
						<Form.Item label="Descripción del producto" name="descripcion">
							<Form.Item
								rules={[ { required: true, message: 'Este campo es requerido' } ]}
								noStyle
								name="descripcion"
								valuePropName="Editor"
							>
								<Editor
									value={editor}
									name="descripcion"
									init={{
										height: 300,
										menubar: true,
										plugins: [
											'advlist autolink lists link image charmap print preview anchor',
											'searchreplace visualblocks code fullscreen',
											'insertdatetime media table paste code help wordcount'
										],
										toolbar:
											'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
									}}
									onEditorChange={obtenerEditor}
								/>
							</Form.Item>
						</Form.Item>
						<div className="d-flex justify-content-center m-2">
							<Alert message="Tamaño recomendado para la imagen es: 800x800px" type="info" showIcon />
						</div>
						<Form.Item label="Imagen principal" name="imagen" valuePropName="filelist">
							<Upload {...antprops} name="imagen">
								<Button disabled={upload}>
									<UploadOutlined /> Subir
								</Button>
							</Upload>
						</Form.Item>
						<Form.Item label="Imagen Actual">
							<img
								className="d-block img-fluid mt-2"
								width="200"
								alt="imagen de base"
								src={aws + files}
							/>
						</Form.Item>
						<Form.Item className="d-flex justify-content-center align-items-center text-center">
							<Button type="primary" htmlType="submit">
								Guardar
							</Button>
						</Form.Item>
					</Form>
				</Spin>
			</TabPane>
			<TabPane tab="Actualizar galería de imágenes" key="2">
				<ActualizarGaleria />
			</TabPane>
		</Tabs>
	);
}
export default ActualizarProducto;
