import clienteAxios from '../../../../config/axios';
import { message } from 'antd';

export async function actualizarCantidad(cliente, articulo, categoria, cantidad, medida, token) {
    var datos = {};
	switch (categoria) {
		case 'Otros':
            datos = {
                cantidad: cantidad
            }
			break;
		case 'Ropa':
            datos = {
                cantidad: cantidad,
                talla: medida
            }
			break;
		case 'Calzado':
            datos = {
                cantidad: cantidad,
                numero: medida
            }
			break;
		default:
			break;
	}

	await clienteAxios
		.put(`/carrito/${cliente}/articulo/${articulo}`, datos, {
			headers: {
				Authorization: `bearer ${token}`
			}
		})
		.then((res) => {
            message.success(res.data.message);
		})
		.catch((err) => {
        });
        return true;
}
