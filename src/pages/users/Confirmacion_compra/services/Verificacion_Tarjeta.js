import React, { useState, useEffect } from 'react';
import {
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement,
	Elements,
	useElements,
	useStripe
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { Form, Button, notification } from 'antd';

import './Animacion_Tarjeta.scss';

import img_visa from '../img/logos/visa.png';
import img_mastercard from '../img/logos/mastercard.png';
import chip_tarjeta from '../img/chip-tarjeta.png';
import Spin from '../../../../components/Spin';

export default function Verificacion_Tarjeta(props) {
    const {setIdPago,prev,setCurrent,current} = props;
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_LLAVE);
    return (
        <div>
            <Elements stripe={stripePromise}>
                <CheckoutForm prev={prev} setCurrent={setCurrent} current={current} setIdPago={setIdPago} />
            </Elements>
        </div>
    )
}

const CheckoutForm = (props) => {
	const { prev, setCurrent, current, setIdPago } = props;
	const stripe = useStripe();
	const elements = useElements();

	const [ name, setName ] = useState('');
	const [ postal, setPostal ] = useState('');
	/* 	const [ loading, setLoading ] = useState(false); */

	const [ typeCard, setTypeCard ] = useState('visa');
	const [ numbrerCard, setNumbrerCard ] = useState('');
	const [ dateCard1, setDateCard1 ] = useState('');
	const [ dateCard2, setDateCard2 ] = useState('');
	const [ activeCard, setActiveCard ] = useState('');
	const [ controlClick, setcontrolClick ] = useState(false);
	const [ cvvCard, setCvvCard ] = useState('---');

	useEffect(() => {
		setTypeCard('visa');
		setNumbrerCard('');
		setActiveCard('');
	}, []);

	const rotartarjeta = () => {
		if (!controlClick) {
			setActiveCard('active');
			setcontrolClick(true);
		} else {
			setActiveCard('');
			setcontrolClick(false);
		}
	};

	const cardOnChage = (e) => {
		setActiveCard('');
		if (e.brand === 'visa') {
			setTypeCard('visa');
		} else {
			setTypeCard('mastercard');
		}
		if (!e.complete) {
			setNumbrerCard('#### ### - incomplet');
		} else {
			setNumbrerCard('#### #### #### ####');
		}
	};

	const cardDateOnChange = (e) => {
		setActiveCard('');
		if (e.complete) {
			setDateCard2('AA');
		} else {
			setDateCard1('MM');
		}
	};

	const cvvChange = (e) => {
		setActiveCard('active');
		if (e.complete) {
			setCvvCard('###');
		} else {
			setCvvCard('##-');
		}
	};

	const handleSubmit = async () => {
		if (!stripe || !elements) {
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			return;
		}

		const cardElement = elements.getElement(CardNumberElement);

		const payload = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement,
			billing_details: {
				name,
				address: {
					postal_code: postal
				}
			}
		});

		if (payload.error) {
			notification.error({
				message: 'Error de conexion',
				description: 'Parece que hubo un error con tu tarjeta.'
			});
		} else {
			setIdPago(payload.paymentMethod);
			setCurrent(current + 1);
		}
	};

	return (
		<Spin spinning={!stripe}>
			<div className="">
				<div className="contenedor ">
					<section
						className={`tarjeta ${activeCard} d-none d-md-none d-lg-block`}
						id="tarjeta"
						onClick={rotartarjeta}
					>
						<div className="delantera">
							<div className="logo-marca" id="logo-marca">
								<img src={typeCard === 'visa' ? img_visa : img_mastercard} alt="" />
							</div>
							<img src={chip_tarjeta} className="chip" alt="" />
							<div className="datos">
								<div className="grupo" id="numero">
									<p className="label">Número Tarjeta</p>
									<p className="numero"> {numbrerCard} </p>
								</div>
								<div className="flexbox">
									<div className="grupo" id="nombre">
										<p className="label">Nombre Tarjeta</p>
										<p className="nombre"> {name} </p>
									</div>

									<div className="grupo" id="expiracion">
										<p className="label">Expiración</p>
										<p className="expiracion">
											<span className="mes"> {dateCard1} </span> {dateCard1 ? '/' : ''}{' '}
											<span className="year"> {dateCard2} </span>
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="trasera w-100">
							<div className="barra-magnetica" />
							<div className="datos">
								<div className="grupo" id="firma">
									<p className="label">Firma</p>
									<div className="firma">
										<p>{name}</p>
									</div>
								</div>
								<div className="grupo" id="ccv">
									<p className="label">CCV</p>
									<p className="ccv"> {cvvCard} </p>
								</div>
							</div>
						</div>
					</section>

					<Form onFinish={handleSubmit} className="active mt-5">
						<div className="row">
							<div className="col-lg-12">
								<label htmlFor="cardNumber" className="font-weight-bold">
									Número Tarjeta
								</label>
								<CardNumberElement
									id="cardNumber"
									onChange={(e) => cardOnChage(e)}
									style={{
										fontSize: '18px',
										color: '#424770',
										letterSpacing: '0.025em',
										'::placeholder': {
											color: '#aab7c4'
										}
									}}
									className="form-control"
									onFocus={() => setActiveCard('')}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-12">
								<label htmlFor="name" className="font-weight-bold">
									Nombre
								</label>
								<input
									id="name"
									placeholder="Nombre del propietario"
									value={name}
									onChange={(e) => {
										setName(e.target.value);
										setActiveCard('');
									}}
									className="form-control"
									onFocus={() => setActiveCard('')}
								/>
							</div>
						</div>
						<div className="row mt-3">
							<div className="col-lg-4 col-sm-12">
								<label htmlFor="expiry" className="font-weight-bold">
									Expiración
								</label>
								<CardExpiryElement
									id="expiry"
									onChange={(e) => cardDateOnChange(e)}
									className="form-control mt-0"
									onFocus={() => setActiveCard('')}
								/>
							</div>
							<div className="col-lg-4 col-sm-12">
								<label htmlFor="cvc" className="font-weight-bold">
									CVC
								</label>
								<CardCvcElement
									id="cvc"
									onChange={(e) => {
										cvvChange(e);
									}}
									className="form-control mt-0"
									onFocus={() => setActiveCard('active')}
								/>
							</div>
							<div className="col-lg-4 col-sm-12">
								<label htmlFor="postal" className="font-weight-bold">
									Código postal
								</label>
								<input
									id="postal"
									className="form-control mt-0"
									placeholder="12345"
									value={postal}
									onFocus={() => setActiveCard('')}
									onChange={(e) => {
										setPostal(e.target.value);
										setActiveCard('');
									}}
								/>
							</div>
						</div>
						<div className="steps-action d-flex justify-content-center align-items-center">
							<Button
								htmlType="submit"
								onClick={prev}
								size="large"
								disabled={!stripe}
								className="m-1 color-boton"
							>
								Volver
							</Button>
							<Button htmlType="submit" size="large" disabled={!stripe} className="m-1 color-boton">
								Siguiente
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</Spin>
	);
};
