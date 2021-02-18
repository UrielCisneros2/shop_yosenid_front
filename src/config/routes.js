//layout
import LayoutAdmin from '../components/Layout_admin/LayoutAdmin'
import LayoutBasic from '../components/Layout/Layout'

//Admin pages
import AdminHome from '../pages/admin/Principal/principal'
import RegistrarProductos from '../pages/admin/Productos/productos'
import Pedidos from '../pages/admin/Pedidos/pedidos'
import Promociones from '../pages/admin/Promociones/promociones_principal'
import SistemaApartado from '../pages/admin/Apartado/apartado'
import Inventario from '../pages/admin/Inventario/inventario'
import Sugerencias from '../pages/admin/Sugerencias/sugerencias'
import Carousel from '../pages/admin/Carousel/carousel'
import Publicidad from '../pages/admin/Publicidad/publicidad'
import BlogAdmin from '../pages/admin/Blog/blog'
import Clientes from '../pages/admin/Clientes/clientes'
import RegistroPublicidad from '../pages/admin/Publicidad/services/registro'

//Users pages
import Home from '../pages/users/home'
import Entrar from '../pages/users//Inicio_sesion/entrar'
import QuienesSomos from '../pages/users/Quienes_somos/quienes_somos';
import ShoppingCart from '../pages/users/Carrito/shopping_cart'
import Productos from '../pages/users/Productos/productos'
import Blog from '../pages/users/Blogs/blog';
import PedidosUsuario from '../pages/users/Pedidos/pedidos'
import Ofertas from '../pages/users/Ofertas/ofertas'
import ResultadoBusqueda from '../pages/users/Resultado_Busqueda/resultado_busqueda'
import Perfiles from '../pages/users/Perfiles/perfiles'
import Confirmacion_compra from '../pages/users/Confirmacion_compra/confirmacion_compra'



import Politicas from '../pages/users/Politicas/politicas'
//Secondary Component
import VistaProducto from '../pages/users/Vista_Producto/vista_producto'
import BusquedaCategorias from '../components/BusquedaCategorias/busqueda_categorias';

//other
import Error404 from '../pages/users/error404'
import Error500 from '../pages/users/error500'
import Search404 from '../pages/users/Resultado_Busqueda/404'
import Success from '../pages/users/Success/success';
import ErrorPago from '../pages/users/Success/error';

import Recuperar_pass from '../components/Recuperar_pass/Recuperar_pass';



const routes = [
	{
		path: '/admin',
		component: LayoutAdmin,
		exact: false,
		routes: [
			{
				path: '/admin',
				component: AdminHome,
				exact: true,
			},
			{
				path: '/admin/productos',
				component: RegistrarProductos,
				exact: true
			},
			{
				path: '/admin/pedidos',
				component: Pedidos,
				exact: true
			},
			{
				path: '/admin/promociones',
				component: Promociones,
				exact: true
			},
			{
				path: '/admin/sistema_apartado',
				component: SistemaApartado,
				exact: true
			},
			{
				path: '/admin/inventario',
				component: Inventario,
				exact: true
			},
			{
				path: '/admin/inventario/:tipoCategoria',
				component: Inventario,
				exact: true
			},
			{
				path: '/admin/blog',
				component: BlogAdmin,
				exact: true
			},
			{
				path: '/admin/sugerencias',
				component: Sugerencias,
				exact: true
			},
			{
				path: '/admin/carousel',
				component: Carousel,
				exact: true
			},
			{
				path: '/admin/publicidad',
				component: Publicidad,
				exact: true
			},
			{
				path: '/admin/clientes',
				component: Clientes,
				exact: true
			},
			{
				path: '/admin/banner/:accion/:idBanner',
				component: RegistroPublicidad,
				exact: true
			},
			{
				component: Error404
			}
		]
	},
	{
		path: '/resetPass/:idRecuperacion',
		component: Recuperar_pass,
		exact: false
	},
	{
		path: '/',
		component: LayoutBasic,
		exact: false,
		routes: [
			{
				path: '/',
				component: Home,
				exact: true
			},
			{
				path: '/entrar',
				component: Entrar,
				exact: true
			},
			{
				path: '/quienes_somos',
				component: QuienesSomos,
				exact: true
			},
			{
				path: '/shopping_cart',
				component: ShoppingCart,
				exact: true
			},
			{
				path: '/productos',
				component: Productos,
				exact: true
			},
			{
				path: '/blog',
				component: Blog,
				exact: true
			},
			{
				path: '/blog/:url',
				component: Blog,
				exact: true
            },
            {
				path: '/pedidos',
				component: PedidosUsuario,
				exact: true
			},
			{
				path: '/ofertas',
				component: Ofertas,
				exact: true
			},
			{
				path: '/productos',
				component: Productos,
				exact: true
			},
			{
				path: '/vista_producto/:url',
				component: VistaProducto,
				exact: true
			},
			{
				path: '/politicas/',
				component: Politicas,
				exact: true
			},
			{
				path: '/searching/:url',
				component: ResultadoBusqueda,
				exact: true
			},
			{
				path: '/searching/',
				component: Search404,
				exact: true
			},
			{
				path: '/categorias/:categoria',
				component: BusquedaCategorias,
				exact: true
			},
			{
				path: '/categorias/:categoria/:subcategoria',
				component: BusquedaCategorias,
				exact: true
			},
			{
				path: '/categoria/:genero',
				component: BusquedaCategorias,
				exact: true
			},
			{
				path: '/categoria/:categoria/:genero',
				component: BusquedaCategorias,
				exact: true
			},
			{
				path: '/categoria/:categoria/:subcategoria/:genero',
				component: BusquedaCategorias,
				exact: true
			},
			{
				path: '/filtros/:temporada/:categoria/:subcategoria/:genero',
				component: BusquedaCategorias,
				exact: true
			},
			{
				path: '/perfiles/',
				component: Perfiles,
				exact: true
			},
			{
				path: '/confirmacion_compra/:url',
				component: Confirmacion_compra,
				exact: true
			},
			{
				path: '/error500/',
				component: Error500,
				exact: true
			},
			{
				path: '/success/:id',
				component: Success,
				exact: true
			},
			{
				path: '/error/:id/:error',
				component: ErrorPago,
				exact: true
			},
			{
				component: Error404
			}
		]
	}
];

export default routes;
