import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import './sidebar.scss';
import {
	FundOutlined,
	AppstoreAddOutlined,
	FormOutlined,
	PoweroffOutlined,
	TagOutlined,
	ShoppingCartOutlined,
	NotificationOutlined,
	PercentageOutlined,
	PictureOutlined,
	EditOutlined,
	HomeOutlined,
	TeamOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const token = localStorage.getItem('token');
const rol = parseJwt(token);

function parseJwt(token) {
	try {
		return JSON.parse(atob(token.split('.')[1]));
	} catch (e) {
		return null;
	}
}

const Sidebar = (props) => {
	return (
		<Sider
			style={{ height: '100vh' }}
			breakpoint="lg"
			collapsedWidth="0"
			onBreakpoint={(broken) => {
				/* console.log(broken); */
			}}
			onCollapse={(collapsed, type) => {
				/* console.log(collapsed, type); */
			}}
		>
			<div>
				<div className="ml-1">
					<h6 className="text-white">Bienvenido</h6>
					{token ? <h5 className="text-white">{rol['nombre']}</h5> : <div />}
				</div>
			</div>
			<Menu theme="dark" mode="inline" defaultSelectedKeys={[ window.location.pathname ]}>
				<Menu.Item key="/admin" icon={<FundOutlined />}>
					Panel principal<Link to="/admin" />
				</Menu.Item>
				<Menu.Item key="/admin/clientes" icon={<TeamOutlined />}>
					Clientes<Link to="/admin/clientes" />
				</Menu.Item>
				<Menu.Item key="/admin/productos" icon={<AppstoreAddOutlined />}>
					Productos<Link to="/admin/productos" />
				</Menu.Item>
				<Menu.Item key="/admin/inventario" icon={<FormOutlined />}>
					Inventario<Link to="/admin/inventario" />
				</Menu.Item>
				<Menu.Item key="/admin/sistema_apartado" icon={<TagOutlined />}>
					Sistema de Apartado<Link to="/admin/sistema_apartado" />
				</Menu.Item>
				<Menu.Item key="/admin/pedidos" icon={<ShoppingCartOutlined />}>
					Pedidos Pendientes<Link to="/admin/pedidos" />
				</Menu.Item>
				<Menu.Item key="/admin/promociones" icon={<PercentageOutlined />}>
					Promociones<Link to="/admin/promociones" />
				</Menu.Item>
				<Menu.Item key="/admin/sugerencias" icon={<NotificationOutlined />}>
					Sugerencias de compra<Link to="/admin/sugerencias" />
				</Menu.Item>
				<Menu.Item key="/admin/carousel" icon={<PictureOutlined />}>
					Banner principal<Link to="/admin/carousel" />
				</Menu.Item>
				<Menu.Item key="/admin/publicidad" icon={<PictureOutlined />}>
					Publicidad<Link to="/admin/publicidad" />
				</Menu.Item>
				<Menu.Item key="/admin/blog" icon={<EditOutlined />}>
					Blog<Link to="/admin/blog" />
				</Menu.Item>
				<Menu.Item icon={<HomeOutlined />}>
					Pagina principal<Link to="/" />
				</Menu.Item>
				<Menu.Item icon={<PoweroffOutlined />}>
					<Button
						type="primary"
						onClick={() => {
							localStorage.removeItem('token');
							props.history.push('/');
						}}
						danger
					>
						Cerrar Sesión
					</Button>
				</Menu.Item>
			</Menu>
		</Sider>
	);
};

export default withRouter(Sidebar);
