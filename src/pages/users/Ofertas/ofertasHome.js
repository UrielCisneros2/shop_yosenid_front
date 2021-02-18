import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { Result, Row } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import './ofertas.scss';
import ComponenteProductoGrande from '../Productos/Card_Grande/componente_producto_grande'
// import ComponenteProductos from '../Productos/componente_productos';
import CardSecundaria from '../Productos/Card_Secundaria/card_secundaria';

import Spin from '../../../components/Spin';

function OfertasHome(props) {
	const {orientacion} = props;

	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		obtenerProductos();
	}, []);

	async function obtenerProductos() {
		setLoading(true);
		await clienteAxios
			.get(`/productos?limit=${5}&page=${1}`)
			.then((res) => {
				setProductos(res.data.posts.docs);
				setLoading(false);
			})
			.catch((err) => {
				props.history.push('/error500');
			});
	}

	const render = productos.map((productos, index) => {
		if(orientacion == "derecha"){
			if(index === 4){
				return  <ComponenteProductoGrande key={productos._id} productos={productos} />
			}else{
				return <CardSecundaria key={productos._id} productos={productos}/>
			}
		}else if(orientacion == "izquierda"){
			if(index === 0){
				return  <ComponenteProductoGrande key={productos._id} productos={productos} />
			}else{
				return <CardSecundaria key={productos._id} productos={productos}/>
			}
		}else if(orientacion == "centro"){
			if(index === 2){
				return  <ComponenteProductoGrande key={productos._id} productos={productos} />
			}else{
				return <CardSecundaria key={productos._id} productos={productos}/>
			}
		}
		else{
			return <CardSecundaria key={productos._id} productos={productos}/>
		}
	});

	if(productos.length === 0){
		return null;
	}

	return (
		<Spin spinning={loading}>
			{/* <div className="contenedor-home-background">
				<div className="row contenedor-home-banner">
					<h4 className="mb-0 font-weight-bold">¡Encuentra ofertas todos los días!</h4> 
				</div>
			</div> */}
			<div className="d-flex justify-content-center align-items-center">
				<div className="">
					<Row gutter={10} style={{ maxWidth: '95vw' }} className=" mt-4">
						{productos.length ? (
							render
						) : (
							<div className="w-100 d-flex justify-content-center align-items-center">
								<Result status="404" title="Aun no hay ofertas" />
							</div>
						)}
					</Row>
				</div>
			</div>
			<div className="d-flex justify-content-center pb-5">
				<Link to="/ofertas" style={{ fontSize: 18 }}>
					Ver Todas las ofertas
				</Link>
			</div>
		</Spin>
	);
}

export default withRouter(OfertasHome);
