import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import { MenuProvider } from '../../context/carritoContext';
import Navegacion from '../../components/Navegacion/Navegacion';
import Categorias from '../Categorias/Categorias';
import FooterPage from '../../components/Footer/Footer';
import './layout.scss';

export default function LayoutBasic(props) {
	const { routes } = props;
	const { Content, Footer } = Layout;

	return (
		<div className="body">
			<Layout>
				<div className="cuerpo bg-layout">
					<Layout>
						<MenuProvider>
							<Navegacion />
							<Categorias />
							<Content style={{ height: 'auto' }} className="bg-layout">
								<div className="site-layout-content flex">
									<LoadRoutes routes={routes} />
								</div>
							</Content>
						</MenuProvider>
					</Layout>
				</div>
				<Footer className="foot" style={{ margin: 0, padding: 0 }}>
					<FooterPage style={{ margin: 0, padding: 0 }} />
				</Footer>
			</Layout>
		</div>
	);
}

function LoadRoutes({ routes }) {
	return (
		<Switch>
			{routes.map((route, index) => (
				<Route key={index} path={route.path} exact={route.exact} component={route.component} />
			))}
		</Switch>
	);
}
