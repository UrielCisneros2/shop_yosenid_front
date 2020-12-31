import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../../config/axios';
import { Table, Tag, InputNumber, notification, Badge, Spin, Form, Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Pagination from '../../../../components/Pagination/pagination';

function InventarioNumeros(props) {
	const {
		location,
		history,
		productos,
		productosRender,
		reload,
		setReload,
		loading,
		setLoading,
		token,
		limite
	} = props;
	const [ form ] = Form.useForm();
	const [ cantidad, setCantidad ] = useState(0);
	const [ idNumeroSeleccionada, setIdNumeroSeleccionada ] = useState('');
	const [ validateStatus, setValidateStatus ] = useState('validate');
	const [ numero, setNumero ] = useState([]);

	const obtenerValor = (value, producto) => {
		if (!value) {
			setCantidad(0);
		} else {
			setCantidad(parseInt(value));
		}
		setValidateStatus('validate');
	};

	const obtenerNumero = (producto, numero) => {
		setNumero(numero);
		setIdNumeroSeleccionada(producto);
		setValidateStatus('warning');
		form.resetFields();
		setCantidad(0);
	};

	const actualizarCantidad = async (producto, accion) => {
		if (cantidad <= 0 || cantidad === null) {
			notification.warning({
				message: 'La cantidad no puede ir vacia',
				duration: 2
			});
			setValidateStatus('error');
		} else {
			await clienteAxios
				.put(
					`/productos/inventario/${producto._id}`,
					{
						cantidad,
						medida: numero._id,
						accion
					},
					{
						headers: {
							Authorization: `bearer ${token}`
						}
					}
				)
				.then((res) => {
					notification.success({
						message: '¡Listo!',
						description: res.data.message,
						duration: 2
					});
					setNumero([]);
					setValidateStatus('validate');
					form.resetFields([ producto._id ]);
					setCantidad(0);
					setIdNumeroSeleccionada('');
					setReload(!reload);
					setLoading(false);
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

	const columns = [
		{
			title: 'Código',
			dataIndex: 'codigo',
			key: 'codigo',
			width: 150,
			render: (text) => (!text ? <p className="h5">-</p> : <p className="h5">{text}</p>)
		},
		{
			title: 'Producto',
			dataIndex: 'nombre',
			key: 'nombre',
			width: 300,
			render: (text) => <p className="h5">{text}</p>
		},
		{
			title: 'Número y Cantidad',
			dataIndex: 'numeros',
			key: 'numeros',
			width: 500,
			render: (numeros, producto) => (
				<div>
					{!numeros.length ? (
						<p className="h5">-</p>
					) : (
						numeros.map((numeros) => {
							return (
								<Badge
									className="badge-inventario"
									key={numeros._id}
									count={numeros.cantidad}
									showZero
									overflowCount={100000}
									style={
										numeros.cantidad !== 0 ? (
											{ backgroundColor: '#52c41a' }
										) : (
											{ backgroundColor: '#FF4D4F' }
										)
									}
								>
									<Button
										type={numero._id === numeros._id ? 'primary' : 'default'}
										onClick={() => obtenerNumero(producto._id, numeros)}
									>
										{numeros.numero}
									</Button>
								</Badge>
							);
						})
					)}
				</div>
			)
		},
		{
			title: 'Estado',
			dataIndex: 'activo',
			key: 'activo',
			render: (estado) => (
				<div>{estado ? <Tag color="green">Activo</Tag> : <Tag color="processing">Pausado</Tag>}</div>
			)
		},
		{
			title: 'Agregar/Restar',
			dataIndex: 'cantidad',
			key: '_id',
			width: 250,
			render: (cantidad, producto) => (
				<Form className="d-flex" form={form}>
					<Form.Item
						name={producto._id}
						className="d-inline"
						validateStatus={producto._id === idNumeroSeleccionada ? validateStatus : 'validate'}
					>
						<InputNumber
							type="number"
							size="large"
							min={1}
							max={100000}
							onChange={(e) => obtenerValor(e, producto._id)}
							onClick={(e) => obtenerValor(e.target.value, producto._id)}
							disabled={producto._id === idNumeroSeleccionada ? false : true}
						/>
					</Form.Item>
					<div className="mx-1 d-inline">
						<Button
							type="primary"
							size="large"
							onClick={() => actualizarCantidad(producto, 'sumar')}
							disabled={producto._id === idNumeroSeleccionada ? false : true}
						>
							<PlusOutlined className="d-flex" />
						</Button>
						<Button
							type="default"
							size="large"
							disabled={producto._id === idNumeroSeleccionada ? false : true}
							onClick={() => actualizarCantidad(producto, 'restar')}
						>
							<MinusOutlined className="d-flex" />
						</Button>
					</div>
				</Form>
			)
		}
	];

	return (
		<Spin size="large" spinning={loading}>
			<Table
				className="tabla-inventario"
				columns={columns}
				dataSource={productosRender}
				pagination={false}
				rowKey={(producto) => producto._id}
				scroll={{ x: 1200 }}
			/>
			<div className="mt-5">
				<Pagination blogs={productos} location={location} history={history} limite={limite} />
			</div>
		</Spin>
	);
}
export default withRouter(InventarioNumeros);
