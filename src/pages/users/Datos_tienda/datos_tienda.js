import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import Geolocalizacion from '../geolocalizacion';
import './informacion.scss';
import aws from '../../../config/aws';

export default function Datos_tienda() {
	const [ tienda, setTienda ] = useState({});
	const [ direccion, setDireccion ] = useState({});
	const [ infor, setInfo ] = useState('');

	function peticionTienda() {
		clienteAxios
			.get('/tienda/')
			.then((res) => {
				setTienda(res.data[0]);
				setInfo(res.data[0].nombre);
				setDireccion(res.data[0].direccion[0]);
			})
			.catch((err) => {
				
			});
	}

	useEffect(() => {
		peticionTienda();
	}, []);

	return (
		<div>
			{infor !== '' ? (
				<div className="mt-5">
					<div className="contenedor-home-background">
						<div className="row contenedor-home-banner d-flex justify-content-center">
							<h4 className="mb-0 text-center">¡Encuentra nuestra tienda!</h4>
						</div>
					</div>
					<div className="row w-100">
						<div className="col-lg-10">
							<Geolocalizacion
								height="38vh"
								width="100%"
								center={[ tienda.ubicacion[0].lat, tienda.ubicacion[0].lng ]}
								titleLayer={'map'}
								zoom={15}
								apikey="I0G4Jr6RUg71dsHIRF0qGzn0l39bAY1V"
								nombreMarcador={tienda.nombre}
							/>
						</div>

						<div className="col-lg-2 text-center caligra">
							<div className="m-3">
								<img
									className="logotipo"
									alt="imagen de base"
									src={aws+tienda.imagenLogo}
								/>
							</div>

							<p className="h6 font-weight-bold"> {tienda.nombre} </p>
							<p className="h6">
								Tel: <span className="subs h6">{tienda.telefono}</span>
							</p>
							<p className="h6">
								Direccion: <span className="h6">{direccion.calle_numero}</span>
							</p>
							<p className="h6">
								Col.{' '}
								<span className="h6">
									{' '}
									{direccion.colonia}, {direccion.ciudad}, {direccion.estado}
								</span>
							</p>
							<p className="h6">
								CP: <span>{direccion.cp}</span>
							</p>
						</div>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
}
