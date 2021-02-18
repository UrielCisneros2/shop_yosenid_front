import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Divider,
  Button,
  Upload,
  notification,
  Alert,
  Steps,
  message,
  Spin,
} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import clienteAxios from "../../../../../config/axios";
import PoliticasEnvio from "./politicas_envio";
import Registro_Politicas from "./registroPoliticas";
import Cobertura_envio from "./cobertura_envios";
import aws from "../../../../../config/aws";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";

export default function RegistroTienda(props) {
  const { drawnerClose } = props;
  const [current, setCurrent] = props.steps;

  const {setDatosNegocio, datosNegocio, token, } = props;

  const [datos, setDatos] = useState({});
  const [control, setControl] = useState(false);

  const [form] = Form.useForm();
  const { Step } = Steps;
  const [upload, setUpload] = useState(false);
  //Variables que guardan las imagenes
  const [files, setFiles] = useState([]);
  const [imagen, setImagen] = useState("");
  const [loading, setLoading] = useState(false);

  const monstrarInformacionBlog = (e) => {
    form.setFieldsValue(e);
  };

  /* const [current, setCurrent] = useState(0); */

  const next = () => {
    setCurrent(current + 1);

  };

  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    if (datosNegocio !== undefined) {
      setImagen(datosNegocio.imagenLogo);
      // if (datosNegocio.ubicacion[0].lat === "undefined") {
      //   datosNegocio.ubicacion[0].lat = "";
      // }
      // if (datosNegocio.ubicacion[0].lng === "undefined") {
      //   datosNegocio.ubicacion[0].lng = "";
      // }
      if (datosNegocio.linkFace === "undefined") {
        datosNegocio.linkFace = "";
      }
      if (datosNegocio.linkInsta === "undefined") {
        datosNegocio.linkInsta = "";
      }
      if (datosNegocio.linkTweeter === "undefined") {
        datosNegocio.linkTweeter = "";
      }
      monstrarInformacionBlog({
        nombre: datosNegocio.nombre,
        telefono: datosNegocio.telefono,
        calle_numero: datosNegocio.direccion[0].calle_numero,
        cp: datosNegocio.direccion[0].cp,
        colonia: datosNegocio.direccion[0].colonia,
        ciudad: datosNegocio.direccion[0].ciudad,
        estado: datosNegocio.direccion[0].estado,
        // lat: datosNegocio.ubicacion[0].lat,
        // lng: datosNegocio.ubicacion[0].lng,
        imagenCorp: datosNegocio.imagenCorp,
        diasHorariosEmpresas: datosNegocio.diasHorariosEmpresas,
        linkFace: datosNegocio.linkFace,
        linkInsta: datosNegocio.linkInsta,
        linkTweeter: datosNegocio.linkTweeter,
      });
      setDatos({
        nombre: datosNegocio.nombre,
        telefono: datosNegocio.telefono,
        calle_numero: datosNegocio.direccion[0].calle_numero,
        cp: datosNegocio.direccion[0].cp,
        colonia: datosNegocio.direccion[0].colonia,
        ciudad: datosNegocio.direccion[0].ciudad,
        estado: datosNegocio.direccion[0].estado,
        // lat: datosNegocio.ubicacion[0].lat,
        // lng: datosNegocio.ubicacion[0].lng,
        imagenCorp: datosNegocio.imagenCorp,
        diasHorariosEmpresas: datosNegocio.diasHorariosEmpresas,
        linkFace: datosNegocio.linkFace,
        linkInsta: datosNegocio.linkInsta,
        linkTweeter: datosNegocio.linkTweeter,
      });
      setControl(true);
    } else {
      setDatos({});
      setControl(false);
    }
  }, [datosNegocio]);


  // const capturarPoliticasEditor = (content, editor) => {
  //   setDatos({ ...datos, politicas: content });
  // };

  const capturarImagenCorpEditor = (content, editor) => {
    setDatos({ ...datos, imagenCorp: content });
  };

  const capturarHorariosDias = (content, editor) => {
    setDatos({ ...datos, diasHorariosEmpresas: content });
  };

  // console.log(capturarHorariosDias);
  // console.log(datosNegocio.diasHorariosEmpresas);


  const propss = {
    listType: "picture",
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        file.thumbUrl = e.target.result;
        setFiles(file);
      };
      setUpload(true);
      return false;
    },
    onRemove: (file) => {
      setUpload(false);
      setFiles([]);
    },
  };

  const onError = (error) => {
    error.errorFields.map((err) => {
      notification.error({
        message: `[${err.name}]`,
        description: err.errors,
        duration: 5,
      });
    });
  };

  const SendForm = async () => {
    const formData = new FormData();
    formData.append("nombre", datos.nombre);
    formData.append("telefono", datos.telefono);
    formData.append("calle_numero", datos.calle_numero);
    formData.append("cp", datos.cp);
    formData.append("colonia", datos.colonia);
    formData.append("ciudad", datos.ciudad);
    formData.append("estado", datos.estado);
    // formData.append("lat", datos.lat);
    // formData.append("lng", datos.lng);
    // formData.append("politicas", datos.politicas);
    formData.append("imagenCorp", datos.imagenCorp);
    formData.append("diasHorariosEmpresas", datos.diasHorariosEmpresas);
    formData.append("linkFace", datos.linkFace);
    formData.append("linkInsta", datos.linkInsta);
    formData.append("linkTweeter", datos.linkTweeter);

    setLoading(true);

    if (control === false) {

      if (files.length === 0) {
        setLoading(false);
        notification.info({
          message: "Ups, algo salio mal",
          description: "La imagen es obligatoria",

        });
      } else {
        setLoading(true);
        formData.append("imagen", files);
        await clienteAxios
          .post("/tienda/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `bearer ${token}`,
            },
          })
          .then((res) => {
            setLoading(false);
            setCurrent(current + 1);
            next();
            notification.success({
              message: "Registro exitoso",
              description: res.data.message,
            });
          })
          .catch((err) => {
            if (err.response) {
              notification.error({
                message: "Error",
                description: err.response.data.message,
                duration: 2,
              });
            } else {
              notification.error({
                message: "Error de conexion",
                description: "Al parecer no se a podido conectar al servidor.",
                duration: 2,
              });
            }
          });
      }
    } else {
      setLoading(true);
      if (files.length !== 0) {
        formData.append("imagen", files);
      }
      await clienteAxios
        .put(`/tienda/${datosNegocio._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          setCurrent(current + 1);
          next();
          notification.success({
            message: "Registro exitoso",
            description: res.data.message,
          });
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            notification.error({
              message: "Error",
              description: err.response.data.message,
              duration: 2,
            });
          } else {
            notification.error({
              message: "Error de conexion",
              description: "Al parecer no se a podido conectar al servidor.",
              duration: 2,
            });
          }
        });
    }
  };

  const steps = [
    {
      title: "Datos de la Tienda",
      content: (
        <div className="" >
          <Spin size="large" spinning={loading}>
            <Form
              onFinish={SendForm}
              form={form}
              // onFinishFailed={onError}
            >
              <div className="row">
                <div className="col-12">
                  <Divider>Logo del negocio</Divider>
                  <div className="d-flex justify-content-center m-2">
                    <Alert
                      className="info-recomended-sizes"
                      message="Tamaño recomendado para la imagen es: 900x300px"
                      type="info"
                      showIcon
                    />
                  </div>
                  <div className="m-auto">
                    <Form.Item label="Logo">
                      <Upload {...propss} name="imagen">
                        <Button disabled={upload}>
                          <UploadOutlined /> Subir
                        </Button>
                      </Upload>
                    </Form.Item>
                    {control === false ? (
                      ""
                    ) : (
                      <div>
                        <p className="text-center">Imagen actual:</p>
                        <div className="d-flex justify-content-center align-items-center">
                          <img
                            className="d-block img-fluid mt-2"
                            width="200"
                            alt="imagen de base"
                            src={aws + imagen}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <Divider>Información de la tienda</Divider>
                <div className="col-lg-6 col-12">
                  <Form.Item
                    className="m-2"
                    label="Nombre"
                    labelCol={{ offset: 1, span: 5 }}
                    onChange={(e) =>
                      setDatos({ ...datos, nombre: e.target.value })
                    }
                  >
                    <Form.Item
                      rules={[
                        { required: true, message: "Nombre obligatorio" },
                      ]}
                      noStyle
                      name="nombre"
                    >
                      <Input name="nombre" placeholder="Nombre del negocio" />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="col-lg-6 col-12">
                  <Form.Item
                    className="m-2"
                    label="Telefono "
                    labelCol={{ offset: 1, span: 5 }}
                    onChange={(e) =>
                      setDatos({ ...datos, telefono: e.target.value })
                    }
                  >
                    <Form.Item
                      rules={[
                        { required: true, message: "Telefono obligatorio" },
                      ]}
                      noStyle
                      name="telefono"
                    >
                      <Input name="telefono" placeholder="Telefono" />
                    </Form.Item>
                  </Form.Item>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4 col-sm-12">
                  <Form.Item
                    className="m-2"
                    label="Calle"
                    onChange={(e) =>
                      setDatos({ ...datos, calle_numero: e.target.value })
                    }
                  >
                    <Form.Item
                      rules={[
                        { required: true, message: "Direccion obligatoria" },
                      ]}
                      noStyle
                      name="calle_numero"
                    >
                      <Input name="calle_numero" placeholder="Calle y Numero" />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <Form.Item
                    className="m-2"
                    label="Código Postal "
                    onChange={(e) => setDatos({ ...datos, cp: e.target.value })}
                  >
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: "Código Postal obligatorio",
                        },
                      ]}
                      noStyle
                      name="cp"
                    >
                      <Input name="cp" placeholder="Codigo Postal" />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <Form.Item
                    className="m-2"
                    label="Colonia "
                    onChange={(e) =>
                      setDatos({ ...datos, colonia: e.target.value })
                    }
                  >
                    <Form.Item
                      rules={[
                        { required: true, message: "Colonia obligatoria" },
                      ]}
                      noStyle
                      name="colonia"
                    >
                      <Input name="colonia" placeholder="Colonia" />
                    </Form.Item>
                  </Form.Item>
                </div>
              </div>

              <div className="row mt-3 justify-content-center">
                <div className="col-lg-5 col-sm-12">
                  <Form.Item
                    className="m-2"
                    label="Ciudad"
                    labelCol={{ offset: 1, span: 4 }}
                    wrapperCol={{ offset: 1, span: 15 }}
                    onChange={(e) =>
                      setDatos({ ...datos, ciudad: e.target.value })
                    }
                  >
                    <Form.Item
                      rules={[
                        { required: true, message: "Direccion obligatoria" },
                      ]}
                      noStyle
                      name="ciudad"
                    >
                      <Input name="ciudad" placeholder="Ciudad" />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="col-lg-5 col-sm-12">
                  <Form.Item
                    className="m-2"
                    label="Estado"
                    labelCol={{ offset: 1, span: 4 }}
                    wrapperCol={{ offset: 1, span: 15 }}
                    onChange={(e) =>
                      setDatos({ ...datos, estado: e.target.value })
                    }
                  >
                    <Form.Item
                      rules={[
                        { required: true, message: "Estado obligatorio" },
                      ]}
                      noStyle
                      name="estado"
                    >
                      <Input name="estado" placeholder="Estado donde vives" />
                    </Form.Item>
                  </Form.Item>
                </div>
              </div>

              {/* <div className="row d-flex justify-content-center align-items-center">
                <Divider>Ubicación</Divider>
                <div className="row justify-content-center">
                  <div className="col-lg-12 text-center">
                    <a
                      href="https://www.google.com.mx/maps/preview"
                      target="_blank"
                      style={{ fontSize: 16 }}
                    >
                      Ir a Google Maps
                      <FontAwesomeIcon
                        icon={faMapMarkedAlt}
                        style={{ marginLeft: 15, fontSize: "20px" }}
                      />
                    </a>
                  </div>
                  <div className="col-lg-4 col-12">
                    <Form.Item
                      className="m-2"
                      label="Latitud "
                      labelCol={{ offset: 1, span: 4 }}
                      wrapperCol={{ offset: 1, span: 12 }}
                      onChange={(e) =>
                        setDatos({ ...datos, lat: e.target.value })
                      }
                    >
                      <Form.Item
                        rules={[
                          { required: true, message: "Latitud obligatoria" },
                        ]}
                        noStyle
                        name="lat"
                      >
                        <Input name="lat" placeholder="Latitud" />
                      </Form.Item>
                    </Form.Item>
                  </div>
                  <div className="col-lg-4 col-12">
                    <Form.Item
                      className="m-2"
                      label="Longitud"
                      labelCol={{ offset: 1, span: 4 }}
                      wrapperCol={{ offset: 1, span: 12 }}
                      onChange={(e) =>
                        setDatos({ ...datos, lng: e.target.value })
                      }
                    >
                      <Form.Item
                        rules={[
                          { required: true, message: "Longitud obligatoria" },
                        ]}
                        noStyle
                        name="lng"
                      >
                        <Input name="lng" placeholder="Latitud" />
                      </Form.Item>
                    </Form.Item>
                  </div>
                </div>
              </div> */}

              <div className="row">
                <Divider>Redes sociales</Divider>
                <div className="col-lg-4 col-sm-12">
                  <Form.Item
                    className="m-2"
                    label="Facebook "
                    onChange={(e) =>
                      setDatos({ ...datos, linkFace: e.target.value })
                    }
                  >
                    <Form.Item noStyle name="linkFace">
                      <Input
                        name="linkFace"
                        placeholder="https://facebook.com/"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <Form.Item
                    className="m-2"
                    label="Instagram"
                    onChange={(e) =>
                      setDatos({ ...datos, linkInsta: e.target.value })
                    }
                  >
                    <Form.Item noStyle name="linkInsta">
                      <Input
                        name="linkInsta"
                        placeholder="https://instagram.com/"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <Form.Item
                    className="m-2"
                    label="Tweeter"
                    onChange={(e) =>
                      setDatos({ ...datos, linkTweeter: e.target.value })
                    }
                  >
                    <Form.Item noStyle name="linkTweeter">
                      <Input
                        name="linkTweeter"
                        placeholder="https://twitter.com/"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
              </div>

              <div className="row">
                <Divider>Horarios y Días Laborales</Divider>
                <div className="col-12">
                  <Form.Item className="m-2">
                    <Form.Item
                      name="diasHorariosEmpresas"
                    >
                      <Editor
                        disabled={false}
                        init={{
                          height: 250,
                          menubar: true,
                          plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                          ],
                          toolbar:
                            "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                        }}
                        onEditorChange={capturarHorariosDias}
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
              </div>
              
              <div className="row">
                <Divider>Imagen corporativa</Divider>
                <div className="col-12">
                  <Form.Item className="m-2">
                    <Form.Item
                      rules={[ { required: true, message: 'Imagen corporativa es obligatoria' } ]}
									    noStyle 
                      name="imagenCorp"
                    >
                      <Editor
                        disabled={false}
                        init={{
                          height: 450,
                          menubar: true,
                          plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                          ],
                          toolbar:
                            "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                        }}
                        onEditorChange={capturarImagenCorpEditor}
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
              </div>

              <Form.Item className="d-flex justify-content-center align-items-center text-center">
                <Button
                  className="text-center"
                  size="large"
                  type="primary"
                  htmlType="submit"
                  icon={
                    control === false ? (
                      <PlusCircleOutlined style={{ fontSize: 24 }} />
                    ) : (
                      <EditOutlined style={{ fontSize: 24 }} />
                    )
                  }
                  // onClick={next}
                >
                  {control === false
                    ? "Registrar informacion de la tienda"
                    : "Actualizar información de la tienda"}
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      ),
    },
    {
      title: "Políticas de Empresa",
      content: (
        <div>
          <Registro_Politicas
            setCurrent={setCurrent}
            current={current}
          />
        </div>
      ),
    },
    {
      title: "Costos de Envió",
      content: (
        <div>
          <PoliticasEnvio
            setCurrent={setCurrent}
            current={current}
          />
        </div>
      ),
    },
    {
      title: "Covertura de envió",
      content: (
        <div>
          <Cobertura_envio />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} status={item.status}/>
        ))}
      </Steps>

      <div className="steps-content">{steps[current].content}</div>

      {/* <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Siguiente
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Anterior
          </Button>
        )}
      </div> */}

    </div>
  );
}
