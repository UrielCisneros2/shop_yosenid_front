import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import ImageGallery from 'react-image-gallery';
import ReactImageMagnify from 'react-image-magnify';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import 'react-image-gallery/styles/css/image-gallery.css';
import './galeria_custom.scss';
import aws from '../../../../config/aws';
import Spin from '../../../../components/Spin';

function Galeria(props) {
	const [ count, setCount ] = useState(0);
	const [ loading, setLoading ] = useState(false);
	const idproducto = props.id;
	const [ galeria, setGaleria ] = useState([]);
	const [ imagen, setImagen ] = useState([
		{
			original: '',
			thumbnail: ''
		}
	]);

	const [ imagenZoom, setImagenZoom ] = useState();

	function onLoad(imagen) {
		if(imagen.target.src){
			var url = imagen.target.src.split('.com/');// se hace asi porque al poner la variable con la url saltaban warnings del src estaba undefind
			setImagenZoom(url[1]);
		}
	}

	const galery = {
		showPlayButton: false,
		showNav: false,
		showFullscreenButton: false,
		renderItem: myRenderItem,
		onThumbnailClick: onLoad,
		disableKeyDown: true
	};

	if (count < galeria.length) {
		setCount(count + 1);
	}

	useEffect(
		() => {
			async function obtenerImagen() {
				await clienteAxios.get(`/productos/${idproducto}`).then((res) => {
					setImagenZoom(res.data.imagen);
					setImagen([
						{
							original: aws+res.data.imagen,
							thumbnail: aws+res.data.imagen
						}
					]);
				});
			}
			async function obtenerGaleria() {
				setLoading(true);
				await clienteAxios
					.get(`/galeria/${idproducto}`)
					.then((res) => {
						setGaleria(res.data.imagenes);
						setLoading(false);
					})
					.catch((err) => {
						setLoading(false);
					});
			}
			obtenerImagen();
			obtenerGaleria();
		},
		[ idproducto ]
	);

	useEffect(
		() => {
			galeria.forEach((res) => {
				return imagen.push({
					original: aws+res.url,
					thumbnail: aws+res.url
				});
			});
		},
		[ count, galeria, imagen ]
	);

	const [ zoomHeight, setZoomHeight ] = useState('');
	const [ zoomWidth, setZoomWidth ] = useState('');
	var img = new Image();
	img.onload = function() {
	setZoomWidth(img.naturalWidth);
	setZoomHeight(img.naturalHeight);
	}
	img.src = aws+imagenZoom;

	const propiedadesImageMagnify= {
		smallImage: {
			alt: 'imagen-producto',
			src: aws+imagenZoom,
			isFluidWidth: true
		},
		largeImage: {
			src: aws+imagenZoom,
			width: zoomWidth*1.6,
			height: zoomHeight*1.6
		},
		enlargedImagePortalId: 'zoom-render'
	}

	function myRenderItem() {
		return (
			<ReactImageMagnify
				imageClassName="image-gallery-image"
				enlargedImageContainerClassName="image-gallery-image-large-container"
				enlargedImageClassName="image-gallery-image-large"
				className="imagen-gallery-container"
				{...propiedadesImageMagnify}
			/>
		);
	}

	return (
		<Spin spinning={loading}>
			<ImageGallery items={imagen} {...galery} />
		</Spin>
	);
}

export default Galeria;
