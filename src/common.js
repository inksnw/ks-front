import {Menu} from "antd";
import React from 'react';
import Sider from "antd/es/layout/Sider";
import {Link} from "react-router-dom";
import axios from "axios";

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
        getItem(<Link to="/ingress"> ingress </Link>, 'sub2')
    ];
    return (<Sider width={150}>
        <Menu mode="inline"
              defaultSelectedKeys={['1']}
              style={{height: '100%', borderRight: -1,}}
              items={items2}
        />
    </Sider>);
}

function getNs(rv) {
    const url = 'http://127.0.0.1:8080/api/v1/namespaces'

    axios.get(url).then(response => {
        for (const rvKey in response.data.items) {
            let key = response.data.items[rvKey].name
            rv.push({value: key, text: key})
        }
    }).catch((error) => {
        console.log(error)
    })

}

export {getItem, getSider, getNs}