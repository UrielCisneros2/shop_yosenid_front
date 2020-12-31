import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './pedidos.scss';
import { Card, Col, Row, Modal, notification, Result, Spin, Radio, Tag } from 'antd';
import { ContainerOutlined, EditOutlined } from '@ant-design/icons';
import clienteAxios from '../../../config/axios';
import DetallesPedido from './detalles_pedido';
import EstadoPedido from './estado_pedido';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';
import { formatoMexico, formatoFecha } from '../../../config/reuserFunction';

const { Meta } = Card;

function Pedidos(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	if (token === '' || token === null) {
		props.history.push('/entrar');
	} else if (decoded['rol'] !== true) {
		props.history.push('/');
	}

	//Tomar la paginacion actual
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);

	const [ pedidos, setPedidos ] = useState([]);
	const [ pedidosPaginacion, setPedidosPaginacion ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	//state modales
	const [ visible, setVisible ] = useState(false);
	const [ estadoVisible, setEstadoVisible ] = useState(false);
	//state para mostrar pedido en el modal
	const [ detallePedido, setDetallePedido ] = useState([]);
	const [ reload, setReload ] = useState(false);

	useEffect(
		() => {
			obtenerPedidos(12, page);
			setReload(false);
		},
		[ reload, page ]
	);

	const obtenerPedidos = async (limit, page) => {
		setLoading(true);
		await clienteAxios
			.get(`/pedidos/admin?limit=${limit}&page=${page}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setPedidos(res.data.docs);
				// setPedidosPaginacion(res.data);
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
	};

	const obtenerPedidosFiltrados = async (limit, page, filtro) => {
		setLoading(true);
		await clienteAxios
			.get(`/pedidos/admin/filtrados?limit=${limit}&page=${page}&filtro=${filtro}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setPedidos(res.data.docs);
				setPedidosPaginacion(res.data);
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
	};

	function onChange(e) {
		const estado = e.target.value;
		switch (estado) {
			case 'todos':
				obtenerPedidos(10, page);
				break;
			case 'proceso':
				obtenerPedidosFiltrados(10, page, 'En proceso');
				break;
			case 'enviados':
				obtenerPedidosFiltrados(10, page, 'Enviado');
				break;
			case 'entregados':
				obtenerPedidosFiltrados(10, page, 'Entregado');
				break;
			default:
				obtenerPedidos(10, page);
				break;
		}
	}
	const showModal = () => {
		setVisible(true);
	};
	const showModalEstado = () => {
		setEstadoVisible(true);
	};
	const handleCancelEstado = () => {
		setEstadoVisible(false);
	};
	const handleCancel = () => {
		setVisible(false);
	};

	const render = pedidos.map((pedidos) => {
		return (
			<Col className="mb-3" span={window.screen.width > 990 ? 8 : 24} key={pedidos._id}>
				<Card
					className="shadow-sm card-p-pedidos"
					actions={[
						<div className="d-flex justify-content-center align-items-center">
							<ContainerOutlined className="mr-2" style={{ fontSize: 20 }} />
							<p
								onClick={() => {
									setDetallePedido(pedidos);
									showModal();
								}}
								className="d-inline"
							>
								Detalles del pedido
							</p>
						</div>,
						<div className="d-flex justify-content-center align-items-center">
							<EditOutlined className="mr-2" style={{ fontSize: 20 }} />
							<p
								onClick={() => {
									setDetallePedido(pedidos);
									showModalEstado();
								}}
								className="d-inline"
							>
								Cambiar estado
							</p>
						</div>
					]}
				>
					<Meta
						className="contenedor-card-pedidos"
						description={
							<div>
								<div className="my-2">
									<h6 className="titulos-info-pedidos">ID del pedido: </h6>
									<p className="data-info-pedidos">{pedidos._id}</p>
								</div>
								<div className="my-2">
									<h6 className="titulos-info-pedidos">Fecha de pedido:</h6>
									<p className="data-info-pedidos fecha-pedidos">{formatoFecha(pedidos.createdAt)}</p>
								</div>
								{pedidos.fecha_envio ? (
									<div className="my-2">
										<h6 className="titulos-info-pedidos">Fecha de envío:</h6>
										<p className="data-info-pedidos">{formatoFecha(pedidos.fecha_envio)}</p>
									</div>
								) : (
									<div />
								)}
								<div className="my-2">
									<h6 className="titulos-info-pedidos">Cliente:</h6>
									<p className="data-info-pedidos">{pedidos.cliente.nombre}</p>
								</div>
								<div className="my-2">
									<h6 className="titulos-info-pedidos">Cantidad:</h6>
									<p className="data-info-pedidos">{pedidos.pedido.length}</p>
								</div>
								<div className="my-2">
									<h6 className="titulos-info-pedidos">Estado:</h6>
									<Tag
										className="data-info-pedidos"
										color={pedidos.estado_pedido === 'Entregado' ? '#5cb85c' : pedidos.estado_pedido === 'Enviado' ? '#0088ff' : '#ffc401'}
									>
										{pedidos.estado_pedido}
									</Tag>
								</div>
								<div className="my-2">
									<h6 className="titulos-info-pedidos">Pagado:</h6>
									<Tag
										className="data-info-pedidos"
										color={pedidos.pagado === true ? '#5cb85c' : '#f0ad4e'}
									>
										{pedidos.pagado === true ? 'Si' : 'No'}
									</Tag>
								</div>
								<div className="my-2">
									<h6 className="titulos-info-pedidos">Total:</h6>
									<p className="precio-total-pedidos data-info-pedidos">
										$ {formatoMexico(pedidos.total)}
									</p>
								</div>
							</div>
						}
					/>
				</Card>
			</Col>
		);
	});

	return (
		<Spin size="large" spinning={loading}>
			<div>
				<p className="text-center font-weight-bold" style={{ fontSize: 20 }}>
						SISTEMA DE CONTROL DE PEDIDOS
				</p>
				<p className="text-center" style={{ fontSize: 15 }}>
					En este apartado puedes ver todos los pedidos de tus clientes, filtrar por estados, si ya están
					pagados o no y cambiar su estado.
				</p>
				<div className="mt-4">
					<p className="d-lg-inline d-block mr-5">Mostrar por:</p>
					<Radio.Group name="radiogroup" defaultValue="todos" size="mediun">
						<Radio className="d-lg-inline d-block mb-1" value="todos" onChange={onChange}>
							Todos
						</Radio>
						<Radio className="d-lg-inline d-block mb-1" value="proceso" onChange={onChange}>
							En Proceso
						</Radio>
						<Radio className="d-lg-inline d-block mb-1" value="enviados" onChange={onChange}>
							Enviados
						</Radio>
						<Radio className="d-lg-inline d-block mb-1" value="entregados" onChange={onChange}>
							Entregados
						</Radio>
					</Radio.Group>
				</div>
				<div className="mt-4">
					{pedidos.length === 0 ? (
						<div className="w-100 d-flex justify-content-center align-items-center">
							<Result status="404" title="No hay resultados" />
						</div>
					) : (
						<Row gutter={16}>{render}</Row>
					)}
				</div>
			</div>
			<Modal
				key="detalle"
				width={600}
				style={{ top: 0 }}
				title=""
				visible={visible}
				onCancel={handleCancel}
				footer={null}
			>
				<DetallesPedido datosDetalle={detallePedido}  />
			</Modal>
			<Modal
				key="estado"
				width={600}
				style={{ top: 0 }}
				title="Estado del pedido"
				visible={estadoVisible}
				onCancel={handleCancelEstado}
				footer={null}
			>
				<EstadoPedido datosPedido={detallePedido} reload={setReload} handleCancelEstado={handleCancelEstado} />
			</Modal>
			<Pagination blogs={pedidosPaginacion} location={location} history={history} limite={12} />
		</Spin>
	);
}
export default withRouter(Pedidos);
