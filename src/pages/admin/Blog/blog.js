import React, {useState,useEffect } from 'react';
import {Button,notification,Drawer} from 'antd';
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import {PlusCircleOutlined } from '@ant-design/icons';
import './blog.scss';
import queryString from 'query-string';
import clienteAxios from '../../../config/axios';
import Spin from '../../../components/Spin';
import BlogsList from './services/blogList';
import Pagination from '../../../components/Pagination/pagination';
import { BlogContext } from '../contexts/BlogContext';
import ActualizarBlog from './services/ActualizarBlog';
import RegistrarBlog from './services/RegistrarBlog';




function BlogAdmin(props) {

    //Tomar la paginacion actual
    const {location,history} = props;
    const {page = 1} = queryString.parse(location.search);
    
    //Uses
    const [ accion, setAccion ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [visible, setVisible] = useState(false);
    const [blogs,setBlogs] = useState([]);
    const [reloadBlog, setReloadBlog] = useState(false);

    const [infoBlog,setInfoBlog] = useState({});
    

    //Obtener token de localStorage
    const token = localStorage.getItem('token')
    var decoded = Jwt(token) 
    
    //Decodificar el JWT
	function Jwt(token) {
		try {
            return jwt_decode(token);
		} catch (e) {
			return null;
		}
    }

    //Traer todos los blogs
    function getBlogsApi(limit,page){
        setLoading(true);
        clienteAxios.get(`/blog?limit=${limit}&page=${page}`)
        .then((res) => {
                setBlogs(res.data.posts);
                setLoading(false);
        })
        .catch((err) => {
            setLoading(false)
            if(err.response){
                notification.error({
                    message: 'Error',
                    description: err.response.data.message,
                    duration: 2
                });
            }else{
                notification.error({
                    message: 'Error de conexion',
                    description: 'Al parecer no se a podido conectar al servidor.',
                    duration: 2
                });
            }
        });
    }
    //Ejecutar funcion traer blogs
    useEffect(() => {
        getBlogsApi(20,page);
        setReloadBlog(false);
	}, [page,reloadBlog]);

    //Verificar el JWT
    if(token === '' || token === null){
        props.history.push('/entrar')
    }else if(decoded['rol'] !== true){
        props.history.push('/')
    }
    
    //Fuciones para abrir y cerrar el Drawer
    const showDrawer = () => {
      setVisible(true);
    };
    const drawnerClose = () => {
        setVisible(false);
        setInfoBlog({});
      };

    //Mostrar el Spin
    if (loading) {
        return <Spin/>;
    }
    
    if(!blogs){
        return null;
    }

    return (
            <div className="blog">
                <Drawer
                    title={accion === true ? 'Actualizar Blog' : 'Registra nuevo Blog'}
                    width={window.screen.width > 768 ? 1000 : window.screen.width}
                    placement={'right'}
                    onClose={drawnerClose}
                    visible={visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: 'right'
                            }}
                        >
                            <Button onClick={drawnerClose} type="primary">
                                Cerrar
                            </Button>
                        </div>
                    }
                >
                    { accion === true ? (
                        <BlogContext.Provider value={infoBlog}>
                            <ActualizarBlog setReloadBlog={setReloadBlog} setLoading={setLoading} token={token} setVisible={setVisible}  />
                        </BlogContext.Provider>
                        
                    ):(

                            <RegistrarBlog setReloadBlog={setReloadBlog} setLoading={setLoading} token={token} setVisible={setVisible} />

                    )}
                </Drawer>
                
                <div className="blog__add-post">
                <p className="text-center font-weight-bold" style={{ fontSize: 20 }}>
                    Tus blogs
                </p>
                    <Button 
                        type="primary"
                        size="large"
                        onClick={() => {
                            setAccion(false);
                            showDrawer()
                            setInfoBlog({});
                        }}
                        className="ml-3"
                        icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}>
                            Crear Blog
                    </Button>
                </div>

                <BlogsList 
                    blogs={blogs} 
                    setReloadBlog={setReloadBlog} 
                    showDrawer={showDrawer} 
                    setAccion={setAccion} 
                    setInfoBlog={setInfoBlog} 
                />

                <Pagination 
                    blogs={blogs} 
                    location={location}  
                    history={history}
                    limite={20}
                />
            </div>
    )
}
export default withRouter(BlogAdmin);