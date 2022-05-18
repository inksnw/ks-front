import React from 'react';
import {Button, Descriptions, Layout, PageHeader, Table} from "antd";
import {getSider} from "../common"
import {Content} from "antd/es/layout/layout";
import axios from "axios";


class Deployments extends React.Component {
    state = {
        data: [],
        isLoading: false,
        visible: false,
    };

    componentDidMount() {
        const url = 'http://127.0.0.1:8080/api/v1/deployments'
        axios.get(url).then(response => {
            this.setState({
                data: response.data.items,
                isLoading: true
            })
        }).catch((error) => {
            console.log(error)
            this.setState({
                data: [], isLoading: false
            },)
        })
    }


    render() {
        return (
            <Layout>
                {getSider()}
                {this.renderContent()}
            </Layout>
        )

    }


    renderContent() {
        const columns = [
            {
                title: '名称', dataIndex: 'name', render: (text) => {
                    return <a href={text}>{text}</a>
                },
            },
            {title: '名称空间', dataIndex: 'name_space'},
            {title: '副本数', dataIndex: 'replicas'},
            {title: '镜像', dataIndex: 'images'},
            {title: '创建时间', dataIndex: 'create_time'},
            {title: '是否完成', dataIndex: 'is_complete'},
            {title: 'Message', dataIndex: 'message'},
            {title: '创建时间', dataIndex: 'create_time'},

        ];
        if (!this.state.isLoading) {
            return (
                <Content className="site-layout-background">
                    <div><Table> </Table></div>
                </Content>
            )
        }
        return (
            <Content className="site-layout-background">
                <PageHeader ghost={false} title="信息" extra={[<Button key="3">创建虚拟机</Button>]}>
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                        <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                    </Descriptions>
                </PageHeader>
                <Table dataSource={this.state.data} columns={columns}>
                </Table>
            </Content>
        )
    }
}

export default Deployments;