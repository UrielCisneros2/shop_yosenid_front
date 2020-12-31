import React, { useState, useContext, useEffect, useRef } from 'react';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Row, Col, Badge, notification, Spin, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './actualizar_tallas.scss';
import { IdProductoContext } from '../../contexts/ProductoContext';

function ActualizarNumero() {
	const formRef = useRef(null);
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ productos, setProductos ] = useState([]);
	const [ idNumero, setIdNumero ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ datos, setDatos ] = useState({
		numero: '',
		cantidad: ''
	});

	useEffect(
		() => {
			obtenerNumero();
		},
		[ productoID ]
	);

	const datosForm = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	async function actualizarNumero() {
		setLoading(true);
		await clienteAxios
			.put(`/productos/action/${productoID}/numero/${idNumero}`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setIdNumero('');
				setLoading(false);
				setDatos({
					numero: '',
					cantidad: ''
				});
				obtenerNumero();
				form.resetFields();
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
	}
	async function nuevoNumero() {
		const resul = productos.map((numeros) => {
			if (numeros.numero === datos.numero) {
				return true;
			}
			return null;
		});
		const existe = resul.find((element) => element === true);

		if (existe) {
			notification.error({
				message: 'Este numero ya esta registrado',
				duration: 2
			});
		} else {
			if (datos.numero === '' || datos.cantidad === '') {
				return null;
			}
			setLoading(true);
			await clienteAxios
				.post(`/productos/addNumero/${productoID}`, datos, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					obtenerNumero();
					setLoading(false);
					setDatos({
						numero: '',
						cantidad: ''
					});
					form.resetFields();
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
		}
	}
	async function eliminarNumero(idNumero) {
		setLoading(true);
		await clienteAxios
			.delete(`/productos/action/${productoID}/numero/${idNumero}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				obtenerNumero();
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
	}
	async function obtenerNumero() {
		await clienteAxios
			.get(`/productos/${productoID}`)
			.then((res) => {
				setProductos(res.data.numeros);
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

	const rellenarCampos = (numero, cantidad, idNumero) => {
		setIdNumero(idNumero);
		setDatos({ ...datos, numero, cantidad });
		form.setFieldsValue({
			numero,
			cantidad
		});
	};

	if (productos !== 0) {
		var render = productos.map((numeros) => (
			<div className="mb-5 m-2" key={numeros._id}>
				<Badge
					showZero
					count={numeros.cantidad}
					style={numeros.cantidad !== 0 ? { backgroundColor: '#52c41a' } : { backgroundColor: '#FF4D4F' }}
				>
					<div className="hover-delete d-flex text-center">
						<p
							className="rounded p-2 contenido-talla"
							style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '60px', height: '56px' }}
						>
							{numeros.numero}
						</p>
						<div className="icono rounded d-flex justify-content-around">
							<EditOutlined
								onClick={function() {
									rellenarCampos(numeros.numero, numeros.cantidad, numeros._id);
								}}
								style={{ fontSize: 20, color: 'white' }}
							/>
							<DeleteOutlined
								onClick={function() {
									eliminarNumero(numeros._id);
								}}
								style={{ fontSize: 20, color: 'white' }}
							/>
						</div>
					</div>
				</Badge>
			</div>
		));
	}

	return (
		<Spin size="large" spinning={loading}>
			<div className="ml-4">
				<div className="d-flex justify-content-center">
					<Form form={form} ref={formRef.current} onFinish={actualizarNumero}>
						<Row gutter={8}>
							<Col span={8}>
								<Form.Item
									name="numero"
									label="Numero"
									onChange={datosForm}
									labelCol={{ offset: 1, span: 6 }}
									wrapperCol={{ offset: 1, span: 16 }}
								>
									<Input name="numero" />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item
									name="cantidad"
									label="Stock actual"
									onChange={datosForm}
									labelCol={{ offset: 1, span: 6 }}
									wrapperCol={{ offset: 1, span: 12 }}
								>
									<Input name="cantidad" />
								</Form.Item>
							</Col>
							<Col>
								{idNumero ? (
									<div>
										<Space>
											<Button type="dafault" htmlType="submit">
												Guardar
											</Button>
											<Button
												type="dafault"
												onClick={() => {
													setIdNumero('');
													form.resetFields();
												}}
											>
												Cancelar
											</Button>
										</Space>
									</div>
								) : (
									<Button type="dafault" onClick={nuevoNumero}>
										Agregar
									</Button>
								)}
							</Col>
						</Row>
					</Form>
				</div>
				<h6 className="mensaje">Para eliminar manten presionado</h6>
				<div className="row">{render}</div>
			</div>
		</Spin>
	);
}
export default ActualizarNumero;
