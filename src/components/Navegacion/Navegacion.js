import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Button, Input, Drawer, Badge, Avatar, Spin, Divider } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import * as firebase from 'firebase/app';
import './navegacion.scss';
import 'firebase/auth';
import 'firebase/firestore';
import { SearchOutlined, MenuOutlined, ShoppingOutlined , SettingOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import clienteAxios from '../../config/axios';
import RightMenu from './RightMenu';
import { MenuContext } from '../../context/carritoContext';
import aws from '../../config/aws';
import './navegacion.scss';
// import '../Categorias/preloading.scss'
import Categorias from '../../components/Categorias/Categorias';


const { Search } = Input;
const { Header } = Layout;
const { SubMenu } = Menu;

const Navegacion = (props) => {
	const { active, setActive } = useContext(MenuContext);
	const { loading, setLoading } = useContext(MenuContext);
	const [ visible, setVisible ] = useState(false);
	const [ busqueda, setBusqueda] = useState("")
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

	useEffect(() => {
		setLoading(true);
	}, [])

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

	console.log(loading);

	function valor(e) {
		setBusqueda(e.target.value);
	}

	return (
		<div>
		<Layout className="layout navbar-menu-general a00">
			<Header className=" a1">
				<div className="menuCon a2">
					<div className="top-menu row a3 container-prin">
						<div className="col-lg-12 container-pages a4">
							<Menu
								className="navbar-menu-sesion float-right nav-font-pages a5 font-nav"
								/* theme="light" */
								mode="horizontal"
								defaultSelectedKeys={[ window.location.pathname ]}
								inlineindent={0}
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
							</Menu>
						</div>
					</div>
				</div>
			</Header>
		</Layout>
		
		{/* DIVISOR PARA EL INPUT  */}

		<Layout className="layout  a0">
			<Header className=" a1">
				<div className="menuCon a2">
					<div className="top-menu row a3">
						<div className="col-lg-2 row-logo-search">
							<div className="row row-logo-search-2">
									{!tienda.imagenLogo ? (
										<div className="d-none" />
									) : (
										// <div className="">
											<Link to="/">
												<div className="contenedor-logo">
													<img
														className="imagen-logo-principal"
														alt="logotipo-tienda"
														src={aws + tienda.imagenLogo}
													/>
												</div>
											</Link>
										// </div>
									)}
								{/* <div className="col-lg-8 row input-search">
									<Input
										onChange={valor}
										className="input-search border-color-search-input"
									/>
									
									<Button
										onClick={(value) => props.history.push(`/searching/${busqueda}`)}
										className="boton-search border-color-search-boton"
									>
										<SearchOutlined style={{fontSize: 25}}/>
									</Button>
								</div> */}
							</div>
						</div>

						{/* INICIO DE AVATAR, TU CARRITO Y ENTRAR  */}
						<div className="col-lg-6 containe-categorias mt-2">
							<Categorias />
						</div>
						<div className="col-lg-4 row a4 mt-2 d-flex justify-content-end">
							<div className="containe-categorias d-flex align-items-center">
								<Search
									placeholder="¿Qué estás buscando?"
									onSearch={(value) => props.history.push(`/searching/${value}`)}
									className="search-navbar "
								/>
							</div>
							<div>
								<Menu
									className="float-right navbar-menu-sesion a50"
									/* theme="light" */
									mode="horizontal"
									defaultSelectedKeys={[ window.location.pathname ]}
									inlineindent={0}
								>
									
									{!decoded || decoded.rol === true ? (
										<Menu.Item key="" className="d-none" />
									) : (
										<Menu.Item className="nav-font-color-sesion a6" key="/shopping_cart">
											<div className="centrar-nav mt-2" >
												<Badge count={carrito}>
													<ShoppingOutlined style={{ fontSize: 25 }} />
													<Link to="/shopping_cart" />
												</Badge>
											</div>
										</Menu.Item>
									)}
									{token && decoded['rol'] === false ? (
										<SubMenu
											className="nav-font-color-sesion a6"
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
										{/* Mis compras dentro del menu peque;o */}
											{!decoded || decoded.rol === true ? (
												<Menu.Item key="" className="d-none" />
											) : (
												<Menu.Item className="nav-font-color-sesion a6 font-foot" key="/pedidos">
													
													<ShoppingOutlined style={{ fontSize: 15 }} />Mis compras
													<Link to="/pedidos" />
												</Menu.Item>
											)}
											<Menu.Item key="" className="nav-font-color-sesion font-foot">
												<SettingOutlined />Mi cuenta<Link to="/perfiles" />
											</Menu.Item>
											<Menu.Item>
												<div
													className="text-danger centrar-nav font-foot"
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
											<Menu.Item key="" className="font-foot a6">
												<SettingOutlined />Panel de administrador<Link to="/admin" />
											</Menu.Item>
											<Menu.Item key="" className=" a6">
												<div
													className="text-danger centrar-nav font-foot"
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
										<Menu.Item key="" className="d-none" />
									)}
									{token === '' || token === null ? (
										<Menu.Item key="" className="nav-font-color-sesion nav-border-color a6">
											<div className="centrar-nav" ><UserOutlined style={{fontSize: 27}}/></div>
											<Link to="/entrar" />
										</Menu.Item>
									) : (
										<Menu.Item key="" className="d-none" />
									)}
								</Menu>
							</div>
						</div>
						{/* FIN DE AVATAR, TU CARRITO Y ENTRAR y todo lo del frente  */}

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
										<ShoppingOutlined className="menu-responsivo-icon" style={{ fontSize: 28 }} />
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

		{/* <Layout className="layout navbar-menu-general a00">
			<Header className="navbar-menu-general a1">
				<div className="menuCon navbar-menu-general a2">
					<div className="top-menu row a3 container-prin">
						<div className="col-lg-12 containe-categorias">
							<Categorias />
						</div>
					</div>
				</div>
			</Header>
		</Layout> */}

		</div>
	);
};

export default withRouter(Navegacion);
