import React from 'react';
import { Tabs } from 'antd';
import PromocionesNormales from './promos_normales/promociones';
import PromoMasivaPrincipal from './promos_masivas/promo_masiva';

const { TabPane } = Tabs;

export default function Promociones() {
	return (
		<div className="card-container">
			<div className="mb-4">
                <p className="text-center font-weight-bold" style={{ fontSize: 20 }}>
                    SISTEMA DE PROMOCIONES
                </p>
                <p className="text-center" style={{ fontSize: 15 }}>
                    En este apartado puedes agregar ofertas especiales a tu producto y aparecer en la página principal
                </p>
            </div>
			<Tabs centered>
				<TabPane tab="Promociones individuales" key="1">
					<PromocionesNormales />
				</TabPane>
				<TabPane tab="Promociones masivas" key="2">
					<PromoMasivaPrincipal />
				</TabPane>
				{/* <TabPane tab="Promociones unitarias" key="3">
					<p>Content of Tab Pane 3</p>
					<p>Content of Tab Pane 3</p>
					<p>Content of Tab Pane 3</p>
				</TabPane> */}
			</Tabs>
		</div>
	);
}
