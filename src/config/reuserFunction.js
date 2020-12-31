/* import { parse } from "dotenv/types";
 */


export const formatoMexico = (number) => {
	if (!number) {
		return null;
	} else {
		let nueva;
		if (number % 1 === 0) {
			nueva = number;
		} else {
			nueva = parseFloat(number).toFixed(2);
		}
		const exp = /(\d)(?=(\d{3})+(?!\d))/g;
		const rep = '$1,';
		return  nueva.toString().replace(exp, rep);
	}
};

export const formatoFecha = (fecha) => {
	if (!fecha) {
		return null;
	} else {
		var newdate = new Date(fecha);
		return newdate.toLocaleDateString('es-MX', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
	}
};

export const formatoHora = (hora) => {
	if (!hora) {
		return null;
	} else {
		var newtime = new Date(hora);
		return newtime.toLocaleTimeString('en-US', { hour12: 'false' });
	}
};

export const agregarPorcentaje = (precio_descuento, precio_producto) => {
	var porcentaje = Math.round(precio_descuento / precio_producto * 100);
	var descuento = 100 - porcentaje;
	return descuento;
}