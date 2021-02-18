import React from 'react';
import './banners.scss'
import {Link, withRouter } from 'react-router-dom';
import aws from '../../../../config/aws';
import './banners.scss'

function Banner_Triple(props) {
    const { banner, imagenLocal } = props;

    const render = banner.banners.map((banner) => {
        return(
            <div key={banner._id} className="col-lg-4 container-imagenes">
                <div className="container-banner-triple">
                        <img
                            onClick={() =>
                                {if (banner.vincular !== false) {
                                    props.history.push(`/searching/${ banner.tipo.categoria || banner.tipo.temporada || banner.tipo.genero }`);
                                }
                            }}
                            className="imagen-triple"
                            src={imagenLocal ? banner.imagenBanner : aws + banner.imagenBanner}
                            alt="Imgen publicitaria"
                        />
                </div>
            </div>
        )
        }
    )

    return (
        <div>
            <div className="container">
                <div className="row">
                    {render}
                </div>
            </div>
        </div>
    );

        
}

export default withRouter(Banner_Triple);
