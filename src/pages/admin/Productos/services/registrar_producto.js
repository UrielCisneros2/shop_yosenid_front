import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Select, Steps, notification, Upload, Spin, Divider, Alert, Radio } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import './registrar_producto.scss';
import { ProductoContext } from '../../contexts/ProductoContext';
import RegistrarGaleria from './registrar_galeria';
import RegistrarTalla from './registrar_talla';
import RegistrarNumero from './registrar_numero';
import { Editor } from '@tinymce/tinymce-react';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';

const { Option } = Select;
const { Step } = Steps;

///Layout para formulario(columnas)
const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 16 }
};

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

function RegistrarProducto(props) {
	const formRef = useRef(null);
	const [ form ] = Form.useForm();
	const [ disabled, setDisabled ] = props.disabledButtons;
	const setCloseDraw = props.closeDraw;
	///Autorizacion a la pagina con Token
	const token = localStorage.getItem('token');
	/// Declaracion de variables para los pasos
	const [ current, setCurrent ] = useState(0);

	const [ editor, setEditor ] = useState();
	const [ disabledPrev, setDisabledPrev ] = useState(false);
	const [ disabledform, setDisabledForm ] = useState(true);
	const [ disabledformProductos, setDisabledFormProductos ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ loadingCombo, setLoadingCombo ] = useState(false);
	const reload = props.reloadProductos;
	const [ upload, setUpload ] = useState(false);

	const [ item, setItem ] = useState();
	const [ buttonCat, setButtonCat ] = useState(true);
	const [ categoriasBD, setCategoriasBD ] = useState([]);
	const [ categoriasDefault, setCategoriasDefault ] = useState([]);
	const [ subcategoriasDefault, setSubcategoriasDefault ] = useState([]);
	const [ subCategoriasBD, setSubCategoriasBD ] = useState([]);
	const [ subCategoria, setSubCategoria ] = useState([]);
	const [ displayColorPicker, setDisplayColorPicker ] = useState(false);
	const [ color, setColor ] = useState('');
	const [ valueSelect, setValueSelect ] = useState();
	const [ valueSelectSubCat, setValueSelectSubCat ] = useState();

	const [ temporadasBD, setTemporadasBD ] = useState([]);

	const styles = reactCSS({
		default: {
			color: {
				width: '36px',
				height: '14px',
				borderRadius: '2px',
				background: color
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
	};

	useEffect(
		() => {
			if (reload) {
				form.resetFields();
				setCurrent(0);
				setDisabledFormProductos(false);
				setColor('');
				setDisabled(false);
				setDisabledForm(true);
				setSubCategoria([]);
				setValueSelectSubCat();
				setSubcategoriasDefault([]);
				setItem('');
				setSelect('');
				setCategoriasDefault([]);
				setValueSelect();
			}
			setUpload(false);
			setValueSelect();
			setCurrent(0);
			setDisabledFormProductos(false);
			obtenerCategorias();
			obtenerTemporadasBD();
			form.resetFields();
		},
		[ reload, form ]
	);

	const next = () => {
		setCurrent(current + 1);
		if (current === 0) {
			obtenerSubcategorias();
			setDisabled(true);
		} else if (current >= 1) {
			setDisabledPrev(true);
		} else {
			setDisabledPrev(false);
		}
	};

	const prev = () => {
		setCurrent(current - 1);
	};

	///UPLOAD ANTD PRODUCTO
	const [ files, setFiles ] = useState([]);
	const propss = {
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

	///capturar datos}
	const [ datos, setDatos ] = useState({
		codigo: '',
		subCategoria: '',
		nombre: '',
		cantidad: '',
		precio: '',
		imagen: '',
		color: ''
	});
	//// Capturar valores de categoria
	const [ select, setSelect ] = useState('');
	const [ genero, setGenero ] = useState('Ninguno');
	const [ tipoCategoria, setTipoCategoria ] = useState('');

	const onSelect = (value) => {
		setSelect(value[1]);
		setValueSelect(value[1]);
		if (value[0] === 'Calzado' || value[0] === 'Ropa') {
			setTipoCategoria(value[0]);
		} else {
			setTipoCategoria('Otros');
		}
		if (value) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};
	const generoOnChange = (value) => {
		setGenero(value);
	};
	const obtenerEditor = (value) => {
		setEditor(value);
	};
	const datosForm = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	/// Guardar y almacenar en la api REST
	const [ productoID, setProductoID ] = useState('');

	const onError = (error) => {
		error.errorFields.forEach((err) => {
			notification.error({
				message: `[${err.name}]`,
				description: err.errors,
				duration: 5
			});
		});
	};

	async function onFinish() {
		setLoading(true);
		const formData = new FormData();
		formData.append('codigo', datos.codigo);
		formData.append('nombre', datos.nombre);
		formData.append('categoria', select);
		formData.append('tipoCategoria', tipoCategoria);
		formData.append('subCategoria', subCategoria);
		formData.append('temporada', temporada);
		formData.append('genero', genero);
		formData.append('color', datos.color);
		formData.append('colorHex', color);
		formData.append('cantidad', datos.cantidad);
		formData.append('precio', datos.precio);
		formData.append('descripcion', editor);
		formData.append('imagen', files);

		await clienteAxios
			.post('/productos/', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setDisabledPrev(true);
				setDisabled(false);
				setDisabledFormProductos(true);
				setDisabledForm(false);
				setProductoID(res.data.userStored._id);
				notification.success({
					message: '¡Hecho!',
					description: res.data.message,
					duration: 2
				});
				if (tipoCategoria === 'Otros') {
					next();
				}
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
		setLoadingCombo(true);
		await clienteAxios
			.get(`/productos/Subcategorias/${select}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoadingCombo(false);
				setSubCategoriasBD(res.data);
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

	const obtenerAtributo = (e) => {
		setTipoCategoria(e.target.value);
	};

	const addItemCategoria = () => {
		setCategoriasDefault([ ...categoriasDefault, { tipoCategoria, _id: item } ]);
		setSelect(item);
		/* setTipoCategoria('Otros'); */
		setDisabled(false);
		setValueSelect(item);
		form.resetFields();
	};
	const addItemSubCategoria = () => {
		setSubcategoriasDefault([ ...subcategoriasDefault, item ]);
		setValueSelectSubCat(item);
		setSubCategoria(item);
		form.setFieldsValue({ subCategoria: item });
	};

	const onSelectSubCategoria = (value) => {
		setSubCategoria(value);
		setValueSelectSubCat(value);
		form.setFieldsValue({ subCategoria: value });
	};
	const onCategoriaChange = (e) => {
		if (e.target.value.length !== 0) {
			setItem(e.target.value.capitalize());
			setButtonCat(false);
		} else {
			setButtonCat(true);
		}
	};
	const onSubCategoriaChange = (e) => {
		if (e.target.value.length !== 0) {
			setItem(e.target.value.capitalize());
			setButtonCat(false);
		} else {
			setButtonCat(true);
		}
	};

	/* temporadas */
	const [ temporada, setTemporada ] = useState('');
	const [ valueSelectTemporada, setValueSelectTemporada ] = useState();
	const [ temporadaDefault, setTemporadaDefault ] = useState([]);

	const onSelectTemporada = (value) => {
		setTemporada(value);
		setValueSelectTemporada(value);
		form.setFieldsValue({ temporada: value });
	};

	const onTemporadaChange = (e) => {
		if (e.target.value.length !== 0) {
			setItem(e.target.value.capitalize());
			setButtonCat(false);
		} else {
			setButtonCat(true);
		}
	};

	const addItemTemporada = () => {
		setTemporadaDefault([ ...temporadaDefault, item ]);
		setValueSelectTemporada(item);
		setTemporada(item);
		form.setFieldsValue({ temporada: item });
	};

	////CONTENIDO DE LOS PASOS
	const steps = [
		{
			title: 'Categoría',
			content: (
				<div className="d-flex justify-content-center align-items-center mt-4 mb-2">
					<div className="text-center">
						<h2 className="mb-5">Selecciona una categoria para continuar o agrega una nueva</h2>
						<Form form={form}>
							<Form.Item className="my-3">
								<Form.Item name="categorias">
									<Input
										name="categorias"
										disabled={disabledformProductos}
										placeholder="Categoria"
										style={{ width: 300 }}
										onChange={onCategoriaChange}
									/>
								</Form.Item>
							</Form.Item>
							<Form.Item className="my-3">
								<Form.Item name="atributos">
								<Radio.Group onChange={obtenerAtributo} name="atributos">
									<Radio.Button value="Calzado">Calzado</Radio.Button>
									<Radio.Button value="Ropa">Ropa</Radio.Button>
									<Radio.Button value="Otros">Otros</Radio.Button>
								</Radio.Group>
								<Button type="primary" onClick={addItemCategoria}>
									Añadir
								</Button>
								</Form.Item>
							</Form.Item>
						</Form>

						<Select
							disabled={loadingCombo}
							loading={loadingCombo}
							value={valueSelect}
							style={{ width: 300 }}
							placeholder="Seleciona una categoria"
							onChange={(e) => onSelect(e)}
							dropdownRender={(menu) => menu}
						>
							{categoriasDefault && categoriasDefault.length !== 0 ? (
								categoriasDefault.map((item) => (
									<Option key={item} value={[ item.tipoCategoria, item._id ]}>
										{item._id}
									</Option>
								))
							) : null}
							{categoriasBD && categoriasBD.length !== 0 ? (
								categoriasBD.map((item) => {
									return (
										<Option key={item._id} value={[ item.tipoCategoria, item._id ]}>
											{item._id}
										</Option>
									);
								})
							) : (
								<Option />
							)}
						</Select>
					</div>
				</div>
			)
		},
		{
			title: 'Producto',
			content: (
				<div className="d-flex justify-content-center align-items-center mt-4 mb-2">
					<div style={{ width: 900 }}>
						<h2 className="mb-5 text-center">Registrar el producto</h2>
						<div>
							<Form
								{...layout}
								name="nest-messages"
								onFinish={onFinish}
								onFinishFailed={onError}
								initialValues={{ categoria: select, genero: 'Ninguno' }}
								form={form}
								ref={formRef.current}
							>
								<Form.Item label="Código de barras" onChange={datosForm}>
									<Input
										name="codigo"
										disabled={disabledformProductos}
										placeholder="Campo opcional"
									/>
								</Form.Item>
								<Form.Item label="Subcategoria" onChange={datosForm}>
									<Form.Item
										name="subCategoria"
										rules={[ { required: true, message: 'Este campo es requerido' } ]}
										noStyle
									>
										<Select
											disabled={loadingCombo}
											loading={loadingCombo}
											value={valueSelectSubCat}
											style={{ width: 250 }}
											placeholder="Seleciona una subcategoria"
											onChange={onSelectSubCategoria}
											dropdownRender={(menu) => (
												<div>
													{menu}
													<Divider style={{ margin: '4px 0' }} />
													<div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
														<Input
															style={{ flex: 'auto' }}
															onChange={onSubCategoriaChange}
														/>
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
								<Form.Item label="Temporada" onChange={datosForm}>
									<Form.Item name="temporada">
										<Select
											disabled={loadingCombo}
											loading={loadingCombo}
											value={valueSelectTemporada}
											style={{ width: 250 }}
											placeholder="Seleciona una temporada"
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
								<Form.Item label="Género" onChange={datosForm}>
									<Form.Item
										name="genero" /* 
										rules={[ { required: true, message: 'Este campo es requerido' } ]} */
										noStyle
									>
										<Select
											name="genero"
											placeholder="Selecciona un género"
											style={{ width: 250 }}
											disabled={disabledformProductos}
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
								<Form.Item label="Nombre del producto" onChange={datosForm}>
									<Form.Item
										rules={[ { required: true, message: 'Este campo es requerido' } ]}
										noStyle
										name="nombre"
									>
										<Input name="nombre" disabled={disabledformProductos} />
									</Form.Item>
								</Form.Item>
								{tipoCategoria === 'Otros' ? (
									<Form.Item label="Stock actual" onChange={datosForm}>
										<Form.Item
											rules={[ { required: true, message: 'Este campo es requerido' } ]}
											noStyle
											name="cantidad"
										>
											<Input
												min="1"
												type="number"
												name="cantidad"
												disabled={disabledformProductos}
											/>
										</Form.Item>
									</Form.Item>
								) : (
									<div />
								)}
								<Form.Item label="Precio del producto" onChange={datosForm}>
									<Form.Item
										rules={[ { required: true, message: 'Este campo es requerido' } ]}
										noStyle
										name="precio"
									>
										<Input
											min="1"
											type="number"
											disabled={disabledformProductos}
											name="precio"
											step=".01"
										/>
									</Form.Item>
								</Form.Item>
								<Form.Item label="Color del producto" onChange={datosForm}>
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
										<Form.Item
											name="color"
											/* rules={[ { required: true, message: 'Este campo es requerido' } ]} */
											noStyle
										>
											<Input
												className="d-inline ml-2"
												type="text"
												disabled={disabledformProductos}
												name="color"
												placeholder="Escribe el color, por ejemplo: Verde"
												style={{ width: 300 }}
											/>
										</Form.Item>
										<Form.Item>
											<Button
												className="d-inline ml-2"
												size="middle"
												type="default"
												onClick={resetColor}
											>
												Quitar color
											</Button>
										</Form.Item>
									</Input.Group>
								</Form.Item>
								<Form.Item label="Descripción del producto">
									<Form.Item
										rules={[ { required: true, message: 'Este campo es requerido' } ]}
										noStyle
										name="descripcion"
										valuePropName="Editor"
									>
										<Editor
											disabled={disabledformProductos}
											init={{
												height: 450,
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
									<Alert
										message="Tamaño recomendado para la imagen es: 800x800px"
										type="info"
										showIcon
									/>
								</div>
								<Form.Item label="Imagen principal">
									<Form.Item
										rules={[ { required: true, message: 'Este campo es requerido' } ]}
										noStyle
										name="imagen"
										valuePropName="filelist"
									>
										<Upload {...propss}>
											<Button disabled={upload}>
												<UploadOutlined /> Subir
											</Button>
										</Upload>
									</Form.Item>
								</Form.Item>
								<Form.Item className="d-flex justify-content-center align-items-center text-center">
									<Button type="primary" htmlType="submit" disabled={disabledformProductos}>
										Registrar
									</Button>
								</Form.Item>
							</Form>
							{tipoCategoria === 'Ropa' ? (
								<div className="d-flex justify-content-center">
									<ProductoContext.Provider value={[ productoID, disabledform ]}>
										<RegistrarTalla disabledButtons={setDisabled} />
									</ProductoContext.Provider>
								</div>
							) : (
								<div />
							)}
							{tipoCategoria === 'Calzado' ? (
								<div>
									<ProductoContext.Provider value={[ productoID, disabledform ]}>
										<RegistrarNumero disabledButtons={setDisabled} />
									</ProductoContext.Provider>
								</div>
							) : (
								<div />
							)}
						</div>
					</div>
				</div>
			)
		},
		{
			title: 'Galería(opcional)',
			content: (
				<div className="contenedor-galeria d-flex justify-content-center align-items-center mt-4 mb-5">
					<div className="text-center" style={{ width: '90%' }}>
						<h2>Agrega más imágenes para tu producto</h2>
						<p>Puedes agregar más imágenes de tu producto para que tus clientes puedan verlas.</p>
						<div className="d-flex justify-content-center m-2">
							<Alert
								className="info-recomended-sizes"
								message="Tamaño recomendado para la imagen es: 800x800px"
								type="info"
								showIcon
							/>
						</div>
						<ProductoContext.Provider value={productoID}>
							<RegistrarGaleria />
						</ProductoContext.Provider>
					</div>
				</div>
			)
		}
	];

	return (
		<div>
			<div className="d-flex justify-content-center">
				<div style={{ width: '80%' }}>
					<Steps current={current}>{steps.map((item) => <Step key={item.title} title={item.title} />)}</Steps>
				</div>
			</div>
			<div className="steps-content">
				<Spin size="large" spinning={loading}>
					{steps[current].content}
				</Spin>
			</div>
			<div className="steps-action d-flex justify-content-center align-items-center">
				{current > 0 && (
					<Button style={{ margin: '0 8px' }} onClick={prev} disabled={disabledPrev}>
						Atras
					</Button>
				)}
				{current === steps.length - 1 && (
					<Button
						type="primary"
						onClick={() => {
							notification.success({
								message: 'Su producto ha sido guardado',
								duration: 2
							});
							setCloseDraw(true);
						}}
					>
						Finalizar
					</Button>
				)}
				{current < steps.length - 1 && (
					<Button type="primary" onClick={next} disabled={disabled}>
						Siguiente
					</Button>
				)}
			</div>
		</div>
	);
}
export default withRouter(RegistrarProducto);
