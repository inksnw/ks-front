import {Button, Descriptions, Layout, PageHeader, Table} from "antd";
import {getSider, renderLoading} from "../common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import axios from "axios";

export default function Deployments(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [requested, setrequested] = useState(false);

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
        setrequested(true)
    }

    const handleTableChange = (pagination, filters, sorter) => {
        fetch(filters.name_space);
    }

    useEffect(() => {
        if (!requested) {
            fetch("");
        }

        if (Object.keys(props.updateMsg).length !== 0) {
            fetch("");
        }

    }, [props, requested]);


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
            return renderLoading()
        }

        return (
            <Content className="site-layout-background">
                <PageHeader ghost={false} title="信息" extra={[<Button key="3">创建虚拟机</Button>]}>
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                        <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                    </Descriptions>
                </PageHeader>
                <Table dataSource={data} columns={columns} onChange={handleTableChange}>
                </Table>
            </Content>
        )
    }
    return (
        <Layout>
            {getSider()}
            {renderContent()}
        </Layout>
    )
}
