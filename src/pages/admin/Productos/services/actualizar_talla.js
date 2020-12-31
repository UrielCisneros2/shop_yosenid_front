import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Row, Col, Badge, notification, Spin, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './actualizar_tallas.scss';
import { IdProductoContext } from '../../contexts/ProductoContext';

function ActualizarTalla() {
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ productos, setProductos ] = useState([]);
	const [ idTalla, setIdTalla ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ datos, setDatos ] = useState({
		talla: '',
		cantidad: ''
	});

	useEffect(
		() => {
			obtenerTalla();
		},
		[ productoID ]
	);

	const datosForm = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	async function actualizarTalla() {
		setLoading(true);
		await clienteAxios
			.put(`/productos/action/${productoID}/talla/${idTalla}`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setIdTalla('');
				obtenerTalla();
				setLoading(false);
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
	async function nuevaTalla() {
		const resul = productos.map((tallas) => {
			if (tallas.talla === datos.talla) {
				return true;
			}
			return null;
		});
		const existe = resul.find((element) => element === true);

		if (existe) {
			notification.error({
				message: 'Esta talla ya esta registrada',
				duration: 2
			});
		} else {
			if (datos.talla === '' || datos.cantidad === '') {
				return null;
			}
			setLoading(true);
			await clienteAxios
				.post(`/productos/addTalla/${productoID}`, datos, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setIdTalla('');
					setLoading(false);
					obtenerTalla();
					setDatos({
						talla: '',
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
					setIdTalla('');
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
	async function eliminarTalla(idTalla) {
		setLoading(true);
		await clienteAxios
			.delete(`/productos/action/${productoID}/talla/${idTalla}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerTalla();
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
	}
	async function obtenerTalla() {
		await clienteAxios
			.get(`/productos/${productoID}`)
			.then((res) => {
				setProductos(res.data.tallas);
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

	const rellenarCampos = (talla, cantidad, idTallas) => {
		setIdTalla(idTallas);
		setDatos({ ...datos, talla, cantidad });
		form.setFieldsValue({
			talla,
			cantidad
		});
	};

	if (productos !== 0) {
		var render = productos.map((tallas) => (
			<div className="mb-5 m-2" key={tallas._id}>
				<Badge
					showZero
					count={tallas.cantidad}
					style={tallas.cantidad !== 0 ? { backgroundColor: '#52c41a' } : { backgroundColor: '#FF4D4F' }}
				>
					<div className="hover-delete d-flex text-center">
						<p
							className="rounded p-2 contenido-talla"
							style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '60px', height: '56px' }}
						>
							{tallas.talla}
						</p>
						<div className="icono rounded d-flex justify-content-around">
							<EditOutlined
								onClick={function() {
									rellenarCampos(tallas.talla, tallas.cantidad, tallas._id);
								}}
								style={{ fontSize: 20, color: 'white' }}
							/>
							<DeleteOutlined
								onClick={function() {
									eliminarTalla(tallas._id);
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
					<Form form={form} onFinish={actualizarTalla}>
						<Row gutter={8}>
							<Col span={5}>
								<Form.Item
									name="talla"
									label="Talla"
									onChange={datosForm}
									labelCol={{ offset: 1, span: 6 }}
									wrapperCol={{ offset: 1, span: 16 }}
								>
									<Input name="talla" />
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
								{idTalla ? (
									<div>
										<Space>
											<Button type="dafault" htmlType="submit">
												Guardar
											</Button>
											<Button
												type="dafault"
												onClick={() => {
													setIdTalla('');
													form.resetFields();
												}}
											>
												Cancelar
											</Button>
										</Space>
									</div>
								) : (
									<Button type="dafault" onClick={nuevaTalla}>
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
export default ActualizarTalla;
