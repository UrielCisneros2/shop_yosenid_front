import React, { useCallback, useEffect, useState, useContext } from 'react';
import { Form, Input, Divider, Button, Avatar, notification } from 'antd';
import { useDropzone } from 'react-dropzone';
import clienteAxios from '../../../../config/axios';
import { MenuContext } from '../../../../context/carritoContext';
import jwt_decode from 'jwt-decode';
import aws from '../../../../config/aws';
import './ActualizarUsuario.scss';

export default function ActualizarUsuario(props) {
	const { active, setActive } = useContext(MenuContext);
	const { datosUser, decoded, token, setLoading, setAccion } = props;

	const [ avatar, setAvatar ] = useState(null);
	const [ enviarFile, setEnviarFile ] = useState([]);
	const [ datosFormulario, setdatosFormulario ] = useState({});

	const [ password, setPassword ] = useState({});

	const [ form ] = Form.useForm();

	const mostrarDatosUser = (e) => {
		form.setFieldsValue(e);
	};

	useEffect(
		() => {
			if (datosUser !== null) {
				if (decoded.imagen) {
					setAvatar({
						preview: aws+decoded.imagen
					});
				}
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ datosUser ]
	);

	useEffect(
		() => {
			if (datosUser !== null) {
				let direccion = {};
				if (datosUser.direccion.length > 0) {
					direccion = datosUser.direccion[0];
				}

				mostrarDatosUser({
					nombre: datosUser.nombre,
					apellido: datosUser.apellido,
					email: datosUser.email,
					telefono: datosUser.telefono,
					calle_numero: direccion.calle_numero,
					entre_calles: direccion.entre_calles,
					cp: direccion.cp,
					colonia: direccion.colonia,
					ciudad: direccion.ciudad,
					estado: direccion.estado,
					pais: direccion.pais
				});
				setdatosFormulario({
					nombre: datosUser.nombre,
					apellido: datosUser.apellido,
					email: datosUser.email,
					telefono: datosUser.telefono,
					calle_numero: direccion.calle_numero,
					entre_calles: direccion.entre_calles,
					cp: direccion.cp,
					colonia: direccion.colonia,
					ciudad: direccion.ciudad,
					estado: direccion.estado,
					pais: direccion.pais
				});
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ datosUser ]
	);

	async function enviarDatosUser() {
		const formData = new FormData();

		if (password.contrasenaActual) {
			if (password.contrasena && password.repeatContrasena) {
				if (password.contrasena === password.repeatContrasena) {
					formData.append('contrasena', password.contrasena);
					formData.append('repeatContrasena', password.repeatContrasena);
					formData.append('contrasenaActual', password.contrasenaActual);
				} else {
					notification.error({
						message: 'Error',
						description: 'Las contrasenas no son iguales',
						duration: 2
					});
					return null;
				}
			}
		}
		formData.append('nombre', datosFormulario.nombre);
		formData.append('apellido', datosFormulario.apellido);
		formData.append('email', datosFormulario.email);
		formData.append('telefono', datosFormulario.telefono);
		formData.append('calle_numero', datosFormulario.calle_numero);
		formData.append('entre_calles', datosFormulario.entre_calles);
		formData.append('cp', datosFormulario.cp);
		formData.append('colonia', datosFormulario.colonia);
		formData.append('ciudad', datosFormulario.ciudad);
		formData.append('estado', datosFormulario.estado);
		formData.append('pais', datosFormulario.pais);

		if (decoded.tipoSesion === 'APIRestAB') {
			formData.append('imagen', enviarFile);
		}
		setAccion(true);
		await clienteAxios
			.put(`/cliente/${decoded._id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setTimeout(() => {
					localStorage.removeItem('token');
					localStorage.setItem('token', res.data.token);
					/* window.location.reload(); */
					setActive(!active);
					const decoded = jwt_decode(res.data.token);
					setAvatar({
						preview: aws+decoded.imagen
					});
				}, 1000);
				setLoading(false);
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((err) => {
				setLoading(false);
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

	if (decoded === null) {
		return null;
	}

	const datosForm = (e) => {
		setdatosFormulario({
			...datosFormulario,
			[e.target.name]: e.target.value
		});
	};

	const datosPassword = (e) => {
		setPassword({
			...password,
			[e.target.name]: e.target.value
		});
	};

	return (
		<div>
			<Form layout="horizontal" size={'large'} form={form} onFinish={enviarDatosUser}>
				{decoded.tipoSesion !== 'APIRestAB' ? (
					<div>
						<div className="upload-user-perfil">
							<img
								className="rounded-circle"
								alt="logotipo-tienda"
								src={decoded.imagenFireBase}
								style={{ width: '200px' }}
							/>
						</div>
					</div>
				) : (
					<UploadAvatar
						avatar={avatar}
						setAvatar={setAvatar}
						nombre={decoded.nombre}
						setEnviarFile={setEnviarFile}
					/>
				)}

				<Divider style={{ fontSize: 22 }}>Información Personal</Divider>

				<h5>Nombre:</h5>
				<Form.Item name="nombre" onChange={datosForm}>
					<Form.Item rules={[ { required: true, message: 'Nombre obligatorio' } ]} noStyle name="nombre">
						<Input name="nombre" placeholder="Nombre" />
					</Form.Item>
				</Form.Item>

				<h5>Apellidos:</h5>
				<Form.Item name="apellido" onChange={datosForm}>
					<Form.Item
						rules={[ { required: true, message: 'Apellidos obligatorios' } ]}
						noStyle
						name="apellido"
					>
						<Input name="apellido" placeholder="Apellidos" />
					</Form.Item>
				</Form.Item>

				<h5>Email:</h5>
				<Form.Item name="email" onChange={datosForm}>
					<Form.Item
						rules={[ { required: true, message: 'Correo electronico obligatorio' } ]}
						noStyle
						name="email"
					>
						<Input name="email" placeholder="Correo electronico" disabled />
					</Form.Item>
				</Form.Item>

				<h5>Telefono:</h5>
				<Form.Item name="telefono" onChange={datosForm}>
					<Form.Item rules={[ { required: true, message: 'Telefono obligatorio' } ]} noStyle name="telefono">
						<Input name="telefono" placeholder="+52 3171234567" />
					</Form.Item>
				</Form.Item>

				<Divider className="mt-5" style={{ fontSize: 22 }}>
					Datos domiciliarios
				</Divider>

				<h5>Direccion:</h5>
				<Form.Item name="calle_numero" onChange={datosForm}>
					<Form.Item
						rules={[ { required: true, message: 'Direccion obligatoria' } ]}
						noStyle
						name="calle_numero"
					>
						<Input name="calle_numero" placeholder="Calle y numero de calle" />
					</Form.Item>
				</Form.Item>

				<h5>Referencia:</h5>
				<Form.Item name="entre_calles" onChange={datosForm}>
					<Form.Item
						rules={[ { required: true, message: 'Referencia obligatoria' } ]}
						noStyle
						name="entre_calles"
					>
						<Input name="entre_calles" placeholder="Calles de referencia" />
					</Form.Item>
				</Form.Item>

				<h5>Codigo postal:</h5>
				<Form.Item name="cp" onChange={datosForm}>
					<Form.Item rules={[ { required: true, message: 'Codigo postal obligatorio' } ]} noStyle name="cp">
						<Input name="cp" placeholder="Codigo Postal" />
					</Form.Item>
				</Form.Item>

				<h5>Colonia:</h5>
				<Form.Item name="colonia" onChange={datosForm}>
					<Form.Item rules={[ { required: true, message: 'Colonia obligatoria' } ]} noStyle name="colonia">
						<Input name="colonia" placeholder="Colonia" />
					</Form.Item>
				</Form.Item>

				<h5>Ciudad: </h5>
				<Form.Item name="ciudad" onChange={datosForm}>
					<Form.Item rules={[ { required: true, message: 'Localidad obligatoria' } ]} noStyle name="ciudad">
						<Input name="ciudad" placeholder="Localidad" />
					</Form.Item>
				</Form.Item>

				<h5>Estado:</h5>
				<Form.Item name="estado" onChange={datosForm}>
					<Form.Item rules={[ { required: true, message: 'Estado obligatoria' } ]} noStyle name="estado">
						<Input name="estado" placeholder="Estado" />
					</Form.Item>
				</Form.Item>

				<h5>País:</h5>
				<Form.Item name="pais" onChange={datosForm}>
					<Form.Item rules={[ { required: true, message: 'País obligatoria' } ]} noStyle name="pais">
						<Input name="pais" placeholder="País" />
					</Form.Item>
				</Form.Item>

				{decoded.tipoSesion === 'FireBase' ? (
					''
				) : (
					<div>
						<Divider style={{ fontSize: 22 }}>Contraseña</Divider>
						<h5>Contraseña Actual:</h5>
						<Form.Item name="contrasenaActual" onChange={datosPassword}>
							<Input.Password name="contrasenaActual" placeholder="Contraseña actual" />
						</Form.Item>
						<h5>Contraseña:</h5>
						<Form.Item name="contrasena" onChange={datosPassword}>
							<Input.Password name="contrasena" placeholder="Contraseña" />
						</Form.Item>
						<h5>Confirmar Contraseña:</h5>
						<Form.Item name="repeatContrasena" onChange={datosPassword}>
							<Input.Password name="repeatContrasena" placeholder="Confirmar contraseña" />
						</Form.Item>
					</div>
				)}
				<div className="d-flex justify-content-center pb-3">
					<Button htmlType="submit" className="color-boton color-font-boton" size="large" style={{ width: 150, fontSize: 20 }}>
						Guardar
					</Button>
				</div>
			</Form>
		</div>
	);
}

function UploadAvatar(props) {
	const { avatar, setAvatar, nombre, setEnviarFile } = props;

	const onDrop = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];
			setAvatar({ file, preview: URL.createObjectURL(file) });
			setEnviarFile(file);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[ setAvatar ]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: 'image/jpg, image/png, image/jpeg',
		noKeyboard: true,
		onDrop
	});

	return (
		<div>
			<Divider className="" style={{ fontSize: 22 }}>
				Imagen de perfil
			</Divider>
			<div className="upload-user-perfil" {...getRootProps()}>
				<input {...getInputProps()} />
				{isDragActive ? (
					<Avatar size={200} style={{ backgroundColor: '#87d068' }}>
						<p className="" style={{ fontSize: 150 }}>
							{nombre.charAt(0)}
						</p>
					</Avatar>
				) : avatar ? (
					<Avatar size={200} src={avatar.preview} style={{ backgroundColor: '#87d068' }}>
						<p style={{ fontSize: 150 }}>{nombre.charAt(0)}</p>
					</Avatar>
				) : (
					<Avatar size={200} style={{ backgroundColor: '#87d068' }}>
						<p style={{ fontSize: 150 }}>{nombre.charAt(0)}</p>
					</Avatar>
				)}
			</div>
		</div>
	);
}
