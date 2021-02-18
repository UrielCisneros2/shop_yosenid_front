import React, { useState, useEffect } from 'react'
import clienteAxios from '../../../config/axios';
import {notification} from 'antd'
import Spin from '../../../components/Spin';

function Politicas() {

    const [ loading, setLoading ] = useState(false);
    const [politicas, setPoliticas] = useState([]);

    function peticionPoliticas(){
		clienteAxios.get('/tienda/')
			.then((res) => {
                setLoading(false);
                // if (res.data[0].politicas !== "") {
                setPoliticas(res.data[0]);
                console.log(res.data[0]);
			})
			.catch((err) => {
                if(err.response){
					notification.error({
						message: 'Error',
						description: err.response.data.message,
						duration: 2
					});
				}else{
					notification.error({
						message: 'Error de conexion',
						description: 'Al parecer no se a podido conectar al servidor.',
						duration: 2
					});
				}
			});
    }

    useEffect(() => {
        setLoading(true);
        peticionPoliticas();
    }, []);
    


    return(
        <Spin spinning={loading} >
            <div className="container">
                { politicas.politicas && politicas.politicas !== "" ? (
                    <div id="privacidad" className="m-5">
                        <p className="font-prin text-center mt-4">Politicas de Privacidad</p>
                        <p className="font-secun text-center mt-4">
                            Para poder brindarte una mayor experiencia de compra, te invitamos a leer nuestras politicas de privacidad.
                        </p>
                        
                        <div style={{lineHeight: "35px"}} dangerouslySetInnerHTML={{__html: politicas.politicas}} className='mt-5 px-4 ' />
                    </div>  
                ): (
                    null
                )
                }
                {
                  politicas.politicasVentas !== "" && politicas.politicasVentas? (
                    <div id="ventas" className="m-5">
                        <p className="font-prin text-center mt-4">Politicas de Ventas</p>
                        <p className="font-secun text-center mt-4">
                            Para poder brindarte una mayor experiencia de compra, te invitamos a leer nuestras politicas de  Ventas
                        </p>
                        
                        <div style={{lineHeight: "35px"}} dangerouslySetInnerHTML={{__html: politicas.politicasVentas}} className='mt-5 px-4 ' />
                    </div>  
                ): (
                    null
                )  
                }
                {
                  politicas.politicasDescuentos !== "" && politicas.politicasDescuentos ? (
                    <div id="descuento" className="m-5">
                        <p className="font-prin text-center mt-4">Politicas de Descuentos</p>
                        <p className="font-secun text-center mt-4">
                            Para poder brindarte una mayor experiencia de compra, te invitamos a leer nuestras politicas de  Descuentos
                        </p>
                        
                        <div  style={{lineHeight: "35px"}} dangerouslySetInnerHTML={{__html: politicas.politicasDescuentos}} className='mt-5 px-4 ' />
                    </div>  
                ): (
                    null
                )  
                }
                {
                  politicas.politicasDevolucion !== "" && politicas.politicasDevolucion ? (
                    <div id="devolucion" className="m-5">
                        <p className="font-prin text-center mt-4">Politicas de Devolucion</p>
                        <p className="font-secun text-center mt-4">
                            Para poder brindarte una mayor experiencia de compra, te invitamos a leer nuestras politicas de  Devolucion
                        </p>
                        
                        <div style={{lineHeight: "35px"}} dangerouslySetInnerHTML={{__html: politicas.politicasDevolucion}} className='mt-5 px-4 ' />
                    </div>  
                ): (
                    null
                )  
                }
                {
                  politicas.politicasEnvios !== "" && politicas.politicasEnvios ? (
                    <div id="envios" className="m-5">
                        <p className="font-prin text-center mt-4">Politicas de Envios</p>
                        <p className="font-secun text-center mt-4">
                            Para poder brindarte una mayor experiencia de compra, te invitamos a leer nuestras politicas de  Envios
                        </p>
                        
                        <div style={{lineHeight: "35px"}} dangerouslySetInnerHTML={{__html: politicas.politicasEnvios}} className='mt-5 px-4 ' />
                    </div>  
                ): (
                    null
                )  
                }
                           
            </div> 
        </Spin>
    )


}

export default Politicas;