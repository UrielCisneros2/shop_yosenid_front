import React, { useState, useEffect } from "react";
import clienteAxios from "../../../config/axios";

import { notification} from "antd";
import { CheckCircleFilled } from '@ant-design/icons';
import '../../../scss/styleEspinoza.scss'

export default function Envio_General() {
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

  return (
    <div>
      <div >
        {dataEstados.map((estado) => {
          if (estado.todos) {
            return (
              <p className="envio-texto font-vista-prod">
                <CheckCircleFilled style={{ fontSize: 20, marginRight: 10 }} /> 
                  <spam >Tenemos envios a toda la republica Mexicana</spam>
              </p>
            );
          } else {
              return null;
          }
        })}
      </div>
    </div>
  );
}
