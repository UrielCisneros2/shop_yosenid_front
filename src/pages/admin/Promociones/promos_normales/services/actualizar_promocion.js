import React, { useState, useEffect, useContext } from 'react';
import clienteAxios from '../../../../../config/axios';
import { Button, Input, Space, Upload, Spin, notification, Form, Col, Slider, List, Alert } from 'antd';
import { IdProductoContext } from '../../../contexts/ProductoContext';
import { formatoMexico } from '../../../../../config/reuserFunction';
import aws from '../../../../../config/aws';

const ActualizarPromocion = (props) => {

	const {drawnerClose} = props;

	const token = localStorage.getItem('token');
	const productoContext = useContext(IdProductoContext);
	const [ loading, setLoading ] = useState(false);

	const [ producto, setProducto ] = useState([]);
	const [ promocion, setPromocion ] = useState([]);
	const [ precioPromocion, setPrecioPromocion ] = useState();
	const [ disabledSumit, setDisabledSumit ] = useState(false);
	const [ validateStatus, setValidateStatus ] = useState('validating');
	const [ inputValue, setInputValue ] = useState(0);
	const [ form ] = Form.useForm();
	const reload = props.reload;

	useEffect(
		() => {
			if(reload){
				obtenerPromocion();
			}
			obtenerPromocion();
		},
		[ productoContext, reload ]
	);
	useEffect(
		() => {
			obtenerCampo(promocion.precioPromocion);
		},
		[ promocion ]
	);

	const antDprops = {
		beforeUpload: async (file) => {
			const formDataImagen = new FormData();
			formDataImagen.append('imagen', file);
			subirImagen(formDataImagen);
		}
	};
	const antDpropsActualizar = {
		beforeUpload: async (file) => {
			const formDataImagen = new FormData();
			formDataImagen.append('imagen', file);
			actualizarImagen(formDataImagen);
		}
	};

	const formatter = (value) => `${value}%`;

	const onChange = (value) => {
		setInputValue(value);
		var porcentaje = 100 - value;
		var descuento = Math.round(producto.precio * porcentaje / 100);
		if (descuento >= producto.precio || descuento <= 0) {
			setValidateStatus('error');
			setDisabledSumit(true);
			form.setFieldsValue({ precio: descuento });
		} else {
			form.setFieldsValue({ precio: descuento });
			setPrecioPromocion(descuento);
			setValidateStatus('validating');
			setDisabledSumit(false);
		}
	};

	const obtenerCampo = (e) => {
		if (e >= producto.precio || e <= 0) {
			setValidateStatus('error');
			setDisabledSumit(true);
		} else {
			setPrecioPromocion(e);
			setValidateStatus('validating');
			setDisabledSumit(false);
			var porcentaje = Math.round(e / producto.precio * 100);
			var descuento = 100 - porcentaje;
			setInputValue(descuento);
		}
	};

	const obtenerPromocion = async () => {
		setLoading(true);
		await clienteAxios
			.get(`/productos/promocion/${productoContext}`)
			.then((res) => {
				setProducto(res.data.productoPromocion);
				setPromocion(res.data);
				setLoading(false);
				form.setFieldsValue({ precio: res.data.precioPromocion });
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

	const subirImagen = async (formDataImagen) => {
		setLoading(true);
		await clienteAxios
			.put(`/productos/promocion/${productoContext}`, formDataImagen, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerPromocion();
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

	const actualizarImagen = async (formDataImagen) => {
		setLoading(true);
		await clienteAxios
			.put(`/productos/promocion/${productoContext}`, formDataImagen, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerPromocion();
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

	const eliminarImagen = async () => {
		setLoading(true);
		await clienteAxios
			.delete(`/productos/promocion/EliminarImagen/${productoContext}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerPromocion();
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

	const actualizarPromocion = async () => {
		setLoading(true);
		const formData = new FormData();
		formData.append('precioPromocion', precioPromocion);
		await clienteAxios
			.put(`/productos/promocion/${productoContext}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				obtenerPromocion();
				drawnerClose();
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

	return (
		<Spin size="large" spinning={loading}>
			<div className="d-flex justify-content-center">
				<div className="col-lg-8 col-12">
					<List className="shadow">
						<List.Item>
							<List.Item.Meta
								avatar={
									<div
										className="d-flex justify-content-center align-items-center mr-2"
										style={{ width: 100, height: 100 }}
									>
										<img
											className="imagen-promocion-principal"
											alt="producto"
											src={aws+producto.imagen}
										/>
									</div>
								}
								title={
									<div className="precio-box">
										<div className="titulo-box">
											<h2>{producto.nombre}</h2>
										</div>
										{disabledSumit === false ? (
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
											<p className="precio-rebaja d-inline">${formatoMexico(producto.precio)}</p>
										)}
									</div>
								}
							/>
						</List.Item>
					</List>
					<div className="mt-5">
						<div className="d-flex justify-content-center mb-2">
							<Col>
								<Slider
									min={0}
									max={100}
									tipFormatter={formatter}
									onChange={onChange}
									value={typeof inputValue === 'number' ? inputValue : 0}
									tooltipVisible
									marks={{ 0: '0%', 50: '50%', 100: '100%' }}
								/>
								<Form form={form}>
									<Form.Item
										name="precio"
										label="Nuevo precio"
										validateStatus={validateStatus}
										help="La promoción no debe ser mayor al precio del producto"
									>
										<Input
											prefix="$"
											type="number"
											onChange={(e) => obtenerCampo(e.target.value)}
										/>
									</Form.Item>
									<Form.Item className="text-center">
										<Button disabled={disabledSumit} onClick={actualizarPromocion}>
											Guardar
										</Button>
									</Form.Item>
								</Form>
							</Col>
						</div>
						<div className="d-none">
							<p className="mt-2 texto-imagen">
								Actualizar imagen de promoción, recuerda que esta imagen aparecerá en el carrucel de
								promociónes
							</p>
							<div className="d-flex justify-content-center m-2">
								<Alert message="Tamaño recomendado para la imagen es: 1710x330px" type="info" showIcon />
							</div>
							<Space className="mt-3 d-flex justify-content-center">
								{!promocion.imagenPromocion ? (
									<Upload {...antDprops}>
										<Button>Subir imagen</Button>
									</Upload>
								) : (
									<Upload {...antDpropsActualizar}>
										<Button>Actualizar imagen</Button>
									</Upload>
								)}
								<Button
									onClick={() => {
										eliminarImagen();
									}}
								>
									Quitar imagen
								</Button>
							</Space>
							<div className="imagen-box-promocion shadow-sm mt-2">
								{!promocion.imagenPromocion ? (
									<div>Sube una imagen</div>
								) : (
									<img
										className="img-producto-promocion"
										alt="img-producto"
										src={aws+promocion.imagenPromocion}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Spin>
	);
};

export default ActualizarPromocion;
