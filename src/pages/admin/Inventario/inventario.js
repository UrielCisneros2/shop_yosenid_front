import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import { Input, notification, Row, Tabs } from 'antd';
import './inventario.scss';
import queryString from 'query-string';
import GetDataFromExcelJusTInput from '../../../components/excel';
import InventarioOtros from './tablas_inventarios/inventario_otros';
import InventarioTallas from './tablas_inventarios/inventario_tallas';
import InventarioNumeros from './tablas_inventarios/inventario_numeros';

const { Search } = Input;
const { TabPane } = Tabs;

function Inventario(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);
	//Tomar la paginacion actual
	const { location } = props;
	const { page = 1 } = queryString.parse(location.search);
	const limite = 20;
	const [ loading, setLoading ] = useState(false);
	const [ categorias, setCategorias ] = useState([]);
	/* const [ tipoCategoria, setTipoCategoria ] = useState(''); */
	const [ productos, setProductos ] = useState([]);
	const [ productosRender, setProductosRender ] = useState([]);
	const [ reload, setReload ] = useState(true);

	const tipoCategoria = props.match.params.tipoCategoria;

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

	useEffect(() => {
		obtenerCategorias();
	}, []);

	useEffect(
		() => {
			obtenerProductos(tipoCategoria, limite, page);
		},
		[ page, reload, props ]
	);

	/* useEffect(
		() => {
			obtenerProductos(tipoCategoria, limite, page)
		},
		[ page, reload, props ]
	);
 */
	const obtenerCategorias = async () => {
		await clienteAxios
			.get('/productos/tipoCategorias', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				if (res.data.length !== 0) {
					setCategorias(res.data);
					/* obtenerProductos(res.data[0]._id, limite, page);  */

					/* setTipoCategoria(res.data[0]._id); */
					props.history.push(`/admin/inventario/${res.data[0]._id}`);
				}
			})
			.catch((err) => {
				setLoading(false);
				error(err);
			});
	};

	const obtenerProductosFiltrados = async (busqueda) => {
		if (!busqueda) {
			obtenerProductos(tipoCategoria, limite, page);
		} else {
			setLoading(true);
			await clienteAxios
				.get(
					`/productos/search/admin?codigo=${busqueda}&nombre=${busqueda}&categoria=${busqueda}&subcategoria=${busqueda}&genero=${busqueda}&color=${busqueda}&temporada=${busqueda}`
				)
				.then((res) => {
					const otros = res.data.posts.filter((element) => element.tipoCategoria === tipoCategoria);
					setProductosRender(otros);
					setProductos(res.data.posts);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
					error(err);
				});
		}
	};

	const obtenerProductos = async (tipoCategoria, limit, page) => {
		/* setTipoCategoria(tipoCategoria); */
		setLoading(true);
		await clienteAxios
			.get(`/productos/filter/individuales?tipoCategoria=${tipoCategoria}&limit=${limit}&page=${page}`)
			.then((res) => {
				setProductosRender(res.data.posts.docs);
				setProductos(res.data.posts);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				error(err);
			});
	};

	function error(err) {
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
	}

	const tabs = categorias.map((categorias) => {
		if (categorias._id === 'Otros') {
			return (
				<TabPane tab="Inventario" key={categorias._id}>
					<InventarioOtros
						token={token}
						productos={productos}
						productosRender={productosRender}
						reload={reload}
						setReload={setReload}
						loading={loading}
						setLoading={setLoading}
						page={page}
						limite={limite}
					/>
				</TabPane>
			);
		} else if (categorias._id === 'Ropa') {
			return (
				<TabPane tab="Inventario tallas" key={categorias._id}>
					<InventarioTallas
						token={token}
						productos={productos}
						productosRender={productosRender}
						reload={reload}
						setReload={setReload}
						loading={loading}
						setLoading={setLoading}
						page={page}
						limite={limite}
					/>
				</TabPane>
			);
		} else if (categorias._id === 'Calzado') {
			return (
				<TabPane tab="Inventario calzado" key={categorias._id}>
					<InventarioNumeros
						token={token}
						productos={productos}
						productosRender={productosRender}
						reload={reload}
						setReload={setReload}
						loading={loading}
						setLoading={setLoading}
						page={page}
						limite={limite}
					/>
				</TabPane>
			);
		}
		return <div />;
	});

	const searchBar = (
		<div className="row mw-100 search-container">
			<Search
				className="col-lg-7 search-width px-0"
				placeholder="Busca un producto"
				onSearch={(value) => obtenerProductosFiltrados(value)}
				style={{ height: 40, marginBottom: 10, width: 400 }}
				enterButton="Buscar"
				size="large"
			/>
			<div className="col-lg-5 pl-0 pr-4">
				<GetDataFromExcelJusTInput reload={[ reload, setReload ]} />
			</div>
		</div>
	);

	return (
		<div>
			<Row justify="center" className="search-container-responsive">
				<Search
					className="search-width"
					placeholder="Busca un producto"
					onSearch={(value) => obtenerProductosFiltrados(value)}
					style={{ height: 40, marginBottom: 10 }}
					enterButton="Buscar"
					size="large"
				/>
				<GetDataFromExcelJusTInput reload={[ reload, setReload ]} />
			</Row>
			<Tabs
				tabBarExtraContent={searchBar}
				onChange={(tipoCategoria) => {
					/* obtenerProductos(tipoCategoria, limite, page); */
					props.history.push(`/admin/inventario/${tipoCategoria}`);
				}}
			>
				{tabs}
			</Tabs>
		</div>
	);
}
export default withRouter(Inventario);
