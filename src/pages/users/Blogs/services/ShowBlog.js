import React, { useEffect, useState } from 'react';
import clienteAxios from '../../../../config/axios';
import Spin from '../../../../components/Spin';
import { formatoFecha } from '../../../../config/reuserFunction';
import aws from '../../../../config/aws';

import './ShowBlog.scss';

export default function ShowBlog(props) {
	const { url } = props;
	const [ infoBlog, setInfoBlog ] = useState({});
	const [ loading, setLoading ] = useState(false);

	async function ObtenerBlog() {
		await clienteAxios
			.get(`/blog/${url}`)
			.then((res) => {
				setLoading(false);
				setInfoBlog(res.data.post);
			})
			.catch((err) => {
				setLoading(false);
			});
	}

	useEffect(
		() => {
			setLoading(true);
			ObtenerBlog();
		},
		[ url ]
	);

	/* var styleDivImagen = {
		height: '400px',
		backgroundImage: `url(https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${infoBlog.imagen})`,
		backgroundSize: 'cover cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: '50% 50%'
	}; */

	return (
		<Spin spinning={loading}>
			<div className="info-blog bg-white shadow">
				{/* <div className="info-blog__div-imagen" style={styleDivImagen} /> */}
				<div className="contenedor-imagen-blog-principal">
					<img className="imagen-blog-principal" alt="imagen blog principal" src={aws+infoBlog.imagen} />
				</div>
				<div className="p-5">
					<h1 className="info-blog__titulo m-3"> {infoBlog.nombre} </h1>
					<div className="info-blog__fecha m-3"> {formatoFecha(infoBlog.createdAt)} </div>

					<div
						className="info-blog__descripcion"
						dangerouslySetInnerHTML={{ __html: infoBlog.descripcion }}
					/>
				</div>
			</div>
		</Spin>
	);
}
