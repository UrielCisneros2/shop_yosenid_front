import React from 'react';
import MostrarDatosProductos from './MostrarDatosCarrito';
import { CarritoProvider } from './context_carrito/context-carrito';

export default function ShoppingCart() {
	return (
		<div className="container">
			<div style={{ background: 'white' }} className="shadow">
				<CarritoProvider>
					<MostrarDatosProductos />
				</CarritoProvider>
			</div>
		</div>
	);
}
