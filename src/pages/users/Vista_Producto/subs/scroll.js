import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import '../vistas.scss';
import { Card, Col } from 'antd';
import { formatoMexico, agregarPorcentaje } from '../../../../config/reuserFunction'
import aws from '../../../../config/aws';
import Spin from '../../../../components/Spin';

const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

function Scroll(props) {
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const producto = props.productos;

	useEffect(() => {
		setLoading(true);
		clienteAxios
			.get(`/productos/search?nombre=${producto.nombre}&categoria=${producto.categoria}&subcategoria=${producto.subCategoria}`)
			.then((res) => {
				setProductos(res.data.posts);
				setLoading(false);
			})
			.catch((err) => {
				
			});
	}, [producto]);

	const render = productos.map((productos) => (
		<Col key={productos._id} className="d-inline-flex mr-2 contenedor-card-tamaño">
				<Card.Grid hoverable style={gridStyle}>
					<Card
						onClick={() => (window.location.href = `/vista_producto/${productos._id}`)}
						bodyStyle={{ padding: 10, backgroundColor: '#F7F7F7' }}
						style={{ maxHeight: '100%', width: '100%', cursor: 'pointer' }}
						cover={
							<div className="d-flex justify-content-center align-items-center" style={{ height: 220 }}>
								<img
									className="imagen-producto-principal"
									alt="producto"
									src={aws+productos.imagen}
								/>
							</div>
						}
					>
						{!productos.promocion.length ? (
							<div className="contenedor-titulos-productos">
								<h1 className="font-secun">{productos.nombre}</h1>
								<h2 className="font-prin precio-rebaja">${formatoMexico(productos.precio)}</h2>
							</div>
						) : (
							productos.promocion.map((promo) => {
								return (
									<div className="contenedor-titulos-productos" key={promo._id}>
										<h1 className="font-secun">{productos.nombre}</h1>
										<p className="font-peque porcentaje-descuento d-inline">
											{agregarPorcentaje(promo.precioPromocion, productos.precio)}%OFF
										</p>
										<h2 className="font-peque precio-producto d-inline mr-1">
											${formatoMexico(productos.precio)}
										</h2>
										<br/>
										<h2 className="font-prin precio-rebaja d-inline mr-1">
											${formatoMexico(promo.precioPromocion)}
										</h2>
										
									</div>
								);
							})
						)}
					</Card>
				</Card.Grid>
		</Col>
	));

	return (
		<Spin spinning={loading}>
			<div className="mt-5">
				<p className="font-prin titulos-vista-productos producto-descripcion mb-3">Quienes vieron este producto también compraron</p>
				<div className="contenedor-scroller">
					{render}
				</div>
			</div>
		</Spin>
	);
}

export default Scroll;
