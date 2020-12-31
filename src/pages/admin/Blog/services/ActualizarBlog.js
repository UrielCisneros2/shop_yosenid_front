import React, { useContext, useState, useEffect } from 'react';
import { BlogContext } from '../../contexts/BlogContext';
import { Form, Input, Button, notification, Upload, Alert } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { UploadOutlined } from '@ant-design/icons';
import clienteAxios from '../../../../config/axios';
import aws from '../../../../config/aws';

export default function ActualizarBlog(props) {
	const { setReloadBlog, token, setVisible } = props;

	const blogContext = useContext(BlogContext);
	const [ form ] = Form.useForm();
	var urlGuion = '';

	//Variables que guardan las imagenes
	const [ files, setFiles ] = useState([]);
	const [ upload, setUpload ] = useState(false);

	const [ accion, setAccion ] = useState(false);
	///capturar datos maualmente}
	const [ datos, setDatos ] = useState({
		nombre: blogContext.nombre,
		administrador: blogContext.administrador,
		url: blogContext.url,
		descripcion: blogContext.descripcion
	});

	const monstrarInformacionBlog = () => {
		form.setFieldsValue({
			nombre: blogContext.nombre,
			administrador: blogContext.administrador,
			url: blogContext.url,
			descripcion: blogContext.descripcion
		});
	};

	useEffect(
		() => {
			monstrarInformacionBlog();
		},
		[ blogContext ]
	);

	//Layout para formulario(columnas)
	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 16 }
	};

	const propss = {
		listType: 'picture',
		beforeUpload: (file) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				file.thumbUrl = e.target.result;
				setFiles(file);
			};
			setUpload(true);
			return false;
		},
		onRemove: (file) => {
			setUpload(false);
			setFiles([]);
		}
	};

	function obtenerUrl(text) {
		const trim = text.trim();
		const datos = trim.split(' ');
		for (var i = 0; i < datos.length; i++) {
			if (datos.length - 1 === i) {
				urlGuion += datos[i];
			} else {
				urlGuion += datos[i] + '-';
			}
		}
		return urlGuion;
		/* setUrl(urlSinGion); */
	}

	const enviarDatos = async () => {
		if (datos.nombre === '' || datos.administrador === '' || datos.url === '' || datos.descripcion === '') {
			notification.info({
				message: 'Ups, algo salio mal',
				description: 'Todos los datos son obligatorios'
			});
		} else {
			if (!accion) {
				obtenerUrl(datos.url);
			} else {
				urlGuion = blogContext.url;
			}
			const formData = new FormData();
			if (files.length === 0) {
				formData.append('nombre', datos.nombre);
				formData.append('administrador', datos.administrador);
				formData.append('url', urlGuion);
				formData.append('descripcion', datos.descripcion);
			} else {
				formData.append('nombre', datos.nombre);
				formData.append('administrador', datos.administrador);
				formData.append('url', urlGuion);
				formData.append('descripcion', datos.descripcion);
				formData.append('imagen', files);
			}

			await clienteAxios
				.put(`/blog/${blogContext._id}`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						 Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					notification.success({
						message: 'Actualización exitosa',
						description: res.data.message
					});
					setReloadBlog(true);
					setVisible(false);
				})
				.catch((err) => {
					setAccion(true);
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
	};

	const obtenerValores = (e) => {
		if (e.target.name === 'url') {
			setAccion(false);
		}
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	const capturarInfoEditor = (content, editor) => {
		setDatos({ ...datos, descripcion: content });
	};

	return (
		<div className="formulario-blog">
			<Form name="nest-messages" {...layout} form={form} onFinish={enviarDatos}>
				<Form.Item label="Titulo del blog:" onChange={obtenerValores}>
					<Form.Item noStyle name="nombre">
						<Input name="nombre" placeholder="Titulo del Blog" />
					</Form.Item>
				</Form.Item>
				<Form.Item label="Autor: " onChange={obtenerValores}>
					<Form.Item noStyle name="administrador">
						<Input name="administrador" placeholder="Nombre del Autor" />
					</Form.Item>
				</Form.Item>
				<Form.Item label="Url (Campo unico) " onChange={obtenerValores}>
					<Form.Item noStyle name="url">
						<Input name="url" placeholder="Url del blog" />
					</Form.Item>
				</Form.Item>

				<Form.Item name="descripcion" label="Contenido del blog">
					<Editor
						disabled={false}
						init={{
							height: 450,
							menubar: true,
							plugins: [
								'advlist autolink lists link image charmap print preview anchor',
								'searchreplace visualblocks code fullscreen',
								'insertdatetime media table paste code help wordcount'
							],
							toolbar:
								'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
						}}
						onEditorChange={capturarInfoEditor}
					/>
				</Form.Item>
				<div className="d-flex justify-content-center m-2">
					<Alert message="No hay un tamaño recomendado para esta imagen" type="info" showIcon />
				</div>
				<Form.Item label="Imagen principal del Blog:">
					<Upload {...propss} name="imagen">
						<Button disabled={upload}>
							<UploadOutlined /> Subir
						</Button>
					</Upload>
				</Form.Item>
				<Form.Item label="Imagen Actual">
					<img
						className="d-block img-fluid mt-2"
						width="200"
						alt="imagen de base"
						src={aws + blogContext.imagen}
					/>
				</Form.Item>
				<Form.Item className="d-flex justify-content-center align-items-center text-center">
					<Button type="primary" htmlType="submit">
						Guardar
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
