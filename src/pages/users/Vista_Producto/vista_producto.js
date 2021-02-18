import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { Divider, Row, Col, Tag, Alert, notification, Result, Button } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import Scroll from './subs/scroll';
import Sugerencia from './subs/sugerencia';
import Galeria from './Galeria_tienda/galeria';
import TallasCantidades from './subs/cantidades_y_tallas';
import InfoTienda from './Info_tienda/info-tienda';
import Envio_General from '../Consulta_covertura/envio_general';
import 'antd/dist/antd.css';
import './vistas.scss';
import { formatoMexico, agregarPorcentaje } from '../../../config/reuserFunction';
import DOMPurify from 'dompurify';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import Spin from '../../../components/Spin';

function VistaProductos(props) {
	const [ productos, setProductos ] = useState([]);
	const [ promocion, setPromocion ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ readMore, setReadMore ] = useState('read-less');
	const producto = props.match.params.url;
	const [ costoEnvio, setCostoEnvio ] = useState([]);

	useEffect(() => {
		obtenerProducto();
		obtenerPoliticasEnvio();
		window.scrollTo(0, 0);
	}, []);

	async function obtenerPoliticasEnvio() {
		await clienteAxios
			.get('/politicasEnvio/')
			.then((res) => {
				setCostoEnvio(res.data);
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

	async function obtenerProducto() {
		setLoading(true);
		await clienteAxios
			.get(`/productos/${producto}`)
			.then((res) => {
				if (!res.data) {
					setLoading(false);
					setProductos([]);
					return;
				}
				setProductos(res.data);
				res.data.promocion.forEach((res) => setPromocion(res));
				setLoading(false);
			})
			.catch((err) => {
				props.history.push('/error500');
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

	const OnClickReadMore = () => {
		if (readMore === 'read-less') {
			setReadMore('read-more');
		} else {
			setReadMore('read-less');
		}
	};

	if (loading === false && productos.length === 0) {
		return (
			<Result
				status="404"
				title="404"
				subTitle="Lo sentimos, este producto ya no existe."
				extra={<Button className="color-boton" type="primary" onClick={() => props.history.push('/')}>Pagina principal</Button>}
			/>
		);
	}

	return (
		<Spin spinning={loading}>
			<div className="container mt-5 shadow caracteristicas ">
				<div className="row mt-5">
					<div className="col-lg-8 imagen-gallery-vista zoom">
						<div id="zoom-render" />
						<div className="mb-5">
							<Galeria id={producto} />
						</div>
						<div className="descripcion-lg">
							<p className="font-secun producto-descripcion">Descripción</p>
							<div
								className={readMore}
								dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productos.descripcion) }}
							/>
							{readMore === 'read-less' ? (
								<p className="font-vista-prod texto-ver-mas" onClick={OnClickReadMore}>
									Ver más...
								</p>
							) : (
								<p className="font-vista-prod texto-ver-mas" onClick={OnClickReadMore}>
									Ver menos
								</p>
							)}
						</div>
						<Divider />
						{/* ### Componenete de Sugerencia */}
						<div className="descripcion-lg">
							<Sugerencia producto={producto} />
						</div>
					</div>
					<div className="col-lg-4 border-left">
						<p className="titulo-principal font-prin">{productos.nombre}</p>
						{promocion.length === 0 ? (
							<p className="precio-prin titulo-precio-tachado precio-rebaja titulo-precio">
								$ {formatoMexico(productos.precio)}
							</p>
						) : (
							<div>
								<p className="titulo-precio-tachado precio-producto font-descrip">
									$ {formatoMexico(productos.precio)}
								</p>
								<p className="titulo-precio precio-rebaja d-inline mr-3 precio-prin">
									$ {formatoMexico(promocion.precioPromocion)}
								</p>
								<p className="titulo-porcentaje porcentaje-descuento d-inline mr-2 font-descrip">
									{agregarPorcentaje(promocion.precioPromocion, productos.precio)}% OFF
								</p>
							</div>
						)}
						
						{costoEnvio ? (
							<div>
								<p className="envio-texto font-vista-prod">
									<FontAwesomeIcon icon={faTruck} style={{ fontSize: 15, marginRight: 10 }} />{' '}
									<span>Costo del envío:</span> <span>${costoEnvio.costoEnvio}</span>
								</p>
								<Envio_General className="mt-3" />
								{costoEnvio.promocionEnvio ?  costoEnvio.descuento !== 0 ? (
									<Alert
										className="mt-3 font-vista-prod"
										message={
											costoEnvio.descuento !== 0 ? (
												<p>¡En compras arriba de ${costoEnvio.promocionEnvio} el envío será GRATIS!</p>
											) : (
												<p>¡En compras arriba de $${costoEnvio.promocionEnvio}, el envío será GRATIS!</p>
											)
										}
										type="success"
										showIcon
									/>
								) : (
									''
								) : (
									<div />
								)}
							</div>
						) : (
							<div className="d-none" />
						)}
						{productos.genero === 'Ninguno' && !productos.color && !productos.colorHex ? (
							<div />
						) : (
							<div>
								<Divider />
								<div className="row justify-content-center">
									{productos.genero === 'Ninguno' ? (
										<div />
									) : (
										<div className="col-4">
											<p className="font-vista-prod" style={{ fontWeight: "bold", marginBottom: 10 }}>
												Género:
											</p>
											<Tag className="font-vista-prod color-tags" >
												{productos.genero}
											</Tag>
										</div>
									)}
									{!productos.color && !productos.colorHex ? (
										<div />
									) : (
										<div className="col-6">
											<p className="font-vista-prod" style={{ marginBottom: 5 }}>
												<spam style={{fontWeight: "bold"}} >Color:</spam> {productos.color}
											</p>
											<div
												className="rounded-circle ml-2"
												style={{ height: 30, width: 30, backgroundColor: productos.colorHex }}
											/>
										</div>
									)}
								</div>
							</div>
						)}
						<Divider />
						<TallasCantidades producto={productos} /> {/* Componente tallas */}
						<Divider />
						<p className="font-vista-prod mb-3 formas-pago" >
							<CreditCardOutlined style={{ fontSize: 25 }} className="mr-2" />
							Formas de Pago
						</p>
						<div className="contenedor-img-tarjetas">
							<img
								alt="tarjetas de credito"
								className="img-tarjetas"
								src="https://www.paymentmedia.com/gallery/5b927b5d6fc472000px-Mastercard-logo.svg.jpg"
							/>
							<img
								alt="tarjetas de credito"
								className="img-tarjetas"
								src="https://logos-marcas.com/wp-content/uploads/2020/04/Visa-Logo.png"
							/>
						</div>
						<Divider />
						<div className="descripcion-sm">
							<Divider />
							<p className="font-secun text-center">Descripcion:</p>
							<div style={{textAlign: 'justify' }} className="px-3">
								<div
									className={readMore}
									dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productos.descripcion) }}
								/>
								{readMore === 'read-less' ? (
									<p className="font-secun texto-ver-mas" onClick={OnClickReadMore}>
										Ver más...
									</p>
								) : (
									<p className="font-secun texto-ver-mas" onClick={OnClickReadMore}>
										Ver menos
									</p>
								)}
							</div>
						</div>
						<Divider />
						<InfoTienda />
						{/* Componente informacion de la tienda */}
					</div>
					
					<div className="descripcion-sm">
						<Sugerencia producto={producto} />
					</div>
					
				</div>
				{/* ### Componenete de productos similares */}
				<Row className="mt-5">
					<Col span={24}>
						<Scroll productos={productos} />
					</Col>
				</Row>
			</div>
		</Spin>
	);
}

export default withRouter(VistaProductos);
