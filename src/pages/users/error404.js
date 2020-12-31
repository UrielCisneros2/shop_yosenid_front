import React from 'react'
import { Result } from 'antd';

export default function Error404 () {
    return (
        <Result
        status="404"
        title="404"
        subTitle="Ups, Parece que esta pagina no existe."
      />
    )
}