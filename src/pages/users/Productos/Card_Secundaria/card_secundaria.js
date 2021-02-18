import React from 'react';
import aws from '../../../../config/aws';
// import DOMPurify from 'dompurify';
import { Card, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import './productos.scss';
// import { ShoppingCartOutlined } from '@ant-design/icons';
import { formatoMexico, agregarPorcentaje } from '../../../../config/reuserFunction';

const gridStyle = { width: '100%', marginBottom: '1.5rem' };

export default function CardSecundaria(props) {
	const { productos } = props;

	if (productos.precioPromocion) {
		return (
			<div key={productos._id} className="size-col col-lg-3 col-6">
				<Link to={`/vista_producto/${productos.productoPromocion._id}`}>
					<Card
						hoverable 
						style={gridStyle} 
						className="contenedor-card-producto-secundario" 
						bordered={false}
					>
						{/* <div className="contenedor-oferta">
							<p className="h4 porcentaje-descuento d-inline">
								{agregarPorcentaje(
									productos.precioPromocion,
									productos.productoPromocion.precio
								)}%OFF
							</p>
						</div> */}
						
						<Card
							bordered={false}
							cover={
								<div>
									<div className="contenedor-imagen-oferta">
										{/* <div className="contenedor-oferta">
											<h5 className="shadow">OFERTA</h5>
										</div> */}
										<div className="contenedor-imagen-producto-secundario">
											<img
												className="imagen-producto-principal"
												alt="producto"
												src={aws + productos.productoPromocion.imagen}
											/>
										</div>
									</div>
								</div>
							}
							className="margen"
						>
							<div className=" row contenedor-precios-sec">
								<div className="col-lg-6">
									<h2 className="h5  rebajado-sec mr-2">
										${formatoMexico(productos.productoPromocion.precio)}
									</h2>
									
									<h3 className="h5 card-precio-rebaja d-inline mr-1">
										${formatoMexico(productos.precioPromocion)}
									</h3>
								</div>
								<div className="col-lg-6 contenedor-titulos-productos-sec titulo-elipsis-sec">
									<h1 className="titulo-producto">{productos.productoPromocion.nombre}</h1>
								</div>
							</div>
						</Card>
					</Card>
				</Link>
			</div>
		);
	} else {
		return (
			<div key={productos._id} className="size-col col-lg-2 col-6 card-div">
				<Link to={`/vista_producto/${productos._id}`}>
					<Card
						hoverable 
						style={gridStyle} 
						className="contenedor-card-producto-secundario margen-b" 
						bordered={false}
					>
						{productos.promocion.length !== 0 ? (
							productos.promocion.map((promo) => {
								return (
									<div key={promo._id} className="contenedor-oferta">
										<p className="h4 porcentaje-descuento d-inline">
											{agregarPorcentaje(promo.precioPromocion, productos.precio)}% OFF
										</p>
									</div>
								);
							})
						) : (
							<div className="d-none" />
						)}
							
						<Card
							bordered={false}
							cover={
								<div className="contenedor-imagen-oferta">									
									<div className="contenedor-imagen-producto-secundario">
										<img
											className="imagen-producto-principal"
											alt="producto"
											src={aws + productos.imagen}
										/>
									</div>
								</div>
							}
							className="margen-dentro"
						>
							
							{!productos.promocion.length ? (
								<div className="row contenedor-informacion">
									<div className="col-lg-7  margen-precios-promo">
										<div className="contenedor-precios-sec infor-center margen-precios">
											<Tooltip placement="top" title={formatoMexico(productos.precio)}>
												<h3 className="font-prin " >${formatoMexico(productos.precio)}</h3>
											</Tooltip>
										</div>
									</div>
									<div className="col-lg-5 infor-center contenedor-titulos-productos-sec titulo-elipsis-sec">
										<Tooltip placement="top" title={productos.nombre}>
											<p className="font-peque titulo-producto">{productos.nombre}</p>
										</Tooltip>
									</div>
								</div>
							) : (
								productos.promocion.map((promo) => {
									return (
										<div className="row contenedor-informacion">
											<div className=" col-lg-6 infor-center contenedor-precios-sec margen-precios-promo" key={promo._id}>
												<h2 className="font-peque precio-producto rebajado-sec mr-2">
													${formatoMexico(productos.precio)}
												</h2>
												<Tooltip placement="top" title={formatoMexico(promo.precioPromocion)}>
													<p className="font-secun precios card-precio-rebaja d-inline mr-1">
														${formatoMexico(promo.precioPromocion)}
													</p>
												</Tooltip>
											</div>
											<div className="col-lg-6 contenedor-titulos-productos-sec titulo-elipsis-sec ">
												<Tooltip placement="top" title={productos.nombre}>
													<p className="font-peque titulo-producto">{productos.nombre}</p>
												</Tooltip>
											</div>
										</div>
										
									);
								})
							)}
							
						</Card>
					</Card>
				</Link>
			</div>
		);
	}
}
