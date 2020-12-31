import React, { useState, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Row, Col, Badge, notification, Spin, Alert } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './registrar_talla.scss';
import { ProductoContext } from '../../contexts/ProductoContext';
/* import { StepsContext } from '../../contexts/stepsContext'; */

function RegistrarTalla(props) {
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const [ productoContext, disabledForm ] = useContext(ProductoContext);
	/* const [ disabled, setDisabled ] = useContext(StepsContext); */
	const setDisabled = props.disabledButtons;
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	const [ datos, setDatos ] = useState({
		talla: '',
		cantidad: ''
	});

	const datosForm = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	const subirTalla = async () => {
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
				.post(`/productos/addTalla/${productoContext}`, datos, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setDisabled(false);
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
	};

	const eliminarTalla = async (idtalla) => {
		setLoading(true);
		await clienteAxios
			.delete(`/productos/action/${productoContext}/talla/${idtalla}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				obtenerTalla();
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
	const obtenerTalla = async () => {
		await clienteAxios
			.get(`/productos/${productoContext}`)
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
	};

	if (productos !== 0) {
		var render = productos.map((tallas) => (
			<div className="m-2" key={tallas._id}>
				<Badge count={tallas.cantidad} style={{ backgroundColor: '#52c41a' }}>
					<div className="hover-delete d-flex text-center">
						<p
							className="rounded p-2 contenido-talla"
							style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '60px', height: '56px' }}
						>
							{tallas.talla}
						</p>
						<div className="icono rounded">
							<DeleteOutlined
								onClick={function() {
									eliminarTalla(tallas._id);
								}}
								style={{ fontSize: 25, color: 'white' }}
							/>
						</div>
					</div>
				</Badge>
			</div>
		));
	}

	return (
		<Spin size="large" spinning={loading}>
			{disabledForm === false ? (
				<div className="d-flex justify-content-center m-2">
					<Alert style={{ width: '60%' }} message="Ya puedes registrar tallas" type="info" showIcon />
				</div>
			) : (
				<div className="d-flex justify-content-center m-2">
					<Alert
						style={{ width: '60%' }}
						message="Podrás registrar tallas después de registrar tu producto"
						type="info"
						showIcon
					/>
				</div>
			)}
			<p className="text-center mb-1">Escribe la talla y la cantidad de productos disponibles de esa talla.</p>
			<div className="d-flex justify-content-center">
				<Form onFinish={subirTalla} form={form} className="d-flex justify-content-center">
					<Row gutter={8}>
						<Col span={5}>
							<Form.Item
								name="talla"
								label="Talla"
								onChange={datosForm}
								labelCol={{ offset: 1, span: 6 }}
								wrapperCol={{ offset: 1, span: 16 }}
							>
								<Input disabled={disabledForm} name="talla" />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="cantidad"
								label="Stock actual"
								onChange={datosForm}
								labelCol={{ offset: 1, span: 8 }}
								wrapperCol={{ offset: 1, span: 12 }}
							>
								<Input disabled={disabledForm} name="cantidad" />
							</Form.Item>
						</Col>
						<Col>
							<Form.Item labelCol={{ offset: 1, span: 4 }} wrapperCol={{ offset: 1, span: 12 }}>
								<Button disabled={disabledForm} type="dafault" htmlType="submit" loading={loading}>
									Agregar
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
			<h6 className="mensaje">Para eliminar manten presionado</h6>
			<div className="row">{render}</div>
		</Spin>
	);
}
export default RegistrarTalla;
