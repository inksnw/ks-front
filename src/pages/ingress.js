import {Button, Divider, Layout, notification, PageHeader, Space, Table} from "antd";
import {loading, SideBar} from "../components/common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import axios from "axios";
import RenderModal from "../create/ingress";
import {fetch} from "../components/request"


const Context = React.createContext({
    name: "Default"
});

export default function Ingress(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [visible, setVisible] = useState(false);


    const [api, contextHolder] = notification.useNotification();


    const handleTableChange = (pagination, filters, sorter) => {
        fetch(filters.namespace, "ingress", setdata, setisLoading);
    }

    function deleteIngress(record) {
        const url = `http://127.0.0.1:8080/api/v1/namespaces/${record.namespace}/ingress/${record.name}`
        axios.delete(url).then(response => {
            console.log(response.data)
            api.info({
                message: `操作结果`,
                description: (
                    <Context.Consumer>{({name}) => `删除成功`}</Context.Consumer>
                ),
            });

        }).catch((error) => {
            api.info({
                message: `操作结果`,
                description: (
                    <Context.Consumer>{({name}) => `删除失败${error}`}</Context.Consumer>
                ),
            });
        })

    }

    const getObj = (item, index) => {
        return {
            name: item.metadata.name,
            namespace: item.metadata.namespace,
            creationTimestamp: item.metadata.creationTimestamp,
            status: item.status.phase,
            key: index
        }
    }

    useEffect(() => {
        fetch("", "ingress", setdata, setisLoading, getObj);
        if (Object.keys(props.updateMsg).length !== 0) {
            fetch("", "ingress", setdata, setisLoading, getObj);
        }
    }, [props, data.items]);


    const renderContent = () => {
        const columns = [
            {title: '名称', dataIndex: 'name'},
            {title: '名称空间', dataIndex: 'namespace', filters: props.ns, filterMultiple: false},
            {title: 'Host', dataIndex: 'host'},
            {title: '创建时间', dataIndex: 'create_time'},
            {
                title: '操作', dataIndex: 'xxx', render: (e, record) =>
                    <div>
                        <Button key="3" onClick={() => deleteIngress(record)}>删除</Button>
                    </div>
            },

        ];
        if (!isLoading) {
            return loading()
        }
        return (
            <Content className="site-layout-background">
                <PageHeader ghost={false} title="Ingress"
                            extra={[<Button key="3" onClick={() => setVisible(true)}>创建ingress</Button>]}>


                    <Context.Provider value={{name: "Ant Design"}}>
                        {contextHolder}
                        <Space> </Space>
                        <Divider/>
                    </Context.Provider>

                </PageHeader>
                <Table dataSource={data} columns={columns} onChange={handleTableChange} compact={true}>
                </Table>
            </Content>)
    }
    return (
        <Layout>
            <SideBar/>
            {renderContent()}
            {RenderModal(visible, setVisible, props.ns)}
        </Layout>)
}


