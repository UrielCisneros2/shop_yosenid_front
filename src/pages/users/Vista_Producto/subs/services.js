import clienteAxios from '../../../../config/axios';
import { notification } from 'antd';

export async function AgregarCarrito(idcliente, idproducto, cantidad, talla, numero, token) {
	await clienteAxios
		.post(
			`/carrito/nuevo/${idcliente}`,
			{
				cliente: idcliente,
				articulos: [
					{ idarticulo: idproducto, cantidad: cantidad, medida: [ { talla: talla, numero: numero } ] }
				]
			},
			{
				headers: {
					Authorization: `bearer ${token}`
				}
			}
		)
		.then((res) => {
			return notification.success({
				message: 'Se añadio un articulo a tu carrito',
				duration: 2
			});
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
	return true;
}

export async function AgregarApartado(idcliente, idproducto, cantidad, precio, talla, numero, tipoEntrega, token) {
	if (talla) {
		await clienteAxios
			.post(
				`/apartado/nuevo/${idcliente}`,
				{
					producto: idproducto,
					cliente: idcliente,
					cantidad: cantidad,
					precio: precio,
					medida: [ { talla: talla } ],
					estado: 'PROCESANDO',
					tipoEntrega: tipoEntrega
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				return notification.success({
					message: "Pedido apartado.",
					duration: 2
				});
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
	} else if (numero) {
		await clienteAxios
			.post(
				`/apartado/nuevo/${idcliente}`,
				{
					producto: idproducto,
					cliente: idcliente,
					cantidad: cantidad,
					precio: precio,
					medida: [ { numero: numero } ],
					estado: 'PROCESANDO',
					tipoEntrega: tipoEntrega
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				return notification.success({
					message: res.data.message,
					duration: 2
				});
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
	} else if (!talla && !numero) {
		await clienteAxios
			.post(
				`/apartado/nuevo/${idcliente}`,
				{
					producto: idproducto,
					cliente: idcliente,
					cantidad: cantidad,
					precio: precio,
					estado: 'PROCESANDO',
					tipoEntrega: tipoEntrega
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				return notification.success({
					message: res.data.message,
					duration: 2
				});
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
	}
}

export async function AgregarPedido(idcliente, idproducto, cantidad, talla, numero, precio, total, token) {
	if (!numero) {
		await clienteAxios
			.post(
				'/pedidos/',
				{
					cliente: idcliente,
					pedido: [
						{
							producto: idproducto,
							cantidad: cantidad,
							talla: talla,
							precio: precio
						}
					],
					total: total,
					estado_pedido: 'En proceso'
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				window.location.href = `/confirmacion_compra/${res.data.pedido._id}`;
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
	} else if (!talla) {
		await clienteAxios
			.post(
				'/pedidos/',
				{
					cliente: idcliente,
					pedido: [
						{
							producto: idproducto,
							cantidad: cantidad,
							numero: numero,
							precio: precio
						}
					],
					total: total,
					estado_pedido: 'En proceso'
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				window.location.href = `/confirmacion_compra/${res.data.pedido._id}`;
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
	} else if (!talla && !numero) {
		await clienteAxios
			.post(
				'/pedidos/',
				{
					cliente: idcliente,
					pedido: [
						{
							producto: idproducto,
							cantidad: cantidad,
							precio: precio
						}
					],
					total: total,
					estado_pedido: 'En proceso'
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				window.location.href = `/confirmacion_compra/${res.data.pedido._id}`;
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
	}
}
