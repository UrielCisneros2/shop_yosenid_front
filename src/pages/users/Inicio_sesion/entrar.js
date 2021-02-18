import React, { useEffect } from 'react'
import Registro from '../Registro/registro'
import Login from '../Login/login'
import Firebase from '../../../components/Firebase/firebase'
import { Tabs, Divider } from 'antd'
import './entrar.scss'
import { withRouter } from 'react-router-dom'

const { TabPane } = Tabs;

function Entrar(props) {
    const token = localStorage.getItem('token')

    useEffect( () => {
        if(token){
            props.history.push('/')
        }
    })

    return(
        <div>
            <p className="font-descrip text-center mb-4 mt-4">
                Si aun no tienes cuenta regístrate dando click en <strong>Crear cuenta</strong>
            </p>
            <div className="tabs">
                <Tabs centered className=" shadow col-12 col-lg-4 bg-white rounded tabs-colors" defaultActiveKey="1">
                    <TabPane className="tab-color" tab="Iniciar Sesión" key="1">
                        <div className="mt-3">
                            <Login />
                        </div>
                        <Divider />
                        <div>
                            <p className="font-descrip">Accede con tu cuenta de Google o Facebook.</p>
                            <Firebase />
                        </div>
                    </TabPane>
                    <TabPane className="tab-color" tab="Crear cuenta" key="2">
                        <div className="mt-3">
                            <Registro />
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export default withRouter(Entrar)