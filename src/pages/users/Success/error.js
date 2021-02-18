import React, { useEffect } from 'react';
import { Result, Button } from 'antd';
import './success.scss';
import { Link } from 'react-router-dom';

export default function ErrorPago(props) {
	const pedidoID = props.match.params.id;
	const error = props.match.params.error;
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!token) {
			props.history.push('/');
		}
	}, []);

	return (
		<div className="contenedor-bgcolor-error">
			<div className="contenedor-error m-5 shadow-lg">
				<Result
					icon={
						<div className="swal2-icon swal2-error swal2-animate-error-icon" style={{ display: 'flex' }}>
							<span className="swal2-x-mark">
								<span className="swal2-x-mark-line-left" />
								<span className="swal2-x-mark-line-right" />
							</span>
						</div>
					}
					title="Tu pago no ha sido aprovado"
					subTitle={error}
					extra={[
						<Link key="principal" to="/">
							<Button type="primary" className="color-boton">
								Ir a pagina principal
							</Button>
						</Link>,
                        // <Link key="reintentar" to={`/confirmacion_compra/${pedidoID}`}>
                        //     <Button type="primary" ghost className="mb-3 color-boton-sec">
                        //         Reintentar
                        //     </Button>
                        // </Link>
					]}
				/>
			</div>
		</div>
	);
}
