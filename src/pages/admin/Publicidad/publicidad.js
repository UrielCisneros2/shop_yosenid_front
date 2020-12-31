import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { Button, Space, Modal, List, notification, Spin, Checkbox, message, Alert } from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	ExclamationCircleOutlined,
    PictureOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import RegistroPublicidad from './services/registro_publicidad';
import aws from '../../../config/aws';
import './publicidad.scss';

const { confirm } = Modal;

export default function Publicidad(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	const [ bannerBD, setBannerBD ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ control, setControl ] = useState(false);
	const [ bannerSeleccionado, setBannerSeleccionado ] = useState([]);
	const [ visible, setVisible ] = useState(false);

	const [ reload, setReload ] = useState(false);

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
			.get('/banner/')
			.then((res) => {
				setBannerBD(res.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				errors(err);
			});
	};

	const actualizarChecks = async (e, banner) => {
		const checkName = e.target.name;
		const checkValue = e.target.checked;
		switch (checkName) {
			case 'vinculacion':
				await clienteAxios
					.put(
						`/banner/${banner}`,
						{ vincularCategoria: checkValue },
						{
							headers: {
								Authorization: `bearer ${token}`
							}
						}
					)
					.then((res) => {
						setLoading(false);
						message.success('Vinculación actualizada');
						setReload(!reload);
					})
					.catch((err) => {
						setLoading(false);
						errors(err);
					});
				break;
			case 'mostrarProductos':
				await clienteAxios
					.put(
						`/banner/${banner}`,
						{ mostrarProductos: checkValue },
						{
							headers: {
								Authorization: `bearer ${token}`
							}
						}
					)
					.then((res) => {
						setLoading(false);
						message.success('Mostrar productos actualizado');
						setReload(!reload);
					})
					.catch((err) => {
						setLoading(false);
						errors(err);
					});
				break;
			case 'mostrarTitulo':
				await clienteAxios
					.put(
						`/banner/${banner}`,
						{ mostrarTitulo: checkValue },
						{
							headers: {
								Authorization: `bearer ${token}`
							}
						}
					)
					.then((res) => {
						setLoading(false);
						message.success('Mostrar titulo actualizado');
						setReload(!reload);
					})
					.catch((err) => {
						setLoading(false);
						errors(err);
					});
				break;
			default:
				break;
		}
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

	const actualizar = (banner) => {
		setVisible(true);
		setControl(true);
		setBannerSeleccionado(banner);
    };

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

	const ListaBanners = (props) => {
		const { banner } = props;
		return (
			<List.Item
				className="list-publicidad"
				key={banner._id}
				actions={[
					<Space className="list-publicidad-botones">
						<Button
							className="d-flex justify-content-center align-items-center"
							style={{ fontSize: 16 }}
							type="primary"
							onClick={() => actualizar(banner)}
							size={window.screen.width > 768 ? 'middle' : 'small'}
						>
							<EditOutlined />
							Editar
						</Button>
						<Button
							className="d-flex justify-content-center align-items-center"
							style={{ fontSize: 16 }}
							danger
							onClick={() => {
								showDeleteConfirm(banner._id);
							}}
							size={window.screen.width > 768 ? 'middle' : 'small'}
						>
							<DeleteOutlined />
							Eliminar
						</Button>
					</Space>
				]}
			>
				<List.Item.Meta
					className="list-publicidad-meta-container"
					avatar={
						<div
							className="d-flex justify-content-center align-items-center mr-2 list-publicidad-imagen-container"
						>
							{banner.imagenBanner ? (
								<img
									className="imagen-promocion-principal"
									alt="producto"
									src={aws + banner.imagenBanner}
								/>
							) : (
								<div className="text-center">
									<PictureOutlined style={{ color: '#CFCFCF', fontSize: 50 }} />
									<h6 style={{ color: '#CFCFCF' }}>No hay imagen</h6>
								</div>
							)}
						</div>
					}
					title={
						<div className="mt-4 titulo-producto list-publicidad-titulos-container">
							<h1 className="h5 font-weight-bold">
								{banner.categoria ? banner.categoria : 'Sin categoria'}
							</h1>
							<div className="list-publicidad-checks-container">
								<div className="d-inline mr-4">
									<h6 className="d-inline mr-2 checktitle">Vinculación:</h6>
									<Checkbox
										className="check-check"
										disabled={banner.categoria.length !== 0 ? false : true}
										name="vinculacion"
										onChange={(e) => actualizarChecks(e, banner._id)}
										checked={banner.vincularCategoria}
									/>
								</div>
								<div className="d-inline mr-4">
									<h6 className="d-inline mr-2 checktitle">Mostrar productos:</h6>
									<Checkbox
										className="check-check"
										disabled={banner.categoria.length !== 0 ? false : true}
										name="mostrarProductos"
										onChange={(e) => actualizarChecks(e, banner._id)}
										checked={banner.mostrarProductos}
									/>
								</div>
								<div className="d-inline mr-4">
									<h6 className="d-inline mr-2 checktitle">Mostrar titulo:</h6>
									<Checkbox
										className="check-check"
										disabled={banner.categoria.length !== 0 ? false : true}
										name="mostrarTitulo"
										onChange={(e) => actualizarChecks(e, banner._id)}
										checked={banner.mostrarTitulo}
									/>
								</div>
							</div>
						</div>
					}
				/>
			</List.Item>
		);
	};

	return (
		<Spin size="large" spinning={loading}>
			<p className="text-center font-weight-bold" style={{ fontSize: 20 }}>
				Publicidad
			</p>
			<p className="text-center" style={{ fontSize: 15 }}>
				En este apartado puedes subir una sección completa con un banner y los productos de una categoria en
				especial en la pagina principal.
			</p>
            <div className="d-flex justify-content-center">
                <Alert showIcon icon={<ThunderboltOutlined style={{fontSize: 20}} />} message="¡Puedes editar mas rapido los checkbox con solo hacer clic sobre ellos!" type="info" />
            </div>
			<div className="d-flex justify-content-end mt-3">
				<RegistroPublicidad
					reload={[ reload, setReload ]}
					modalVisible={[ visible, setVisible ]}
                    bannerSeleccionado={bannerSeleccionado}
                    control={[ control, setControl ]}
				/>
			</div>
			<div>
				<List dataSource={bannerBD} renderItem={(banner) => <ListaBanners banner={banner} />} />
			</div>
		</Spin>
	);
}
