import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { notification, Result } from 'antd';
// import Pagination from '../../../components/Pagination/pagination';
// import queryString from 'query-string';

import '../Productos/productos.scss';
import './bannerPromocion.scss'
import ComponentProductos from '../Productos/componente_productos';
import Spin from '../../../components/Spin';

/* const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' }; */

function CardsProductos(props) {
    const {categoria} = props;
	//const { location, history } = props.propiedades;
	//const { page = 1 } = queryString.parse(location.search);
	const [ productosPaginacion, setProductosPaginacion ] = useState([]);

	const [ productos, setProductos ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    
    useEffect(() => {
        async function obtenerProductos(limit, page) {
            setLoading(true);
            await clienteAxios
                .get(`/productos/filter?categoria=${categoria}`)
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
    }, [categoria])


	const render = productos.map((productos, index) => {
		if(index <= 5){
			return (
				<ComponentProductos key={productos._id} productos={productos} />
			)
		}	
	});

	return (
		<Spin spinning={loading}>
			{/* <div className="principal-productos"><p>NUESTROS PRODUCTOS</p></div> */}
			<div className="mt-2 d-flex justify-content-center align-items-center">
				<div className="justify-content-center align-items-center">
					<div style={{ maxWidth: '95vw' }} className="row d-flex justify-content-center align-items-center">

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