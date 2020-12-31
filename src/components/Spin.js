import React from 'react'
import { Spin } from 'antd';
import './spin.scss';

export default function Spinner(props){
    return <Spin className="spiner" size="large" spinning={props.spinning}>{props.children}</Spin>
}
