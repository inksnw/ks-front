import {Menu} from "antd";
import React from 'react';
import Sider from "antd/es/layout/Sider";
import {Link} from "react-router-dom";

function getItem(label, key, children) {
    return {
        key,
        children,
        label,
    };
}

function getSider() {
    const items2 = [

        getItem(<Link to="/"> 工作负载 </Link>, 'sub1',
            [
                getItem(<Link to="/pods"> pods </Link>, 'sub11'),
                getItem(<Link to="/deployments"> deployment </Link>, 'sub12'),
            ]),
    ];
    return (<Sider width={150}>
        <Menu mode="inline"
              defaultSelectedKeys={['1']}
              style={{height: '100%', borderRight: -1,}}
              items={items2}
        />
    </Sider>);
}


export {getItem, getSider}