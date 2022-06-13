import {Button, Layout, PageHeader, Table} from "antd";
import {loading, sideBar} from "../components/common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import axios from "axios";

export default function Deployments(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);

    function fetch(ns) {

        let url = ""
        if (typeof (ns) === "undefined" || ns === null) {
            url = 'http://127.0.0.1:8080/api/v1/deployments'
        } else {
            url = 'http://127.0.0.1:8080/api/v1/deployments?'.concat('ns=', ns)
        }

        axios.get(url).then(response => {
            setdata(response.data.items)
            setisLoading(true)
        }).catch((error) => {
            console.log(error)
            setisLoading(false)
        })
    }

    const handleTableChange = (pagination, filters, sorter) => {
        fetch(filters.name_space);
    }

    useEffect(() => {
        fetch("");
        if (Object.keys(props.updateMsg).length !== 0) {
            fetch("");
        }
    }, [props, data.items]);


    const renderContent = () => {

        const columns = [
            {
                title: '名称', dataIndex: 'name', render: (text) => {
                    return <a href={text}>{text}</a>
                },
            },
            {title: '名称空间', dataIndex: 'name_space', filters: props.ns, filterMultiple: false, sorter: true},
            {title: '副本数', dataIndex: 'replicas'},
            {title: '镜像', dataIndex: 'images'},
            {title: '是否完成', dataIndex: 'is_complete'},
            {title: 'Message', dataIndex: 'message'},
            {title: '创建时间', dataIndex: 'create_time'},

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
            {sideBar()}
            {renderContent()}
        </Layout>
    )
}
