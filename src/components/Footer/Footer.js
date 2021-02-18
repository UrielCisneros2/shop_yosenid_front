import React, { useState, useEffect } from 'react'
import clienteAxios from '../../config/axios';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import {  Button,  Layout} from 'antd';
import aws from '../../config/aws';
import jwt_decode from 'jwt-decode';

import {FacebookFilled, InstagramFilled,
        TwitterCircleFilled, UserOutlined, KeyOutlined, 
        PhoneOutlined, SettingOutlined 
        } from '@ant-design/icons';
import './footer.scss';
import '../../scss/variables.scss'

const { Footer } = Layout;



const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

const FooterPage = (props) => {
    const [face, setFace] = useState('')
    const [insta, setInsta] = useState('')
    const [twitter, setTwitter] = useState('')
    const [imagenCorp, setImagenCorp] = useState('')
    // const [nombreCorp, setNombreCorp] = useState('')
    const [politicas, setPoliticas] = useState('')
    const [telefono, setTelefono] = useState('')
    const [tienda, setTienda] = useState([])
    const [ direccion, setDireccion ] = useState({});
    const [accion, setAccion] = useState(false)

	const [ categorias, setCategorias ] = useState([]);

    function peticionRedes(){
		clienteAxios.get('/tienda/')
			.then((res) => {
                
                if(res.data[0]){
                    setImagenCorp(res.data[0].imagenCorp)
                    setTienda(res.data[0])
                    setDireccion(res.data[0].direccion[0])
                    setTelefono(res.data[0].telefono)
                    if(res.data[0].linkFace !== 'undefined' && res.data[0].linkFace !== ''){
                        setFace(res.data[0].linkFace);
                        setAccion(true);
                    }
                    if(res.data[0].linkInsta !== 'undefined' && res.data[0].linkInsta !== ''){
                        setInsta(res.data[0].linkInsta);
                        setAccion(true);
                    }
                    if(res.data[0].linkTweeter !== 'undefined' && res.data[0].linkTweeter !== ''){
                        setTwitter(res.data[0].linkTweeter);
                        setAccion(true);
                    }
                }
			})
			.catch((err) => {
               
			});
    }

    async function obtenerCategorias() {
		await clienteAxios
			.get('/productos/filtrosNavbar', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
                setCategorias(res.data);
				window.scrollTo(0, 0);
			})
			.catch((res) => {
                console.log(res);
			});
	}

    useEffect(() => {
        peticionRedes();
        setAccion(false)
        obtenerCategorias();
    }, []);

    const categorias_foot = categorias.map((categoria, index) => {
        if(index <= 14){
            return (
                    <Button 
                        type="link"
                        className="footer-font-color"
                        key={categoria.categoria}
                    >
                        <Link className="font-foot" to={(`/filtros/null/${categoria.categoria}/null/null`)}> 
                            {categoria.categoria}
                        </Link>
                    </Button>
              
            )
        }
    });
    

    return(
       
         <Layout className="layout">
             <Footer className="bg-footer" >
                <div end="xs" id="foot">  
                    <div className="row footer-font-color">
                        <div className="col-lg-3  d-sm-text-center">
                            {tienda.imagenLogo !== '' && tienda.imagenLogo ?
                            <div className="contenedor-logo">
                                <div className="logos"> 
                                    <img
                                        className="logotipo"
                                        alt="imagen de base"
                                        src={aws+tienda.imagenLogo}
                                    />
                                </div>
                            </div>
                            : ""}
                            {/* <h6>{tienda.nombre !== '' ? tienda.nombre : ""}</h6> */}
                            {telefono !== '' && telefono ? 
                            <div className="row mt-3">
                                <PhoneOutlined className="mt-1" style={{fontSize: 55, marginLeft: 5}} />
                                <div className="px-3 mt-2">
                                    <p className="font-foot">¿Tienes preguntas? ¡Contáctanos!:</p> 
                                    {telefono !== '' ? (<h1 className="footer-font-color" style={{fontSize: 20}}>{telefono} </h1>): ""}
                                </div>
                            </div>
                            : ""}

                            <div className="mt-3 font-foot">

                                {accion ? (<p style={{fontWeight: "bold"}}>Datos de contacto:</p>):""}
                                {direccion.calle_numero !== '' && direccion.calle_numero ? (
                                    <div>
                                        <p>{direccion.calle_numero}, Col. {direccion.colonia}, </p>
                                        <p>{direccion.ciudad}, {direccion.estado}</p>
                                    </div>
                                ) : ""}

                                <div className="mt-3">

                                {face !== '' ? 
                                    (
                                    <a href={face} target="_blank" rel="noopener noreferrer">
                                        <FacebookFilled  id="is" style={{fontSize: 33, color:"gray"}} />
                                    </a>
                                    ):('')
                                
                                }
                                {insta !== '' ? 
                                    (
                                    <a href={insta} target="_blank" rel="noopener noreferrer">
                                        <InstagramFilled  id="is" style={{fontSize: 33, color:"gray"}} />
                                    </a>
                                    ):('')
                                }
                                
                                {twitter !== '' ? 
                                    (
                                    <a href={twitter} target="_blank" rel="noopener noreferrer">
                                        <TwitterCircleFilled  id="is" style={{fontSize: 33, color:"gray"}} />
                                    </a>
                                    ):('')
                                }
                                </div>
                            </div>
                        </div>
                        {tienda.diasHorariosEmpresas !== '' && tienda.diasHorariosEmpresas !== "undefined" ? (
                            <div className="col-lg-3 mt-4">
                                <div className="container">
                                    <p className="font-foot">
                                        <span className="font-weight-bold">Horarios de Atención:</span>
                                        <p dangerouslySetInnerHTML={{__html: tienda.diasHorariosEmpresas}}/>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            null
                        )}
                        <div className="col-lg-4 mt-lg-4 d-none d-lg-block">
                            <p className="font-foot" style={{fontWeight: "bold"}}>Encuéntralo más rápido</p>
                            <div style={{columnCount: 2}}>
                                <div >
                                    {categorias_foot}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 mt-4 d-none d-lg-block" style={{columnCount: 1}}>
                           <p className="font-foot" style={{fontWeight: "bold"}}>Atención al cliente</p>
                           {imagenCorp !== '' ? (
                                <Link  to="/quienes_somos" >
                                    <Button className="footer-font-color font-foot" id="is" type="link" ><UserOutlined className="footer-font-color"/>
                                        Conócenos
                                    </Button>
                                </Link>
                            ): ""}

                            {tienda.politicas !== '' && tienda.politicas ? (
                                <HashLink to="/politicas#privacidad">
                                    <Button className="footer-font-color font-foot" id="is" type="link" ><KeyOutlined className="footer-font-color"/>
                                        Aviso de Privacidad
                                    </Button>
                                </HashLink>
                            ): ""}
                            {tienda.politicasDescuentos !== '' && tienda.politicasDescuentos ? (
                                <HashLink to="/politicas#descuento">
                                    <Button className="footer-font-color font-foot" id="is" type="link" ><KeyOutlined className="footer-font-color"/>
                                        Políticas de Descuento
                                    </Button>
                                </HashLink>
                            ): ""}
                            {tienda.politicasDevolucion !== '' && tienda.politicasDevolucion ? (
                                <HashLink to="/politicas#devolucion">
                                    <Button className="footer-font-color font-foot" id="is" type="link" ><KeyOutlined className="footer-font-color"/>
                                        Políticas de Devolución
                                    </Button>
                                </HashLink>
                            ): ""}
                            {tienda.politicasVentas !== '' && tienda.politicasVentas ? (
                                <HashLink to="/politicas#ventas">
                                    <Button className="footer-font-color font-foot" id="is" type="link" ><KeyOutlined className="footer-font-color"/>
                                        Políticas de Ventas
                                    </Button>
                                </HashLink>
                            ): ""}
                            {tienda.politicasEnvios !== '' &&  tienda.politicasEnvios? (
                                <HashLink to="/politicas#envios">
                                    <Button className="footer-font-color font-foot" id="is" type="link" ><KeyOutlined className="footer-font-color"/>
                                        Políticas de Envíos
                                    </Button>
                                </HashLink>
                            ): ""}


                            {token && decoded['rol'] === false ? (
                            <Link  to="/perfiles">
                                <Button className="footer-font-color font-foot" id="is" type="link" ><SettingOutlined className="footer-font-color"/>
                                    Mi cuenta
                                </Button>
                            </Link>
                            ) : 
                            (
                            <Link  to="/entrar">
                                <Button className="footer-font-color font-foot" id="is" type="link" ><SettingOutlined className="footer-font-color"/>
                                    Mi cuenta
                                </Button>
                            </Link>
                            )}
                        </div>
                    </div> 
                </div>
                {/* <div className="align-center">
                    <p className="text-center">© CAFI - All Rights Reserved - 2020</p>
                </div> */}
             </Footer>
         </Layout>
    )
}

export default FooterPage;
