import React,{useState,useEffect} from 'react';
import { notification, Form, Input, Button,Alert  } from 'antd';
import {useParams} from 'react-router-dom';
import clienteAxios from '../../config/axios';
import './Recuperacion_pass.scss';


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
};

export default function Recuperar_pass(props) {

/*     const {location,history} = props; */
    const {idRecuperacion} = useParams();

    const [mostrarError, setmostrarError] = useState("d-none");
    const [acceso, setAcceso] = useState(false);

    useEffect(() => {
        setAcceso(false);
        const cambiarEstadoPass = async () => {
            await clienteAxios.put(`/cliente/restablecer/pass/${idRecuperacion}`)
            .then((res) => {
                setAcceso(false);
            })
            .catch((err) => {
                setAcceso(true);
            })
        }
        cambiarEstadoPass();
    }, [])

    const onFinish = async (values) => {
        const {password,confirmPassword} = values;
        if(password !== confirmPassword){
            setmostrarError("");
        }else{
            const datos = {
                password,
                confirmPassword,
                idRecuperacion,
            }
            await clienteAxios.put('/cliente/reset/pass/',datos)
            .then((res) => {
                const token = res.data.token;
                localStorage.setItem('token', token);
            })
            .catch((err) => {
                notification.error({
                    message: 'Error',
                    description: 'Hubo un error',
                    duration: 2
                });
            })
            props.history.push('/');
        }
    }

    if(acceso){
        props.history.push('/');
    }
    

    return (
        <FormResetPass onFinish={onFinish} mostrarError={mostrarError} />
    )
}


function FormResetPass(props){
    const { onFinish,mostrarError} = props;
    return(
        <div className="centrar-div">
            <div className="div-resetPass shadow col-12 col-lg-4 bg-white rounded">
                <p className="text-center my-4">Recuperacion de contraseña</p>
                <Form {...layout}  name="basic" initialValues={{ remember: true }} onFinish={onFinish}>
                    <Form.Item label="Contraseña" >
                        <Form.Item name="password" rules={[ { required: true, message: 'Rellenar los campos' } ]} noStyle >
                            <Input.Password />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Confirmar contraseña" >
                        <Form.Item name="confirmPassword" rules={[ { required: true, message: 'Rellenar los campos' } ]} noStyle >
                            <Input.Password />
                        </Form.Item>
                    </Form.Item>
                    <Alert
                        className={`my-4 ${mostrarError}`}
                        message="Contraseña distintas"
                        description="Las contraseñas son distintas, favor de poner la misma"
                        type="error"
                    />
                    <Form.Item className="d-flex justify-content-center align-items-center text-center" >
                        <Button type="primary" htmlType="submit" className="color-boton">
                            Continuar
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
