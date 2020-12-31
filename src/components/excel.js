import React, { useState } from 'react';
import { Button, notification, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import clienteAxios from '../config/axios';

export default function GetDataFromExcelJusTInput(props) {
	const [ hojas, setHojas ] = useState([]);
	const [ reload, setReload ] = props.reload;

	const [ fileList, setFileList ] = useState([]);
	const [ uploading, setUploading ] = useState(false);

	const propsUlpload = {
		multiple: false,
		beforeUpload: (file) => {
			if (
				file.type === 'application/vnd.ms-excel' ||
				file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
				file.type === 'application/vnd.ms-excel.sheet.macroEnabled.12' 
			) {
				return false;
			}else {
				notification.error({
					message: 'Solo se admiten archivos csv',
					duration: 2
				});
			}
			
		},
		onChange({ file, fileList }) {
			setFileList(fileList);
			let hojas = [];
			if (!file.status ) {
				let reader = new FileReader();
				reader.readAsArrayBuffer(file);
				reader.onloadend = (e) => {
					var data = new Uint8Array(e.target.result);
					var workbook = XLSX.read(data, { type: 'array' });

					workbook.SheetNames.forEach(function(sheetName) {
						// Here is your object
						var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
						hojas.push({
							data: XL_row_object,
							sheetName
						});
					});
					setHojas(hojas);
				};
			}
		},
		fileList: fileList
	};

	const enviarDatos = () => {
		setUploading(true);
		const token = localStorage.getItem('token');
		clienteAxios
			.put('/productos/inventario/excel/', hojas[0], {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setReload(!reload);
				setUploading(false);
				setHojas([]);
				setFileList([]);
				notification.success({
					message: 'Registros actualizados',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((err) => {
				setUploading(false);
				if (err.response) {
					notification.error({
						message: 'Error',
						description: 'hubo un error al cargar el archivo',
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
		<div className="ml-2 mb-3 d-flex">
			<Upload {...propsUlpload} className="d-inline-flex mx-3">
				<Button size="large" icon={<UploadOutlined />} disabled={fileList.length >= 1}>
					Cargar csv
				</Button>
			</Upload>
			<Button
				className="d-inline-flex"
				type="primary"
				size="large"
				onClick={enviarDatos}
				disabled={fileList.length === 0}
				loading={uploading}
			>
				{uploading ? 'Cargando...' : 'Cargar archivo'}
			</Button>
		</div>
	);
}
