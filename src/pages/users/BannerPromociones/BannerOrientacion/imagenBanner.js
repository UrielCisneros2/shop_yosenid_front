import React from 'react'
import {Link } from 'react-router-dom';
import './bannerOrientacion.scss';
import aws from '../../../../config/aws';

export default function Imagen_Banner(props) {
    
    const {imagen, link, imagenLocal, vincular } = props;
        return(
            <div className="container-imagenes">
                <div className="container-image">
                    <img
                        onClick={() =>
                            {if (vincular !== false) {
                                props.history.push(`/searching/${ link.categoria || link.temporada || link.genero }`);
                            }
                        }}
                        className="image-orientancion"
                        src={imagenLocal ? imagen : aws + imagen}
                        alt="Imgen publicitaria"
                    />
                </div>
            </div>
        );
    
}
