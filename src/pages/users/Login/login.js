import React,{useState} from 'react';
import clienteAxios from '../../../config/axios';
import { withRouter } from 'react-router-dom';
import { notification, Form, Input, Button, Alert } from 'antd';


const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 14 }
};
const tailLayout = {
	wrapperCol: { offset: 7, span: 10 }
};

function Login(props) {

	const [mostrarDiv, setMostrarDiv] = useState('d-none');
	const [mostrarMensaje, setmostrarMensaje] = useState('d-none');

	const onFinish = async (values) => {
		await clienteAxios
			.post('/cliente/auth', values)
			.then((res) => {
				const token = res.data.token;
				localStorage.setItem('token', token);
				const vista = localStorage.getItem("vistas");
				if (vista) {
					localStorage.getItem("vistas");
					props.history.push(vista);
					setTimeout(() => {
						localStorage.removeItem("vistas");
					}, 300);
				}else{
					props.history.push('/admin');
				}
			})
			.catch((err) => {
				if(err.response){
					if (err.response.status === 404 || err.response.status === 500) {
						notification.error({
							message: 'Error',
							description: err.response.data.message,
							duration: 2
						});
					} else {
						notification.error({
							message: 'Error',
							description: 'Hubo un error',
							duration: 2
						});
					}
				}else{
					notification.error({
						message: 'Error de conexion.',
						description:
						  'Al parecer no se a podido conectar al servidor.',
					  });
				}
			});
	};

	const onRecuperar = async (email) => {
			await clienteAxios.post('/cliente/restablecer/pass',email)
			.then((res) => {
				setmostrarMensaje("");
			})
			.catch((err) => {
				if(err.response){
					if (err.response.status === 404 || err.response.status === 500) {
						notification.error({
							message: 'Error',
							description: err.response.data.message,
							duration: 2
						});
					} else {
						notification.error({
							message: 'Error',
							description: 'Hubo un error',
							duration: 2
						});
					}
				}else{
					notification.error({
						message: 'Error de conexion.',
						description:
						  'Al parecer no se a podido conectar al servidor.',
					  });
				}
			});


	}

	const mostrarDivClick = () => {
		setMostrarDiv("")
	}


	return (
		<div className="col-12">
			<Form {...layout} name="basic" className="font-descrip" initialValues={{ remember: true }} onFinish={onFinish}>
				<Form.Item label="Correo" >
					<Form.Item name="email" rules={[ { required: true, message: 'El email es obligatorio!' } ]} noStyle >
						<Input />
					</Form.Item>
				</Form.Item>
				<Form.Item label="Contraseña" >
					<Form.Item name="contrasena" rules={[ { required: true, message: 'La contraseña es obligatoria!' } ]} noStyle >
						<Input.Password />
					</Form.Item>
				</Form.Item>
				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit" className="color-boton" >
						Continuar
					</Button>
				</Form.Item>
				<p onClick={mostrarDivClick} style={{cursor: 'pointer',color: '#0084ff'}}>¿Has olvidado tu contrasena?</p>				
			</Form>
			<div  className={`${mostrarDiv} col-12 mt-2`}>
				<Form {...layout} name="basic" initialValues={{ remember: true }} onFinish={onRecuperar}>
					<Form.Item label="Correo" >
						<Form.Item name="emailCliente" rules={[ { required: true, message: 'El email es obligatorio!' } ]} noStyle >
							<Input />
						</Form.Item>
					</Form.Item>
					<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit" className="color-boton" >
						Enviar
					</Button>
					<Alert
						className={`${mostrarMensaje}`}
						message="Correo enviado"
						description="Se a enviado un correo para actualizar su contraseña"
						type="success"
					/>
				</Form.Item>
				</Form>
			</div>
			
		</div>
	);
}
export default withRouter(Login);
