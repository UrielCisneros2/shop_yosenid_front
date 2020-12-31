import React, { useState, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Row, Col, Badge, notification, Spin, Alert } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './registrar_talla.scss';
import { ProductoContext } from '../../contexts/ProductoContext';
/* import { StepsContext } from '../../contexts/stepsContext'; */

function RegistrarNumero(props) {
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const [ productoContext, disabledForm ] = useContext(ProductoContext);
	/* const [ disabled, setDisabled ] = useContext(StepsContext); */
	const setDisabled = props.disabledButtons;
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	const [ datos, setDatos ] = useState({
		numero: '',
		cantidad: ''
	});

	const datosForm = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	const subirNumero = async () => {
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
				.post(`/productos/addNumero/${productoContext}`, datos, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setDisabled(false);
					obtenerNumero();
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
	};

	const eliminarNumero = async (idnumero) => {
		setLoading(true);
		await clienteAxios
			.delete(`/productos/action/${productoContext}/numero/${idnumero}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerNumero();
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
	const obtenerNumero = async () => {
		await clienteAxios
			.get(`/productos/${productoContext}`)
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
	};

	if (productos !== 0) {
		var render = productos.map((numero) => (
			<div className="m-2" key={numero._id}>
				<Badge count={numero.cantidad} style={{ backgroundColor: '#52c41a' }}>
					<div className="hover-delete d-flex text-center">
						<p
							className="rounded p-2 contenido-talla"
							style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '60px', height: '56px' }}
						>
							{numero.numero}
						</p>
						<div className="icono rounded">
							<DeleteOutlined
								onClick={function() {
									eliminarNumero(numero._id);
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
					<Alert
						style={{ width: '60%' }}
						message="Ya puedes registrar número de calzado"
						type="info"
						showIcon
					/>
				</div>
			) : (
				<div className="d-flex justify-content-center m-2">
					<Alert
						style={{ width: '60%' }}
						message="Podrás registrar el número de calzado después de registrar tu producto"
						type="info"
						showIcon
					/>
				</div>
			)}
			<p className="text-center mb-1">
				Escribe la talla del calzado y la cantidad de productos disponibles de esa talla.
			</p>
			<div className="d-flex justify-content-center">
				<Form onFinish={subirNumero} form={form}>
					<Row gutter={8}>
						<Col span={5}>
							<Form.Item
								name="numero"
								label="Numero"
								onChange={datosForm}
								labelCol={{ offset: 1, span: 8 }}
								wrapperCol={{ offset: 1, span: 16 }}
							>
								<Input name="numero" disabled={disabledForm} />
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
								<Input name="cantidad" disabled={disabledForm} />
							</Form.Item>
						</Col>
						<Col>
							<Form.Item labelCol={{ offset: 1, span: 4 }} wrapperCol={{ offset: 1, span: 12 }}>
								<Button type="dafault" htmlType="submit" disabled={disabledForm} loading={loading}>
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
export default RegistrarNumero;
