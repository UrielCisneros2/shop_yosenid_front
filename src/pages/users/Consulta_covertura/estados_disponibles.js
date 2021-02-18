import React, { useState, useEffect } from "react";

import clienteAxios from "../../../config/axios";

import { notification, Tooltip, Tag } from "antd";

export default function Estados_disponibles() {
  const [dataEstados, setDataEstados] = useState([]);

  const traerDatos = async () => {
    clienteAxios
      .get(`/politicasEnvio/estados/`)
      .then((res) => {
        setDataEstados(res.data);
      })
      .catch((err) => {
        notification.error({
          message: "Error del servidor",
          description:
            "Paso algo en el servidor, al parecer la conexion esta fallando.",
        });
      });
  };

  useEffect(() => {
    traerDatos();
  }, []);


  const municipios = [];

  return (
    <div>
      <div className="text-center ">
        <h3 className="font-secun">Tenemos envios a:</h3>
        {
          dataEstados.map((estados) => {
            estados.municipios.map((municipio) => {
              municipios.push(municipio.municipio + "       -       ");
            });

            if (estados.todos || dataEstados.length === 0) {
              
            }else{
              return(
                <Tooltip
                  placement="left"
                  key={estados._id}
                  title={municipios}
                >
                  <Tag
                    className="mt-2 tags-color font-vista-prod"
                    visible={true}
                    key={estados._id}
                  >
                    {estados.estado}
                  </Tag>
                </Tooltip>
                )
            }
          })
      } 
      </div>
    </div>
  );
}
