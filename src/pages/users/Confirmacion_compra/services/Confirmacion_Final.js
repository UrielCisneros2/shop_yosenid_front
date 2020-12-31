/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect, useContext } from 'react';
import Traer_pedido from './traer_pedido';
import { Button ,notification} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import clienteAxios from '../../../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { MenuContext } from '../../../../context/carritoContext';
import Spin from '../../../../components/Spin';

import './Confirnacion_Final.scss';

export default function Confirmacion_Final(props) {
	const { active, setActive } = useContext(MenuContext);
	const { datosPedido, idPago, pedidoCompleto, token, history,datosActualizados } = props;
	const [ direccion, setDireccion ] = useState({});
	const [ datosEnvio, setDatosEnvio ] = useState({});
	const [ total, setTotal ] = useState(null);
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		setDireccion(datosActualizados);
		traerCostosEnvio();
		setLoading(true);
	}, []);

	const traerCostosEnvio = async () => {
		await clienteAxios
			.get('/politicasEnvio/')
			.then((res) => {
				setLoading(false);
				setDatosEnvio(res.data);
				if (res.data.descuento) {
					if (pedidoCompleto.total >= res.data.promocionEnvio) {
						setTotal(
							parseFloat(pedidoCompleto.total) +
								parseFloat(res.data.costoEnvio) -
								parseFloat(res.data.descuento)
						);
					} else {
						setTotal(parseFloat(pedidoCompleto.total) + parseFloat(res.data.costoEnvio));
					}
				} else {
					setTotal(parseFloat(pedidoCompleto.total) + parseFloat(res.data.costoEnvio));
				}
			})
			.catch((error) => {
				
			});
	};

	const crearPago = async () => {
		setLoading(true);
		const datos = {
			total
		};
		await clienteAxios
			.put(`/pedidos/pedido/total/${pedidoCompleto._id}`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then(async (res) => {
				let centavo = Math.round(100 * parseFloat(total));
				const newPedido = pedidoCompleto;
				newPedido.total = total;
				const datosPago = {
					sesionStripe: idPago,
					pedidoCompleto: newPedido,
					amount: centavo
				};
				await clienteAxios
					.post('/pago/', datosPago, {
						headers: {
							Authorization: `bearer ${token}`
						}
					})
					.then((res) => {
						setLoading(false);
						history.push(`/success/${pedidoCompleto._id}`);
						setActive(!active);
					})
					.catch((error) => {
						setLoading(false);
						if(error.response){
							history.push(`/error/${pedidoCompleto._id}/${error.response.data.err.code}`);
						}else{
							notification.error({
								message: 'Error de conexion.',
								description:
								  'Al parecer no se a podido conectar al servidor.',
							  });
						}
					});
			})
			.catch((error) => {
				setLoading(false);
				history.push(`/error/${pedidoCompleto._id}`);
			});
	};

	return (
		<Spin spinning={loading}>
			<div className="d-flex justify-content-center">
				<h3 className="font-weight-bold">Resumen de compra</h3>
			</div>
			<div className="shadow-lg bg-white rounded confirmacion_final">
				<div className="row">
					<div className="col-lg-6 info-domicilio">
						<div>
							<div className="mt-3">
								<div className="contenedor-direccion-conf shadow-sm">
									<p className="h4 font-weight-bold">Dirección de envío</p>
									<div className="row m-0">
										<div className="col-lg-3 col-sm-none text-center icono-info">
											<FontAwesomeIcon
												className="text-success"
												icon={faTruck}
												style={{ fontSize: '50px' }}
											/>
										</div>
										<div className="col-lg-9 col-sm-12 m-sm-2 contenido-info">
											<p className="h6">
												{direccion.calle_numero}, {direccion.entre_calles}, {direccion.colonia},{' '}
												{direccion.ciudad}, {direccion.estado}, {direccion.pais}, CP{' '}
												{direccion.cp}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="shadow-sm contenedor-info-pago">
								<p className="h4 font-weight-bold">Información de pago</p>
								<div className="row my-3 mx-0">
									<div className="col-lg-3 col-sm-12 text-center icono-info">
										<FontAwesomeIcon
											className={'visa'}
											icon={idPago.card.brand === 'visa' ? faCcVisa : faCcMastercard}
											style={{ fontSize: '50px' }}
										/>
									</div>
									<div className="col-lg-7 m-2 contenido-info">
										<p className="h6">
											<span className="font-weight-bold">Tipo tarjeta:</span>{' '}
											{idPago.card.funding}{' '}
										</p>
										<p className="h6">
											<span className="font-weight-bold">Tarjeta:</span> *********{idPago.card.last4}{' '}
										</p>
										<p className="h6">
											<span className="font-weight-bold">Expira:</span> {idPago.card.exp_month}/{idPago.card.exp_year}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-6">
						<Traer_pedido
							setTotal={setTotal}
							datosEnvio={datosEnvio}
							datosPedido={datosPedido}
							pedidoCompleto={pedidoCompleto}
						/>
					</div>
				</div>
				<div className="d-flex flex-row-reverse justify-content-center align-items-center text-center pb-3 mr-5 mt-5">
					<Button size="large" className="color-boton" style={{ width: 200, textAlign: 'center' }} onClick={crearPago}>
						<ShoppingCartOutlined /> COMPRAR AHORA
					</Button>
				</div>
			</div>
		</Spin>
	);
}
