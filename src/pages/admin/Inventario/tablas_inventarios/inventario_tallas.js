import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../../config/axios';
import { Table, Tag, InputNumber, notification, Badge, Spin, Form, Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Pagination from '../../../../components/Pagination/pagination';

function InventarioTallas(props) {
	const { location, history, productos, productosRender, reload, setReload, loading, setLoading, token, limite } = props;
	const [ form ] = Form.useForm();
	const [ cantidad, setCantidad ] = useState(0);
	const [ idTallaSeleccionada, setIdTallaSeleccionada ] = useState('');
	const [ validateStatus, setValidateStatus ] = useState('validate');
	const [ talla, setTalla ] = useState([]);

	const obtenerValor = (value, producto) => {
		if (!value) {
			setCantidad(0);
		} else {
			setCantidad(parseInt(value));
		}
		setValidateStatus('validate');
	};

	const obtenerTallas = (producto, talla) => {
		setTalla(talla);
		setIdTallaSeleccionada(producto);
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
						medida: talla._id,
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
					setTalla([]);
					setValidateStatus('validate');
					form.resetFields([ producto._id ]);
					setCantidad(0);
					setIdTallaSeleccionada('');
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
			title: 'Talla y Cantidad',
			dataIndex: 'tallas',
			key: 'tallas',
			width: 500,
			render: (tallas, producto) => (
				<div>
					{!tallas.length ? (
						<p className="h5">-</p>
					) : (
						tallas.map((tallas) => {
							return (
								<Badge
									className="badge-inventario"
									key={tallas._id}
									count={tallas.cantidad}
									showZero
									overflowCount={100000}
									style={
										tallas.cantidad !== 0 ? (
											{ backgroundColor: '#52c41a' }
										) : (
											{ backgroundColor: '#FF4D4F' }
										)
									}
								>
									<Button
										type={talla._id === tallas._id ? 'primary' : 'default'}
										onClick={() => obtenerTallas(producto._id, tallas)}
									>
										{tallas.talla}
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
						validateStatus={producto._id === idTallaSeleccionada ? validateStatus : 'validate'}
					>
						<InputNumber
							type="number"
							size="large"
							min={1}
							max={100000}
							onChange={(e) => obtenerValor(e, producto._id)}
							onClick={(e) => obtenerValor(e.target.value, producto._id)}
							disabled={producto._id === idTallaSeleccionada ? false : true}
						/>
					</Form.Item>
					<div className="mx-1 d-inline">
						<Button
							type="primary"
							size="large"
							onClick={() => actualizarCantidad(producto, 'sumar')}
							disabled={producto._id === idTallaSeleccionada ? false : true}
						>
							<PlusOutlined className="d-flex" />
						</Button>
						<Button
							type="default"
							size="large"
							disabled={producto._id === idTallaSeleccionada ? false : true}
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
export default withRouter(InventarioTallas);
