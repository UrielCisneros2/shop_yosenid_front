/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import Carousel from './Carusel_ofertas/carousel';
/* import ConsultaProductos from './Productos/consulta_productos'; */
import Ofertas from './Ofertas/ofertasHome';
import BannerInformativo from './Datos_tienda/banner_informativo'
import Consulta_Banners from './BannerPromociones/consultaBanners';
import Banner_Promocionales from './BannerPromociones/bannerPromocionales';
import Datos_tienda from './Datos_tienda/datos_tienda';
import OfertasIzquierda from './Ofertas/OfertasHome/ofertasIzquierda';
import OfertasDerecha from './Ofertas/OfertasHome/ofertasDerecha';
import OfertasCentro from './Ofertas/OfertasHome/ofertasCentro';

import './home.scss'

export default function Home(props) {

	return (
		<div>
			<Carousel />
			{/* <div className="contenedor-home-background">
					<div className="row contenedor-home-banner">
						<div className="text-center textos-home col-lg-4 col-12">
							<h2 className="mb-0">REALIZA TU PAGO EN LÍNEA</h2>
							<p>ACEPTAMOS PAGOS CON TARJETA</p>
						</div>
						<div className="text-center textos-home divider-home-banner col-lg-4 col-12 ">
							<h2 className="mb-0">ENVÍO GRATUITO</h2>
							<p>EN PEDIDOS MAYORES A $1500.00</p>
						</div>
						<div className="text-center textos-home col-lg-4 col-12">
							<h2 className="mb-0">APARTA TU PRODUCTO FAVORITO</h2>
							<p>PUEDES APARTAR TU PEDIDO Y PASAR POR EL</p>
						</div>
					</div>
				</div> */}
			{/* <Ofertas /> */}
			<Consulta_Banners/>
			{/* <ConsultaProductos propiedades={props} /> */}
            {/* <Datos_tienda /> */}
			{/* <OfertasIzquierda /> */}
			{/* <OfertasDerecha /> */}
			{/* <OfertasCentro /> */}
			<BannerInformativo />
			
		</div>
	);
}
