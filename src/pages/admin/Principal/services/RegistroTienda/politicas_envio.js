import React, { useState, useEffect } from 'react';
import { Form, Input, Divider, Button, Alert, notification, Spin } from 'antd';
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import clienteAxios from '../../../../../config/axios';
import jwt_decode from 'jwt-decode';

export default function PoliticasEnvio(props) {
	const {setCurrent, current} = props;
	const {next} = props;

	const [datosNegocio, setDatosNegocio] = useState({});
	const [ reloadInfo, setReloadInfo ] = useState(false);

	const [ disabled, setDisabled ] = useState(false);
	const [ datos, setDatos ] = useState({});
	const [ control, setControl ] = useState(false);
	const [ idTienda, setIdTienda ] = useState('');
	const [ form ] = Form.useForm();
	const [ loading, setLoading ] = useState(false);
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	function peticionDatosTienda() {
		setLoading(true);
		clienteAxios
			.get(`/tienda/`)
			.then((res) => {
				setLoading(false);
				setDatosNegocio(res.data[0]);
			})
			.catch((err) => {
				setLoading(false);
				setDatosNegocio({});
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

	useEffect(
		() => {
			peticionDatosTienda();
			setReloadInfo(false);
		},
		[ reloadInfo ]
	);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	useEffect(
		() => {
			obtenerDatos();
			if (!datosNegocio) {
				setDisabled(true);
			} else {
				setDisabled(false);
			}
		},
		[ datosNegocio ]
	);

	async function obtenerDatos() {
		await clienteAxios
			.get('/politicasEnvio/', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);

				if (!res.data) {
					setControl(false);
				} else {
					setControl(true);
					form.setFieldsValue({
						costoEnvio: res.data.costoEnvio,
						promocionEnvio: res.data.promocionEnvio,
						descuento: res.data.descuento
					});
					setDatos({
						costoEnvio: res.data.costoEnvio,
						promocionEnvio: res.data.promocionEnvio,
						descuento: res.data.descuento
					});
					setIdTienda(res.data._id);
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

	async function SendForm() {
		if (control === false) {
			setLoading(true);
			await clienteAxios
				.post(
					'/politicasEnvio/',
					{
						idTienda: datosNegocio._id,
						idAdministrador: decoded._id,
						costoEnvio: datos.costoEnvio,
						promocionEnvio: datos.promocionEnvio,
						descuento: datos.descuento
					},
					{
						headers: {
							Authorization: `bearer ${token}`
						}
					}
				)
				.then((res) => {
					setLoading(false);
					// setReloadInfo(true);
					// drawnerClose();
					setCurrent(current + 1);
					notification.success({
						message: '¡Listo!',
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
		} else {
			setLoading(true);
			await clienteAxios
				.put(
					`/politicasEnvio/${idTienda}`,
					{
						costoEnvio: datos.costoEnvio,
						promocionEnvio: datos.promocionEnvio,
						descuento: datos.descuento
					},
					{
						headers: {
							Authorization: `bearer ${token}`
						}
					}
				)
				.then((res) => {
					setLoading(false);
					// setReloadInfo(true);
					// drawnerClose();
					setCurrent(current + 1);
					notification.success({
						message: '¡Listo!',
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
		}
	}

	return (
		<Spin spinning={loading}>
			{disabled ? (
				<Alert
					message="Nota:"
					description="No puedes registrar las políticas de envió sin antes registrar los datos de la tienda"
					type="info"
					showIcon
					className="m-5"
				/>
			) : (
				<div />
			)}
			<Form onFinish={SendForm} form={form} className="mt-5">
				<Form.Item
					className="m-2"
					label="Costo de envío"
					onChange={(e) => setDatos({ ...datos, costoEnvio: e.target.value })}
				>
					<Form.Item
						name="costoEnvio"
						wrapperCol={{ span: 12, offset: 1 }}
						help="Costo de envío de la paqueteria"
					>
						<Input type="number" name="costoEnvio" suffix="$" disabled={disabled} />
					</Form.Item>
				</Form.Item>
				<Form.Item
					className="m-2"
					label="Promoción de envío"
					onChange={(e) => setDatos({ ...datos, promocionEnvio: e.target.value })}
				>
					<Form.Item
						name="promocionEnvio"
						wrapperCol={{ span: 12, offset: 1 }}
						help="Se aplica una promoción de envío a clientes que superen esta cantidad"
					>
						<Input type="number" name="promocionEnvio" suffix="$" disabled={disabled} />
					</Form.Item>
				</Form.Item>
				<Form.Item
					className="m-2"
					label="Descuento"
					onChange={(e) => setDatos({ ...datos, descuento: e.target.value })}
				>
					<Form.Item
						name="descuento"
						wrapperCol={{ span: 12, offset: 1 }}
						help="Costo de envío de la promoción"
					>
						<Input type="number" name="descuento" suffix="$" disabled={disabled} />
					</Form.Item>
				</Form.Item>

				<Form.Item className="d-flex justify-content-center align-items-center text-center">
					<Button
						htmlType="submit"
						disabled={disabled}
						size="large"
						type="primary"
						icon={
							control === false ? (
								<PlusCircleOutlined style={{ fontSize: 24 }} />
							) : (
								<EditOutlined style={{ fontSize: 24 }} />
							)
						}
					>
						{control === false ? 'Registrar politicas de envío' : 'Actualizar politicas de envío'}
					</Button>
				</Form.Item>
			</Form>
		</Spin>
	);
}
