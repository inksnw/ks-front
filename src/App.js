import React from 'react';
import 'antd/dist/antd.min.css';
import './index.css';
import {Layout, Menu} from 'antd';
import ListVm from "./list";

const {Content, Sider} = Layout;


class Demo extends React.Component {
    render() {
        return (<Layout>
            <Layout>
                {this.getSider()}
                {this.getContent()}
            </Layout>
        </Layout>)
    }

    getContent() {
        return (<Layout>
            <Content className="site-layout-background">
                <ListVm/>
            </Content>
        </Layout>);
    }

    getSider() {
        const items2 = [{
            key: '1', label: '虚拟机',
        }, {
            key: '2', label: '网络',
        }, {
            key: '3', label: '存储',
        },];
        return (<Sider width={150}>
            <Menu mode="inline"
                  defaultSelectedKeys={['1']}
                  style={{height: '100%', borderRight: -1,}}
                  items={items2}
            />
        </Sider>);
    }
}

export default Demo;