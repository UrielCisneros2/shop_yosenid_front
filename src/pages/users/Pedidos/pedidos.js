import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import DetallesPedido from './detalles';
import { formatoFecha, formatoMexico } from '../../../config/reuserFunction';
import './pedidos.scss';
import DetalleApartado from './detalleApartado';
import { Modal, Tag, Button, List, Result, Tabs, notification, Avatar, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import aws from '../../../config/aws';
import Spin from '../../../components/Spin';
import ApartadoMultiple from './apartadoMultiple';

const { TabPane } = Tabs;
const { confirm } = Modal;

export default function PedidosUsuario(props) {
	const [ pedidos, setPedidos ] = useState([]);
	const [ apartados, setApartados ] = useState([]);
	const [ visible, setVisible ] = useState(false);
	const [ Elige, setElige ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ showInfo, setshowInfo ] = useState(false);
	const [ estado, setEstado ] = useState(false);

	//modal del pedido
	const [ detallePedido, setDetallePedido ] = useState({});
	const [ detalleApartado, setDetalleApartado ] = useState({});

	const showModal = (e) => {
		setVisible(e);
	};

	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	const obtenerPedidos = async () => {
		setLoading(true);
		await clienteAxios
			.get(`/pedidos/${decoded._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				if (res.data.length > 0) {
					setPedidos(res.data);
					setshowInfo(true);
				}
				setLoading(false);
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

	async function obtenerApartados() {
		/* setLoading(true); */
		await clienteAxios
			.get(`/apartado/cliente/apartados/${decoded._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				if (res.data.length > 0) {
					setApartados(res.data);
					setshowInfo(true);
				}
				setLoading(false);
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

	useEffect(
		() => {
			if (token === '' || token === null) {
				props.history.push('/entrar');
			} else {
				obtenerPedidos();
				obtenerApartados();
				setLoading(true);
				setPedidos([]);
				setshowInfo(false);
				setEstado(false);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[ estado, token, props ]
	);

	const deleteApartado = (id) => {
		confirm({
			title: 'Eliminando Apartado',
			icon: <ExclamationCircleOutlined />,
			content: `¿Estás seguro que deseas eliminar el apartado?`,
			okText: 'Eliminar',
			okType: 'danger',
			cancelText: 'Cancelar',
			onOk() {
				clienteAxios
					.put(`/apartado/estado/eliminado/${id}`, {
						headers: {
							'Content-Type': 'multipart/form-data',
							Authorization: `bearer ${token}`
						}
					})
					.then((res) => {
						notification.success({
							message: 'Apartado Eliminado',
							description: res.data.message
						});
						setEstado(true);
					})
					.catch((err) => {
						notification.error({
							message: 'Error del servidor',
							description: 'Paso algo en el servidor, al parecer la conexion esta fallando.'
						});
					});
			}
		});
	};

	return (
		<Spin spinning={loading}>
			<div className="container">
				<h4 className="text-center m-3">Mis Compras</h4>
				<Tabs
					centered
					className="shadow bg-white rounded tabs-colors"
					defaultActiveKey="1"
					type="card"
					size="large"
				>
					<TabPane tab="Mis compras" key="1">
						<div>
							{showInfo !== true ? (
								<Result
									status="404"
									title="Parece que aun no tienes compras"
									subTitle="Ve y realiza tus compras. ¿Que esperas?"
								/>
							) : (
								<div>
									<List
										size="large"
										dataSource={pedidos}
										renderItem={(pedido) => (
											<Pedido
												pedido={pedido}
												showModal={showModal}
												setDetallePedido={setDetallePedido}
												setElige={setElige}
											/>
										)}
									/>
								</div>
							)}
						</div>
					</TabPane>
					<TabPane tab="Mis apartados" key="2">
						<div>
							{showInfo !== true ? (
								<Result
									status="404"
									title="Parece que aun no tienes compras"
									subTitle="Ve y realiza tus compras para poder verlas"
								/>
							) : (
								<div>
									<List
										size="large"
										dataSource={apartados}
										renderItem={(apartado) => {
											if (apartado.apartadoMultiple && apartado.apartadoMultiple.length !== 0) {
												return (
													<ApartadoMultiple
														apartado={apartado}
														showModal={showModal}
														setDetalleApartado={setDetalleApartado}
														setElige={setElige}
														deleteApartado={deleteApartado}
													/>
												);
											} else {
												return (
													<Apartado
														apartado={apartado}
														showModal={showModal}
														setDetalleApartado={setDetalleApartado}
														setElige={setElige}
														deleteApartado={deleteApartado}
													/>
												);
											}
										}}
									/>
								</div>
							)}
						</div>
					</TabPane>
				</Tabs>
			</div>
			<Modal
				key="detalle"
				width={900}
				style={{ top: 0 }}
				title=""
				visible={visible}
				onCancel={() => {
					showModal(false);
				}}
				footer={null}
			>
				{Elige === true ? (
					<DetalleApartado detalleApartado={detalleApartado} />
				) : (
					<DetallesPedido detallePedido={detallePedido} />
				)}
			</Modal>
		</Spin>
	);
}

function Pedido(props) {
	const { pedido, showModal, setDetallePedido, setElige } = props;

	return (
		<List.Item
			key={pedido._id}
			className="d-flex justify-content-center align-items-center m-5"
			actions={[
				<Button
					className="d-flex justify-content-top align-items-top color-boton"
					style={{ fontSize: 16 }}
					onClick={() => {
						setElige(false);
						showModal(true);
						setDetallePedido(pedido);
					}}
				>
					<EditOutlined />
					Ver mi pedido
				</Button>
			]}
		>
			<div className="d-lg-none d-sm-block">
				<p className="h6">
					<span className="font-weight-bold">Productos:</span>
					<span className="text-primary"> x {pedido.pedido.length}</span>
				</p>
				<p className="h6">
					<span className="font-weight-bold">Total:</span>{' '}
					<span className="text-success"> $ {formatoMexico(pedido.total)}</span>{' '}
				</p>
				{/* <p className="h6"><span className="font-weight-bold">Pedido el:</span> {formatoFecha(pedido.createdAt)}</p> */}
				<p className="m-0" style={{ fontSize: '15px' }}>
					<span className="font-weight-bold">Pedido:</span>
					<Tag
						className="ml-2"
						color={
							pedido.estado_pedido === 'Entregado' ? (
								'#5cb85c'
							) : pedido.estado_pedido === 'Enviado' ? (
								'#0088ff'
							) : (
								'#ffc401'
							)
						}
					>
						{pedido.estado_pedido}
					</Tag>
				</p>
			</div>
			<List.Item.Meta
				avatar={
					<div className=" d-flex justify-content-center" style={{ width: 200 }}>
						<Avatar.Group
							maxCount={1}
							size={90}
							maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
						>
							{pedido.pedido.map((res) => (
								<Tooltip key={res.producto._id} title={res.producto.nombre} placement="top">
									<Avatar src={aws + res.producto.imagen} />
								</Tooltip>
							))}
						</Avatar.Group>
					</div>
				}
				title={
					<div className="titulo-producto row mostrar-pedido">
						<div className="col-lg-6 col-sm-12">
							<p className="m-0 font-weight-bold" style={{ fontSize: '15px' }}>
								Productos: <span className="text-primary"> x {pedido.pedido.length}</span>
							</p>
							{pedido.pagado === false ? (
								''
							) : (
								<p className="m-0" style={{ fontSize: '15px' }}>
									<span className="font-weight-bold">Estatus:</span>
									<Tag
										className="ml-2"
										color={
											pedido.estado_pedido === 'Entregado' ? (
												'#5cb85c'
											) : pedido.estado_pedido === 'Enviado' ? (
												'#0088ff'
											) : (
												'#ffc401'
											)
										}
									>
										{pedido.estado_pedido}
									</Tag>
								</p>
							)}

							<p className="m-0" style={{ fontSize: '15px' }}>
								<span className="font-weight-bold">Total de la compra:</span>
								<span className="text-success"> $ {formatoMexico(pedido.total)}</span>{' '}
							</p>
							<p className="m-0" style={{ fontSize: '15px' }}>
								<span className="font-weight-bold">Fecha de pedido:</span>{' '}
								{formatoFecha(pedido.createdAt)}
							</p>
							{/* 							<p className="m-0" style={{ fontSize: '15px' }}>
								{pedido.pagado === false ? (
									<div>
										<p className="text-danger">Pedido no realizado </p>
										<Button
												className="d-flex justify-content-center align-items-center"
												style={{ fontSize: 16 }}
												type="primary"
											>
												Comprar
											</Button>
									</div>
								) : (
									<div>
										<p className="text-success">Pedido realizado</p>
										{pedido.codigo_seguimiento ? (
											<div>
												<p>Seguimiento: {pedido.codigo_seguimiento} </p>
												<a href={`${pedido.url}${pedido.codigo_seguimiento}`} target="_blank">
													<Button
														className="d-flex justify-content-center align-items-center"
														style={{ fontSize: 16 }}
														type="primary"
													>
														Seguir envio
													</Button>
												</a>
											</div>
										) : (
											''
										)}
									</div>
								)}
							</p> */}
						</div>
						{pedido.pagado === false ? (
							''
						) : (
							<div className="col-lg-6 col-sm-12">
								<p className="m-0 font-weight-bold h3 color-fonts" style={{ fontSize: '15px' }}>
									¡Hola!
								</p>
								<p className="mt-2" style={{ fontSize: '15px' }}>
									{pedido.mensaje_admin ? (
										pedido.mensaje_admin
									) : (
										'Tu pedido esta en procesado, si tienes alguna duda no dudes en contactarnos!!'
									)}
								</p>
							</div>
						)}
					</div>
				}
			/>
		</List.Item>
	);
}

function Apartado({ apartado, showModal, setDetalleApartado, setElige, deleteApartado }) {
	return (
		<List.Item
			key={apartado._id}
			className="d-flex justify-content-center align-items-center m-5"
			actions={[
				<div>
					<Button
						className="d-flex justify-content-top align-items-top m-2 w-100 color-boton"
						style={{ fontSize: 16 }}
						onClick={() => {
							setElige(true);
							showModal(true);
							setDetalleApartado(apartado);
						}}
					>
						<EditOutlined />
						Ver mi apartado
					</Button>
					<Button
						className={
							apartado.estado === 'ACEPTADO' ||
							apartado.estado === 'ENVIADO' ||
							apartado.estado === 'ENTREGADO' ? (
								'd-none'
							) : (
								'd-flex justify-content-top align-items-top m-2 w-100'
							)
						}
						style={{ fontSize: 16 }}
						danger
						ghost
						onClick={() => {
							deleteApartado(apartado._id);
						}}
					>
						<DeleteOutlined />
						Eliminar apartado
					</Button>
				</div>
			]}
		>
			<div className="d-lg-none d-sm-block">
				<p className="h6">
					<span className="font-weight-bold">Producto:</span>
					<span className="ml-1">{apartado.producto.nombre}</span>
				</p>
				<p className="h6">
					<span className="font-weight-bold">Precio:</span>{' '}
					<span className="text-success">
						{' '}
						$ {apartado.precio ? (
							formatoMexico(apartado.precio)
						) : (
							formatoMexico(apartado.producto.precio)
						)}{' '}
					</span>{' '}
				</p>

				<p className="m-0" style={{ fontSize: '15px' }}>
					<span className="font-weight-bold">Tipo de entrega:</span>
					<Tag className="" color={apartado.tipoEntrega === 'RECOGIDO' ? '#f0ad4e' : '#5cb85c'}>
						{apartado.tipoEntrega === 'ENVIO' ? 'Envío por paquetería' : 'Recoger a sucursal'}
					</Tag>
				</p>
				<p className="m-0" style={{ fontSize: '15px' }}>
					<span className="font-weight-bold">Estado:</span>
					<Tag
						className="ml-2"
						color={
							apartado.estado === 'ACEPTADO' ? (
								'#0088ff'
							) : apartado.estado === 'PROCESANDO' ? (
								'#ffc401'
							) : apartado.estado === 'ENVIADO' ? (
								'#0088ff'
							) : apartado.estado === 'ENTREGADO' ? (
								'#5cb85c'
							) : (
								'#F75048'
							)
						}
					>
						{apartado.estado === 'ACEPTADO' ? (
							'Apartado aceptado'
						) : apartado.estado === 'PROCESANDO' ? (
							'Apartado en proceso'
						) : apartado.estado === 'ENVIADO' ? (
							'Apartado enviado'
						) : apartado.estado === 'ENTREGADO' ? (
							'Apartado entregado'
						) : (
							'Apartado cancelado'
						)}
					</Tag>
				</p>
			</div>

			<List.Item.Meta
				avatar={
					<div className="d-flex justify-content-center align-items-center centrar-avatar">
						<Avatar src={aws + apartado.producto.imagen} size={80} />
					</div>
				}
				title={
					<div className="titulo-producto row mostrar-pedido">
						<div className="col-lg-6 col-sm-12">
							<p className="h6">
								<span className="font-weight-bold">Producto:</span>
								<span className=""> {apartado.producto.nombre}</span>
							</p>
							<p className="h6">
								<span className="font-weight-bold">Precio:</span>{' '}
								<span className="text-success">
									{' '}
									${' '}
									{apartado.precio ? (
										formatoMexico(apartado.precio)
									) : (
										formatoMexico(apartado.producto.precio)
									)}{' '}
								</span>{' '}
							</p>
							<p className="m-0" style={{ fontSize: '15px' }}>
								<span className="font-weight-bold">Tipo de entrega:</span>
								<Tag
									className="ml-2"
									color={apartado.tipoEntrega === 'RECOGIDO' ? '#f0ad4e' : '#5cb85c'}
								>
									{apartado.tipoEntrega === 'ENVIO' ? 'Envio por paqueteria' : 'Recoger a sucursal'}
								</Tag>
							</p>

							<p className="m-0" style={{ fontSize: '15px' }}>
								<span className="font-weight-bold m-0">Fecha de apartado:</span>{' '}
								{formatoFecha(apartado.createdAt)}
							</p>
							<p className="m-0" style={{ fontSize: '15px' }}>
								<span className="font-weight-bold">Estado:</span>
								<Tag
									className="ml-2"
									color={
										apartado.estado === 'ACEPTADO' ? (
											'#0088ff'
										) : apartado.estado === 'PROCESANDO' ? (
											'#ffc401'
										) : apartado.estado === 'ENVIADO' ? (
											'#0088ff'
										) : apartado.estado === 'ENTREGADO' ? (
											'#5cb85c'
										) : (
											'#F75048'
										)
									}
								>
									{apartado.estado === 'ACEPTADO' ? (
										'Apartado aceptado'
									) : apartado.estado === 'PROCESANDO' ? (
										'Apartado en proceso'
									) : apartado.estado === 'ENVIADO' ? (
										'Apartado enviado'
									) : apartado.estado === 'ENTREGADO' ? (
										'Apartado entregado'
									) : (
										'Apartado cancelado'
									)}
								</Tag>
							</p>
							<div>
								{apartado.tipoEntrega === 'ENVIO' && apartado.codigo_seguimiento ? (
									<div className="">
										<p style={{ fontSize: '15px' }}>
											{' '}
											<span className="font-weight-bold">Seguimiento:</span>{' '}
											{apartado.codigo_seguimiento}{' '}
										</p>
										<a
											href={`${apartado.url}${apartado.codigo_seguimiento}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button
												className="d-flex justify-content-center align-items-center color-boton"
												style={{ fontSize: 16 }}
											>
												Seguír envío
											</Button>
										</a>
									</div>
								) : (
									''
								)}
							</div>
						</div>
						{apartado.tipoEntrega === 'ENVIO' ? (
							<div className="col-lg-6 col-sm-12">
								<p className="m-0 font-weight-bold h3 color-fonts" style={{ fontSize: '15px' }}>
									¡Hola!
								</p>
								<p className="mt-2" style={{ fontSize: '15px' }}>
									{apartado.mensaje_admin ? (
										apartado.mensaje_admin
									) : (
										'Tu pedido esta en procesado, si tienes alguna duda no dudes en contactarnos!!'
									)}
								</p>
							</div>
						) : (
							''
						)}
					</div>
				}
			/>
		</List.Item>
	);
}
