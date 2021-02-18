import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { notification, Result } from 'antd';
import Spin from '../../../components/Spin';
import '../Productos/Card_Secundaria/productos.scss'
import '../Productos/Cards_Normales/card_producto.scss';
import CardSecundaria from '../Productos/Card_Secundaria/card_secundaria';
import Card_Producto_Frente from '../Productos/Cards_Normales/card_producto_frente';
import Imagen_Banner from './BannerOrientacion/imagenBanner'

// import Pagination from '../../../components/Pagination/pagination';
// import queryString from 'query-string';
// import ComponentProductos from '../Productos/componente_productos';
/* const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' }; */


function CardsProductos({tipo, orientacion, banner, imagenLocal}) {
	//const { location, history } = props.propiedades;
	//const { page = 1 } = queryString.parse(location.search);
	const [ productosPaginacion, setProductosPaginacion ] = useState([]);

	const [ productos, setProductos ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    
    useEffect(() => {
        async function obtenerProductos() {
            setLoading(true);
			await clienteAxios
			// tipo.categoria ? `categoria=${tipo.categoria}` : `temporada=${tipo.temporada}`
                .get(`/productos/filter?${tipo.categoria ? `categoria=${tipo.categoria}` : tipo.temporada ? `temporada=${tipo.temporada}` : `genero=${tipo.genero}` }`)
                .then((res) => {
                    setProductos(res.data.posts);
                    setProductosPaginacion(res.data.posts);
                    setLoading(false);
                })
                .catch((err) => {
                    if(err.response){
                        notification.error({
                            message: 'Error',
                            description: err.response.data.message,
                            duration: 2
                        });
                    }else{
                        notification.error({
                            message: 'Error de conexion',
                            description: 'Al parecer no se a podido conectar al servidor.',
                            duration: 2
                        });
                    }
                });
        }

       obtenerProductos()
    }, [tipo])


	const render = productos.map((productos, index) => {
		if(orientacion > 0){
			if(orientacion === 1 && index === 0 ){
				return <Imagen_Banner key={index} vincular={banner.vincular} imagen={banner.imagenBanner} link={banner.tipo} imagenLocal={imagenLocal} />
			}else if(orientacion === 2 && index === 2){
				return <Imagen_Banner key={index} vincular={banner.vincular} imagen={banner.imagenBanner}	link={banner.tipo} imagenLocal={imagenLocal}/>
			}else if(orientacion === 3 && index === 4){
				return <Imagen_Banner key={index} vincular={banner.vincular} imagen={banner.imagenBanner} link={banner.tipo} imagenLocal={imagenLocal}/>
			}else if(index <= 4){
				return <CardSecundaria key={index} productos={productos} imagenLocal={imagenLocal} />
			}
		}else{
			if(index <= 4){
				return (
					<Card_Producto_Frente key={index} productos={productos} />
				)
			}
		}
		

	});
	// const render = productos.map((productos, index) => {
	// 	if(orientacion > 0){
	// 		if(orientacion === 1 && index === 0 ){
	// 			return <Imagen_Banner imagen={banner.imagenBanner} link={banner.tipo} />
	// 		}else if(orientacion === 2 && index === 2){
	// 			return <Imagen_Banner imagen={banner.imagenBanner}	link={banner.tipo}/>
	// 		}else if(orientacion === 3 && index === 4){
	// 			return <Imagen_Banner imagen={banner.imagenBanner} link={banner.tipo}/>
	// 		}else if(index <= 4){
	// 			return <CardSecundaria key={productos._id} productos={productos} />
	// 		}
	// 	}else{
	// 		if(index <= 5){
	// 			return (
	// 				<CardSecundaria key={productos._id} productos={productos} />
	// 			)
	// 		}
	// 	}
		

	// });

	return (
		<Spin spinning={loading}>
			{/* <div className="principal-productos"><p>NUESTROS PRODUCTOS</p></div> */}
			<div className="d-flex justify-content-center align-items-center cont-div-card">
				<div className="justify-content-center align-items-center cont-div-card">
					<div style={{ maxWidth: '95vw', paddingBottom: 0, marginBottom: 0 }} className="row d-flex justify-content-center align-items-center">

						{productos.length ? (
							render
						) : (
							<div className="w-100 d-flex justify-content-center align-items-center">
								<Result status="404" title="Articulo no encontrado" />
							</div>
						)}
					</div>
				</div>
			</div>
			{/* <Pagination
				blogs={productosPaginacion}
				location={location}
				history={history}
				limite={window.screen.width < 768 ? 12 : 40}
			/> */}
		</Spin>
	);
}

export default CardsProductos;