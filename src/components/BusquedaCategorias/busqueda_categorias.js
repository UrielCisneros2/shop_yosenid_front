import React, { Fragment, useState, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import { notification, Row, Breadcrumb } from 'antd';
import ComponenteProductos from '../../pages/users/Productos/componente_productos';
import Spin from '../Spin';
import './busqueda_categorias.scss';

function BusquedaCategorias(props) {
	const categoria = props.match.params.categoria;
	const subcategoria = props.match.params.subcategoria;
	const genero = props.match.params.genero;

	const [ loading, setLoading ] = useState(false);
	const [ resultado, setResultado ] = useState([]);

	const obtenerFiltrosDivididos = async (categoria, subcategoria, genero) => {
		var cat = categoria;
		var sub = subcategoria;
		var gen = genero;

		if (categoria === undefined) {
			cat = '';
		}
		if (subcategoria === undefined) {
			sub = '';
		}
		if (genero === undefined || genero === 'Todos') {
			gen = '';
		}

		setLoading(true);

		await clienteAxios
			.get(`/productos/filter?categoria=${cat}&subcategoria=${sub}&genero=${gen}`)
			.then((res) => {
				setResultado(res.data.posts);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
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
	};

	useEffect(
		() => {
			obtenerFiltrosDivididos(categoria, subcategoria, genero);
		},
		[ props ]
	);

	const result = resultado.map((productos) => <ComponenteProductos key={productos._id} productos={productos} />);

	return (
		<Fragment>
			<Spin spinning={loading}>
				<div className="my-4 mx-3">
					<h3 className="d-inline mr-3">{resultado.length} resultados en: </h3>
					<Breadcrumb separator=">" className="d-inline">
						<Breadcrumb.Item className="bread-font">{categoria}</Breadcrumb.Item>
						<Breadcrumb.Item className="bread-font">{subcategoria}</Breadcrumb.Item>
						<Breadcrumb.Item className="bread-font">{genero}</Breadcrumb.Item>
					</Breadcrumb>
				</div>
				<div className="d-flex justify-content-center align-items-center">
					<div className="">
						<Row gutter={10} style={{ maxWidth: '95vw' }} className=" mt-4">
							{result}
						</Row>
					</div>
				</div>
			</Spin>
		</Fragment>
	);
}

export default BusquedaCategorias;
