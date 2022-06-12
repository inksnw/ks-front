import {Menu, Select, Table} from "antd";
import React from 'react';
import Sider from "antd/es/layout/Sider";
import {Link} from "react-router-dom";
import {Content} from "antd/es/layout/layout";


function getItem(label, children) {
    return {
        label,
        key: Math.random().toString(36).substring(2),
        children,
    };
}

function sideBar() {
    const items = [
        getItem(<Link to="/pods"> pods </Link>),
        getItem(<Link to="/deployments"> deployment </Link>),
        getItem(<Link to="/ingress"> ingress </Link>),
        getItem(<Link to="/secret"> Secret </Link>),
        getItem(<Link to="/node"> Node </Link>),
        getItem(<Link to="/role"> Role </Link>)
    ];
    return (
        <Sider width={150}>
            <Menu mode="inline" className="sidebar" items={items}/>
        </Sider>
    );
}


function loading() {
    return (
        <Content className="site-layout-background">
            <div><Table> </Table></div>
        </Content>
    );
}

function selectNS(nameSpace) {
    return nameSpace.map((item, index) =>
        <Select.Option key={index} value={item.value}>{item.value}</Select.Option>
    );
}


export {getItem, sideBar, loading, selectNS}