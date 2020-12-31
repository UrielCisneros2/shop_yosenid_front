import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import { Table, Input, notification, Avatar, Spin, Row, Button } from 'antd';
import { RollbackOutlined, UserOutlined } from '@ant-design/icons';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';
import './clientes.scss';
import aws from '../../../config/aws';

import ConsutaExcel from './consutaExcel';

const { Search } = Input;

function Clientes(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);
	//Tomar la paginacion actual
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);

	const [ loading, setLoading ] = useState(false);
	const [ clientes, setClientes ] = useState([]);
	const [ clientesPaginados, setClientesPaginados ] = useState([]);
	const [ visible, setVisible ] = useState('d-none');

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	useEffect(
		() => {
			if (token === '' || token === null) {
				props.history.push('/entrar');
			} else if (decoded['rol'] !== true) {
				props.history.push('/');
			}else{
				obtenerClientes(20, page);
			}
			
		},
		[ page ]
	);

	const columns = [
		{
			title: 'Foto de perfil',
			dataIndex: 'imagen',
			key: 'imagen',
			render: (imagen) => {
				return !imagen ? (
					<Avatar icon={<UserOutlined />} />
				) : imagen.includes('https') ? (
					<Avatar src={imagen} />
				) : (
					<Avatar src={aws + imagen} />
				);
			}
		},
		{
			title: 'Nombre',
			dataIndex: 'nombre',
			key: 'nombre',
			render: (nombre) => <p className="h5">{nombre}</p>
		},
		{
			title: 'Apellido',
			dataIndex: 'apellido',
			key: 'apellido',
			render: (apellido) => (!apellido ? <p className="h5">-</p> : <p className="h5">{apellido}</p>)
		},
		{
			title: 'Telefono',
			dataIndex: 'telefono',
			key: 'telefono',
			render: (telefono) => (!telefono ? <p className="h5">-</p> : <p className="h5">{telefono}</p>)
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			render: (email) => <p className="h5">{email}</p>
		},
		{
			title: 'Dirección',
			dataIndex: 'direccion',
			key: 'direccion',
			render: (direccion) => {
				return direccion.map((res) => {
					return (
						<div key={res._id}>
							<p className="h5">
								{res.calle_numero}, {res.colonia}
							</p>
						</div>
					);
				});
			}
		},
		{
			title: 'Ciudad',
			dataIndex: 'direccion',
			key: 'direccion',
			render: (ciudad) => {
				return ciudad.map((res) => {
					return (
						<div key={res._id}>
							<p className="h5">
								{res.ciudad}, {res.estado}, {res.pais}
							</p>
						</div>
					);
				});
			}
		}
	];

	async function obtenerClientes(limit, page) {
		setVisible('d-none');
		setLoading(true);
		await clienteAxios
			.get(`/cliente?limit=${limit}&page=${page}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setClientes(res.data.posts.docs);
				setClientesPaginados(res.data.posts);
				setLoading(false);
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
	}

	const obtenerClientesFiltrados = async (busqueda) => {
		if (!busqueda) {
			setVisible('d-none');
			obtenerClientes(10, page);
		} else {
			setVisible('ml-3 d-flex justify-content-center align-items-center');
			setLoading(true);
			await clienteAxios
				.get(`/cliente/filtrados?nombre=${busqueda}&apellido=${busqueda}&direccion=${busqueda}`, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setClientesPaginados(res.data.posts);
					setClientes(res.data.posts);
					setLoading(false);
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
		}
	};

	return (
		<Spin size="large" spinning={loading}>
			<Row justify="center">
				<Search
					placeholder="Buscar un cliente"
					onSearch={(value) => obtenerClientesFiltrados(value)}
					style={{ height: 40, marginBottom: 10 }}
					enterButton="Buscar"
					size="large"
					className="search-width"
				/>

				<Button
					type="primary"
					size="large"
					className={visible}
					onClick={() => obtenerClientes(10, page)}
					icon={<RollbackOutlined style={{ fontSize: 24 }} />}
				>
					Volver
				</Button>
			</Row>

			<ConsutaExcel />

			<Table
				className="tabla-inventario mt-5"
				columns={columns}
				dataSource={clientes}
				pagination={false}
				rowKey={(clientes) => clientes._id}
				scroll={{ x: 1200 }}
			/>
			<div className="mt-5">
				<Pagination blogs={clientesPaginados} location={location} history={history} limite={20} />
			</div>
		</Spin>
	);
}

export default Clientes;
