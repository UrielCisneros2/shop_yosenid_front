import React from 'react';
import { Card, Col, Tag, Modal, notification } from 'antd';
import { ContainerOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { formatoFecha } from '../../../../config/reuserFunction';
import clienteAxios from '../../../../config/axios';

import './MostrarDatosTargeta.scss';

const { Meta } = Card;
const { confirm } = Modal;

export default function MostrarDatosTargeta(props) {
	const { setDetalleApartado, showModal, apartado, setEstado, token } = props;

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
		});
	};

	return (
		<Col className="mb-3" span={window.screen.width > 990 ? 8 : 24} key={apartado._id}>
			<Card
				className="shadow-sm card-body-apartados"
				actions={[
					<div className="d-flex ml-3 justify-content-center align-items-center">
						<ContainerOutlined className="mr-2" style={{ fontSize: 20 }} />
						<p
							onClick={() => {
								setDetalleApartado(apartado);
								showModal();
							}}
							className="d-inline"
						>
							Detalle del pedido
						</p>
					</div>,
					<div className="d-flex justify-content-center align-items-center text-danger">
						<DeleteOutlined className="mr-2" style={{ fontSize: 20 }} />
						<p
							onClick={() => {
								deleteApartado(apartado._id);
							}}
							className="d-inline"
						>
							Eliminar
						</p>
					</div>
				]}
			>
				<Meta
					className="contenedor-card-apartados"
					description={
						<div className="">
							<div className="sistema-apartado m-2">
								<h6 className="titulos-info-apartados">Id apartado: </h6>
								<p className="data-info-apartados">{apartado._id}</p>
							</div>
							<div className="sistema-apartado m-2">
								<h6 className="titulos-info-apartados">Pedido el:</h6>
								<p className="data-info-apartados">{formatoFecha(apartado.createdAt)}</p>
							</div>
							<div className="sistema-apartado m-2">
								<h6 className="titulos-info-apartados">Cliente:</h6>
								<p className="data-info-apartados">
									{`${apartado.cliente[0].nombre} ${apartado.cliente[0].apellido}`}{' '}
								</p>
							</div>
							<div className="sistema-apartado m-2">
								<h6 className="titulos-info-apartados">Estado:</h6>
								<Tag
									className="data-info-apartados"
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
									{apartado.estado}
								</Tag>
							</div>

							<div className="sistema-apartado m-2">
								<h6 className="titulos-info-apartados">Tipo de entrega:</h6>
								<Tag
									className="data-info-apartados"
									color={apartado.tipoEntrega === 'ENVIO' ? '#5cb85c' : '#0275d8'}
								>
									{apartado.tipoEntrega === 'ENVIO' ? 'Envio a domicilio' : 'Recoger a sucursal'}
								</Tag>
							</div>

							<div className="sistema-apartado m-2">
								<h6 className="titulos-info-apartados">Producto:</h6>
								<p className="data-info-apartados">{apartado.producto[0].nombre}</p>
							</div>
							<div className="sistema-apartado m-2">
								<h6 className="titulos-info-apartados">Cantidad de artículos:</h6>
								<p className="data-info-apartados">{apartado.cantidad}</p>
							</div>
						</div>
					}
				/>
			</Card>
		</Col>
	);
}
