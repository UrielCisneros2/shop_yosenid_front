import React, { useState } from 'react';
import { notification, Modal, Select, Divider, Alert, Avatar, List } from 'antd';
import { formatoMexico } from '../../../config/reuserFunction';
import { AgregarApartado } from './services/consultas_individuales';
import DatosCliente from '../Vista_Producto/subs/datos_cliente';
import aws from '../../../config/aws';

const { Option } = Select;

export default function ModalApartado(props) {
	const [ visible, setVisible ] = props.visible;
	const { carrito, cliente, token } = props;
	const [ tipoEnvio, setTipoEnvio ] = useState('');

	const handleOk = (e) => {
		if (!tipoEnvio) {
			notification.info({
				message: 'Selecciona un tipo de envio',
				duration: 2
			});
		} else {
			let precio;
			if(carrito.promocion && carrito.promocion.length !== 0){
				precio = carrito.promocion.precioPromocion;
			}else{
				precio = carrito.idarticulo.precio;
			}
			AgregarApartado(
				cliente._id,
				carrito.idarticulo._id,
				carrito.cantidad,
				precio,
				carrito.medida,
				tipoEnvio,
				token,
				carrito.idarticulo.tipoCategoria
			);
			setVisible(false);
		}
	};

	const handleCancel = (e) => {
		setVisible(false);
	};

	function obtenerTipoEnvio(value) {
		setTipoEnvio(value);
	}

	return (
		<Modal
			style={{ top: 20 }}
			title="Nuevo Apartado"
			visible={visible}
			onCancel={handleCancel}
			/* cancelText="Cancelar"
			okText={false}
			onOk={false} */
			footer={false}
			width={700}
		>
			<List>
				<List.Item className="row">
					<div className="col-lg-2">
						<Avatar size={64} src={aws + carrito.idarticulo.imagen} />
					</div>
					<div className="col-lg-10">
						<h5>{carrito.idarticulo.nombre}</h5>
						<div className="row">
							<div className="col-lg-3">
								<h6>Cantidad: {carrito.cantidad}</h6>
							</div>
							{carrito.medida.length !== 0 ? (
								<div className="col-lg-3">
									{carrito.medida.map((res) => {
										if (res.talla) {
											return <h6 key={res._id}>Talla: {res.talla}</h6>;
										} else if (res.numero) {
											return <h6 key={res._id}>Talla: {res.numero}</h6>;
										}
										return null;
									})}
								</div>
							) : (
								<div className="d-none" />
							)}
							<div className="col-lg-3">
								{!carrito.promocion ? (
									<h6>Precio: ${formatoMexico(carrito.idarticulo.precio)}</h6>
								) : (
									<h6>Precio: ${formatoMexico(carrito.promocion.precioPromocion)}</h6>
								)}
							</div>
						</div>
					</div>
				</List.Item>
			</List>

			<div className="d-flex justify-content-end mt-3 border-bottom">
				{!carrito.promocion ? (
					<h4>Total: ${formatoMexico(carrito.idarticulo.precio * carrito.cantidad)}</h4>
				) : (
					<h4>Total: ${formatoMexico(carrito.promocion.precioPromocion * carrito.cantidad)}</h4>
				)}
			</div>
			<div className="row mt-4">
				<div className="col-lg-6 text-center">
					<h6 className="font-weight-bold">Elegir tipo de envío: </h6>
					<div>
						<Select style={{ width: 200 }} placeholder="Selecciona un tipo" onChange={obtenerTipoEnvio}>
							<Option value="ENVIO">Envío por paquetería</Option>
							<Option value="REGOGIDO">Recoger a sucursal</Option>
						</Select>
					</div>
				</div>
				<div className="col-lg-6">
					<Alert description="Para apartar un producto completa tus datos." type="info" showIcon />
				</div>
			</div>
			<Divider>Tus datos</Divider>
			<DatosCliente token={token} clienteID={cliente._id} tipoEnvio={tipoEnvio} enviarDatos={[ handleOk ]} />
		</Modal>
	);
}
