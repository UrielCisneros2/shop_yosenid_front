import React, { useState, useEffect } from 'react';
import { Button, Form, Divider, notification, Input, Row, Col, Alert } from 'antd';
import clienteAxios from '../../../../config/axios';
import Spin from '../../../../components/Spin';

import axios from 'axios';

const consultaCodigos = axios.create({
	baseURL: `https://api-sepomex.hckdrk.mx/query/`
});

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

export default function DatosCliente(props) {
	const [ loading, setLoading ] = useState(false);
	const [ form ] = Form.useForm();
	const { token, clienteID, tipoEnvio } = props;
	const [ handleOk ] = props.enviarDatos;

	const [ controlBoton, setControlBoton ] = useState(true);
	const [ estadoBoton, setEstadoBoton ] = useState('Completa tus datos');
	const [ mensajeRechazo, setMensajeRechazo ] = useState('');

	const [ envioTotal, setEnvioTotal ] = useState(false);

	async function obtenerDatosUser() {
		setLoading(true);
		await clienteAxios
			.get(`/cliente/${clienteID}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				if (res.data.direccion.length !== 0) {
					form.setFieldsValue({
						nombre: res.data.nombre,
						apellido: res.data.apellido,
						email: res.data.email,
						telefono: res.data.telefono,
						calle_numero: res.data.direccion[0].calle_numero,
						entre_calles: res.data.direccion[0].entre_calles,
						cp: res.data.direccion[0].cp,
						colonia: res.data.direccion[0].colonia,
						ciudad: res.data.direccion[0].ciudad,
						estado: res.data.direccion[0].estado,
						pais: res.data.direccion[0].pais
					});
				} else {
					form.setFieldsValue({
						nombre: res.data.nombre,
						apellido: res.data.apellido,
						email: res.data.email,
						telefono: res.data.telefono,
						calle_numero: '',
						entre_calles: '',
						cp: '',
						colonia: '',
						ciudad: '',
						estado: '',
						pais: ''
					});
				}
				if (res.data.telefono.length === 0 || res.data.direccion.length === 0) {
					setEstadoBoton('Completa tus datos');
				} else {
					setEstadoBoton('Apartar');
				}
			})
			.catch((err) => {
				setLoading(false);
			});
	}

	const control = () => {
		switch (estadoBoton) {
			case 'Completa tus datos':
				setControlBoton(false);
				setEstadoBoton('Apartar');
				break;
			default:
				break;
		}
	};

	async function envios() {
		await clienteAxios
			.get(`/politicasEnvio/estados/`)
			.then((res) => {
				res.data.map((total) => {
					setEnvioTotal(total);
				});
			})
			.catch((err) => {});
	}

	useEffect(() => {
		envios();
	}, []);

	async function envioDatos(valores) {
		setLoading(true);
		const estado = await editarDatosUsuario(valores);
		if (estado) {
			const municipio_aceptado = await checarEnvios(valores.cp);
			if (municipio_aceptado !== 'municipioRechazado') {
				handleOk();
			} else {
				setEstadoBoton('Apartar');
				setControlBoton(false);
			}
		}
	}

	async function editarDatosUsuario(valores) {
		return await clienteAxios
			.put(`/cliente/${clienteID}`, valores, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				localStorage.setItem('token', res.data.token);
				setLoading(false);
				setControlBoton(true);
				return true;
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
				return false;
			});
	}

	async function checarEnvios(cp) {
		if (tipoEnvio !== 'ENVIO') {
			return 'NoEnvio';
		} else {
			if (envioTotal.todos === true || envioTotal === false) {
				return 'TodosEstados';
			} else {
				const estado = await consultaCodigos.get(`/info_cp/${cp}`).then((res) => {
					return clienteAxios
						.get(`/politicasEnvio/estado/municipio/${res.data[0].response.municipio}`)
						.then((res) => {
							setLoading(false);
							return 'MunicipioAceptado';
						})
						.catch((err) => {
							setLoading(false);
							setMensajeRechazo(err.response.data.message);
							return 'municipioRechazado';
						});
				});
				return estado;
			}
		}
	}

	useEffect(() => {
		obtenerDatosUser();
	}, []);

	return (
		<Spin spinning={loading}>
			<Form {...layout} form={form} onFinish={envioDatos}>
				<Row>
					<Col>
						<Form.Item label="Nombre" name="nombre">
							<Form.Item
								rules={[ { required: true, message: 'Nombre obligatorio' } ]}
								noStyle
								name="nombre"
							>
								<Input name="nombre" placeholder="Nombre" disabled={controlBoton} />
							</Form.Item>
						</Form.Item>
						<Form.Item label="Apellido" name="apellido">
							<Form.Item
								rules={[ { required: true, message: 'Apellidos obligatorios' } ]}
								noStyle
								name="apellido"
							>
								<Input name="apellido" placeholder="Apellidos" disabled={controlBoton} />
							</Form.Item>
						</Form.Item>
					</Col>
					<Col>
						<Form.Item label="Email" name="email">
							<Form.Item
								rules={[ { required: true, message: 'Correo electronico obligatorio' } ]}
								noStyle
								name="email"
							>
								<Input name="email" placeholder="Correo electronico" disabled />
							</Form.Item>
						</Form.Item>
						<Form.Item label="Teléfono" name="telefono">
							<Form.Item
								rules={[ { required: true, message: 'Telefono obligatorio' } ]}
								noStyle
								name="telefono"
							>
								<Input name="telefono" placeholder="telefono" disabled={controlBoton} />
							</Form.Item>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Divider>Datos de envío</Divider>
					<Col>
						<Form.Item label="Calle y número" name="calle_numero">
							<Form.Item
								rules={[ { required: true, message: 'Direccion obligatoria' } ]}
								noStyle
								name="calle_numero"
							>
								<Input
									name="calle_numero"
									placeholder="Calle y numero de calle"
									disabled={controlBoton}
								/>
							</Form.Item>
						</Form.Item>
						<Form.Item label="Entre calles" name="entre_calles">
							<Form.Item
								rules={[ { required: true, message: 'Referencia obligatoria' } ]}
								noStyle
								name="entre_calles"
							>
								<Input name="entre_calles" placeholder="Calles de referencia" disabled={controlBoton} />
							</Form.Item>
						</Form.Item>
						<Form.Item label="Código postal" name="cp">
							<Form.Item
								rules={[ { required: true, message: 'Codigo postal obligatorio' } ]}
								noStyle
								name="cp"
							>
								<Input name="cp" placeholder="Codigo Postal" disabled={controlBoton} />
							</Form.Item>
						</Form.Item>
						<Form.Item label="Colonia" name="colonia">
							<Form.Item
								rules={[ { required: true, message: 'Colonia obligatoria' } ]}
								noStyle
								name="colonia"
							>
								<Input name="colonia" placeholder="Colonia" disabled={controlBoton} />
							</Form.Item>
						</Form.Item>
					</Col>
					<Col>
						<Form.Item label="Ciudad" name="ciudad">
							<Form.Item
								rules={[ { required: true, message: 'Localidad obligatoria' } ]}
								noStyle
								name="ciudad"
							>
								<Input name="ciudad" placeholder="Localidad" disabled={controlBoton} />
							</Form.Item>
						</Form.Item>
						<Form.Item label="Estado" name="estado">
							<Form.Item
								rules={[ { required: true, message: 'Estado obligatoria' } ]}
								noStyle
								name="estado"
							>
								<Input name="estado" placeholder="Estado" disabled={controlBoton} />
							</Form.Item>
						</Form.Item>
						<Form.Item label="País" name="pais">
							<Form.Item rules={[ { required: true, message: 'País obligatoria' } ]} noStyle name="pais">
								<Input name="pais" placeholder="País" disabled={controlBoton} />
							</Form.Item>
						</Form.Item>
					</Col>
				</Row>
				{mensajeRechazo !== '' ? (
					<Alert
						className="text-center mb-2"
						message="Lo sentimos"
						description={mensajeRechazo}
						type="error"
						showIcon
					/>
				) : (
					<Form.Item />
				)}
				<Form.Item className="d-flex justify-content-center align-items-center">
					<Form.Item className="text-center">
						{estadoBoton === 'Apartar' ? (
							<Button
								htmlType="submit"
								className="color-boton color-font-boton"
								size="large"
								style={{ width: 170 }}
							>
								{estadoBoton}
							</Button>
						) : (
							<Button
								htmlType="button"
								className="color-boton color-font-boton"
								size="large"
								style={{ width: 170 }}
								onClick={control}
							>
								{estadoBoton}
							</Button>
						)}
					</Form.Item>
				</Form.Item>
			</Form>
		</Spin>
	);
}
