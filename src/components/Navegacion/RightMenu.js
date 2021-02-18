import React from 'react';
import { Menu, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase/app';
import './navegacion.scss';
import 'firebase/auth';
import 'firebase/firestore';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import aws from '../../config/aws';

const { SubMenu } = Menu;

function RightMenu(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);
	const { ofertas, tienda } = props;

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	return (
		<Menu defaultSelectedKeys={[ window.location.pathname ]} className="navbar-menu-general font-foot">
			<Menu.Item key="/" className="navbar-menu-general nav-font-color">
				Inicio<Link to="/" />
			</Menu.Item>
			<Menu.Item key="/productos" className="navbar-menu-general nav-font-color">
				Productos<Link to="/productos" />
			</Menu.Item>
			{ofertas.length ? (
				<Menu.Item key="/ofertas" className="navbar-menu-general nav-font-color">
					Ofertas<Link to="/ofertas" />
				</Menu.Item>
			) : (
				<Menu.Item className="d-none" />
			)}
			<Menu.Item key="/blog" className="navbar-menu-general nav-font-color">
				Blog<Link to="/blog" />
			</Menu.Item>
			{tienda.length === 0 ? (
				<Menu.Item className="d-none" />
			) : (
				<Menu.Item key="/quienes_somos" className="navbar-menu-general nav-font-color">
					Quiénes somos<Link to="/quienes_somos" />
				</Menu.Item>
			)}
			{!decoded || decoded.rol === true ? (
				<Menu.Item className="d-none" />
			) : (
				<Menu.Item key="/pedidos" className="navbar-menu-general nav-font-color">
					Mis pedidos<Link to="/pedidos" />
				</Menu.Item>
			)}
			{token && decoded['rol'] === false ? (
				<SubMenu
					className="nav-font-color nav-border-color"
					icon={
						!decoded.imagen && !decoded.imagenFireBase ? (
							<Avatar size="large" style={{ backgroundColor: '#87d068' }}>
								<p>{decoded.nombre.charAt(0)}</p>
							</Avatar>
						) : decoded.imagenFireBase ? (
							<Avatar size="large" src={decoded.imagenFireBase} />
						) : (
							<Avatar
								size="large"
								src={aws+decoded.imagen}
							/>
						)
					}
				>
					<Menu.Item className=" nav-border-color">
						<SettingOutlined />Mi cuenta<Link to="/perfiles" />
					</Menu.Item>
					<Menu.Item>
						<p
							className="text-danger"
							onClick={() => {
								localStorage.removeItem('token');
								firebase.auth().signOut();
								setTimeout(() => {
									window.location.reload();
								}, 1000);
							}}
						>
							<LogoutOutlined />Cerrar Sesión
						</p>
					</Menu.Item>
				</SubMenu>
			) : decoded && decoded['rol'] === true ? (
				<SubMenu
					className="nav-font-color nav-border-color"
					icon={
						!decoded.imagen ? (
							<Avatar size="large" style={{ backgroundColor: '#87d068' }}>
								<p>{decoded.nombre.charAt(0)}</p>
							</Avatar>
						) : (
							<Avatar
								size="large"
								src={aws+decoded.imagen}
							>
								{/* <p>{decoded.nombre.charAt(0)}</p> */}
							</Avatar>
						)
					}
				>
					<Menu.Item className=" nav-border-color">
						<SettingOutlined />Panel de administrador<Link to="/admin" />
					</Menu.Item>
					<Menu.Item className="nav-font-color nav-border-color">
						<p
							className="text-danger"
							onClick={() => {
								localStorage.removeItem('token');
								firebase.auth().signOut();
								setTimeout(() => {
									window.location.reload();
								}, 1000);
							}}
						>
							<LogoutOutlined />Cerrar Sesión
						</p>
					</Menu.Item>
				</SubMenu>
			) : (
				<Menu.Item className="d-none" />
			)}

			{token === '' || token === null ? (
				<Menu.Item className="navbar-menu-general nav-font-color">
					Entrar<Link to="/entrar" />
				</Menu.Item>
			) : (
				<Menu.Item className="d-none" />
			)}
		</Menu>
	);
}

export default RightMenu;
