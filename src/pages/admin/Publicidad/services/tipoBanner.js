import React, { useState } from 'react';
import { Button, Spin, Collapse, notification } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import ImagenEstilo1 from '../imagenes/estilo1.png';
import ImagenEstilo3 from '../imagenes/estilo3.png';
import ImagenEstilo5 from '../imagenes/estilo5.png';
import ImagenEstilo6 from '../imagenes/estilo6.png';
import clienteAxios from '../../../../config/axios';
import { withRouter } from 'react-router-dom';

const { Panel } = Collapse;

function RegistroTipoBanner(props) {
	const [ loadingBackDrop, setLoadingBackDrop ] = useState(false);
	const token = localStorage.getItem('token');

	const crearBannerBD = async (estilo) => {
		setLoadingBackDrop(true);
		await clienteAxios
			.post(
				`/banner/`,
				{ estilo, publicado: false },
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setLoadingBackDrop(false);
				props.history.push(`/admin/banner/nuevo/${res.data.userStored._id}`);
			})
			.catch((err) => {
				setLoadingBackDrop(false);
				if (err.response) {
					notification.error({
						message: 'Error',
						description: err.response.data.message,
						duration: 2
					});
				} else {
					notification.error({
						message: 'Error de conexion',
						description: 'Al parecer no se a podido conectar al servidor.',
						duration: 2
					});
				}
			});
	};

	return (
		<div>
			<Collapse ghost>
				<Panel
					showArrow={false}
					header={
						<div className="d-flex justify-content-end">
							<Button
								type="primary"
								size="large"
								className="d-flex justify-content-center align-items-center"
								icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}
							>
								Nueva sección
							</Button>
						</div>
					}
					key="1"
				>
					<Spin size="large" spinning={loadingBackDrop}>
						<div className="row d-flex justify-content-around shadow">
							<div>
								<div
									className="my-3 shadow rounded d-flex justify-content-center align-items-center estilo-hover"
									style={{ cursor: 'pointer' }}
									onClick={() => crearBannerBD(1)}
								>
									<img
										alt="estilo 1"
										src={ImagenEstilo1}
										className="imagen-estilos"
										width="250"
										height="200"
									/>
								</div>
							</div>
							<div>
								<div
									className="my-3 shadow rounded d-flex justify-content-center align-items-center estilo-hover"
									style={{ cursor: 'pointer' }}
									onClick={() => crearBannerBD(2)}
								>
									<img
										alt="estilo 2"
										src={ImagenEstilo3}
										className="imagen-estilos"
										width="250"
										height="200"
									/>
								</div>
							</div>
							<div>
								<div
									className="my-3 shadow rounded d-flex justify-content-center align-items-center estilo-hover"
									style={{ cursor: 'pointer' }}
									onClick={() => crearBannerBD(3)}
								>
									<img
										alt="estilo 3"
										src={ImagenEstilo5}
										className="imagen-estilos"
										width="250"
										height="200"
									/>
								</div>
							</div>
							<div>
								<div
									className="my-3 shadow rounded d-flex justify-content-center align-items-center estilo-hover"
									style={{ cursor: 'pointer' }}
									onClick={() => crearBannerBD(4)}
								>
									<img
										alt="estilo 4"
										src={ImagenEstilo6}
										className="imagen-estilos"
										width="250"
										height="200"
									/>
								</div>
							</div>
						</div>
					</Spin>
				</Panel>
			</Collapse>
		</div>
	);
}
export default withRouter(RegistroTipoBanner);
