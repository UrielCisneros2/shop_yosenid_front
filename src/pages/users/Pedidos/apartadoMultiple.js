import React from 'react';
import { formatoFecha, formatoMexico } from '../../../config/reuserFunction';
import { Tag, Button, List, Avatar, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import aws from '../../../config/aws';

export default function ApartadoMultiple({ apartado, showModal, setDetalleApartado, setElige, deleteApartado }) {
	return (
		<List.Item
			key={apartado._id}
			className="d-flex justify-content-center align-items-center m-5"
			actions={[
				<div>
					<Button
						className="d-flex justify-content-top align-items-top color-boton m-2 w-100"
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
					<span className="font-weight-bold">Productos:</span>
					<span className="text-primary"> x {apartado.apartadoMultiple.length}</span>
				</p>
				<p className="h6">
					<span className="font-weight-bold">Total:</span>{' '}
					<span className="text-success"> $ {formatoMexico(apartado.total)} </span>{' '}
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
						<Avatar.Group
							maxCount={1}
							size={80}
							maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
						>
							{apartado.productosMultiple.map((res) => (
								<Tooltip key={res._id} title={res.nombre} placement="top">
									<Avatar src={aws + res.imagen} />
								</Tooltip>
							))}
						</Avatar.Group>
					</div>
				}
				title={
					<div className="titulo-producto row mostrar-pedido">
						<div className="col-lg-6 col-sm-12">
							<p className="h6">
								<span className="font-weight-bold">Productos:</span>
								<span className="text-primary"> x {apartado.apartadoMultiple.length}</span>
							</p>
							<p className="h6">
								<span className="font-weight-bold">Total:</span>{' '}
								<span className="text-success"> $ {formatoMexico(apartado.total)} </span>{' '}
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
