import React, { useState, useEffect } from 'react';
import { Result, Button, notification, Divider } from 'antd';
import { Avatar } from 'antd';
import clienteAxios from '../../../config/axios';
import { formatoMexico } from '../../../config/reuserFunction';
import './success.scss';
import { Link } from 'react-router-dom';
import aws from '../../../config/aws';
import Spin from '../../../components/Spin';

export default function Success(props) {
	const pedidoID = props.match.params.id;
	const [ pedido, setPedido ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const token = localStorage.getItem('token');

	const obtenerPedido = async () => {
		setLoading(true);
		await clienteAxios
			.get(`/pedidos/pedido/${pedidoID}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				if(res.data.length === 0){
					props.history.push('/');
				}
				setPedido(res.data);
				setLoading(false);
			})
			.catch((err) => {
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
	};

	useEffect(() => {
		if (!token) {
			props.history.push('/');
		} else {
			obtenerPedido();
		}
	}, []);

	if (pedido.pedido) {
		var avatar_productos = pedido.pedido.map((pedido) => {
			return (
				<Avatar
					size={75}
					key={pedido._id}
					src={aws+pedido.producto.imagen}
				/>
			);
		});
		var nombre_productos = pedido.pedido.map((pedido) => {
			return <p key={pedido._id}>{pedido.producto.nombre}</p>;
		});
	}

	return (
		<div className="contenedor-bgcolor-success">
			<div className="contenedor-success m-5 shadow-lg">
				<Spin spinning={loading}>
					<Result
						className="result-pago"
						icon={
							<div
								className="swal2-icon swal2-success swal2-animate-success-icon"
								style={{ display: 'flex' }}
							>
								<div
									className="swal2-success-circular-line-left"
									style={{ backgroundColor: 'rgb(255, 255, 255)' }}
								/>
								<span className="swal2-success-line-tip" />
								<span className="swal2-success-line-long" />
								<div className="swal2-success-ring" />
								<div className="swal2-success-fix" style={{ backgroundColor: 'rgb(255, 255, 255)' }} />
								<div
									className="swal2-success-circular-line-right"
									style={{ backgroundColor: 'rgb(255, 255, 255)' }}
								/>
							</div>
						}
						title="Pago realizado exitosamente"
						subTitle={
							<div>
								<p>
									El ID del pedido es <strong> {pedido._id}</strong>
								</p>
								<Divider>Detalles del pedido</Divider>
								<div className="m-2">{avatar_productos}</div>
								<div className="mt-4">
									<h6>Productos:</h6>
									<div>{nombre_productos}</div>
								</div>
								<div className="mt-3">
									<h5>Total del pedido:</h5>
									<h4>${formatoMexico(pedido.total)}</h4>
								</div>
							</div>
						}
						extra={[
							<Link to="/">
								<Button type="primary" className="mb-3 color-boton">
									Ir a Pagina principal
								</Button>
							</Link>
						]}
					/>
				</Spin>
			</div>
		</div>
	);
}
