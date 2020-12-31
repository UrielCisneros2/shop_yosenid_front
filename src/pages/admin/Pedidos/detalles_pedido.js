import React from 'react';
import { Tag, Divider } from 'antd';
import { formatoMexico, formatoFecha, formatoHora } from '../../../config/reuserFunction';
import aws from '../../../config/aws';

const DetallesPedido = (props) => {
	const pedido = props.datosDetalle;

	return (
		<div className="card-p-pedidos">
			<Divider className="text-center">Detalles del pedido</Divider>
			<div className="my-2">
				<h6 className="titulos-info-pedidos">ID del pedido: </h6>
				<p className="data-info-pedidos">{pedido._id}</p>
			</div>
			<div className="my-2">
				<h6 className="titulos-info-pedidos">Fecha de pedido:</h6>
				<p className="data-info-pedidos">{formatoFecha(pedido.createdAt)}</p>
			</div>
			<div className="my-2">
				<h6 className="titulos-info-pedidos">Hora de pedido:</h6>
				<p className="data-info-pedidos">{formatoHora(pedido.createdAt)}</p>
			</div>
			{pedido.fecha_envio ? (
				<div>
					<div className="my-2">
						<h6 className="titulos-info-pedidos">Fecha de envío:</h6>
						<p className="data-info-pedidos">{formatoFecha(pedido.fecha_envio)}</p>
					</div>
					<div className="my-2">
						<h6 className="titulos-info-pedidos">Hora de envío:</h6>
						<p className="data-info-pedidos">{formatoHora(pedido.fecha_envio)}</p>
					</div>
				</div>
			) : (
				<div />
			)}
			<div className="my-2">
				<h6 className="titulos-info-pedidos">Cantidad:</h6>
				<p className="data-info-pedidos">{pedido.pedido.length}</p>
			</div>
			<div className="my-2">
				<h6 className="titulos-info-pedidos">Estado:</h6>
				<Tag className="data-info-pedidos" color={pedido.estado_pedido === 'Entregado' ? '#5cb85c' : pedido.estado_pedido === 'Enviado' ? '#0088ff' : '#ffc401'}>
					{pedido.estado_pedido}
				</Tag>
			</div>
			<div className="my-2">
				<h6 className="titulos-info-pedidos">Pagado:</h6>
				<Tag className="data-info-pedidos" color={pedido.pagado === true ? '#5cb85c' : '#f0ad4e'}>
					{pedido.pagado === true ? 'Si' : 'No'}
				</Tag>
			</div>
			<div className="my-2">
				<h6 className="titulos-info-pedidos">Total:</h6>
				<p className="precio-total-pedidos data-info-pedidos">$ {formatoMexico(pedido.total)}</p>
			</div>
			<Divider className="text-center">Detalles del cliente</Divider>
			<div className="my-2">
				<h6 className="titulos-info-pedidos">Cliente:</h6>
				<p className="data-info-pedidos">{pedido.cliente.nombre}</p>
			</div>
			<div className="my-2">
				<h6 className="titulos-info-pedidos">Email:</h6>
				<p className="data-info-pedidos">{pedido.cliente.email}</p>
			</div>
			{pedido.cliente.direccion.map((direccion) => {
				return (
					<div className="my-2" key={direccion._id}>
						<h6 className="titulos-info-pedidos">Dirección:</h6>
						<p className="data-info-pedidos">
							{direccion.calle_numero}, {direccion.ciudad}, {direccion.estado},{' CP '}
							{direccion.cp}
						</p>
					</div>
				);
			})}

			<Divider className="text-center">Detalles del producto</Divider>
			{pedido.pedido.map((pedido, index) => {
				return (
					<div key={pedido._id}>
						<div className="h6">
							<strong>Producto {index + 1}</strong>
						</div>
						<div className="d-flex justify-content-center">
							<div className="contenedor-imagen-producto-detalle">
								<img alt="imagen-producto-detalle" className="imagen-producto-detalle" src={aws+pedido.producto.imagen} />
							</div>
						</div>
						<div className="my-2 contenedor-info-pedidos">
							<h6 className="titulos-info-pedidos">Código de barras:</h6>
							<p className="data-info-pedidos">{pedido.producto.codigo}</p>
						</div>
						<div className="my-2 contenedor-info-pedidos">
							<h6 className="titulos-info-pedidos">Artículo:</h6>
							<p className="data-info-pedidos">{pedido.producto.nombre}</p>
						</div>
						<div className="my-2 contenedor-info-pedidos">
							<h6 className="titulos-info-pedidos">Categoría:</h6>
							<p className="data-info-pedidos">{pedido.producto.categoria}</p>
						</div>
						<div className="my-2 contenedor-info-pedidos">
							<h6 className="titulos-info-pedidos">Cantidad:</h6>
							<p className="data-info-pedidos">{pedido.cantidad}</p>
						</div>
						{pedido.producto.categoria.toLowerCase() === 'ropa' ? (
							<div className="my-2 contenedor-info-pedidos">
								<h6 className="titulos-info-pedidos">Talla:</h6>
								<p className="data-info-pedidos">{pedido.talla}</p>
							</div>
						) : (
							<div />
						)}
						{pedido.producto.categoria.toLowerCase() === 'calzado' ? (
							<div className="my-2 contenedor-info-pedidos">
								<h6 className="titulos-info-pedidos">Número de calzado:</h6>
								<p className="data-info-pedidos">{pedido.numero}</p>
							</div>
						) : (
							<div />
						)}
						<Divider />
					</div>
				);
			})}
			<div className="my-2">
				<h6 className="titulos-info-pedidos">Total:</h6>
				<p className="precio-total-pedidos data-info-pedidos">$ {formatoMexico(pedido.total)}</p>
			</div>
		</div>
	);
};

export default DetallesPedido;
