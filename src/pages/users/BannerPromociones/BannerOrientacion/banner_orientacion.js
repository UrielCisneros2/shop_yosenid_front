import React from 'react';

import { withRouter } from 'react-router-dom';
import Imagen_Banner from './imagenBanner';
import CardsProductos from '../cardsProductos';

export default function Banner_Orientacion({ banner, imagenLocal }) {
	const render = banner.banners.map((subBanner, index) => (
		<CardsProductos key={index} tipo={subBanner.tipo} orientacion={subBanner.orientacion} banner={subBanner} imagenLocal={imagenLocal} />
	));

	return(
		<div className="mt-2">
			{render}
		</div>
	);
}
