import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { Result, Row } from 'antd';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import './ofertas.scss';
import Card_Producto from '../Productos/Cards_Normales/card_producto'
import Spin from '../../../components/Spin';

function Ofertas(props) {
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);
	const [ productosPaginacion, setProductosPaginacion ] = useState([]);

	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	useEffect(
		() => {
			obtenerProductos(40, page);
			window.scrollTo(0, 0);
		},
		[ page ]
	);

	async function obtenerProductos(limit, page) {
		setLoading(true);
		await clienteAxios
			.get(`/productos/promociones?limit=${limit}&page=${page}`)
			.then((res) => {
				setProductos(res.data.posts.docs);
				setProductosPaginacion(res.data.posts);
				setLoading(false);
			})
			.catch((err) => {
				props.history.push('/error500');
			});
	}

	const render = productos.map((productos) => (
		< Card_Producto key={productos._id} productos={productos} />
	));

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
				<div className="row contenedor-home-banner">
					<p className="font-prin mb-0 text-center">¡Encuentra ofertas todos los días!</p>
				</div>
			</div>
			<div className="d-flex justify-content-center align-items-center">
				<div className="">
					<Row gutter={10} style={{ maxWidth: '95vw' }} className=" mt-4">
						{render}
					</Row>
				</div>
			</div>
			<Pagination blogs={productosPaginacion} location={location} history={history} />
		</Spin>
	);
}

export default withRouter(Ofertas);
