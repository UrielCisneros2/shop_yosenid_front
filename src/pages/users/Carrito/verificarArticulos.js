
export function verificarArticulos(carrito) {
	if (carrito.idarticulo.tallas.length !== 0) {
		const talla = carrito.idarticulo.tallas.map((tallas) => {
			if (carrito.medida && carrito.medida[0].talla === tallas.talla) {
				return carrito.medida[0].talla;
			}else {
                return null
            }
        });
        return talla.filter((talla) => talla !== null);
	} else if (carrito.idarticulo.numeros.length !== 0) {
		const numero = carrito.idarticulo.numeros.map((numeros) => {
			if (carrito.medida && carrito.medida[0].numero === numeros.numero) {
				return carrito.medida[0].numero
			} else {
				return null;
			}
        });
        return numero.filter((talla) => talla !== null);
	}
}
