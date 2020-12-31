import React from 'react';
import { Tag, Divider, Card, Result } from 'antd';
import { formatoFecha, formatoMexico } from '../../../config/reuserFunction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus } from '@fortawesome/free-solid-svg-icons';
import aws from '../../../config/aws';

const { Meta } = Card;

const DetallesPedido = (props) => {
	const { detallePedido } = props;

	return (
		<div className="card-p-pedidos">
			<Divider className="text-center">Detalles del pedido</Divider>

			<div className="row">
				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">ID del pedido: </h6>
					<p className=""> {detallePedido._id} </p>
				</div>

				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">Fecha de pedido:</h6>
					<p className=""> {formatoFecha(detallePedido.createdAt)} </p>
				</div>

				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">No. de productos:</h6>
					<p className="">x {detallePedido.pedido.length} </p>
				</div>
			</div>

			<div className="row">
				{detallePedido.pagado === false ? (
					''
				) : (
					<div className="my-2 col-lg-4">
						<h6 className="titulos-info-pedidos">Estatus del pedido:</h6>
						<p>
							<Tag
								className="my-2"
								color={
									detallePedido.estado_pedido === 'Entregado' ? (
										'#5cb85c'
									) : detallePedido.estado_pedido === 'Enviado' ? (
										'#0088ff'
									) : (
										'#ffc401'
									)
								}
							>
								{detallePedido.estado_pedido}
							</Tag>
						</p>
					</div>
				)}
				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">Pagado:</h6>
					<div>
						{detallePedido.pagado === false ? (
							<p className="text-danger my-2">Pedido cancelado</p>
						) : (
							<p className="text-success my-2">Pedido realizado</p>
						)}
					</div>
				</div>

				<div className="my-2 ">
					<h6 className="titulos-info-pedidos">Total:</h6>
					<p className=""> $ {formatoMexico(detallePedido.total)} </p>
				</div>
			</div>

			<Divider className="text-center">Productos del pedido</Divider>
			<div className="row d-flex justify-content-center">{detallePedido.pedido.map((producto) => <Producto key={producto._id} producto={producto} />)}</div>

			{detallePedido.pagado === false ? (
				''
			) : (
				<div>
					<Divider className="text-center">Seguimiento de pedido</Divider>
					<Result
						icon={<FontAwesomeIcon icon={faBus} style={{ fontSize: '50px' }} />}
						title={
							<div>
								<p className="font-weight-bold">Dirección de envio:</p>
								<p>
									{' '}
									{`${detallePedido.cliente.direccion[0].calle_numero} Colonia ${detallePedido.cliente
										.direccion[0].colonia} ${detallePedido.cliente.direccion[0]
										.ciudad} ${detallePedido.cliente.direccion[0].estado} ${detallePedido.cliente
										.direccion[0].pais}.`}{' '}
								</p>
								<p>
									{' '}
									{`Referencia: ${detallePedido.cliente.direccion[0]
										.entre_calles}. CP: ${detallePedido.cliente.direccion[0].cp}`}{' '}
								</p>
								<p>
									<span className="font-weight-bold">Código de seguimiento: </span>
								</p>
								<p>
									<a
										href={`${detallePedido.url}${detallePedido.codigo_seguimiento}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										{' '}
										{detallePedido.codigo_seguimiento}{' '}
									</a>
								</p>
							</div>
						}
					/>
				</div>
			)}
			<div className="my-2">
				<h6 className="titulos-info-pedidos h4 mt-3">Total: $ {formatoMexico(detallePedido.total)}</h6>
			</div>
		</div>
	);
};

function Producto(props) {
	const { producto } = props;

	return (
		<div key={producto.producto._id} className="col-lg-4 col-sm-12 mb-3">
			<Card
				/* hoverable */
				style={{ width: 250 }}
				cover={
					<div className="contenedor-imagen-pedido">
						<img alt="example" className="imagen-detalle-pedido" src={aws + producto.producto.imagen} />
					</div>
				}
			>
				<Meta
					title={producto.producto.nombre}
					description={
						<div>
							<h6 className="precio-rebaja">Cantidad de articulos: {producto.cantidad}</h6>
							<div className="row">
								<h2 className="h5 precio-rebaja col-lg-6">
									${formatoMexico(producto.precio)}
								</h2>
								{producto.talla ? (
									<h2 className="h5 precio-rebaja col-lg-6">Talla: {producto.talla}</h2>
								) : producto.numero ? (
									<h2 className="h5 precio-rebaja col-lg-6">Talla: {producto.numero}</h2>
								) : (
									<div />
								)}
							</div>
						</div>
					}
				/>
			</Card>
		</div>
	);
}

export default DetallesPedido;
