import clienteAxios from '../../../../config/axios';
import { notification } from 'antd';

export async function AgregarPedidoCarrito(idcliente, token) {
	/* idcliente, idproducto, categoria, cantidad, talla, precio, total, token */
	const res = await clienteAxios
        .get(`/carrito/${idcliente}`, {
            headers: {
                Authorization: `bearer ${token}`
            }
		})
	
	const nuevo = res.data.articulos.map((res) => {
		if(res.idarticulo.activo === false){
            return [];
        }else if(res.idarticulo.eliminado && res.idarticulo.eliminado === true){
            return [];
        }else{
            return res;
        }
	});

	var carrito = nuevo.filter((arr) => arr.length !== 0);

	var pedido = [];

	carrito.forEach((carrito) => {
		const medida = carrito.medida.map((res) => {
			if (res.talla) {
				return res.talla;
			} else if (res.numero) {
				return res.numero;
            }
            return null;
        });
		var precio;
		
        if(!carrito.promocion){
            precio = carrito.idarticulo.precio
        }else{
            precio = carrito.promocion.precioPromocion
        }

		switch (carrito.idarticulo.tipoCategoria) {
			case 'Ropa':
				pedido.push(
					{
						producto: carrito.idarticulo._id,
						cantidad: carrito.cantidad,
						talla: medida[0],
						precio: precio
					}
				);
				break;
			case 'Calzado':
				pedido.push(
					{
						producto: carrito.idarticulo._id,
						cantidad: carrito.cantidad,
						numero: medida[0],
						precio: precio
					}
				);
				break;
			case 'Otros':
				pedido.push(
					{
						producto: carrito.idarticulo._id,
						cantidad: carrito.cantidad,
						precio: precio
					}
				);
				break;
			default:
				break;
        }
	});

	var subtotal = 0;
	var total = 0;

	carrito.forEach((res) => {
		if(res.promocion){
			subtotal += res.promocion.precioPromocion * res.cantidad
		}else{
			subtotal += res.idarticulo.precio * res.cantidad
		}
		total = subtotal;
	});

	await clienteAxios
		.post(
			'/pedidos/',
			{
				cliente: idcliente,
				pedido: pedido,
				total: total,
				estado_pedido: 'En proceso',
				carrito: true,
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
