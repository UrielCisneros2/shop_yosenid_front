import React, { useState, useEffect } from "react";
import axios from "axios";

import "./coberturaEnvios.scss";
import {
  Button,
  Select,
  Tag,
  notification,
  Table,
  Spin,
  Modal,
  Tooltip,
  Checkbox,
} from "antd";
import {
  EditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import clienteAxios from "../../../../../config/axios";

const consultaEstados = axios.create({
  baseURL: `https://api-sepomex.hckdrk.mx/query/`,
});

export default function Cobertura_envios(props) {
  const token = localStorage.getItem("token");
  const { confirm } = Modal;
  const { Option } = Select;
  const { Column } = Table;

  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [municipioGuardado, setMunicipioGuardado] = useState([]);
  const [idEstado, setIdEstado] = useState([]);

  const [todos, setTodos] = useState(false);

  const [municipiosApi, setMunicipiosApi] = useState([]);
  const [estadosApi, setEstadoApi] = useState([]);
  const [value, setValue] = useState([]);

  const [dataEstados, setDataEstados] = useState([]);
  const [estado, setEstado] = useState("");

  const errors = (err) => {
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
  };

  const selectTodos = (e) => {
    setTodos(e.target.checked);
    // console.log(e.target.checked);
    
  };

  //*******************************Checkeo de datos************************************************************************************ */
  const [covertura, setCovertura] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (parametros) => {
    setSelectedRowKeys(parametros);
    const listaMun = parametros.map((res) => {
      return res;
    });
    setCovertura(listaMun);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (municipio) => {
      if (value) {
        return {
          disabled: municipio.municipio && municipio.length !== 0,
          // Column configuration not to be checked
          name: municipio.name,
        };
      } else {
        return {
          disabled: municipio.municipio && municipio.length !== 0,
          // Column configuration not to be checked
          name: municipio.name,
        };
      }
    },
    onSelect: (record, selected, selectedRows) => {
      setCovertura(selectedRows);
    },
    onSelectAll: (selected, selectedRows) => {
      setCovertura(selectedRows);
    },
  };

  const checkearChecks = () => {
    const listaMunicipios = municipioGuardado.map((municipio) => {
      return municipio;
    });
    setSelectedRowKeys(listaMunicipios);
  };
  //*******************************************Consultas de API Externas*************************************************************** */

  const selectMunicipio = (value) => {
    setValue(value);
    setMunicipioGuardado([]);
    setIdEstado();

    if (value) {
      setEstado(value);
      setLoading(true);
      consultaEstados
        .get(`/get_municipio_por_estado/${value}`)
        .then((res) => {
          setLoading(false);
          const datosApiMunicipios = res.data.response.municipios;
          setMunicipiosApi(res.data.response.municipios);
          const arrayMunicipio = [];
          dataEstados.forEach((estado) => {
            if (value === estado.estado) {
              setIdEstado(estado._id);
              estado.municipios.map((municipio) => {
                for (let i = 0; i < datosApiMunicipios.length; i++) {
                  if (datosApiMunicipios[i] === municipio.municipio) {
                    arrayMunicipio.push(municipio.municipio);
                  }
                }
              });
            }
          });
          setSelectedRowKeys(arrayMunicipio);
        })
        .catch((err) => {
          notification.error({
            message: "Error del servidor",
            description: "Paso algo en el servidor",
          });
        });
    }
  };

  function obtenerEstados() {
    consultaEstados
      .get(`/get_estados/`)
      .then((res) => {
        setEstadoApi(res.data.response.estado);
      })
      .catch((err) => {
        notification.error({
          message: "Error del servidor",
          description:
            "Paso algo en el servidor, al parecer la conexion esta fallando.",
        });
      });
  }

  const arrayMunicipio = [];
  for (let i = 0; i < covertura.length; i++) {
    arrayMunicipio.push({ municipio: covertura[i] });
  }

  // *****************************************ENVIO DE ESTADOS****************************************************************
  const enviarDatos = async () => {
    var nuevoEstado = {};

    //Condicion de registros y actualizacion
    if (todos && dataEstados.length == 0) {
      nuevoEstado.todos = todos;
      clienteAxios
        .post(`/politicasEnvio/estados/`, nuevoEstado, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((res) => {
          setTodos(false);
          notification.success({
            message: "Registro Exitoso",
            duration: 2,
          });
          setReload(res);
        })
        .catch((err) => {
          errors(err);
        });
    } else if (todos && dataEstados.length > 0) {
      nuevoEstado.todos = todos;
      clienteAxios
        .put(`/politicasEnvio/estados/todos`, nuevoEstado, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((res) => {
          setTodos(false);
          notification.success({
            message: "Actualizacion Exitosa a todo mexico",
            duration: 2,
          });
          setReload(res);
        })
        .catch((err) => {
          errors(err);
        });
    } else if (selectedRowKeys.length > 0 && !idEstado) {
      nuevoEstado = {
        estado: estado,
        municipios: arrayMunicipio,
      };
      clienteAxios
        .post(`/politicasEnvio/estados/`, nuevoEstado, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((res) => {
          notification.success({
            message: "Registro Exitoso",
            duration: 2,
          });
          setReload(res);
          limpiar();
          setTodos(false);
        })
        .catch((err) => {
          errors(err);
        });
    } else if (idEstado) {
      nuevoEstado = {
        estado: estado,
        municipios: arrayMunicipio,
      };
      clienteAxios
        .put(`/politicasEnvio/estados/${idEstado}`, nuevoEstado, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((res) => {
          notification.success({
            message: "Actualizacion Exitosa de estado",
            duration: 2,
          });
          setReload(res);
          setTodos(false);
          limpiar();
        })
        .catch((err) => {
          errors(err);
        });
    }
  };

  // ***************************************** Retorno de estados TAGS***************************************************************
  const traerDatos = async () => {
    clienteAxios.get(`/politicasEnvio/estados/`).then((res) => {
      if (res.data.length > 0) {
        res.data.map((todo) => {
          if (todo.todos === true) {
            setTodos(true);
          }
        });
      }

      setDataEstados(res.data);
      setReload(true);
    });
  };

  // console.log(todosApi);
  // *****************************************Eliminar estados****************************************************************
  const deleteEstado = (state) => {
    confirm({
      title: "Eliminando Estado",
      icon: <ExclamationCircleOutlined />,
      content: `¿Estás seguro que deseas eliminar el Estado?`,
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        clienteAxios
          .delete(`/politicasEnvio/estados/${state._id}`, {
            headers: {
              Authorization: `bearer ${token}`,
            },
          })
          .then((res) => {
            notification.success({
              message: "Estado Eliminado",
            });
            setReload(res);
            limpiar();
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
      },
    });
  };

  useEffect(() => {
    obtenerEstados();
    if (value) {
      checkearChecks();
    }
  }, []);

  useEffect(() => {
    traerDatos();
  }, [reload]);

  function limpiar() {
    setValue([]);
    setMunicipiosApi([]);
    setSelectedRowKeys([]);
    setMunicipioGuardado([]);
    setIdEstado();
  }

  return (
    <div className="mt-5">
      <div className="row text-center">
        <div className="col-lg-6">
          
          <Checkbox 
            onChange={selectTodos} 
            checked={todos} 
            className="mt-2"
            style={{fontSize: 16, color: "green"}}
          >
            Envio a todo Mexico
          </Checkbox>

          <Select
            style={{ width: "70%" }}
            className="mt-3"
            placeholder="Selecciona un estado"
            onChange={selectMunicipio}
            value={value}
            disabled={todos}
          >
            {estadosApi.length !== 0 ? (
              estadosApi.map((estado) => {
                return (
                  <Option key={estado} value={estado}>
                    {estado}
                  </Option>
                );
              })
            ) : (
              <Option />
            )}
          </Select>
          
          <div className="text-center mt-3">
            {
           
              dataEstados.map((estado) => {
               if (estado.todos) {

               }else{
                const municipios = [];
                estado.municipios.map((municipio) => {
                  municipios.push(municipio.municipio + "       -       ");
                });
                return (
                  <Tooltip
                    placement="left"
                    key={estado._id}
                    title={municipios}
                  >
                    <Tag
                      className="mt-3 tags-color"
                      visible={true}
                      closable
                      onClick={() => selectMunicipio(estado.estado)}
                      onClose={() => deleteEstado(estado)}
                      key={estado._id}
                    >
                      {estado.estado}
                    </Tag>
                  </Tooltip>
                );
               }
              })
            }
          </div>
        </div>

        <div style={{ width: "50%", textAlign: "center" }}>
          <Spin size="large" spinning={loading}>
            <Table
              className=""
              rowSelection={rowSelection}
              dataSource={municipiosApi}
              rowKey={(municipio) => municipio}
              scroll={{ y: 300 }}
              pagination={false}
            >
              <Column title={"Municipios"} />
            </Table>
          </Spin>
        </div>
      </div>

      <div className="justify-content-center align-items-center text-center mt-4">
        <Button
          className="mt-4 m-3 text-center px-4"
          size="large"
          type="primary"
          onClick={enviarDatos}
        >
          <EditOutlined style={{ fontSize: 24 }} />
          Agregar
        </Button>

        <Button
          className="mt-4 m-3 text-center px-4"
          size="large"
          type="primary"
          onClick={limpiar}
          disabled={todos}
        >
          <DeleteOutlined style={{ fontSize: 20 }} />
          Limpiar
        </Button>
      </div>
    </div>
  );
}
