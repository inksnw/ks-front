import {Menu, Select, Table} from "antd";
import React from 'react';
import Sider from "antd/es/layout/Sider";
import {Link} from "react-router-dom";
import {Content} from "antd/es/layout/layout";


function getItem(label, key, children) {
    return {
        key,
        children,
        label,
    };
}

function getSider() {
    const items2 = [
        getItem(<Link to="/pods"> pods </Link>, 'sub11'),
        getItem(<Link to="/deployments"> deployment </Link>, 'sub12'),
        getItem(<Link to="/ingress"> ingress </Link>, 'sub2'),
        getItem(<Link to="/secret"> Secret </Link>, 'sub3'),
        getItem(<Link to="/node"> Node </Link>, 'sub4'),
        getItem(<Link to="/role"> Role </Link>, 'sub5')
    ];
    return (<Sider width={150}>
        <Menu mode="inline"
              defaultSelectedKeys={['1']}
              className="sidebar"

              items={items2}
        />
    </Sider>);
}


function renderLoading() {
    return (
        <Content className="site-layout-background">
            <div><Table> </Table></div>
        </Content>
    );
}

function getSelectNS(nameSpace) {
    return nameSpace.map((item, index) =>
        <Select.Option key={index} value={item.value}>{item.value}</Select.Option>
    );
}


export {getItem, getSider, renderLoading, getSelectNS}