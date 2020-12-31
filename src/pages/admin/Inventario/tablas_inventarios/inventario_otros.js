import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../../config/axios';
import { Table, Tag, InputNumber, notification, Badge, Spin, Form, Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Pagination from '../../../../components/Pagination/pagination';

function InventarioOtros(props) {
	//Tomar la paginacion actual
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
	const [ idSeleccionado, setIdSeleccionado ] = useState('');
	const [ validateStatus, setValidateStatus ] = useState('validate');

	const obtenerValor = (value, producto) => {
		if (!value) {
			setCantidad(0);
		} else {
			setCantidad(parseInt(value));
		}
		setIdSeleccionado(producto);
		setValidateStatus('validate');
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
					setValidateStatus('validate');
					form.resetFields([ producto._id ]);
					setCantidad(0);
					setIdSeleccionado('');
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
			render: (text) => (!text ? <p className="h5">-</p> : <p className="h5">{text}</p>)
		},
		{
			title: 'Producto',
			dataIndex: 'nombre',
			key: 'nombre',
			render: (text) => <p className="h5">{text}</p>
		},
		{
			title: 'Cantidad',
			dataIndex: 'cantidad',
			key: 'cantidad',
			width: 100,
			render: (text) =>
				text === null ? (
					<p>-</p>
				) : text === 0 ? (
					<Badge count={text} showZero />
				) : (
					<Badge style={{ backgroundColor: '#52c41a' }} count={text} overflowCount={100000} />
				)
		},
		{
			title: 'Estado',
			dataIndex: 'activo',
			key: 'activo',
			width: 100,
			render: (estado) => (
				<div>{estado ? <Tag color="green">Activo</Tag> : <Tag color="processing">Pausado</Tag>}</div>
			)
		},
		{
			title: 'Agregar/Restar',
			dataIndex: 'cantidad',
			key: '_id',
			width: 230,
			render: (cantidad, producto) => (
				<Form key={producto._id} className="d-flex" form={form}>
					<Form.Item
						name={producto._id}
						className="d-inline"
						validateStatus={producto._id === idSeleccionado ? validateStatus : 'validate'}
					>
						<InputNumber
							id={producto._id}
							type="number"
							size="large"
							min={1}
							max={100000}
							onChange={(e) => obtenerValor(e, producto._id)}
							onClick={(e) => obtenerValor(e.target.value, producto._id)}
						/>
					</Form.Item>
					<div className="mx-1 d-inline">
						<Button
							type="primary"
							size="large"
							onClick={() => actualizarCantidad(producto, 'sumar')}
							disabled={producto._id === idSeleccionado ? false : true}
						>
							<PlusOutlined className="d-flex" />
						</Button>
						<Button
							type="default"
							size="large"
							onClick={() => actualizarCantidad(producto, 'restar')}
							disabled={producto._id === idSeleccionado ? false : true}
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
export default withRouter(InventarioOtros);
