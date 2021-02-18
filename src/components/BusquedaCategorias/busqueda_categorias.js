import React, { Fragment, useState, useEffect, useContext } from 'react';
import clienteAxios from '../../config/axios';
import { notification, Row, Breadcrumb, Button } from 'antd';
import Card_Producto from '../../pages/users/Productos/Cards_Normales/card_producto'
import Spin from '../Spin';
import './busqueda_categorias.scss';
import { MenuContext } from '../../context/carritoContext';

function BusquedaCategorias(props) {
	const categoria = props.match.params.categoria;
	const subcategoria = props.match.params.subcategoria;
	const temporada = props.match.params.temporada;
	const genero = props.match.params.genero;

	const [ loading, setLoading ] = useState(false);
	const [ resultado, setResultado ] = useState([]);
	const { reloadFilter, setReloadFilter } = useContext(MenuContext);
	const [ todosProductos, setTodosProductos ] = useState(false);


	const obtenerFiltrosDivididos = async (categoria, subcategoria, temporada, genero) => {
		let cat = categoria;
		let sub = subcategoria;
		let temp = temporada;
		let gen = genero;

		if (categoria === 'null') {
			cat = '';
		}
		if (subcategoria === 'null') {
			sub = '';
		}
		if (genero === 'null' || genero === 'Todos') {
			gen = '';
		}
		if(temporada === 'null'){
			temp = '';
		}

		

		setLoading(true);
		await clienteAxios
			.get(`/productos/filter?categoria=${cat}&subcategoria=${sub}&genero=${gen}&temporada=${temp}`)
			.then((res) => {
				setResultado(res.data.posts);
				setLoading(false);
				setTodosProductos(false);
			})
			.catch((err) => {
				setLoading(false);
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

	const obtenerTodos = async () => {
		await clienteAxios
			.get(`/productos/sinPaginacion`)
			.then((res) => {
				setResultado(res.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
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
	}

	const limpiarFiltros = () => {
		setReloadFilter(!reloadFilter);
		obtenerTodos();
		setTodosProductos(true);
	}

	useEffect(() => {
		return () => {
			limpiarFiltros();
		}
	}, [])

	useEffect(
		() => {
			obtenerFiltrosDivididos(categoria, subcategoria, temporada, genero);
		},
		[ props ]
	);

	const result = resultado.map((productos) => <Card_Producto key={productos._id} productos={productos} />);

	return (
		<Fragment>
			<Spin spinning={loading}>
				<div className="my-4 mx-3">
					<h3 className="d-inline mr-3 font-prin">{resultado.length} resultados en: </h3>
					{todosProductos ? (
						<h3  className="d-inline font-prin">Todos los productos</h3>
					): (
						<Breadcrumb separator=">" className="d-inline font-prin">
							<Breadcrumb.Item className="bread-font">{categoria !== 'null' ? categoria : null}</Breadcrumb.Item>
							<Breadcrumb.Item className="bread-font">{subcategoria !== 'null' ? subcategoria : null}</Breadcrumb.Item>
							<Breadcrumb.Item className="bread-font">{temporada !== 'null' ? temporada : null}</Breadcrumb.Item>
							<Breadcrumb.Item className="bread-font">{genero !== 'null' ? genero : null}</Breadcrumb.Item>
						</Breadcrumb>
					)}
					<div>
						<Button type="primary" size="large" className="mt-3" onClick={limpiarFiltros}>
							Limpiar filtros
						</Button>
					</div>
				</div>
				<div className="d-flex justify-content-center align-items-center">
					<div className="">
						<Row gutter={10} style={{ maxWidth: '95vw' }} className=" mt-4">
							{result}
						</Row>
					</div>
				</div>
			</Spin>
		</Fragment>
	);
}

export default BusquedaCategorias;
