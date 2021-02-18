import React from 'react';

import clienteAxios from '../../../config/axios';

import Banner_Orientacion from './BannerOrientacion/banner_orientacion';
import Banner_Largo from './BannerLargo/BannerLargo';
import Banner_Doble from './BannerCuadrados/bannerDoble';
import Banner_Triple from './BannerCuadrados/bannerTriple';

export default function Banner_Promocionales({ banner, imagenLocal }) {

	const render = banner.map((banner, index) => {
		if (banner.estilo === 1) {
			return <Banner_Largo key={index} banner={banner} imagenLocal={imagenLocal} />;
		} else if (banner.estilo === 2) {
			return <Banner_Orientacion key={index} banner={banner} imagenLocal={imagenLocal} />;
		} else if (banner.estilo === 3) {
			return <Banner_Doble key={index} banner={banner} imagenLocal={imagenLocal} />;
		} else if (banner.estilo === 4) {
			return <Banner_Triple key={index} banner={banner} imagenLocal={imagenLocal} />;
		}
	});

	return <div>{render}</div>;
}
