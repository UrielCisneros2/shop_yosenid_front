import React from 'react';
import './banners.scss'
import {Link, withRouter } from 'react-router-dom';
import aws from '../../../../config/aws';
import './banners.scss'

function Banner_Doble(props) {

    const { banner, imagenLocal } = props;
    
    const render = banner.banners.map((banner) => {
        return(
            <div key={banner._id} className="col-lg-6 container-imagenes">
                <div className="container-banner-doble mt-2">
                        <img
                            onClick={() =>
                                {if (banner.vincular !== false) {
                                    props.history.push(`/searching/${ banner.tipo.categoria || banner.tipo.temporada || banner.tipo.genero }`);
                                }
                            }}
                            className="imagen-doble " 
                            src={imagenLocal ? banner.imagenBanner : aws + banner.imagenBanner}
                            alt="Imgen publicitaria"
                        />
                </div>
            </div>
        )
    }
    )

    return (
        <div className="container">
            <div className="row">
                {render}
            </div>
        </div>
    );

}

export default withRouter(Banner_Doble);
