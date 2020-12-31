import React, { useState, useEffect } from 'react'
import clienteAxios from '../../config/axios';
import { Link } from 'react-router-dom';
import {  Button,  Layout} from 'antd';

import {FacebookFilled, InstagramFilled, TwitterCircleFilled, UserOutlined, KeyOutlined } from '@ant-design/icons';
import './footer.scss';
import '../../scss/variables.scss'

 const { Footer } = Layout;
const Style = {fontSize:15};



const FooterPage = () => {

    const [face, setFace] = useState('')
    const [insta, setInsta] = useState('')
    const [twitter, setTwitter] = useState('')
    const [imagenCorp, setImagenCorp] = useState('')
    const [nombreCorp, setNombreCorp] = useState('')
    const [politicas, setPoliticas] = useState('')
    const [telefono, setTelefono] = useState('')
    const [accion, setAccion] = useState(false)

    

    function peticionRedes(){
		clienteAxios.get('/tienda/')
			.then((res) => {
                if(res.data[0]){
                    setImagenCorp(res.data[0].imagenCorp)
                    setNombreCorp(res.data[0].nombre)
                    setPoliticas(res.data[0].politicas)
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

    useEffect(() => {
        peticionRedes();
        setAccion(false)
    }, []);
    



    return(
       
         <Layout className="layout">
             <Footer className="bg-footer" >
                <div end="xs" id="foot"  className="row footer-font-color">  
                    <div className="col-lg-9 text-lg-left text-center footer-font-color">
                        <div className="footer-border footer-font-color">
                            {imagenCorp !== '' ? (
                                <Link  to="/quienes_somos" >
                                    <Button className="footer-font-color" id="is" type="link" style={Style} ><UserOutlined className="footer-font-color" style={{fontSize: 17}}/>
                                        Conócenos
                                    </Button>
                                </Link>
                            ): ""}

                            {politicas !== '' ? (
                                <Link  to="/politicas">
                                    <Button className="footer-font-color" id="is" type="link" style={Style} ><KeyOutlined className="footer-font-color" style={{fontSize: 17}}/>
                                        Aviso de Privacidad
                                    </Button>
                                </Link>
                            ): ""}
                        </div>

                        <div className="mt-2 p-3 font-color-footer">
                            <h2 className="footer-font-color" style={{fontSize: 18}} >{nombreCorp !== '' ? nombreCorp : ""}</h2>
                            {telefono !== '' ? (<p className="footer-font-color">Teléfono: {telefono} </p>): ""}
                        </div>
                    </div>

                    <div className="col-lg-3 p-3" style={{textAlign:"center"}}>
                        {accion ? (<p style={{fontSize: 30, }}>Buscanos en:</p>):""}
                        

                        {face !== '' ? 
                            (
                            <a href={face} target="_blank" rel="noopener noreferrer">
                                <FacebookFilled  id="is" style={{fontSize: 45, color:"gray"}} />
                            </a>
                            ):('')
                        
                        }
                        {insta !== '' ? 
                            (
                            <a href={insta} target="_blank" rel="noopener noreferrer">
                                <InstagramFilled  id="is" style={{fontSize: 45, color:"gray"}} />
                            </a>
                            ):('')
                        }
                        
                        {twitter !== '' ? 
                            (
                            <a href={twitter} target="_blank" rel="noopener noreferrer">
                                <TwitterCircleFilled  id="is" style={{fontSize: 45, color:"gray"}} />
                            </a>
                            ):('')
                        }
                        
                    </div>
                </div>
             {/* <p style={{textAlign:"center"}}>Ant Design ©2018 Created by Ant UED</p> */}
             </Footer>
         </Layout>
    )
}

export default FooterPage;
