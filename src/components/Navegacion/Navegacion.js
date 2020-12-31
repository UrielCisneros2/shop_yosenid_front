import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Button, Input, Drawer, Badge, Avatar, Spin } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import * as firebase from 'firebase/app';
import './navegacion.scss';
import 'firebase/auth';
import 'firebase/firestore';
import { MenuOutlined, ShoppingCartOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import clienteAxios from '../../config/axios';
import RightMenu from './RightMenu';
import { MenuContext } from '../../context/carritoContext';
import aws from '../../config/aws';

const { Search } = Input;
const { Header } = Layout;
const { SubMenu } = Menu;

const Navegacion = (props) => {
	const { active, setActive } = useContext(MenuContext);
	const { loading, setLoading } = useContext(MenuContext);
	const [ visible, setVisible ] = useState(false);
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	const [ tienda, setTienda ] = useState([]);
	const [ carrito, setCarrito ] = useState(0);
	const [ ofertas, setOfertas ] = useState([]);

	useEffect(
		() => {
			setActive(true);
			obtenerOfertas();
			obtenerQuienesSomos();
			if (token) {
				obtenerCarrito();
			}
		},
		[ token, active ]
	);

	async function obtenerCarrito() {
		await clienteAxios
			.get(`/carrito/${decoded._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				const nuevo = res.data.articulos.map((res) => {
					if (res.idarticulo.activo === false) {
						return [];
					}else if (res.idarticulo.eliminado && res.idarticulo.eliminado === true) {
						return [];
					} else {
						return res;
					}
				});
				const carrito = nuevo.filter((arr) => arr.length !== 0);
				setCarrito(carrito.length);
			})
			.catch((res) => {
				setCarrito(0);
			});
	}
	async function obtenerQuienesSomos() {
		await clienteAxios
			.get('/tienda')
			.then((res) => {
				res.data.forEach((datos) => {
					setTienda(datos);
				});
			})
			.catch((res) => {});
	}
	async function obtenerOfertas() {
		await clienteAxios
			.get('/productos/promocion')
			.then((res) => {
				setOfertas(res.data);
			})
			.catch((res) => {});
	}

	const showDrawer = () => {
		setVisible(true);
	};
	const onClose = () => {
		setVisible(false);
	};

	if (loading) {
		return (
			<div className="preloading">
				<div className="contenedor-preloading">
					<Spin size="large" tip="Cargando la tienda..." className="spiner" />
				</div>
			</div>
		);
	}

	return (
		<Layout className="layout navbar-menu-general a0">
			<Header className="navbar-menu-general a1">
				<div className="menuCon navbar-menu-general a2">
					<div className="top-menu row a3">
						<div className="col-lg-4 row-logo-search">
							<div className="row row-logo-search-2">
								{!tienda.imagenLogo ? (
									<div className="d-none" />
								) : (
									<div className="col-lg-4">
										<Link to="/">
											<div className="contenedor-logo">
												<img
													className="imagen-logo-principal"
													alt="logotipo-tienda"
													src={aws + tienda.imagenLogo}
												/>
											</div>
										</Link>
									</div>
								)}
								<div className="col-lg-8">
									<Search
										placeholder="¿Qué estás buscando?"
										onSearch={(value) => props.history.push(`/searching/${value}`)}
										className="search-navbar"
									/>
								</div>
							</div>
						</div>
						<div className="col-lg-8 nav-menu-enlaces a4 ">
							<Menu
								className="float-right navbar-menu-general a5"
								/* theme="light" */
								mode="horizontal"
								defaultSelectedKeys={[ window.location.pathname ]}
								inlineIndent={0}
							>
								<Menu.Item className="nav-font-color nav-border-color a6" key="/">
									<div className="centrar-nav" >Inicio</div>
									<Link to="/" />
								</Menu.Item>
								<Menu.Item className="nav-font-color nav-border-color a6" key="/productos">
									<div className="centrar-nav" >Productos</div>
									<Link to="/productos" />
								</Menu.Item>
								{ofertas.length ? (
									<Menu.Item className="nav-font-color nav-border-color a6" key="/ofertas">
										<div className="centrar-nav" >Ofertas</div>
										<Link to="/ofertas" />
									</Menu.Item>
								) : (
									<Menu.Item className="d-none" />
								)}
								<Menu.Item className="nav-font-color nav-border-color a6" key="/blog">
									<div className="centrar-nav" >Blog</div>
									<Link to="/blog" />
								</Menu.Item>
								{tienda.length === 0 ? (
									<Menu.Item className="d-none" />
								) : (
									<Menu.Item className="nav-font-color nav-border-color a6" key="/quienes_somos">
										<div className="centrar-nav" >Quiénes somos</div>
										<Link to="/quienes_somos" />
									</Menu.Item>
								)}
								{!decoded || decoded.rol === true ? (
									<Menu.Item className="d-none" />
								) : (
									<Menu.Item className="nav-font-color nav-border-color a6" key="/pedidos">
										<div className="centrar-nav" >Mis compras</div>
										<Link to="/pedidos" />
									</Menu.Item>
								)}
								{!decoded || decoded.rol === true ? (
									<Menu.Item className="d-none" />
								) : (
									<Menu.Item className="nav-font-color nav-border-color a6" key="/shopping_cart">
										<div className="centrar-nav" >
											<Badge count={carrito}>
												<ShoppingCartOutlined style={{ fontSize: 25 }} />
												<Link to="/shopping_cart" />
											</Badge>
										</div>
									</Menu.Item>
								)}
								{token && decoded['rol'] === false ? (
									<SubMenu
										className="nav-font-color a6"
										icon={
											!decoded.imagen && !decoded.imagenFireBase ? (
												<Avatar size="large" style={{ backgroundColor: '#87d068' }}>
													<p>{decoded.nombre.charAt(0)}</p>
												</Avatar>
											) : decoded.imagenFireBase ? (
												<Avatar size="large" src={decoded.imagenFireBase} />
											) : (
												<Avatar size="large" src={aws + decoded.imagen} />
											)
										}
									>
										<Menu.Item className="">
											<SettingOutlined />Mi cuenta<Link to="/perfiles" />
										</Menu.Item>
										<Menu.Item>
											<div
												className="text-danger centrar-nav"
												onClick={() => {
													localStorage.removeItem('token');
													firebase.auth().signOut();
													setTimeout(() => {
														window.location.reload();
													}, 1000);
												}}
											>
												<LogoutOutlined />Cerrar Sesión
											</div>
										</Menu.Item>
									</SubMenu>
								) : decoded && decoded['rol'] === true ? (
									<SubMenu
										className="nav-font-color nav-border-color a6"
										icon={
											!decoded.imagen ? (
												<Avatar size="large" style={{ backgroundColor: '#87d068' }}>
													<p>{decoded.nombre.charAt(0)}</p>
												</Avatar>
											) : (
												<Avatar size="large" src={aws + decoded.imagen}>
													{/* <p>{decoded.nombre.charAt(0)}</p> */}
												</Avatar>
											)
										}
									>
										<Menu.Item className=" a6">
											<SettingOutlined />Panel de administrador<Link to="/admin" />
										</Menu.Item>
										<Menu.Item className=" a6">
											<div
												className="text-danger centrar-nav"
												onClick={() => {
													localStorage.removeItem('token');
													firebase.auth().signOut();
													setTimeout(() => {
														window.location.reload();
													}, 1000);
												}}
											>
												<LogoutOutlined />Cerrar Sesión
											</div>
										</Menu.Item>
									</SubMenu>
								) : (
									<Menu.Item className="d-none" />
								)}

								{token === '' || token === null ? (
									<Menu.Item className="nav-font-color nav-border-color a6">
										<div className="centrar-nav" >Entrar</div>
										<Link to="/entrar" />
									</Menu.Item>
								) : (
									<Menu.Item className="d-none" />
								)}
							</Menu>
						</div>
					</div>
					<div className="top-menu-responsive">
						<Button type="link" className="barsMenu" onClick={showDrawer}>
							<MenuOutlined className="menu-responsivo-icon" style={{ fontSize: 22 }} />
						</Button>
						<Search
							className="search-nav-responsive"
							placeholder="input search text"
							onSearch={(value) => props.history.push(`/searching/${value}`)}
						/>
						{!decoded || decoded.rol === true ? (
							<div className="d-none" />
						) : (
							<div className="mx-4">
								<Badge count={carrito}>
									<Link to="/shopping_cart">
										<ShoppingCartOutlined className="menu-responsivo-icon" style={{ fontSize: 28 }} />
									</Link>
								</Badge>
							</div>
						)}
					</div>
					<Drawer
						className="drawer-background"
						title={
							!tienda.imagenLogo ? (
								<div className="d-none" />
							) : (
								<div className="contenedor-logo">
									<Link to="/">
										<img
											className="imagen-logo-principal"
											alt="logotipo-tienda"
											src={aws + tienda.imagenLogo}
										/>
									</Link>
								</div>
							)
						}
						placement="left"
						closable={false}
						onClose={onClose}
						visible={visible}
					>
						<RightMenu ofertas={ofertas} tienda={tienda} />
					</Drawer>
				</div>
			</Header>
		</Layout>
	);
};

export default withRouter(Navegacion);
