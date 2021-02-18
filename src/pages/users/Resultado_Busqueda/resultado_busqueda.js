import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { notification, Result, Row } from 'antd';
import Card_Producto from '../Productos/Cards_Normales/card_producto';
import Spin from '../../../components/Spin';

function ResultadoBusqueda(props) {
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const url = props.match.params.url;

	useEffect(
		() => {
			async function obtenerProductosFiltrados() {
				setLoading(true);
				await clienteAxios
					.get(
						`/productos/search?nombre=${url}&categoria=${url}&subcategoria=${url}&genero=${url}&color=${url}&temporada=${url}`
					)
					.then((res) => {
						setProductos(res.data.posts);
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
			obtenerProductosFiltrados();
		},
		[ url ]
	);

	const render = productos.map((productos) => <Card_Producto key={productos._id} productos={productos} />);

	if (!productos) {
		return (
			<div className="w-100 d-flex justify-content-center align-items-center">
				<Result status="404" title="Aun no hay ofertas" />
			</div>
		);
	}

	return (
		<Spin spinning={loading}>
			<h3 className="ml-5 mt-4 mb-4 font-prin">
				{productos.length} resultados de la busqueda "{url}"
			</h3>
			<div className="d-flex justify-content-center align-items-center">
				<div className="">
					<Row gutter={10} style={{ maxWidth: '95vw' }} className=" mt-4">
						{render}
					</Row>
				</div>
			</div>
		</Spin>
	);
}

export default ResultadoBusqueda;
