import React, { useState } from 'react';
import { Form, Input, Button, notification, Upload, message, Alert } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { UploadOutlined, CheckOutlined } from '@ant-design/icons';
import clienteAxios from '../../../../config/axios';

export default function RegistrarBlog(props) {
	const { setReloadBlog, token, setVisible } = props;

	//Variablo que trae la informacion del post
	const [ blogData, setBlogData ] = useState({});

	const [ upload, setUpload ] = useState(false);
	//Variables que guardan las imagenes
	const [ files, setFiles ] = useState([]);
	const [ accion, setAccion ] = useState(false);

	var urlGuion = '';

	//Layout para formulario(columnas)
	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 16 }
	};

	const onError = (error) => {
		error.errorFields.forEach((err) => {
			notification.error({
				message: `[${err.name}]`,
				description: err.errors,
				duration: 5
			});
		});
	};

	const processPost = async (e) => {
		if (blogData.descripcion === undefined) {
			notification.info({
				message: 'Ups, algo salio mal',
				description: 'La descripcion del blog es obligatoria'
			});
		} else if (files.length === 0) {
			notification.info({
				message: 'Ups, algo salio mal',
				description: 'La imagen es obligatoria'
			});
		} else {
			if (!accion) {
				obtenerUrl(blogData.url);
			}
			const hide = message.loading('Accion en proceso....', 0);
			setTimeout(hide, 2000);
			const formData = new FormData();
			formData.append('nombre', blogData.nombre);
			formData.append('administrador', blogData.administrador);
			formData.append('url', urlGuion);
			formData.append('descripcion', blogData.descripcion);
			formData.append('imagen', files);

			await clienteAxios
				.post('/blog/', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					notification.success({
						message: 'Registro exitoso',
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
	//Funcion que quita los espacios y los remplasa por guiones
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
	}

	//Funcion que captura la imagen seleccionada por el usuario
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

	//Funcion que escucha la variable que trae la informacion del blog

	const capturarInfoEditor = (content, editor) => {
		setBlogData({ ...blogData, descripcion: content });
	};

	return (
		<div className="formulario-blog">
			<Form name="nest-messages" {...layout} onFinish={processPost} onFinishFailed={onError}>
				<Form.Item
					label="Crea un título llamativo: "
					onChange={(e) => setBlogData({ ...blogData, nombre: e.target.value })}
				>
					<Form.Item rules={[ { required: true, message: 'Titulo obligatorio' } ]} noStyle name="nombre">
						<Input value={blogData.nombre} name="nombre" placeholder="Titulo del Blog" />
					</Form.Item>
				</Form.Item>

				<Form.Item
					label="Autor: "
					onChange={(e) => setBlogData({ ...blogData, administrador: e.target.value })}
				>
					<Form.Item
						rules={[ { required: true, message: 'Autor obligatorio' } ]}
						noStyle
						name="administrador"
					>
						<Input name="administrador" placeholder="Nombre del Autor" />
					</Form.Item>
				</Form.Item>
				<Form.Item
					label="Url (Campo unico) "
					onChange={(e) => {
						setAccion(false);
						setBlogData({ ...blogData, url: e.target.value });
					}}
				>
					<Form.Item rules={[ { required: true, message: 'La url es obligatoria' } ]} noStyle name="url">
						<Input name="url" placeholder="Url del blog" />
					</Form.Item>
				</Form.Item>

				<Form.Item name="descripcion" label="Contenido del blog">
					<Editor
						value={blogData.descripcion ? blogData.descripcion : ''}
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
				<Form.Item className="d-flex justify-content-center align-items-center text-center">
					<Button type="primary" htmlType="submit" size="large" icon={<CheckOutlined />}>
						Guardar
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
