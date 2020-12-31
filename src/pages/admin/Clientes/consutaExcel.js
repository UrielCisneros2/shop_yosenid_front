import React, { useState, useEffect, Fragment } from 'react';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';

import { Row, Button } from 'antd';

import ReactExport from 'react-export-excel'; //LIBRERIA EXCEL
import { withRouter } from 'react-router-dom';
const ExcelFile = ReactExport.ExcelFile; //ARCHIVO DE EXCEL
const ExcelSheet = ReactExport.ExcelSheet; //HOJA DE EXCEL
const ExcelColumn = ReactExport.ExcelColumn; //COLUMNA DE EXCEL

function ConsutaExcel(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	const [ consulta, setConsulta ] = useState([]);
	//const [data, setData] = useState([]);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	if (token === '' || token === null) {
		props.history.push('/entrar');
	} else if (decoded['rol'] !== true) {
		props.history.push('/');
	}

	const obtenerConsulta = async () => {
		await clienteAxios
			.get(`/cliente/todos/`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setConsulta(res.data);
			})
			.catch((res) => {});
	};

	useEffect(() => {
		obtenerConsulta();
	}, []);

	const datos = consulta.map((datos) => {
		const clientes = {};

		clientes.nombre = `${datos.nombre} ${datos.apellido}`;
		clientes.telefono = datos.telefono;
		clientes.email = datos.email;

		if (datos.direccion.length === 0) {
			clientes.direccion = '';
			clientes.ciudad = '';
		} else {
			clientes.direccion = `${datos.direccion[0].calle_numero} ${datos.direccion[0].colonia}`;
			clientes.ciudad = `${datos.direccion[0].ciudad}, ${datos.direccion[0].estado}, ${datos.direccion[0].pais}`;
		}

		return clientes;
	});

	return (
		<Fragment>
			<Row justify="center">
				<ExcelFile
					element={
						<Button size="large" type="primary">
							Descargar datos de clientes
						</Button>
					}
					filename="Datos Clientes"
				>
					<ExcelSheet data={datos} name="Datos de clientes">
						<ExcelColumn label="Nombre" value="nombre" />
						<ExcelColumn label="Telefonos" value="telefono" />
						<ExcelColumn label="E-mail" value="email" />
						<ExcelColumn label="Domicilio" value="direccion" />
						<ExcelColumn label="Ciudad" value="ciudad" />
					</ExcelSheet>
				</ExcelFile>
			</Row>
		</Fragment>
	);
}

export default withRouter(ConsutaExcel);
