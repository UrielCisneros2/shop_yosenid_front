import React, { useState, useEffect, useCallback, useContext, Fragment } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, notification, Spin, Form, Modal, Checkbox, Cascader, Alert, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import aws from '../../../../config/aws';
import '../publicidad.scss';
import ImagenEstilo2 from '../imagenes/estilo2.png';
import ImagenEstilo3 from '../imagenes/estilo3.png';
import ImagenEstilo4 from '../imagenes/estilo4.png';
import ImagenEspecial1 from '../imagenes/especial1.png';
import ImagenEspecial2 from '../imagenes/especial2.png';
import ImagenEspecial3 from '../imagenes/especial3.png';
import { BannerContext } from '../../../../context/admincontext';
import PreviewBanner from './previewBanner';

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}

export default function RegistroPublicidad(props) {
	const token = localStorage.getItem('token');
	const [ form ] = Form.useForm();
	const [ loading, setLoading ] = useState(false);
	const { reload, setReload } = useContext(BannerContext);
	const idBanner = props.match.params.idBanner;
	const accion = props.match.params.accion;

	const [ categoriasBD, setCategoriasBD ] = useState([]);
	const [ temporadasBD, setTemporadasBD ] = useState([]);
	const [ generosBD, setGenerosBD ] = useState([]);
	const [ bannerRender, setBannerRender ] = useState({ banner: '', banners: '' });
	const [ bannerSeleccionado, setBannerSeleccionado ] = useState({ banner: '', banners: '' });
	const [ datos, setDatos ] = useState({
		tipo: '',
		vincular: false,
		mostrarProductos: bannerRender.banner.estilo === 2 ? true : false,
		mostrarTitulo: false,
		imagenBanner: '',
		orientacion: 2
	});
	const [ disabledCheck, setDisabledCheck ] = useState(true);
	const [ disabledReg3, setDisabledReg3 ] = useState(0);

	const [ saveAndPublish, setSaveAndPublish ] = useState(false);

	/* UPLOAD ANTD */
	const [ openPreview, setOpenPreview ] = useState(false);
	const [ previewImage, setPreviewImage ] = useState('');
	const [ previewTitle, setPreviewTitle ] = useState('');
	const [ fileList, setFileList ] = useState([]);
	const [ disabled, setDisabled ] = useState(false);

	const handleCancel = () => setOpenPreview(false);

	const limpiarCampos = () => {
		setDisabledCheck(true);
		setFileList([]);
		setDatos({
			tipo: '',
			vincular: false,
			mostrarProductos: bannerRender.banner.estilo === 2 ? true : false,
			mostrarTitulo: false,
			imagenBanner: '',
			orientacion: 2
		});
		form.resetFields();
	};

	/* UPLOAD ANTD */
	const uploadProps = {
		fileList: fileList,
		listType: 'picture-card',
		beforeUpload: (file) => {
			if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') {
				setDisabled(false);
				return false;
			}
			notification.error({
				message: 'Formato de imagen no válido',
				duration: 2
			});
			setDisabled(true);
		},
		onChange: async ({ fileList, file }) => {
			if (fileList.length !== 0) {
				setDatos({ ...datos, imagenBanner: file });
				setFileList(fileList);
				setPreviewImage(URL.createObjectURL(file));
			} else {
				setDatos({ ...datos, imagenBanner: '' });
				setFileList([]);
				setDisabled(false);
				form.resetFields([ 'imagen' ]);
				setPreviewImage('');
			}
		},
		onPreview: async (file) => {
			if (!file.url && !file.preview) {
				file.preview = await getBase64(file.originFileObj);
			}
			setPreviewImage(file.url || file.preview);
			setOpenPreview(true);
			setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
		}
	};

	const selectTipo = (tipo) => {
		setDatos({ ...datos, tipo: tipo });
		setDisabledCheck(false);
	};

	const obtenerOrientacion = (orientacion) => {
		setDatos({ ...datos, orientacion: orientacion });
	};

	const obtenerChecks = (e) => setDatos({ ...datos, [e.target.name]: e.target.checked });

	const errors = (err) => {
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

	async function obtenerCategorias() {
		await clienteAxios
			.get('/productos/filtrosNavbar')
			.then((res) => {
				let categorias = [];
				res.data.map((categoria) => {
					categorias.push({ value: categoria.categoria, label: categoria.categoria });
				});
				setCategoriasBD(categorias);
			})
			.catch((err) => {
				errors(err);
			});
	}
	async function obtenerTemporadas() {
		await clienteAxios
			.get(`/productos/agrupar/temporadas`)
			.then((res) => {
				let temporadas = [];
				res.data.forEach((temporada) => {
					temporadas.push({ label: temporada._id, value: temporada._id });
				});
				setTemporadasBD(temporadas);
			})
			.catch((err) => {
				errors(err);
			});
	}
	async function obtenerGeneros() {
		await clienteAxios
			.get(`/productos/agrupar/generos`)
			.then((res) => {
				let generos = [];
				res.data.forEach((genero) => {
					if(genero._id !== 'Ninguno'){
						generos.push({ label: genero._id, value: genero._id });
					}
				});
				setGenerosBD(generos);
			})
			.catch((err) => {
				errors(err);
			});
	}

	const enviarDatos = async () => {
		if (!datos.tipo) {
			notification.error({
				message: 'Selecciona un tipo',
				duration: 2
			});
			return;
		} else {
			if (!datos.imagenBanner && datos.tipo && datos.mostrarProductos === false) {
				notification.error({
					message: 'si una categoria esta seleccionada, "mostrar productos" es obligatorio',
					duration: 2
				});
				return;
			} else if (bannerSeleccionado.banner.estilo === 2 && !datos.imagenBanner) {
				notification.error({
					message: 'En este tipo de banner la imagen es obligatoria',
					duration: 2
				});
				return;
			} else {
				setLoading(true);
				const formData = new FormData();
				if (datos.imagenBanner.length !== 0) {
					formData.append('imagen', datos.imagenBanner);
				} else {
					formData.append('imagenBanner', '');
				}
				if (bannerSeleccionado.banner.estilo === 2) {
					formData.append('orientacion', datos.orientacion);
				}
				formData.append(datos.tipo[0], datos.tipo[1]);
				formData.append('vincular', datos.vincular);
				formData.append('mostrarProductos', datos.mostrarProductos);
				formData.append('mostrarTitulo', datos.mostrarTitulo);

				if (bannerSeleccionado.banners.length !== 0) {
					await clienteAxios
						.put(
							`/banner/${bannerSeleccionado.banner._id}/action/${bannerSeleccionado.banners._id}`,
							formData,
							{
								headers: {
									'Content-Type': 'multipart/form-data',
									Authorization: `bearer ${token}`
								}
							}
						)
						.then((res) => {
							setLoading(false);
							notification.success({
								message: res.data.message,
								duration: 2
							});
							setReload(!reload);
							limpiarCampos();
							setDisabledReg3(0);
							if (bannerSeleccionado.banner.estilo < 3) {
								props.history.push('/admin/publicidad');
							}
							if(saveAndPublish){
								publicarBanner(true);
							}else{
								publicarBanner(false);
							}
						})
						.catch((err) => {
							setLoading(false);
							errors(err);
						});
				} else {
					await clienteAxios
						.put(`/banner/${bannerSeleccionado.banner._id}`, formData, {
							headers: {
								'Content-Type': 'multipart/form-data',
								Authorization: `bearer ${token}`
							}
						})
						.then((res) => {
							setLoading(false);
							notification.success({
								message: res.data.message,
								duration: 2
							});
							setReload(!reload);
							limpiarCampos();
							setDisabledReg3(0);
							if (bannerSeleccionado.banner.estilo < 3) {
								props.history.push('/admin/publicidad');
							}
							if(saveAndPublish){
								publicarBanner();
							}else{
								publicarBanner(false);
							}
						})
						.catch((err) => {
							setLoading(false);
							errors(err);
						});
				}
			}
		}
	};

	const llenarCampos = useCallback(
		(banner, banners) => {
			if (banners.length !== 0) {
				setBannerSeleccionado({ banner, banners });
				setDatos({
					...datos,
					imagenBanner: banners.imagenBanner ? banners.imagenBanner : '',
					tipo: banners.tipo.categoria
						? [ 'categoria', banners.tipo.categoria ]
						: banners.tipo.temporada ? [ 'temporada', banners.tipo.temporada ] : [ 'genero', banners.tipo.genero ],
					vincular: banners.vincular,
					mostrarProductos: banners.mostrarProductos,
					mostrarTitulo: banners.mostrarTitulo,
					orientacion: banners.orientacion
				});

				if (!banners.imagenBanner || banners.imagenBanner === '') {
					setFileList([]);
				} else {
					setFileList([
						{
							uid: '-1',
							name: 'imagen actual',
							status: 'done',
							url: aws + banners.imagenBanner
						}
					]);
				}

				if (banners.tipo.length === 0) {
					form.resetFields([ 'tipo' ]);
				} else {
					
					setDisabledCheck(false);
					
					if (banners.tipo.categoria) {
						form.setFieldsValue({
							tipo: [ 'categoria', banners.tipo.categoria ]
						});
					} else if (banners.tipo.temporada) {
						form.setFieldsValue({
							tipo: [ 'temporada', banners.tipo.temporada ]
						});
					}else {
						form.setFieldsValue({
							tipo: [ 'genero', banners.tipo.genero ]
						});
					}
				}
			}
		},
		[ form ]
	);

	const obtenerBannerBD = async () => {
		setLoading(true);
		await clienteAxios
			.get(`/banner/${idBanner}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				if (accion === 'nuevo') {
					setBannerSeleccionado({ banner: res.data, banners: [] });
					setBannerRender({ banner: res.data, banners: [] });
				} else if (bannerSeleccionado.banner < 3) {
					setBannerSeleccionado({ banner: res.data, banners: res.data.banners });
					setBannerRender({ banner: res.data, banners: res.data.banners });
				} else {
					res.data.banners.map((banners) => {
						setBannerSeleccionado({ banner: res.data, banners });
					});
				}
				setBannerRender({ banner: res.data, banners: res.data.banners });
				if (accion === 'editar' && res.data.estilo < 3) {
					res.data.banners.map((banners) => {
						llenarCampos(res.data, banners);
					});
				}
			})
			.catch((err) => {
				setLoading(false);
				errors(err);
			});
	};

	const publicarBanner = async (publicado) => {
		if (bannerRender.banner.estilo === 3 && bannerRender.banners.length < 2 && publicado) {
			notification.info({
				message: 'No has terminado de registrar este banner',
				duration: 2
			});
			return;
		} else if (bannerRender.banner.estilo === 4 && bannerRender.banners.length < 3 && publicado) {
			notification.info({
				message: 'No has terminado de registrar este banner',
				duration: 2
			});
			return;
		} else if (bannerRender.banners.length === 0 && publicado) {
			notification.info({
				message: 'No has terminado de registrar este banner',
				duration: 2
			});
			return;
		}
		await clienteAxios
			.put(
				`/banner/publicar/${bannerRender.banner._id}`,
				{ publicado },
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				if(publicado){
					notification.success({
						message: res.data.message,
						duration: 2
					});
				}
				setReload(!reload);
			})
			.catch((err) => {
				errors(err);
			});
	};

	useEffect(
		() => {
			obtenerCategorias();
			obtenerTemporadas();
			obtenerGeneros();
			obtenerBannerBD();
		},
		[ reload ]
	);

	const options = [
		{
			value: 'categoria',
			label: 'Categoria',
			name: 'categoria',
			children: categoriasBD
		},
		{
			value: 'temporada',
			label: 'Temporada',
			name: 'temporada',
			children: temporadasBD
		},
		{
			value: 'genero',
			label: 'Género',
			name: 'genero',
			children: generosBD
		}
	];

	/* simular imagenes */
	var elementos = [];
	for (let i = 0; i < bannerRender.banner.estilo - 1; i++) {
		let array = [];
		array.push(i);
		elementos.push(array);
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				{bannerRender.banner.estilo === 2 ? (
					<div className="d-flex justify-content-around pb-3 mb-3 border-bottom">
						<div
							className=" contenedor-imagen-estilo-registro estilo-hover2"
							onClick={() => obtenerOrientacion(1)}
							style={datos.orientacion === 1 ? { border: '1px solid #1890FF' } : null}
						>
							<h6 className=" position-absolute">
								<b>Diseño 1</b>
							</h6>
							<img alt="estilos banners" src={ImagenEstilo4} className="imagen-estilo-registro" />
						</div>
						<div
							className="contenedor-imagen-estilo-registro estilo-hover2"
							onClick={() => obtenerOrientacion(2)}
							style={datos.orientacion === 2 ? { border: '1px solid #1890FF' } : null}
						>
							<h6 className=" position-absolute">
								<b>Diseño 2</b>
							</h6>
							<img alt="estilos banners" src={ImagenEstilo3} className="imagen-estilo-registro" />
						</div>
						<div
							className="contenedor-imagen-estilo-registro estilo-hover2"
							onClick={() => obtenerOrientacion(3)}
							style={datos.orientacion === 3 ? { border: '1px solid #1890FF' } : null}
						>
							<h6 className="position-absolute">
								<b>diseño 3</b>
							</h6>
							<img alt="estilos banners" src={ImagenEstilo2} className="imagen-estilo-registro" />
						</div>
					</div>
				) : null}
				{bannerRender.banner.estilo > 2 ? (
					<div>
						<div className="d-flex justify-content-center mb-3">
							<h4>
								<b>Selecciona un banner</b>
							</h4>
						</div>
						<div className="text-center d-flex justify-content-around pb-3 mb-3 border-bottom">
							{bannerRender.banners.length !== 0 ? (
								bannerRender.banners.map((res, index) => {
									return (
										<Fragment key={index}>
											<div>
												<h6>
													<b>Imagen {index + 1}</b>
												</h6>
												<div
													className=" contenedor-imagen-estilo-registro estilo-hover2"
													onClick={() => {
														setDisabledReg3(index + 1);
														setDisabledCheck(false);
														llenarCampos(bannerRender.banner, res);
													}}
													style={
														disabledReg3 === index + 1 ? (
															{ border: '1px solid #1890FF' }
														) : null
													}
												>
													<img
														alt="estilos banners"
														src={aws + res.imagenBanner}
														className="imagen-estilo-registro"
													/>
												</div>
											</div>
											{bannerRender.banners.length === 1 && bannerRender.banner.estilo === 3 ? (
												<div>
													<h6>
														<b>Imagen 2</b>
													</h6>
													<div
														className=" contenedor-imagen-estilo-registro estilo-hover2"
														onClick={() => {
															setDisabledReg3(index + 2);
															limpiarCampos();
															setBannerSeleccionado({
																banner: bannerRender.banner,
																banners: []
															});
															setDisabledCheck(false);
														}}
														style={
															disabledReg3 === index + 2 ? (
																{ border: '1px solid #1890FF' }
															) : null
														}
													>
														<img
															alt="estilos banners"
															src={ImagenEspecial2}
															className="imagen-estilo-registro"
														/>
													</div>
												</div>
											) : null}
											{bannerRender.banners.length === 1 && bannerRender.banner.estilo === 4 ? (
												<Fragment>
													<div>
														<h6>
															<b>Imagen 2</b>
														</h6>
														<div
															className="contenedor-imagen-estilo-registro estilo-hover2"
															onClick={() => {
																setDisabledReg3(index + 2);
																limpiarCampos();
																setBannerSeleccionado({
																	banner: bannerRender.banner,
																	banners: []
																});
																setDisabledCheck(false);
															}}
															style={
																disabledReg3 === index + 2 ? (
																	{ border: '1px solid #1890FF' }
																) : null
															}
														>
															<img
																alt="estilos banners"
																src={ImagenEspecial2}
																className="imagen-estilo-registro"
															/>
														</div>
													</div>
													<div>
														<h6>
															<b>Imagen 3</b>
														</h6>
														<div
															className=" contenedor-imagen-estilo-registro estilo-hover2"
															onClick={() => {
																setDisabledReg3(index + 3);
																limpiarCampos();
																setBannerSeleccionado({
																	banner: bannerRender.banner,
																	banners: []
																});
																setDisabledCheck(false);
															}}
															style={
																disabledReg3 === index + 3 ? (
																	{ border: '1px solid #1890FF' }
																) : null
															}
														>
															<img
																alt="estilos banners"
																src={ImagenEspecial3}
																className="imagen-estilo-registro"
															/>
														</div>
													</div>
												</Fragment>
											) : null}
											{index > 0 &&
											bannerRender.banners.length === 2 &&
											bannerRender.banner.estilo === 4 ? (
												<div>
													<h6>
														<b>Imagen 3</b>
													</h6>
													<div
														className=" contenedor-imagen-estilo-registro estilo-hover2"
														onClick={() => {
															setDisabledReg3(index + 3);
															limpiarCampos();
															setBannerSeleccionado({
																banner: bannerRender.banner,
																banners: []
															});
															setDisabledCheck(false);
														}}
														style={
															disabledReg3 === index + 3 ? (
																{ border: '1px solid #1890FF' }
															) : null
														}
													>
														<img
															alt="estilos banners"
															src={ImagenEspecial3}
															className="imagen-estilo-registro"
														/>
													</div>
												</div>
											) : null}
										</Fragment>
									);
								})
							) : (
								elementos.map((res, index) => {
									return (
										<div
											key={index}
											className=" contenedor-imagen-estilo-registro estilo-hover2"
											onClick={() => {
												setDisabledReg3(index + 1);
												setDisabledCheck(false);
											}}
											style={disabledReg3 === index + 1 ? { border: '1px solid #1890FF' } : null}
										>
											<h6 className=" position-absolute">
												<b>Imagen {index + 1}</b>
											</h6>
											<img
												alt="estilos banners"
												src={
													index + 1 === 1 ? (
														ImagenEspecial1
													) : index + 1 === 2 ? (
														ImagenEspecial2
													) : (
														ImagenEspecial3
													)
												}
												className="imagen-estilo-registro"
											/>
										</div>
									);
								})
							)}
						</div>
					</div>
				) : null}
				<div className="d-flex justify-content-center">
					<div className="">
						<Form form={form} hideRequiredMark onFinish={enviarDatos} id="MyForm">
							<div className="row ">
								<div className="col-lg-6">
									<Form.Item label="Tipo de producto" labelCol={{ span: 8 }}>
										<Form.Item name="tipo">
											<Cascader
												options={options}
												onChange={selectTipo}
												placeholder="Selecciona uno"
												disabled={
													bannerRender.banner.estilo > 2 && !disabledReg3 ? true : false
												}
											/>
										</Form.Item>
									</Form.Item>
									<Form.Item labelCol={{ span: 4 }} label="Imagen" className="image-upload-container">
										<Form.Item name="imagenBanner">
											<Upload
												{...uploadProps}
												disabled={
													bannerRender.banner.estilo > 2 && !disabledReg3 ? true : false
												}
											>
												{fileList.length >= 1 ? null : (
													<div>
														<PlusOutlined />
														<div style={{ marginTop: 8 }}>Upload</div>
													</div>
												)}
											</Upload>
										</Form.Item>
										{bannerRender.banner.estilo === 1 ? (
											<Alert
												info
												message={
													<p>
														Tamaño recomendado para esta imagen es: <b>alto=190px</b>,{' '}
														<b>largo=1400px</b>
													</p>
												}
											/>
										) : bannerRender.banner.estilo === 2 ? (
											<Alert
												info
												message={
													<p>
														Tamaño recomendado para esta imagen es: <b>alto=260px</b>,{' '}
														<b>largo=430px</b>
													</p>
												}
											/>
										) : bannerRender.banner.estilo === 3 ? (
											<Alert
												info
												message={
													<p>
														Tamaño recomendado para esta imagen es: <b>alto=700px</b>,{' '}
														<b>largo=470px</b>
													</p>
												}
											/>
										) : (
											<Alert
												info
												message={
													<p>
														Tamaño recomendado para esta imagen es: <b>alto=530px</b>,{' '}
														<b>largo=360px</b>
													</p>
												}
											/>
										)}
									</Form.Item>
								</div>
								<div className="col-lg-5">
									<div>
										<div className="my-4">
											<Checkbox
												name="vincular"
												checked={datos.vincular}
												onChange={obtenerChecks}
												disabled={disabledCheck}
											>
												Vincular banner
											</Checkbox>
										</div>
										<div className="my-4">
											<Checkbox
												name="mostrarProductos"
												checked={
													datos.mostrarProductos ? (
														datos.mostrarProductos
													) : bannerRender.banner.estilo === 2 ? (
														true
													) : (
														datos.mostrarProductos
													)
												}
												onChange={obtenerChecks}
												disabled={
													disabledCheck ? (
														disabledCheck
													) : bannerRender.banner.estilo === 2 ? (
														true
													) : (
														bannerRender.banner.estilo > 2 ? true : disabledCheck
													)
												}
											>
												Mostrar Productos
											</Checkbox>
										</div>
										<div className="my-4">
											<Checkbox
												name="mostrarTitulo"
												checked={datos.mostrarTitulo}
												onChange={obtenerChecks}
												disabled={disabledCheck ? disabledCheck : bannerRender.banner.estilo > 2 ? true : disabledCheck}
											>
												Mostrar Titulo
											</Checkbox>
										</div>
										<div className="my-4">
											<h4>{bannerRender.banner.publicado ? 'Banner publicado' : 'Banner no publicado'}</h4>
										</div>
									</div>
									<div className="d-lg-flex d-block justify-content-around">
										<Button
											className="m-2"
											type="primary"
											size="large"
											ghost
											onClick={() => props.history.push('/admin/publicidad')}
										>
											Cerrar
										</Button>
										{/* <Button
											className="m-2"
											type="primary"
											ghost
											size="large"
											onClick={() => publicarBanner(!bannerRender.banner.publicado)}
											style={
												bannerRender.banner.publicado ? (
													{ color: '#5cb85c', borderColor: '#5cb85c' }
												) : null
											}
										>
											{bannerRender.banner.publicado ? 'Publicado' : 'Publicar'}
										</Button> */}
										<Button
											className="m-2"
											htmlType="submit"
											type="primary"
											disabled={disabled}
											size="large"
											form="MyForm"
										>
											Guardar sin publicar
										</Button>
										<Button
											className="m-2"
											htmlType="submit"
											type="primary"
											disabled={disabled}
											size="large"
											form="MyForm"
											onClick={() => setSaveAndPublish(true)}
										>
											Guardar y publicar
										</Button>
									</div>
								</div>
							</div>
						</Form>
					</div>
				</div>

				<Modal forceRender visible={openPreview} title={previewTitle} footer={null} onCancel={handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
				<PreviewBanner datos={datos} estilo={bannerRender.banner.estilo} previewImage={previewImage} />
			</Spin>
		</div>
	);
}
