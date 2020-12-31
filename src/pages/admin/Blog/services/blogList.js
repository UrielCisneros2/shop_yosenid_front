import React from 'react';
import { List, Button, Modal, notification, Avatar } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import clienteAxios from '../../../../config/axios';
import './blogList.scss';
import aws from '../../../../config/aws';

const { confirm } = Modal;

export default function blogList(props) {
	const { blogs, setReloadBlog, showDrawer, setAccion, setInfoBlog } = props;
	const token = localStorage.getItem('token');

	const deleteBlog = (blog) => {
		confirm({
			title: 'Eliminando Blog',
			icon: <ExclamationCircleOutlined />,
			content: `¿Estás seguro que deseas eliminar el blog ${blog.nombre}?`,
			okText: 'Eliminar',
			okType: 'danger',
			cancelText: 'Cancelar',
			onOk() {
				clienteAxios
					.delete(`/blog/${blog._id}`, {
						headers: {
							'Content-Type': 'aplication/json',
							Authorization: `bearer ${token}`
						}
					})
					.then((res) => {
						notification.success({
							message: 'Blog Eliminado',
							description: res.data.message
						});
						setReloadBlog(true);
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
			}
		});
	};

	return (
		<div className="blogs-list">
			<List
				itemLayout="horizontal"
				dataSource={blogs.docs}
				renderItem={(blog) => (
					<Blog
						blog={blog}
						deleteBlog={deleteBlog}
						showDrawer={showDrawer}
						setAccion={setAccion}
						setInfoBlog={setInfoBlog}
					/>
				)}
			/>
		</div>
	);
}

function Blog(props) {
	const { blog, deleteBlog, showDrawer, setAccion, setInfoBlog } = props;

	return (
		<List.Item
			actions={[
				<Link to={`/blog/${blog.url}`} target="_blank">
					<Button type="dashed" size={window.screen.width > 768 ? 'middle' : 'small'}>
						<EyeOutlined /> Ver
					</Button>
				</Link>,
				<Button
					type="dashed"
					size={window.screen.width > 768 ? 'middle' : 'small'}
					onClick={() => {
						setInfoBlog(blog);
						setAccion(true);
						showDrawer();
					}}
				>
					<EditOutlined /> Editar
				</Button>,
				<Button
					type="dashed"
					danger
					onClick={() => deleteBlog(blog)}
					size={window.screen.width > 768 ? 'middle' : 'small'}
				>
					<DeleteOutlined /> Eliminar
				</Button>
			]}
		>
			<List.Item.Meta
				avatar={<Avatar src={aws + blog.imagen} />}
				title={<p className="h5 font-weight-bold">{blog.nombre}</p>}
				description={<p className="h6">{blog.administrador}</p>}
			/>
		</List.Item>
	);
}
