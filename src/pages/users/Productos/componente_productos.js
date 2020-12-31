import React from 'react';
import aws from '../../../config/aws';
import DOMPurify from 'dompurify';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { formatoMexico, agregarPorcentaje } from '../../../config/reuserFunction';

const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

export default function ComponenteProductos(props) {
	const { productos } = props;

	if (productos.precioPromocion) {
		return (
			<div key={productos._id} className="size-col col-lg-2 col-6">
				<Link to={`/vista_producto/${productos.productoPromocion._id}`}>
					<Card.Grid hoverable style={gridStyle} className="border contenedor-card-producto-principal">
						<Card
							className="contenedor-card-body"
							cover={
								<div className="contenedor-imagen-oferta">
									<div className="contenedor-oferta">
										<h5 className="shadow">OFERTA</h5>
									</div>
									<div className="contenedor-imagen-producto-principal">
										<img
											className="imagen-producto-principal"
											alt="producto"
											src={aws + productos.productoPromocion.imagen}
										/>
									</div>
								</div>
							}
						>
							<div className="contenedor-titulos-productos titulo-elipsis">
								<h1 className="titulo-producto">{productos.productoPromocion.nombre}</h1>
								<div
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(productos.productoPromocion.descripcion)
									}}
								/>
							</div>
							<div className="contenedor-precios-productos">
								<h2 className="h5 precio-producto rebajado mr-2">
									${formatoMexico(productos.productoPromocion.precio)}
								</h2>
								<h3 className="h5 precio-rebaja d-inline mr-1">
									${formatoMexico(productos.precioPromocion)}
								</h3>
								<p className="h4 porcentaje-descuento d-inline">
									{agregarPorcentaje(
										productos.precioPromocion,
										productos.productoPromocion.precio
									)}%OFF
								</p>
							</div>
						</Card>
					</Card.Grid>
				</Link>
			</div>
		);
	} else {
		return (
			<div key={productos._id} className="size-col col-lg-2 col-6">
				<Link to={`/vista_producto/${productos._id}`}>
					<Card.Grid hoverable style={gridStyle} className="border contenedor-card-producto-principal">
						<Card
							className="contenedor-card-body"
							cover={
								<div className="contenedor-imagen-oferta">
									{productos.promocion.length !== 0 ? (
										productos.promocion.map((promo) => {
											return (
												<div key={promo._id} className="contenedor-oferta">
													<h5 className="shadow">OFERTA</h5>
													{/* <p>-{agregarPorcentaje(promo.precioPromocion, productos.precio)}%</p> */}
												</div>
											);
										})
									) : (
										<div className="d-none" />
									)}

									<div className="contenedor-imagen-producto-principal">
										<img
											className="imagen-producto-principal"
											alt="producto"
											src={aws + productos.imagen}
										/>
									</div>
								</div>
							}
						>
							<div className="contenedor-titulos-productos titulo-elipsis">
								<h1 className="titulo-producto">{productos.nombre}</h1>
								<div
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(productos.descripcion)
									}}
								/>
							</div>
							{!productos.promocion.length ? (
								<div className="contenedor-precios-productos">
									<h3 className="h5 precio-rebaja">${formatoMexico(productos.precio)}</h3>
								</div>
							) : (
								productos.promocion.map((promo) => {
									return (
										<div className="contenedor-precios-productos" key={promo._id}>
											<h2 className="h5 precio-producto rebajado mr-2">
												${formatoMexico(productos.precio)}
											</h2>
											<h3 className="h5 precio-rebaja d-inline mr-1">
												${formatoMexico(promo.precioPromocion)}
											</h3>
											<p className="h4 porcentaje-descuento d-inline">
												{agregarPorcentaje(promo.precioPromocion, productos.precio)}%OFF
											</p>
										</div>
									);
								})
							)}
						</Card>
					</Card.Grid>
				</Link>
			</div>
		);
	}
}
