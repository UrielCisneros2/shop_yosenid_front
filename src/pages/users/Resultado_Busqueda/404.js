import React from 'react'
import { Result } from 'antd';

export default function Error404 () {
    return (
        <Result
        status="404"
        title="Escribe el nombre del producto que deseas buscar"
      />
    )
}