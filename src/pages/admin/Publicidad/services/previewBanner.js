import { Divider } from 'antd';
import React from 'react';
import Banner_Promocionales from '../../../users/BannerPromociones/bannerPromocionales';

export default function PreviewBanner({ datos, estilo, previewImage }) {
	const array_banner = [
		{
			estilo,
			banners: [
				{
					tipo: { [datos.tipo[0]]: datos.tipo[1] },
					imagenBanner: previewImage ? previewImage : datos.imagenBanner,
					vincular: datos.vincular,
					mostrarProductos: datos.mostrarProductos,
					mostrarTitulo: datos.mostrarTitulo,
					orientacion: datos.orientacion ? datos.orientacion : null
				}
			]
		}
	];

	return (
		<div className="mt-5">
			<div>
				{estilo < 3 ? (
                    <h1>Preview del banner</h1>
                ) : null}
			</div>
			<Divider />
			{estilo < 3 ? (
				<Banner_Promocionales banner={array_banner} imagenLocal={previewImage ? true : false} />
			) : null}
		</div>
	);
}
