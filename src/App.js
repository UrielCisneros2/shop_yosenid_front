import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from './config/routes';
import { Helmet } from 'react-helmet';
import './scss/disenoUno.scss';
import { MenuProvider } from './context/carritoContext';


export default function App() {
	return (
		<div>
			<Helmet>
				<meta charSet="utf-8" />
				<title>Diseno Uno</title>
			</Helmet>
			<MenuProvider>
				<Router>
					<Switch>{routes.map((route, index) => <RoutesWithSubRoutes key={index} {...route} />)}</Switch>
				</Router>
			</MenuProvider>
		</div>
	);
}

function RoutesWithSubRoutes(route) {
	return (
		<Route
			path={route.path}
			exact={route.exact}
			render={(props) => <route.component routes={route.routes} {...props} />}
		/>
	);
}
