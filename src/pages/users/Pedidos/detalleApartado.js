import React from 'react';
import { Tag, Divider, Col, Card, Result } from 'antd';
import { formatoFecha, formatoMexico } from '../../../config/reuserFunction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus } from '@fortawesome/free-solid-svg-icons';
import aws from '../../../config/aws';

const { Meta } = Card;

export default function detalleApartado(props) {
	const { detalleApartado } = props;
	let multiple;

	if (detalleApartado.apartadoMultiple && detalleApartado.apartadoMultiple.length !== 0) {
		multiple = detalleApartado.apartadoMultiple.map((info) => {
			const producto = detalleApartado.productosMultiple.map((producto) => {
				if (info.producto === producto._id) {
					return <ProductosMultiple key={producto._id} producto={producto} info={info} />;
				}
				return (<div key={producto._id} />)
			});
			return producto;
		});
	}

	return (
		<div className="card-p-pedidos">
			<Divider className="text-center">Detalles del Apartado</Divider>

			<div className="row">
				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">ID del Apartado: </h6>
					<p className=""> {detalleApartado._id} </p>
				</div>

				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">Fecha de apartado:</h6>
					<p className=""> {formatoFecha(detalleApartado.createdAt)} </p>
				</div>

				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">Estatus:</h6>
					<p className="m-0" style={{ fontSize: '15px' }}>
						<Tag
							className="ml-2"
							color={
								detalleApartado.estado === 'ACEPTADO' ? (
									'#0088ff'
								) : detalleApartado.estado === 'PROCESANDO' ? (
									'#ffc401'
								) : detalleApartado.estado === 'ENVIADO' ? (
									'#0088ff'
								) : detalleApartado.estado === 'ENTREGADO' ? (
									'#5cb85c'
								) : (
									'#F75048'
								)
							}
						>
							{detalleApartado.estado === 'ACEPTADO' ? (
								'Apartado aceptado'
							) : detalleApartado.estado === 'PROCESANDO' ? (
								'Apartado en proceso'
							) : detalleApartado.estado === 'ENVIADO' ? (
								'Apartado enviado'
							) : detalleApartado.estado === 'ENTREGADO' ? (
								'Apartado entregado'
							) : (
								'Apartado cancelado'
							)}
						</Tag>
					</p>
				</div>
			</div>

			<div className="row">
				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">Tipo de entrega:</h6>
					<p className="m-0" style={{ fontSize: '15px' }}>
						<Tag
							className="ml-2"
							color={detalleApartado.tipoEntrega === 'RECOGIDO' ? '#f0ad4e' : '#5cb85c'}
						>
							{detalleApartado.tipoEntrega === 'ENVIO' ? 'Envio por paqueteria' : 'Recoger a sucursal'}
						</Tag>
					</p>
				</div>
				{detalleApartado.tipoEntrega === 'ENVIO' ? (
					<div className="my-2 col-lg-4">
						<h6 className="titulos-info-pedidos">Paqueteria:</h6>
						<p> {detalleApartado.paqueteria} </p>
					</div>
				) : (
					''
				)}

				{detalleApartado.tipoEntrega === 'ENVIO' ? (
					<div className="my-2 col-lg-4">
						<h6 className="titulos-info-pedidos">Fecha de envio:</h6>
						<p> {detalleApartado.fecha_envio} </p>
					</div>
				) : (
					''
				)}
			</div>

			<Divider className="text-center">Productos del apartado</Divider>

			{detalleApartado.apartadoMultiple && detalleApartado.apartadoMultiple.length !== 0 ? (
				<div className="row d-flex justify-content-center">{multiple}</div>
			) : (
				<div className="row d-flex justify-content-center">
					<Producto producto={detalleApartado} />
				</div>
			)}

			{detalleApartado.tipoEntrega === 'ENVIO' ? detalleApartado.estado === 'ENVIADO' ? (
				<div>
					<Divider className="text-center">Seguimiento de Apartado</Divider>
					<Result
						icon={<FontAwesomeIcon icon={faBus} style={{ fontSize: '50px' }} />}
						title={
							<div>
								<p className="font-weight-bold">Dirección de envio:</p>
								<p>
									{' '}
									{`${detalleApartado.cliente.direccion[0].calle_numero} Colonia ${detalleApartado
										.cliente.direccion[0].colonia} ${detalleApartado.cliente.direccion[0]
										.ciudad} ${detalleApartado.cliente.direccion[0].estado} ${detalleApartado
										.cliente.direccion[0].pais}.`}{' '}
								</p>
								<p>
									{' '}
									{`Referencia: ${detalleApartado.cliente.direccion[0]
										.entre_calles}. CP: ${detalleApartado.cliente.direccion[0].cp}`}{' '}
								</p>
								<p>
									{' '}
									<span className="font-weight-bold">Codigó de seguimiento: </span>
								</p>
								<p>
									<a
										href={`${detalleApartado.url}${detalleApartado.codigo_seguimiento}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										{' '}
										{detalleApartado.codigo_seguimiento}{' '}
									</a>
								</p>
							</div>
						}
					/>
				</div>
			) : (
				''
			) : (
				''
			)}
			<div className="mt-3 d-flex justify-content-end">
				{detalleApartado.apartadoMultiple && detalleApartado.apartadoMultiple.length !== 0 ? (
					<h3>Total: $ {formatoMexico(detalleApartado.total)}</h3>
				) : (
					<h3>Total: $ {detalleApartado.precio ? formatoMexico(detalleApartado.precio) : formatoMexico(detalleApartado.producto.precio)}</h3>
				)}
			</div>
		</div>
	);
}

function Producto({ producto }) {

	return (
		<div>
			<Col span={4} key={producto.producto._id} className="col-lg-12 col-sm-12">
				<Card
					/* hoverable */
					style={{ width: 250 }}
					bodyStyle={{ paddingLeft: 15, paddingRight: 15 }}
					cover={
						<div className="contenedor-imagen-detalle-apartado">
							<img
								alt="example"
								className="imagen-detalle-apartado"
								src={aws + producto.producto.imagen}
							/>
						</div>
					}
				>
					<Meta
						title={producto.producto.nombre}
						description={
							<div className="row">
								{producto.precio ? (
									<h2 className="h5 precio-rebaja col-lg-6">${formatoMexico(producto.precio)}</h2>
								) : producto.promocion && producto.promocion.length !== 0 ? (
									<h2 className="h5 precio-rebaja col-lg-6">
										${formatoMexico(producto.promocion[0].precioPromocion)}
									</h2>
								) : (
									<h2 className="h5 precio-rebaja col-lg-6">
										${formatoMexico(producto.producto.precio)}
									</h2>
								)}
								{producto.medida && producto.medida.length !== 0 ? producto.medida[0].talla ? (
									<h2 className="h5 precio-rebaja col-lg-6">Talla: {producto.medida[0].talla}</h2>
								) : (
									<h2 className="h5 precio-rebaja col-lg-6">Talla: {producto.medida[0].numero}</h2>
								) : (
									<div />
								)}
							</div>
						}
					/>
				</Card>
			</Col>
		</div>
	);
}

function ProductosMultiple({ producto, info }) {
	return (
		<div key={producto._id} className="col-lg-4 col-sm-12">
			<Card
				/* hoverable */
				style={{ width: 250 }}
				bodyStyle={{ paddingLeft: 15, paddingRight: 15 }}
				cover={
					<div className="contenedor-imagen-detalle-apartado">
						<img alt="example" className="imagen-detalle-apartado" src={aws + producto.imagen} />
					</div>
				}
			>
				<Meta
					title={producto.nombre}
					description={
						<div className="row">
							<h2 className="h5 precio-rebaja col-lg-6">${formatoMexico(info.precio)}</h2>
							{info.medida ? info.medida.talla ? (
								<h2 className="h5 precio-rebaja col-lg-6">Talla: {info.medida.talla}</h2>
							) : (
								<h2 className="h5 precio-rebaja col-lg-6">Talla: {info.medida.numero}</h2>
							) : (
								<div />
							)}
						</div>
					}
				/>
			</Card>
		</div>
	);
}
