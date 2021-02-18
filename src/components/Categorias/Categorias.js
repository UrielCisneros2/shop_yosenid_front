import React, { useState, useEffect, useContext } from 'react';
import {  Button, Divider, Layout, Menu, Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import './categorias.scss';
import './preloading.scss';
import clienteAxios from '../../config/axios';
import { MenuContext } from '../../context/carritoContext';

const { SubMenu } = Menu;

const Categorias = (props) => {
	const token = localStorage.getItem('token');
	const [ categorias, setCategorias ] = useState([]);
	const [ generos, setGeneros ] = useState([{_id: 'Todos'}]);
	const [ temporadas, setTemporadas ] = useState([]);
 	// const [ loading, setLoading ] = useState(false); 
	const { reloadFilter,setLoading } = useContext(MenuContext);

	const [ categoriaSeleccionada, setCategoriaSeleccionada, ] = useState(null);
	const [ subcategoriaSeleccionada, setSubcategoriaSeleccionada, ] = useState(null);
	const [ temporadaSeleccionada, setTemporadaSeleccionada, ] = useState(null);
	const [ generoSeleccionado, setGeneroSeleccionado ] = useState(null);

	useEffect(() => {
		obtenerCategorias();
		obtenerGeneros();
		obtenerTemporadas();
	}, []);

	useEffect(() => {
		limpiarFiltros();
	}, [ reloadFilter ])

	const limpiarFiltros = () => {
		setCategoriaSeleccionada(null)
		setSubcategoriaSeleccionada(null)
		setTemporadaSeleccionada(null)
		setGeneroSeleccionado(null)
	}

	async function obtenerCategorias() {
		// setLoading(true);
		await clienteAxios
			.get('/productos/filtrosNavbar', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setCategorias(res.data);
				window.scrollTo(0, 0);
			})
			.catch((res) => {
				setLoading(false);
			});
	}

	async function obtenerGeneros() {
		await clienteAxios
			.get('/productos/agrupar/generos')
			.then((res) => {
				setGeneros([...generos, ...res.data]);
			})
			.catch((res) => {
			});
	}

	async function obtenerTemporadas() {
		await clienteAxios
			.get(`/productos/agrupar/temporadas`)
			.then((res) => {
				setTemporadas(res.data);
			})
			.catch((err) => {
			});
	}

	// if (loading) {
	// 	return (
	// 		<div className="preloading">
	// 			<div className="contenedor-preloading">
	// 				<Spin size="large" tip="Cargando la tienda..." className="spiner" />
	// 			</div>
	// 		</div>
	// 	);
	// }
	
	if(!generos || !categorias){
		return null;
	}

	const categorias_nav = categorias.map((categoria, index) => {
		return (
			<SubMenu
				key={categoria.categoria}
				title={categoria.categoria}
				className="submenu-categoria nav-font-color-categorias container-subcategorias-nav size-submenu-cat font-cates"
				onTitleClick={(e) => {
					if(e.key === categoria.categoria){
						props.history.push(`/filtros/${temporadaSeleccionada}/${categoria.categoria}/${subcategoriaSeleccionada}/${generoSeleccionado}`);
						setCategoriaSeleccionada(categoria.categoria);
					}
					
				}}

			>
				{categoria.subcCategoria.map((sub) => {
					return (
						<Menu.Item
							className="font-cates"
							key={sub._id}
							onClick={() => {
								props.history.push(`/filtros/${temporadaSeleccionada}/${categoriaSeleccionada}/${sub._id}/${generoSeleccionado}`);
								setSubcategoriaSeleccionada(sub._id);
							}}
						>
							{sub._id}
						</Menu.Item>
					);
				})}
			</SubMenu>
			// 
		);
	});

	const temporadas_nav = temporadas.map((temporada, index) => {
		if(temporada._id){
			return (
				<Menu.Item
					className="nav-font-color-categorias font-cates"
					key={index}
					onClick={() => {
						props.history.push(`/filtros/${temporada._id}/${categoriaSeleccionada}/${subcategoriaSeleccionada}/${generoSeleccionado}`);
						setTemporadaSeleccionada(temporada._id);
					}}
				>
					{temporada._id}
				</Menu.Item>
			);
		}
		return
	});

	const categorias_generos = generos.map((generos) => {
		return (
			<Menu.Item
				className="font-cates"
				key={generos._id}
				onClick={() => {
					props.history.push(`/filtros/${temporadaSeleccionada}/${categoriaSeleccionada}/${subcategoriaSeleccionada}/${generos._id}`);
					setGeneroSeleccionado(generos._id)
				}}
				
			>
				{generos._id}
			</Menu.Item>
		);
	});

	return (
		<Layout className="container-subcategorias-nav d-lg-inline size-layout-cat">
			{/* <Spin className="ml-5 d-inline spin-nav-categorias" spinning={loading} /> */}
			<Menu
				className="categorias-navbar d-inline size-menu-cat font-cates "
				theme="light"
				mode="horizontal"
				defaultSelectedKeys={[ window.location.pathname ]}
				triggerSubMenuAction="click"
			>
				{categorias_nav}
				<SubMenu
					title="Temporadas"
					className="submenu-categoria nav-font-color-categorias container-subcategorias-nav size-submenu-cat font-cates"

				>
					{temporadas_nav}
				</SubMenu>
				{generos.length !== 0 ? (
					<SubMenu title="Género" className="submenu-categoria nav-font-color-categorias container-subcategorias-nav size-submenu-cat font-cates">
						{categorias_generos}
					

					</SubMenu>
				) : (
					<Menu.Item className="d-none" />
				)}
			</Menu>
			
			{/* <Menu
				className="categorias-navbar d-inline size-menu-cat font-cates"
				theme="light"
				mode="horizontal"
				defaultSelectedKeys={[ window.location.pathname ]}
				triggerSubMenuAction="click"
			>
				{categorias_nav}
			</Menu> */}

		</Layout>
	);
};

export default withRouter(Categorias);
