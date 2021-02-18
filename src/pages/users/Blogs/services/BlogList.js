import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { notification } from 'antd';
import queryString from 'query-string';
import Pagination from '../../../../components/Pagination/pagination';
import aws from '../../../../config/aws';
import Spin from '../../../../components/Spin';

import { List } from 'antd';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './BlogList.scss';

export default function BlogList(props) {
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);

	const [ loading, setLoading ] = useState(false);
	const [ blogs, setBlogs ] = useState([]);

	function getBlogsApi(limit, page) {
		setLoading(true);
		clienteAxios
			.get(`/blog?limit=${limit}&page=${page}`)
			.then((res) => {
				setBlogs(res.data.posts);
				setLoading(false);
			})
			.catch((err) => {
				notification.error({
					message: 'Error del servidor',
					description: 'Paso algo en el servidor, al parecer la conexion esta fallando.'
				});
			});
	}

	useEffect(
		() => {
			setLoading(true);
			getBlogsApi(10, page);
		},
		[ page ]
	);

	return (
		<Spin size="large" spinning={loading}>
			<div id="blog" className="container">
				<p className="font-prin text-center p-3">¡Nuestro Blog!</p>
				<div className="container-fluid bg-white shadow-lg">
					<div id="cards">
						<BlogsList2 blogs={blogs} setLoading={setLoading} />
					</div>

					<Pagination blogs={blogs} location={location} history={history} />
				</div>
			</div>
		</Spin>
	);
}

function BlogsList2(props) {
	const { blogs } = props;

	return (
		<div>
			<List
				className="p-3"
				itemLayout="vertical"
				size="large"
				dataSource={blogs.docs}
				renderItem={(blog) => <Blog blog={blog} />}
			/>
		</div>
	);
}

function Blog(props) {
	const { blog } = props;

	return (
		<Link to={`/blog/${blog.url}`} className="blogList">
			<List.Item
				className="blogList__lista list-hover  mb-5"
				key={blog.nombre}
				extra={
					<div className="contenedor-imagen-blog-list">
						<img className="imagen-blog-list" alt={blog.nombre} src={aws + blog.imagen} />
					</div>
				}
			>
				<List.Item.Meta
					title={<p className="blogList__title titulo-blog">{blog.nombre}</p>}
					description={<p className="blogList__author">Autor: {blog.administrador}</p>}
				/>
				{
					<div>
						<div
							className={'blogList__content-description m-0'}
							dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.descripcion) }}
						/>
						<p>Leer mas</p>
					</div>
				}
			</List.Item>
		</Link>
	);
}
