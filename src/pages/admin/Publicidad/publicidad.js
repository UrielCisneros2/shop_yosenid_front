import React, { useState, useEffect, Fragment, useContext } from 'react';
import clienteAxios from '../../../config/axios';
import { Button, Modal, notification, Spin, message, Collapse } from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	ExclamationCircleOutlined,
	CheckSquareOutlined,
	CloseSquareOutlined,
	PictureOutlined
} from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import RegistroTipoBanner from './services/tipoBanner';
import aws from '../../../config/aws';
import './publicidad.scss';

import ImagenEstilo1 from './imagenes/estilo1.png';
import ImagenEstilo2 from './imagenes/estilo2.png';
import ImagenEstilo3 from './imagenes/estilo3.png';
import ImagenEstilo4 from './imagenes/estilo4.png';
import ImagenEstilo5 from './imagenes/estilo5.png';
import ImagenEstilo6 from './imagenes/estilo6.png';
import ImagenEspecial1 from './imagenes/especial1.png';
import ImagenEspecial2 from './imagenes/especial2.png';
import ImagenEspecial3 from './imagenes/especial3.png';
import { BannerContext } from '../../../context/admincontext';

const { confirm } = Modal;

export default function Publicidad(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	const [ bannerBD, setBannerBD ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ control, setControl ] = useState(false);
	const [ bannerSeleccionado, setBannerSeleccionado ] = useState({ banner: '', banners: '' });
	const { reload, setReload, setActualizarDatos } = useContext(BannerContext);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	if (token === '' || token === null) {
		props.history.push('/entrar');
	} else if (decoded['rol'] !== true) {
		props.history.push('/');
	}

	useEffect(
		() => {
			obtenerBannersBD();
		},
		[ reload ]
	);

	///*** OBTENER DATOS DE LA BASE DE DATOS
	const obtenerBannersBD = async () => {
		setLoading(true);
		await clienteAxios
			.get('/banner/admin', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setBannerBD(res.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				errors(err);
			});
	};

	///ELIMINAR BANNER
	const eliminarBanner = async (banner) => {
		setLoading(true);
		await clienteAxios
			.delete(`/banner/${banner}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				notification.success({
					message: '¡Hecho!',
					description: res.data.message,
					duration: 2
				});
				setReload(!reload);
			})
			.catch((err) => {
				setLoading(false);
				errors(err);
			});
	};

	function showDeleteConfirm(banner) {
		confirm({
			title: '¿Quieres eliminar este banner?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				eliminarBanner(banner);
			}
		});
	}

	const errors = (err) => {
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
	};

	const renderBanners = bannerBD.map((banner, index) => (
		<CollapseBanners
			key={index}
			props={props}
			banner={banner}
			showDeleteConfirm={showDeleteConfirm}
			token={token}
			errors={errors}
			reload={reload}
			setReload={setReload}
			setActualizarDatos={setActualizarDatos}
		/>
	));

	return (
		<Spin size="large" spinning={loading}>
			<p className="text-center font-weight-bold" style={{ fontSize: 20 }}>
				Publicidad
			</p>
			<p className="text-center" style={{ fontSize: 15 }}>
				En este apartado puedes subir una sección completa con un banner y los productos de una categoria en
				especial en la pagina principal.
			</p>
			<div className="mt-3">
				<RegistroTipoBanner
					reload={reload}
					setReload={setReload}
					bannerSeleccionado={bannerSeleccionado}
					setBannerSeleccionado={setBannerSeleccionado}
					control={control}
					setControl={setControl}
				/>
			</div>
			{renderBanners}
		</Spin>
	);
}

function CollapseBanners({ props, banner, showDeleteConfirm, token, errors, reload, setReload }) {
	//PUBLICAR BANNER
	const publicarBanner = async (banner, publicado) => {
		if (banner.estilo === 3 && banner.banners.length < 2) {
			notification.info({
				message: 'No has terminado de registrar este banner',
				duration: 2
			});
			return;
		} else if (banner.estilo === 4 && banner.banners.length < 3) {
			notification.info({
				message: 'No has terminado de registrar este banner',
				duration: 2
			});
			return;
		} else if (banner.banners.length === 0) {
			notification.info({
				message: 'No has terminado de registrar este banner',
				duration: 2
			});
			return;
		}
		await clienteAxios
			.put(
				`/banner/publicar/${banner._id}`,
				{ publicado },
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				notification.success({
					message: res.data.message,
					duration: 2
				});
				setReload(!reload);
			})
			.catch((err) => {
				errors(err);
			});
	};
	let imagen;

	switch (banner.estilo) {
		case 1:
			imagen = ImagenEstilo1;
			break;
		case 2:
			if (banner.banners.length !== 0 && banner.banners[0].orientacion && banner.banners[0].orientacion === 1) {
				imagen = ImagenEstilo4;
			} else if (
				banner.banners.length !== 0 &&
				banner.banners[0].orientacion &&
				banner.banners[0].orientacion === 2
			) {
				imagen = ImagenEstilo3;
			} else if (
				banner.banners.length !== 0 &&
				banner.banners[0].orientacion &&
				banner.banners[0].orientacion === 3
			) {
				imagen = ImagenEstilo2;
			}
			break;
		case 3:
			imagen = ImagenEstilo5;
			break;
		case 4:
			imagen = ImagenEstilo6;
			break;
		default:
			break;
	}

	/* simular imagenes */
	var elementos = [];
	for (let i = 0; i < banner.estilo - 1; i++) {
		let array = [];
		array.push(i);
		elementos.push(array);
	}

	return (
		<div className="my-3 shadow-sm border">
			<div className="d-flex align-items-center banner-container">
				<div className="estilo-imagen">
					<img className="mr-3 imagen-promocion-principal" alt="producto" src={imagen} />
				</div>
				<h5 className=" img-publicidad">
					<b>
						{banner.estilo === 1 ? (
							'Banner grande con productos'
						) : banner.estilo === 2 ? (
							'Banner entre productos'
						) : banner.estilo === 3 ? (
							'2 banner sin productos'
						) : (
							'3 banners sin productos'
						)}
					</b>
				</h5>
				<div className="grow" />
				<Button
					ghost
					type="primary"
					size="large"
					className="mx-2"
					onClick={() => props.history.push(`/admin/banner/editar/${banner._id}`)}
					icon={
						<EditOutlined
							className="d-flex justify-content-center align-items-center"
							style={{ fontSize: 20 }}
						/>
					}
				/>
				<Button
					ghost
					type="primary"
					size="large"
					className="mx-2"
					onClick={() => publicarBanner(banner, !banner.publicado)}
					style={banner.publicado ? { color: '#5cb85c', borderColor: '#5cb85c' } : null}
				>
					{banner.publicado ? 'Publicado' : 'Publicar'}
				</Button>
				<Button
					ghost
					type="danger"
					size="large"
					className="mr-2"
					onClick={() => showDeleteConfirm(banner._id)}
					icon={
						<DeleteOutlined
							className="d-flex justify-content-center align-items-center"
							style={{ fontSize: 20 }}
						/>
					}
				/>
			</div>
			<div className="d-flex">
				{banner.banners.length === 0 && banner.estilo > 2 ? (
					elementos.map((res, index) => {
						return (
							<div key={index} className="">
								<div
									className="d-flex justify-content-center align-items-center"
									style={{ width: 250, height: 200 }}
								>
									<img
										alt="imagen publicidad"
										src={
											index + 1 === 1 ? (
												ImagenEspecial1
											) : index + 1 === 2 ? (
												ImagenEspecial2
											) : (
												ImagenEspecial3
											)
										}
										className="imagen-estilo-registro"
									/>
								</div>
							</div>
						);
					})
				) : null}
				{banner.banners.map((res, index, array) => {
					if (banner.estilo === 3) {
						return (
							<div key={index} className="mx-5 d-flex">
								<div
									className="d-flex justify-content-center align-items-center"
									style={{ width: 250, height: 200 }}
								>
									{res.imagenBanner ? (
										<img
											alt="imagen publicidad"
											src={aws + res.imagenBanner}
											className="imagen-promocion-principal"
										/>
									) : (
										<PictureOutlined style={{ fontSize: 90 }} />
									)}
								</div>
								{array.length === 1 ? (
									<div
										className="d-flex justify-content-center align-items-center"
										style={{ width: 250, height: 200 }}
									>
										<img
											alt="imagen publicidad"
											src={ImagenEspecial2}
											className="imagen-promocion-principal"
										/>
									</div>
								) : null}
							</div>
						);
					} else if (banner.estilo === 4) {
						return (
							<div key={index} className="mx-5 d-flex">
								<div
									className="d-flex justify-content-center align-items-center"
									style={{ width: 250, height: 200 }}
								>
									{res.imagenBanner ? (
										<img
											alt="imagen publicidad"
											src={aws + res.imagenBanner}
											className="imagen-promocion-principal"
										/>
									) : (
										<PictureOutlined style={{ fontSize: 90 }} />
									)}
								</div>
								{array.length === 1 ? (
									<Fragment>
										<div
											className="d-flex justify-content-center align-items-center"
											style={{ width: 250, height: 200 }}
										>
											<img
												alt="imagen publicidad"
												src={ImagenEspecial2}
												className="imagen-promocion-principal"
											/>
										</div>
										<div
											className="d-flex justify-content-center align-items-center"
											style={{ width: 250, height: 200 }}
										>
											<img
												alt="imagen publicidad"
												src={ImagenEspecial3}
												className="imagen-promocion-principal"
											/>
										</div>
									</Fragment>
								) : null}
								{array.length === 2 && index > 0 ? (
									<div
										className="d-flex justify-content-center align-items-center"
										style={{ width: 250, height: 200 }}
									>
										<img
											alt="imagen publicidad"
											src={ImagenEspecial3}
											className="imagen-promocion-principal"
										/>
									</div>
								) : null}
							</div>
						);
					} else {
						return (
							<div className="d-lg-flex" key={res._id}>
								<div
									className="d-flex justify-content-center align-items-center"
									style={{ width: 300, height: 200 }}
								>
									{res.imagenBanner ? (
										<img
											alt="example"
											src={aws + res.imagenBanner}
											className="imagen-promocion-principal"
										/>
									) : (
										<PictureOutlined style={{ fontSize: 90 }} />
									)}
								</div>
								<div>
									<div className="ml-2 mt-2">
										<div className="d-flex">
											<h6 className="mr-2">
												<b>
													{res.tipo ? res.tipo.categoria ? (
														'Categoria: '
													) : res.tipo.temporada ? (
														'Temporada: '
													) : (
														'Género'
													) : (
														''
													)}
												</b>
											</h6>
											<h6>
												{res.tipo ? res.tipo.categoria ? (
													res.tipo.categoria
												) : res.tipo.temporada ? (
													res.tipo.temporada
												) : res.tipo.genero ? (
													res.tipo.genero
												) : (
													''
												) : (
													'sin categoria/temporada'
												)}
											</h6>
										</div>
										<div className="d-flex">
											<h6 className="mr-2">
												<b className="d-flex align-items-center">
													{res.vincular ? (
														<CheckSquareOutlined style={{ color: '#5cb85c' }} />
													) : (
														<CloseSquareOutlined style={{ color: '#d9534f' }} />
													)}
												</b>
											</h6>
											<h6 className="d-flex align-items-center">
												{res.vincular ? 'Vinculado' : 'No vinculado'}
											</h6>
										</div>
										<div className="d-flex">
											<h6 className="mr-2">
												<b className="d-flex align-items-center">
													{res.mostrarTitulo ? (
														<CheckSquareOutlined style={{ color: '#5cb85c' }} />
													) : (
														<CloseSquareOutlined style={{ color: '#d9534f' }} />
													)}
												</b>
											</h6>
											<h6 className="d-flex align-items-center">
												{res.mostrarTitulo ? 'Muestra titulo' : 'No muestra titulo'}
											</h6>
										</div>
										<div className="d-flex">
											<h6 className="mr-2">
												<b className="d-flex align-items-center">
													{res.mostrarProductos ? (
														<CheckSquareOutlined style={{ color: '#5cb85c' }} />
													) : (
														<CloseSquareOutlined style={{ color: '#d9534f' }} />
													)}
												</b>
											</h6>
											<h6 className="d-flex align-items-center">
												{res.mostrarProductos ? 'Muestra productos' : 'No muestra productos'}
											</h6>
										</div>
									</div>
								</div>
							</div>
						);
					}
				})}
			</div>
		</div>
	);
}
