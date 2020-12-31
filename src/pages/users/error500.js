import React from 'react'
import { Result } from 'antd';

export default function Error500 () {
    return (
        <Result
        status="500"
        title="Error del servidor"
        subTitle="Ups, Parece que hubo un error con el servidor."
      />
    )
}