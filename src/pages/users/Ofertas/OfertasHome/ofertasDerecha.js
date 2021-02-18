import React from 'react'
import { Tabs, Row } from 'antd';
import {  withRouter } from 'react-router-dom';
import OfertasHome from '../ofertasHome'


const { TabPane } = Tabs;

function  OfertasDerecha() {
    return (
		<div className="d-flex justify-content-center align-items-center">
        <Row gutter={10} style={{ maxWidth: '95vw' }} className=" mt-4">
            <div className="col-lg-12 mt-3">
                <OfertasHome orientacion="derecha" />
            </div>
        </Row>
        </div>
    )
}

export default withRouter( OfertasDerecha);