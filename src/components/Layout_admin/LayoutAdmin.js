import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Sidebar from '../Navegacion_Admin/Sidebar';
import { Layout, Breadcrumb } from 'antd';
import './layoutAdmin.scss';
import { BannerProvider } from '../../context/admincontext';

export default function LayoutAdmin(props) {
	const { routes } = props;
	const { Header, Content } = Layout;
	const path = window.location.pathname.split('/');

	return (
		<Fragment>
			<Layout>
				<Sidebar />
				<Layout className="site-layout">
					<Header className="breadcrumb-head site-layout-background bg-white" style={{ padding: 0 }}>
						<Breadcrumb style={{ margin: '16px 16px' }}>
							<Breadcrumb.Item>{path[1]}</Breadcrumb.Item>
							<Breadcrumb.Item>{path[2]}</Breadcrumb.Item>
							<Breadcrumb.Item>{path[3]}</Breadcrumb.Item>
						</Breadcrumb>
					</Header>
					<BannerProvider>
						<Content style={{ margin: '24px 16px 0' }}>
							<div className="site-layout-background bg-white" style={{ padding: 24, minHeight: 360 }}>
								<LoadRoutes routes={routes} />
							</div>
						</Content>
					</BannerProvider>
				</Layout>
			</Layout>
		</Fragment>
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
