import React, { useState, useEffect } from 'react';
import { Form, Input, Divider, Button, Alert, notification, Spin } from 'antd';
import { Editor } from "@tinymce/tinymce-react";
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import clienteAxios from '../../../../../config/axios';
import jwt_decode from 'jwt-decode';

export default function Registro_Politicas(props) {
	const {setCurrent, current} = props;

	const {next} = props;
	const token = localStorage.getItem('token');

	const [ disabled, setDisabled ] = useState(false);
	const [datos, setDatos] = useState({});
	const [datosNegocio, setDatosNegocio] = useState({});
	const [ reloadInfo, setReloadInfo ] = useState(false);

	const [ control, setControl ] = useState(false);
	const [ form ] = Form.useForm();
	const [ loading, setLoading ] = useState(false);
	// const token = localStorage.getItem('token');
	// var decoded = Jwt(token);

	const monstrarInformacionBlog = (e) => {
		form.setFieldsValue(e);
	  };


	function peticionDatosTienda() {
		setLoading(true);
		clienteAxios
			.get(`/tienda/`)
			.then((res) => {
				setLoading(false);
				setDatosNegocio(res.data[0]);
			})
			.catch((err) => {
				setLoading(false);
				setDatosNegocio({});
				if (err.response) {
					notification.error({
						message: 'Error',
						description: err.response.data.message,
						duration: 2
					});
				} else {
					notification.error({
						message: 'Error de conexion',
						description: 'Al parecer no se a podido conectar al servidor.',
						duration: 2
					});
				}
			});
	}

	useEffect(
		() => {
			peticionDatosTienda();
			setReloadInfo(false);
		},
		[ reloadInfo ]
	);


	useEffect(() => {
		
		if (datosNegocio !== undefined) {
			setDisabled(false);
			monstrarInformacionBlog({
				politicas: datosNegocio.politicas,
				politicasVentas: datosNegocio.politicasVentas,
				politicasEnvios: datosNegocio.politicasEnvios,
				politicasDescuentos: datosNegocio.politicasDescuentos,
				politicasDevolucion: datosNegocio.politicasDevolucion
			});
			setDatos({
				politicas: datosNegocio.politicas,
				politicasVentas: datosNegocio.politicasVentas,
				politicasEnvios: datosNegocio.politicasEnvios,
				politicasDescuentos: datosNegocio.politicasDescuentos,
				politicasDevolucion: datosNegocio.politicasDevolucion
			});
			setControl(true);
			
		} else {
			setDisabled(true);
			setDatos({});
			setControl(false);
		}
	  }, [datosNegocio]);


	const capturarPoliticasEditor = (content, editor) => {
		setDatos({ ...datos, politicas: content });
	};
	const capturarPoliticasVentas = (content, editor) => {
		setDatos({ ...datos, politicasVentas: content });
	};
	const capturarPoliticasEnvio = (content, editor) => {
		setDatos({ ...datos, politicasEnvios: content });
	};
	const capturarPoliticasDescuento = (content, editor) => {
		setDatos({ ...datos, politicasDescuentos: content });
	};
	const capturarPoliticasDevolucion = (content, editor) => {
		setDatos({ ...datos, politicasDevolucion: content });
	};
	

	  async function SendForm(){
		setLoading(true);
		// console.log(datos);
		if (disabled === false) {
			setLoading(true);
			await clienteAxios
			.put(
				`/tienda/politicas/${datosNegocio._id}`,
				datos,
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setLoading(false);
				setControl(true);
				setCurrent(current + 1);
				// next();
				notification.success({
				message: "Registro exitoso",
				description: res.data.message,
				});
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				if (err.response) {
				notification.error({
					message: "Error",
					description: err.response.data.message,
					duration: 2,
				});
				} else {
				notification.error({
					message: "Error de conexion",
					description: "Al parecer no se a podido conectar al servidor.",
					duration: 2,
				});
				}
			});
		}

	
	};



	return (
		<Spin spinning={loading}>
			{disabled ? (
				<Alert
					message="Nota:"
					description="No puedes registrar las políticas de empresa sin antes registrar los datos de la tienda"
					type="info"
					showIcon
					className="m-5"
				/>
			) : (
				<div />
			)}
			<Form  
				onFinish={SendForm}
              	form={form}
				className="mt-5"
			>

				{/* PRIMER PANEL */}
				<div className="row">
					<Divider>Información de Políticas de Privacidad</Divider>
					<div className="col-12">
					<Form.Item className="m-2" valuePropName="Editor">
						<Form.Item
						
						noStyle
						name="politicas"
						>
						<Editor
							disabled={false}
							init={{
							height: 300,
							menubar: true,
							plugins: [
								"advlist autolink lists link image charmap print preview anchor",
								"searchreplace visualblocks code fullscreen",
								"insertdatetime media table paste code help wordcount",
							],
							toolbar:
								"undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
							}}
							onEditorChange={capturarPoliticasEditor}
						/>
						</Form.Item>
					</Form.Item>
					</div>
				</div>

				{/* SEGUNDO PANEL */}
				<div className="row">
					<Divider>Información de Políticas de Ventas</Divider>
					<div className="col-12">
					<Form.Item className="m-2" valuePropName="Editor">
						<Form.Item
						
						noStyle
						name="politicasVentas"
						>
						<Editor
							disabled={false}
							init={{
							height: 300,
							menubar: true,
							plugins: [
								"advlist autolink lists link image charmap print preview anchor",
								"searchreplace visualblocks code fullscreen",
								"insertdatetime media table paste code help wordcount",
							],
							toolbar:
								"undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
							}}
							onEditorChange={capturarPoliticasVentas}
						/>
						</Form.Item>
					</Form.Item>
					</div>
				</div>

				{/* TERCER PANEL */}
				<div className="row">
					<Divider>Información de Políticas de Envíos</Divider>
					<div className="col-12">
					<Form.Item className="m-2" valuePropName="Editor">
						<Form.Item
						
						noStyle
						name="politicasEnvios"
						>
						<Editor
							disabled={false}
							init={{
							height: 300,
							menubar: true,
							plugins: [
								"advlist autolink lists link image charmap print preview anchor",
								"searchreplace visualblocks code fullscreen",
								"insertdatetime media table paste code help wordcount",
							],
							toolbar:
								"undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
							}}
							onEditorChange={capturarPoliticasEnvio}
						/>
						</Form.Item>
					</Form.Item>
					</div>
				</div>
				
				{/* CUARTO PANEL  */}
				<div className="row">
					<Divider>Información de Políticas de Descuentos</Divider>
					<div className="col-12">
					<Form.Item className="m-2" valuePropName="Editor">
						<Form.Item
						
						noStyle
						name="politicasDescuentos"
						>
						<Editor
							disabled={false}
							init={{
							height: 300,
							menubar: true,
							plugins: [
								"advlist autolink lists link image charmap print preview anchor",
								"searchreplace visualblocks code fullscreen",
								"insertdatetime media table paste code help wordcount",
							],
							toolbar:
								"undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
							}}
							onEditorChange={capturarPoliticasDescuento}
						/>
						</Form.Item>
					</Form.Item>
					</div>
				</div>
				
				{/* QUINTO PANEL */}
				<div className="row">
					<Divider>Información de Políticas de Devolución</Divider>
					<div className="col-12">
					<Form.Item className="m-2" valuePropName="Editor">
						<Form.Item
						
						noStyle
						name="politicasDevolucion"
						>
						<Editor
							disabled={false}
							init={{
							height: 300,
							menubar: true,
							plugins: [
								"advlist autolink lists link image charmap print preview anchor",
								"searchreplace visualblocks code fullscreen",
								"insertdatetime media table paste code help wordcount",
							],
							toolbar:
								"undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
							}}
							onEditorChange={capturarPoliticasDevolucion}
						/>
						</Form.Item>
					</Form.Item>
					</div>
				</div>

				<Form.Item className="d-flex justify-content-center align-items-center text-center">
					<Button
						htmlType="submit"
						disabled={disabled}
						size="large"
						type="primary"
						icon={
							control === false ? (
								<PlusCircleOutlined style={{ fontSize: 24 }} />
							) : (
								<EditOutlined style={{ fontSize: 24 }} />
							)
						}
					>
						{control === false ? 'Registrar politicas de la Empresa' : 'Actualizar politicas de Empresa'}
					</Button>
				</Form.Item>
			</Form>
		</Spin>
	);
}