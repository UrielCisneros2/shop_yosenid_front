import React,{useState,useEffect} from 'react'
import clienteAxios from '../../../config/axios';
import { notification } from 'antd';
import Spin from '../../../components/Spin';

export default function QuienesSomos() {

    const [ loading, setLoading ] = useState(false);
    const [imagenCorp, setImagenCorp] = useState([]);

    function peticionImagenCoorporativa(){
        clienteAxios.get('/tienda/')
            .then((res) => {
                setLoading(false)
                if (res.data[0].politicas !== "") {
                    setImagenCorp(res.data[0].imagenCorp)
                }
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
        peticionImagenCoorporativa();
        setLoading(true)
    }, [])

    return (
        <Spin spinning={loading}>
            <div className="container bg-white shadow mb-5">
                <div style={{lineHeight: "35px",color:"black"}} dangerouslySetInnerHTML={{__html: imagenCorp}} className='mt-5 px-4' />
            </div>
        </Spin>
    )
}
