import clienteAxios from '../../../../config/axios';
import { notification, message } from 'antd';

export async function AgregarPedido(idcliente, idproducto, categoria, cantidad, talla, precio, total, token) {
	var pedido = [];

	const medida = talla.map((res) => {
		if (res.talla) {
			return res.talla;
		} else if (res.numero) {
			return res.numero;
		}
		return null;
	});

	switch (categoria) {
		case 'Ropa':
			pedido = [
				{
					producto: idproducto,
					cantidad: cantidad,
					talla: medida[0],
					precio: precio
				}
			];
			break;
		case 'Calzado':
			pedido = [
				{
					producto: idproducto,
					cantidad: cantidad,
					numero: medida[0],
					precio: precio
				}
			];
			break;
		case 'Otros':
			pedido = [
				{
					producto: idproducto,
					cantidad: cantidad,
					precio: precio
				}
			];
			break;
		default:
			break;
	}

	await clienteAxios
		.post(
			'/pedidos/',
			{
				cliente: idcliente,
				pedido: pedido,
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
		.catch((res) => {
			if (res.response.status === 404 || res.response.status === 500) {
				return notification.error({
					message: 'Error',
					description: res.response.data.message,
					duration: 2
				});
			} else {
				return notification.error({
					message: 'Error',
					description: 'Hubo un error',
					duration: 2
				});
			}
		});
}

export async function AgregarApartado(idcliente, idproducto, cantidad, precio, talla, tipoEntrega, token, categoria) {
	var apartado = [];
	const medida = talla.map((res) => {
		if (res.talla) {
			return res.talla;
		} else if (res.numero) {
			return res.numero;
		}
		return null
	});
	switch (categoria) {
		case 'Ropa':
			apartado = {
				producto: idproducto,
				cliente: idcliente,
				cantidad: cantidad,
				precio: precio,
				medida: [ { talla: medida[0] } ],
				estado: 'PROCESANDO',
				tipoEntrega: tipoEntrega
			};
			break;
		case 'Calzado':
			apartado = {
				producto: idproducto,
				cliente: idcliente,
				cantidad: cantidad,
				precio: precio,
				medida: [ { numero: medida[0] } ],
				estado: 'PROCESANDO',
				tipoEntrega: tipoEntrega
			};
			break;
		case 'Otros':
			apartado = {
				producto: idproducto,
				cliente: idcliente,
				cantidad: cantidad,
				precio: precio,
				estado: 'PROCESANDO',
				tipoEntrega: tipoEntrega
			};
			break;
		default:
			break;
	}

	await clienteAxios
		.post(`/apartado/nuevo/${idcliente}`, apartado, {
			headers: {
				Authorization: `bearer ${token}`
			}
		})
		.then((res) => {
			return message.success(res.data.message);
		})
		.catch((res) => {
			if (res.response.status === 404 || res.response.status === 500) {
				return notification.error({
					message: 'Error',
					description: res.response.data.message,
					duration: 2
				});
			} else {
				return notification.error({
					message: 'Error',
					description: 'Hubo un error',
					duration: 2
				});
			}
		});
}

export async function EliminarArticuloCarrito(idcliente, articulo, token) {
	await clienteAxios
		.delete(`/carrito/${idcliente}/articulo/${articulo}`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		})
		.then((res) => {
			return message.success(res.data.message);
		})
		.catch((res) => {
			if (res.response.status === 404 || res.response.status === 500) {
				return notification.error({
					message: 'Error',
					description: res.response.data.message,
					duration: 2
				});
			} else {
				return notification.error({
					message: 'Error',
					description: 'Hubo un error',
					duration: 2
				});
			}
		});
	return true;
}
