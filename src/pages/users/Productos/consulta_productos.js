import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { notification, Result, Row } from 'antd';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';
import './productos.scss';
import ComponenteProductos from './componente_productos';
import Spin from '../../../components/Spin';

function ConsultaProductos(props) {
	const { location, history } = props.propiedades;
	const { page = 1 } = queryString.parse(location.search);
	const [ productosPaginacion, setProductosPaginacion ] = useState([]);

	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	useEffect(
		() => {
			if (window.screen.width < 768) {
				obtenerProductos(12, page);
			} else {
				obtenerProductos(40, page);
			}
		},
		[ page ]
	);

	async function obtenerProductos(limit, page) {
		setLoading(true);
		await clienteAxios
			.get(`/productos?limit=${limit}&page=${page}`)
			.then((res) => {
				setProductos(res.data.posts.docs);
				setProductosPaginacion(res.data.posts);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response) {
					notification.error({
						message: 'Error',
						description: err.response.data.message,
						duration: 2
					});
				} else {
					notification.error({
						message: 'Error de conexion',
						description: 'Al parecer no se a podido conectar al servidor.',
						duration: 2
					});
				}
			});
	}

	const render = productos.map((productos) => {
		return (<ComponenteProductos key={productos._id} productos={productos} />);
	});

	if (!productos) {
		return (
			<div className="w-100 d-flex justify-content-center align-items-center">
				<Result status="404" title="Aun no hay ofertas" />
			</div>
		);
	}

	return (
		<Spin spinning={loading}>
			<div className="contenedor-home-background">
				<div className="row float-left">
					<h4 className="mb-0 text-center font-weight-bold">¡Conoce nuestros productos!</h4>
				</div>
			</div>
			<div className="d-flex justify-content-center align-items-center">
				<div className="">
					<Row gutter={10} style={{ maxWidth: '95vw' }} className=" mt-4">
						{render}
					</Row>
				</div>
			</div>
			<Pagination
				blogs={productosPaginacion}
				location={location}
				history={history}
				limite={window.screen.width < 768 ? 12 : 40}
			/>
		</Spin>
	);
}

export default ConsultaProductos;
