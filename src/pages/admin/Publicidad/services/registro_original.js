import React, { useState, useEffect, useCallback } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, notification, Spin, Alert, Form, Modal, Select, Checkbox, message } from 'antd';
import { PlusOutlined, PlusCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import aws from '../../../../config/aws';

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};
const { Option } = Select;
const { confirm } = Modal;

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}

function RegistroPublicidad(props) {
	const token = localStorage.getItem('token');
	const [ form ] = Form.useForm();
	const [ loading, setLoading ] = useState(false);
	const [ loadingSelect, setLoadingSelect ] = useState(false);
	const [ reload, setReload ] = props.reload;
	const { bannerSeleccionado } = props;
	const [ control, setControl ] = props.control;

	const [ categoriasBD, setCategoriasBD ] = useState([]);
	const [ categoria, setCategoria ] = useState('');
	const [ vincular, setVincular ] = useState(false);
	const [ mostrarProductos, setMostrarProductos ] = useState(false);
	const [ mostrarTitulo, setMostrarTitulo ] = useState(false);
	const [ disabledCheck, setDisabledCheck ] = useState(true);

	/* UPLOAD ANTD */
	const [ visible, setVisible ] = props.modalVisible;
	const [ previewVisible, setPreviewVisible ] = useState(false);
	const [ previewImage, setPreviewImage ] = useState('');
	const [ previewTitle, setPreviewTitle ] = useState('');
	const [ fileList, setFileList ] = useState([]);
	const [ imagen, setImagen ] = useState('');
	const [ disabled, setDisabled ] = useState(false);

	const handleCancel = () => setPreviewVisible(false);
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
		onChange: ({ fileList, file }) => {
			if (fileList.length !== 0) {
				setImagen(file);
			} else {
				setImagen('');
				setFileList([]);
				setDisabled(false);
				form.resetFields([ 'imagen' ]);
			}
			setFileList(fileList);
		},
		onRemove: () => {
			showDeleteConfirm();
		},
		onPreview: async (file) => {
			if (!file.url && !file.preview) {
				file.preview = await getBase64(file.originFileObj);
			}
			setPreviewImage(file.url || file.preview);
			setPreviewVisible(true);
			setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
		}
	};
	/* UPLOAD ANTD */

	function closeModalCrear() {
		setVisible(false);
		limpiarCampos();
		setReload(!reload);
	}
	function showModalCrear() {
		setVisible(true);
	}

	const selectCategoria = (categoria) => {
		setDisabledCheck(false);
		setCategoria(categoria);
	};
	const onChangeVincular = (e) => setVincular(e.target.checked);
	const onChangeMostrar = (e) => setMostrarProductos(e.target.checked);
	const onChangeTitulo = (e) => setMostrarTitulo(e.target.checked);

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
		setLoadingSelect(true);
		await clienteAxios
			.get('/productos/filtrosNavbar', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setCategoriasBD(res.data);
				setLoadingSelect(false);
			})
			.catch((err) => {
				setLoadingSelect(false);
				errors(err);
			});
	}

	const enviarDatos = async () => {
		if (!categoria && !imagen) {
			notification.error({
				message: 'Selecciona uno',
				duration: 2
			});
		} else {
			if (!imagen && categoria && mostrarProductos === false) {
				notification.error({
					message: 'si una categoria esta seleccionada, "mostrar productos" es obligatorio',
					duration: 2
				});
			} else {
				setLoading(true);
				const formData = new FormData();
				if (imagen.length !== 0) {
					formData.append('imagen', imagen);
				}else{
					formData.append('imagenBanner', "");
				}
				formData.append('categoria', categoria);
				formData.append('vincularCategoria', vincular);
				formData.append('mostrarProductos', mostrarProductos);
				formData.append('mostrarTitulo', mostrarTitulo);

				if (control) {
					await clienteAxios
						.put(`/banner/${bannerSeleccionado._id}`, formData, {
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
							limpiarCampos();
							closeModalCrear();
						})
						.catch((err) => {
							setLoading(false);
							errors(err);
						});
				} else {
					await clienteAxios
						.post('/banner/', formData, {
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
							limpiarCampos();
							closeModalCrear();
						})
						.catch((err) => {
							setLoading(false);
							errors(err);
						});
				}
			}
		}
	};

	const eliminarImagen = async () => {
		await clienteAxios
		.delete(`/banner/imagen/${bannerSeleccionado._id}`, {
			headers: {
				 Authorization: `bearer ${token}`
			}
		})
		.then((res) => {
			setLoading(false);
			message.success(res.data.message);
		})
		.catch((err) => {
			setLoading(false);
			errors(err);
		});
	}
	function showDeleteConfirm() {
		confirm({
			title: '¿Quieres eliminar la imagen?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				eliminarImagen();
			}
		});
	}

	const llenarCampos = useCallback(
		() => {
			if (bannerSeleccionado.imagenBanner || bannerSeleccionado.imagenBanner !== '') {
				setImagen(bannerSeleccionado.imagenBanner);
				setFileList([
					{
						uid: '-1',
						name: 'imagen actual',
						status: 'done',
						url: aws + bannerSeleccionado.imagenBanner
					}
				]);
			} else {
				setImagen('');
				setFileList([]);
			}

			form.setFieldsValue({
				categoria: bannerSeleccionado.categoria
			});
			if (bannerSeleccionado.categoria.length === 0) {
				form.resetFields([ 'categoria' ]);
			} else {
				setDisabledCheck(false);
				setCategoria(bannerSeleccionado.categoria);
			}
			setVincular(bannerSeleccionado.vincularCategoria);
			setMostrarProductos(bannerSeleccionado.mostrarProductos);
			setMostrarTitulo(bannerSeleccionado.mostrarTitulo);
		},
		[ form, bannerSeleccionado ]
	);

	const limpiarCampos = () => {
		setVincular(false);
		setMostrarProductos(false);
		setMostrarTitulo(false);
		setDisabledCheck(true);
		setImagen('');
		setFileList([]);
		setCategoria('');
		form.resetFields();
		setControl(false);
	};

	useEffect(
		() => {
			obtenerCategorias();
			if (reload) {
				limpiarCampos();
			}
		},
		[ reload ]
	);

	useEffect(
		() => {
			if (control) {
				llenarCampos();
			}
		},
		[ control, llenarCampos ]
	);

	return (
		<div>
			<Button
				onClick={showModalCrear}
				type="primary"
				size="large"
				className="ml-3 mb-3 d-flex justify-content-center align-items-center"
				icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}
			>
				Nueva imagen de publicidad
			</Button>
			<Modal
				title="Crear nueva imagen publicitaria para el Carousel"
				visible={visible}
				onCancel={closeModalCrear}
				footer={false}
				centered
				forceRender={true}
				style={{ top: 20 }}
			>
				<Spin size="large" spinning={loading}>
					<div className="d-flex justify-content-center m-2">
						<Alert
							message="Puedes subir solo una imagen para que aparezca de banner secundario o puedes configurar para que sea una sección completa con productos y redirecciones"
							type="info"
							showIcon
						/>
					</div>
					<div className="row d-sm-block d-lg-flex">
						<div className="">
							<Form {...layout} form={form} hideRequiredMark onFinish={enviarDatos}>
								<Form.Item label="Categoria" name="categoria">
									<Select
										loading={loadingSelect}
										style={{ width: 200 }}
										placeholder="Selecciona una categoria"
										onChange={selectCategoria}
									>
										{categoriasBD.length !== 0 ? (
											categoriasBD.map((categoria) => {
												return (
													<Option key={categoria.categoria} value={categoria.categoria}>
														{categoria.categoria}
													</Option>
												);
											})
										) : null}
									</Select>
								</Form.Item>
								<Form.Item label="Imagen" name="imagen">
									<Upload {...uploadProps}>
										{fileList.length >= 1 ? null : (
											<div>
												<PlusOutlined />
												<div style={{ marginTop: 8 }}>Upload</div>
											</div>
										)}
									</Upload>
								</Form.Item>
								<div className="row d-flex justify-content-center">
									<div className="col-4">
										<Checkbox
											checked={vincular}
											onChange={onChangeVincular}
											disabled={disabledCheck}
										>
											Vincular Categoria
										</Checkbox>
									</div>
									<div className="col-4">
										<Checkbox
											checked={mostrarProductos}
											onChange={onChangeMostrar}
											disabled={disabledCheck}
										>
											Mostrar Productos
										</Checkbox>
									</div>
									<div className="col-4">
										<Checkbox
											checked={mostrarTitulo}
											onChange={onChangeTitulo}
											disabled={disabledCheck}
										>
											Mostrar Titulo
										</Checkbox>
									</div>
								</div>
								<Form.Item className="d-flex justify-content-center mt-5">
									<Form.Item className="text-center">
										<Button htmlType="submit" type="primary" disabled={disabled}>
											{control ? 'Actualizar datos' : 'Crear banner'}
										</Button>
									</Form.Item>
								</Form.Item>
							</Form>
						</div>
					</div>
					<Modal
						forceRender
						visible={previewVisible}
						title={previewTitle}
						footer={null}
						onCancel={handleCancel}
					>
						<img alt="example" style={{ width: '100%' }} src={previewImage} />
					</Modal>
				</Spin>
			</Modal>
		</div>
	);
}
export default RegistroPublicidad;
