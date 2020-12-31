import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, notification, Spin, Modal, Alert } from 'antd';
import {
	UploadOutlined,
	EyeOutlined,
	DeleteOutlined,
	PictureOutlined,
	EditOutlined,
	ExclamationCircleOutlined
} from '@ant-design/icons';
import { IdProductoContext } from '../../contexts/ProductoContext';
import './actualizar_galeria.scss';
import aws from '../../../../config/aws';

const { confirm } = Modal;

function RegistrarGaleria() {
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ galeria, setGaleria ] = useState();
	const [ existeGaleria, setExisteGaleria ] = useState(false);
	const [ idImagen, setIdImagen ] = useState();
	const [ loading, setLoading ] = useState(false);
	const [ prev, setPrev ] = useState('');

	useEffect(
		() => {
			obtenerBD();
			setExisteGaleria(false);
			setPrev('');
		},
		[ productoID ]
	);

	const antprops = {
		beforeUpload: async (file) => {
			const formData = new FormData();
			formData.append('producto', productoID);
			formData.append('imagen', file);
			await subirBD(formData);
		}
	};
	const propsActualizar = {
		beforeUpload: async (file) => {
			const formData = new FormData();
			formData.append('imagen', file);
			await actualizarBD(formData);
		}
	};

	const actualizarBD = async (formdata) => {
		setLoading(true);
		await clienteAxios
			.put(`/galeria/${productoID}/imagen/${idImagen}`, formdata, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerBD();
				setLoading(false);
				notification.success({
					message: '¡Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((err) => {
				setLoading(false);
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
	};

	const subirBD = async (formData) => {
		setLoading(true);
		await clienteAxios
			.post(`/galeria/nueva/${productoID}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerBD();
				setLoading(false);
				notification.success({
					message: '¡Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((err) => {
				setLoading(false);
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
	};
	const obtenerBD = async () => {
		await clienteAxios
			.get(`/galeria/${productoID}`)
			.then((res) => {
				setGaleria(res.data.imagenes);
				setExisteGaleria(true);
			})
			.catch((err) => {
				if (err.response) {
					if (err.response.status === 404) {
						setExisteGaleria(false);
					} else {
						notification.error({
							message: 'Error',
							description: err.response.data.message,
							duration: 2
						});
					}
				} else {
					notification.error({
						message: 'Error de conexion',
						description: 'Al parecer no se a podido conectar al servidor.',
						duration: 2
					});
				}
			});
	};
	const eliminarBD = async (idimagen) => {
		setLoading(true);
		await clienteAxios
			.delete(`/galeria/${productoID}/imagen/${idimagen}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerBD();
				setLoading(false);
				notification.success({
					message: '¡Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((err) => {
				setLoading(false);
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
	};

	function showDeleteConfirm(idimagen) {
		confirm({
			title: 'Estás seguro de borrar esto?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				eliminarBD(idimagen);
			}
		});
	}

	if (galeria !== undefined) {
		var render = galeria.map((imagenes) => (
			<div className="shadow rounded imgStyle d-inline-block " key={imagenes._id}>
				<div className="padre-iconos d-flex justify-content-around align-items-center">
					<img className="img" src={aws + imagenes.url} alt="preview-imagen" />
					<div className="iconos rounded">
						<EyeOutlined
							style={{ fontSize: 20 }}
							className="ver"
							onClick={function() {
								setPrev(imagenes.url);
							}}
						/>
						<Upload {...propsActualizar}>
							<EditOutlined
								style={{ fontSize: 20 }}
								className="modificar"
								onClick={function() {
									setIdImagen(imagenes._id);
								}}
							/>
						</Upload>
						<DeleteOutlined
							style={{ fontSize: 20 }}
							className="eliminar"
							onClick={function() {
								showDeleteConfirm(imagenes._id);
							}}
						/>
					</div>
				</div>
			</div>
		));
	}

	return (
		<Spin size="large" spinning={loading}>
			<div className="d-flex justify-content-center m-2">
				<Alert message="Tamaño recomendado para la imagen es: 800x800px" type="info" showIcon />
			</div>
			<div className="responsive">
				<div className="col-sm-4 col-lg-6 imgUploads">
					<Upload {...antprops} className="upload-text-display">
						<Button>
							<UploadOutlined /> Upload
						</Button>
					</Upload>
					{existeGaleria ? (
						<div className="padre">{render}</div>
					) : (
						<div className="d-flex justify-content-center mt-5">
							<p>No hay Galeria</p>
						</div>
					)}
				</div>
				<div className="col-sm-4 col-lg-6">
					<p className="text-center">Visualización de la imagen</p>
					<div className="shadow rounded imgPreview-actualizar-galeria d-flex justify-content-center align-items-center mb-5">
						{existeGaleria === false || prev === '' || galeria.length === 0 ? (
							<PictureOutlined style={{ fontSize: 80 }} />
						) : (
							<img className="imagen-actualizar-galeria" src={aws + prev} alt="preview-imagen" />
						)}
					</div>
				</div>
			</div>
		</Spin>
	);
}
export default RegistrarGaleria;
