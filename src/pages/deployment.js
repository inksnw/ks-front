import {Button, Layout, PageHeader, Table} from "antd";
import {loading, SideBar} from "../components/common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import {fetch} from "../components/request"

export default function Deployments(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);

    const handleTableChange = (pagination, filters, sorter) => {
        fetch(filters.namespace, "deployments", setdata, setisLoading);
    }
    const getObj = (item, index) => {
        return {
            name: item.metadata.name,
            namespace: item.metadata.namespace,
            creationTimestamp: item.metadata.creationTimestamp,
            replicas: item.status.replicas,
            key: index
        }
    }

    useEffect(() => {
        fetch("", "deployments", setdata, setisLoading, getObj);
        if (Object.keys(props.updateMsg).length !== 0) {
            fetch("", "deployments", setdata, setisLoading, getObj);
        }
    }, [props, data.items]);


    const renderContent = () => {

        const columns = [
            {title: '名称', dataIndex: 'name'},
            {title: '名称空间', dataIndex: 'namespace'},
            {title: '创建时间', dataIndex: 'creationTimestamp'},
            {title: '副本数', dataIndex: 'replicas'},
        ];
        if (!isLoading) {
            return loading()
        }

        return (
            <Content className="site-layout-background">
                <PageHeader title="deployment" extra={[<Button key="3">创建deployment</Button>]}> </PageHeader>
                <Table dataSource={data} columns={columns} onChange={handleTableChange}> </Table>
            </Content>
        )
    }
    return (
        <Layout>
            <SideBar/>
            {renderContent()}
        </Layout>
    )
}
