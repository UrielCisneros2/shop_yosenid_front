import React, { useState, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, notification, Spin, Modal } from 'antd';
import {
	UploadOutlined,
	EyeOutlined,
	DeleteOutlined,
	PictureOutlined,
	ExclamationCircleOutlined
} from '@ant-design/icons';
import './registrar_galeria.scss';
import { ProductoContext } from '../../contexts/ProductoContext';
import aws from '../../../../config/aws';

const { confirm } = Modal;

function RegistrarGaleria() {
	const token = localStorage.getItem('token');
	const productoContext = useContext(ProductoContext);
	const [ galeria, setGaleria ] = useState();
	const [ loading, setLoading ] = useState(false);

	const props = {
		beforeUpload: async (file) => {
			const formData = new FormData();
			formData.append('producto', productoContext);
			formData.append('imagen', file);
			await subirBD(formData);
		}
	};

	const subirBD = async (formData) => {
		setLoading(true);
		await clienteAxios
			.post(`/galeria/nueva/${productoContext}`, formData, {
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
			.get(`/galeria/${productoContext}`)
			.then((res) => {
				setGaleria(res.data.imagenes);
			})
			.catch((err) => {
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
	const eliminarBD = async (idimagen) => {
		setLoading(true);
		await clienteAxios
			.delete(`/galeria/${productoContext}/imagen/${idimagen}`, {
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

	const [ prev, setPrev ] = useState('');
	if (galeria !== undefined) {
		var render = galeria.map((imagenes) => (
			<div className="shadow rounded imgStyle d-inline-block" key={imagenes._id}>
				<div className="padre-iconos d-flex justify-content-around align-items-center">
					<img
						className="img"
						src={aws+imagenes.url}
						alt="preview-imagen"
					/>
					<div className="iconos rounded">
						<span
							onClick={function() {
								setPrev(imagenes.url);
							}}
						>
							<EyeOutlined style={{ fontSize: 20 }} className="ver" />
						</span>
						<span
							onClick={function() {
								showDeleteConfirm(imagenes._id);
							}}
						>
							<DeleteOutlined style={{ fontSize: 20 }} className="eliminar" />
						</span>
					</div>
				</div>
			</div>
		));
	}

	return (
		<Spin size="large" spinning={loading}>
			<div className="responsive">
				<div className="col-sm-12 col-lg-6 imgUploads">
					<Upload {...props} className="upload-text-display">
						<Button>
							<UploadOutlined /> Upload
						</Button>
					</Upload>
					<div className="padre">{render}</div>
				</div>
				<div className="col-sm-12 col-lg-6">
					<p className="text-center">Visualización de la imagen</p>
					<div className="shadow rounded imgPreview-registrar-galeria d-flex justify-content-center align-items-center">
						{prev === '' || galeria.length === 0 ? (
							<PictureOutlined style={{ fontSize: 80 }} />
						) : (
							<img
								className="imagen-registrar-galeria"
								src={aws+prev}
								alt="preview-imagen"
							/>
						)}
					</div>
				</div>
			</div>
		</Spin>
	);
}
export default RegistrarGaleria;
