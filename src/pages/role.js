import {Button, Layout, PageHeader, Table} from "antd";
import {loading, SideBar} from "../components/common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";

import {fetch} from "../components/request"

export default function Role(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const getObj = (item, index) => {
        return {
            name: item.metadata.name,
            namespace: item.metadata.namespace,
            creationTimestamp: item.metadata.creationTimestamp,
            key: index
        }
    }

    useEffect(() => {
        fetch("", "roles", setdata, setisLoading, getObj);
        if (Object.keys(props.updateMsg).length !== 0) {
            fetch("", "roles", setdata, setisLoading, getObj);
        }
    }, [props, data.items]);

    const handleTableChange = (pagination, filters, sorter) => {
        fetch(filters.namespace, "roles", setdata, setisLoading);
    }


    const renderContent = () => {

        const columns = [
            {title: '名称', dataIndex: 'name'},
            {title: '名称空间', dataIndex: 'namespace', filters: props.ns, filterMultiple: false},
            {title: '创建时间', dataIndex: 'creationTimestamp'},
        ];
        if (!isLoading) {
            return loading()
        }

        return (<Content className="site-layout-background">
            <PageHeader ghost={false} title="信息" extra={[<Button key="3">创建虚拟机</Button>]}>

            </PageHeader>
            <Table dataSource={data} columns={columns} onChange={handleTableChange}>
            </Table>
        </Content>)
    }


    return (
        <Layout>
            <SideBar/>
            {renderContent()}
        </Layout>
    )
}
