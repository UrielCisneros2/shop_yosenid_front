import React, { useState, useEffect } from 'react';

import {withRouter } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import Banner_Promocionales from './bannerPromocionales';


// import aws from '../../../../config/aws';

function Consulta_Banners(props) {

    const [ banners, setBanners ] = useState([]);

    useEffect(() => {
		const obtenerBanner = async () => {
			await clienteAxios
				.get('/banner/')
				.then((res) => {
					setBanners(res.data);
				})
                .catch((res) => {});
		};
		obtenerBanner();
	}, []);
	

    

    return (
        <div className="container-fluid">
			 <Banner_Promocionales banner={banners}/>
        </div>
    )
}

export default withRouter(Consulta_Banners);

