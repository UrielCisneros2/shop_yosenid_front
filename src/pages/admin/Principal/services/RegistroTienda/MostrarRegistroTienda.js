import React, { useState, useEffect, useCallback } from 'react';
import { Button, Drawer, Alert, notification, Empty } from 'antd';
import clienteAxios from '../../../../../config/axios';
import { withRouter } from 'react-router-dom';
import Geolocalizacion from '../../../../users/geolocalizacion';
import './MostrarRegistroTienda.scss';
import {
	PlusCircleOutlined,
	EditOutlined,
	EyeOutlined,
	FacebookFilled,
	InstagramFilled,
	TwitterCircleFilled
} from '@ant-design/icons';
import Spin from '../../../../../components/Spin';
import RegistroTienda from './RegistroTienda';
import { Link } from 'react-router-dom';
import aws from '../../../../../config/aws';

function MostrarRegistroTienda(props) {
	const { token } = props;

	const [ action, setAction ] = useState(false);
	const [ visible, setVisible ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ datosNegocio, setDatosNegocio ] = useState({});
	const [ face, setFace ] = useState('');
	const [ insta, setInsta ] = useState('');
	const [ twitter, setTwitter ] = useState('');

	const [ reloadInfo, setReloadInfo ] = useState(false);
	const [ politicasEnvio, setPoliticasEnvio ] = useState([]);

	// const [ lat, setLat ] = useState('');
	// const [ lng, setLng ] = useState('');

	const showDrawer = () => {
		setVisible(true);
	};
	const drawnerClose = () => {
		setVisible(false);
		setReloadInfo(!reloadInfo)
	};

	const [ current, setCurrent ] = useState(0);

	const next = () => {
		setCurrent(current + 1);
	};

	const prev = () => {
		setCurrent(current - 1);
	};

	function peticionDatosTienda() {
		setLoading(true);
		clienteAxios
			.get(`/tienda/`)
			.then((res) => {
				setLoading(false);
				setDatosNegocio(res.data[0]);
				if (res.data[0]) {
					setAction(true);
					// if (res.data[0].ubicacion[0].lat === '' || res.data[0].ubicacion[0].lat === 'undefined') {
					// 	setLat('19.767980');
					// } else {
					// 	setLat(res.data[0].ubicacion[0].lat);
					// }
					// if (res.data[0].ubicacion[0].lng === '' || res.data[0].ubicacion[0].lng === 'undefined') {
					// 	setLng('-104.358159');
					// } else {
					// 	setLng(res.data[0].ubicacion[0].lng);
					// }
					if (res.data[0].linkFace !== 'undefined' && res.data[0].linkFace !== '') {
						setFace(res.data[0].linkFace);
					}
					if (res.data[0].linkInsta !== 'undefined' && res.data[0].linkInsta !== '') {
						setInsta(res.data[0].linkInsta);
					}
					if (res.data[0].linkTweeter !== 'undefined' && res.data[0].linkTweeter !== '') {
						setTwitter(res.data[0].linkTweeter);
					}
				} 
				// else {
				// 	setLat('19.767980');
				// 	setLng('-104.358159');
				// }
				/*             if(res.data[0] !== {}){
                setAction(true)
                setLat(res.data[0].ubicacion[0].lat)
                setLng(res.data[0].ubicacion[0].lng)
            }else{
                setLat("19.767980")
                setLng("-104.358159")
            } */
			})
			.catch((err) => {
				setLoading(false);
				// setLat('19.767980');
				// setLng('-104.358159');
				setDatosNegocio({});
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

	const obtenerPoliticasEnvio = useCallback(
		async () => {
			await clienteAxios
				.get('/politicasEnvio/', {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setPoliticasEnvio(res.data);
				})
				.catch((err) => {
					setLoading(false);
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
		},
		[ token ]
	);

	useEffect(
		() => {
			peticionDatosTienda();
			obtenerPoliticasEnvio();
			setReloadInfo(false);
		},
		[ reloadInfo, obtenerPoliticasEnvio ]
	);

	if (loading) {
		return <Spin />;
	}

	return (
		<div className="info-tienda">
			<Drawer
				title={
					action === false ? (
						'Registrando la información del negocio'
					) : (
						'Actualizando la información del negocio'
					)
				}
				width={window.screen.width > 768 ? 1000 : window.screen.width}
				placement={'right'}
				onClose={drawnerClose}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right'
						}}
					>
						{current > 0 && (
							<Button className="mx-1" onClick={() => prev()}>
								Anterior
							</Button>
						)}
						{current < 3 && (
							<Button className="mx-1" type="primary" onClick={() => next()}>
								Siguiente
							</Button>
						)}
						<Button className="mx-1" onClick={drawnerClose} type="primary">
							Cerrar
						</Button>
					</div>
				}
			>
				<RegistroTienda
					datosNegocio={datosNegocio}
					setDatosNegocio={setDatosNegocio}
					token={token}
					setLoading={setLoading}
					steps={[current, setCurrent]}
					// setReloadInfo={setReloadInfo}
					// drawnerClose={drawnerClose}
				/>
			</Drawer>

			<div className="contenedor-boton-datostienda">
				<Button
					type="primary"
					className="m-3"
					size="large"
					/* drawnerClose={drawnerClose} */
					icon={
						action === false ? (
							<PlusCircleOutlined style={{ fontSize: 24 }} />
						) : (
							<EditOutlined style={{ fontSize: 24 }} />
						)
					}
					onClick={() => {
						showDrawer();
					}}
				>
					{action === false ? 'Agregar información tienda' : 'Editar información tienda'}
				</Button>
			</div>

			<div className="text-center mt-3">
				<p className="text-center mb-4 font-weight-bold" style={{ fontSize: 20 }}>
					{action === false ? (
						'Ey aún no agregas la información de tu negocio.'
					) : (
						'Información de tu negocio'
					)}{' '}
				</p>
				<div className="w-50" style={{ margin: 'auto' }}>
					{action === false ? (
						<Alert message="Nota:" description={<AlertTienda />} type="info" showIcon />
					) : (
						''
					)}
				</div>
				{action === false ? (
					''
				) : (
					<div>
						<p className="h5 font-weight-bold">Logo del negocio:</p>
						<div className="mostrarRegistroTienda-imagen m-3">
							<img
								className="d-block img-fluid "
								width="200"
								alt="imagen de base"
								src={aws + datosNegocio.imagenLogo}
							/>
						</div>
					</div>
				)}

				<div className="row m-4">
					<div className="col-lg-4 col-md-4 col-sm-12 mb-2 shadow">
						<p className="h5 font-weight-bold">
							Nombre del negocio:{' '}
							<span className="h5">
								{' '}
								{action === false ? 'Nombre de tu negocio' : datosNegocio.nombre}{' '}
							</span>{' '}
						</p>
					</div>
					<div className="col-lg-4 col-md-4 col-sm-12 mb-2 shadow">
						<p className="h5 font-weight-bold">
							Teléfono:<span className="h5">
								{' '}
								{action === false ? 'Teléfono' : datosNegocio.telefono}{' '}
							</span>
						</p>
					</div>
					<div className="col-lg-4 col-md-4 col-sm-12 mb-2 shadow">
						<p className="h5 font-weight-bold">
							Código Postal:<span className="h5">
								{' '}
								{action === false ? 'Código Postal' : datosNegocio.direccion[0].cp}{' '}
							</span>
						</p>
					</div>
				</div>

				<div className="row m-4">
					<div className="col-lg-4 col-md-4 col-sm-12 mb-2 shadow">
						<p className="h5 font-weight-bold">
							Calle:<span className="h5">
								{' '}
								{action === false ? 'Calle' : datosNegocio.direccion[0].calle_numero}{' '}
							</span>
						</p>
					</div>
					<div className="col-lg-4 col-md-4 col-sm-12 mb-2 shadow">
						<p className="h5 font-weight-bold">
							Colonia:<span className="h5">
								{' '}
								{action === false ? 'Colonia' : datosNegocio.direccion[0].colonia}{' '}
							</span>
						</p>
					</div>
					<div className="col-lg-4 col-md-4 col-sm-12 mb-2 shadow">
						<p className="h5 font-weight-bold">
							Ciudad:<span className="h5">
								{' '}
								{action === false ? 'Colonia' : datosNegocio.direccion[0].ciudad} Ciudad
							</span>
						</p>
					</div>
				</div>

				<div className="row justify-content-around">
					<div className="col-lg-4 col-sm-12 shadow">
						<p className="h5 font-weight-bold">
							Estado:<span className="h5">
								{' '}
								{action === false ? 'Estado' : datosNegocio.direccion[0].estado}
							</span>
						</p>
					</div>
					
					<div className="col-lg-4 col-sm-12 shadow">
						<p className="m-2 h5 font-weight-bold">Redes sociales:</p>
						{face !== '' ? (
							<a href={face} className="m-2" target="_blank" rel="noopener noreferrer">
								<FacebookFilled style={{ fontSize: 45, color: 'gray' }} />
							</a>
						) : (
							''
						)}
						{insta !== '' ? (
							<a href={insta} className="m-2" target="_blank" rel="noopener noreferrer">
								<InstagramFilled style={{ fontSize: 45, color: 'gray' }} />
							</a>
						) : (
							''
						)}

						{twitter !== '' ? (
							<a href={twitter} className="m-2" target="_blank" rel="noopener noreferrer">
								<TwitterCircleFilled style={{ fontSize: 45, color: 'gray' }} />
							</a>
						) : (
							''
						)}
					</div>
				</div>
				<div className="row justify-content-around mt-3">
					<div className="col-lg-4 col-sm-12 shadow ">
						<p className="h5 font-weight-bold">
							Horarios de Atención:<span className="h5">
								{' '}
								{action === false ? 'Horarios de Atención:' : 
									<div 
										style={{lineHeight: "35px"}} 
										dangerouslySetInnerHTML={{__html: datosNegocio.diasHorariosEmpresas}} 
										className='mt-1 px-4 ' 
									/>
								}
							</span>
						</p>
					</div>
				</div>

				{/* <div className="row">
					<div className="col-12">
						<p className="m-3 h5">Ubicación actual: </p>
						<Geolocalizacion
							height="60vh"
							width="100%"
							center={[ lat, lng ]}
							titleLayer={'map'}
							zoom={15}
							apikey="I0G4Jr6RUg71dsHIRF0qGzn0l39bAY1V"
							nombreMarcador="AB soluciones Empresariales"
						/>
					</div>
				</div> */}

				<div className="row mt-5">
					<div className="col-lg-4 col-sm-12">
						<p className="m-3 h3">Políticas de envío</p>
						{politicasEnvio.length === 0 ? (
							<Empty description="Aún no hay información" />
						) : (
							<div className="politicas-p mt-4">
								<p className="h5">
									Costo por envío de paqueteria: <strong>${politicasEnvio.costoEnvio}</strong>
								</p>
								<p className="h5">
									Promoción de envío: <strong>${politicasEnvio.promocionEnvio}</strong>
								</p>
								<p className="h5">
									Costo de promocion de envío: <strong>${politicasEnvio.descuento}</strong>
								</p>
							</div>
						)}
					</div>
					<div className="col-lg-4 col-sm-12">
						<p className="m-3 h3">Políticas de privacidad</p>
						{action === false ? (
							<Empty description="Aún no hay información" />
						) : (
							<Empty
								image="https://es.seaicons.com/wp-content/uploads/2015/11/Review-Post-icon1.png"
								description="Información existente"
							>
								<Link to={`/politicas`} target="_blank">
									<Button type="dashed">
										<EyeOutlined /> Ver
									</Button>
								</Link>
							</Empty>
						)}
					</div>
					<div className="col-lg-4 col-sm-12">
						<p className="m-3 h3">Imagen corporativa</p>
						{action === false ? (
							<Empty description="Aún no hay información" />
						) : (
							<Empty
								image="https://es.seaicons.com/wp-content/uploads/2015/11/Review-Post-icon1.png"
								description="Información existente"
							>
								<Link to={`/quienes_somos`} target="_blank">
									<Button type="dashed">
										<EyeOutlined /> Ver
									</Button>
								</Link>
							</Empty>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function AlertTienda() {
	return (
		<div>
			<p className="h5">
				Recuerda que tener la información de tu negocio es importante, ya que esta informacion ayudará que tu
				negocio sea encontrado fácilmente.
			</p>
		</div>
	);
}

export default withRouter(MostrarRegistroTienda);
