import React, {useEffect, useState} from "react";

import axios from "axios";
import {getNs, getSider} from "../common";
import {Content} from "antd/es/layout/layout";
import {Button, Descriptions, Layout, PageHeader, Table} from "antd";

export default function Secret(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [requested, setrequested] = useState(false);

    function fetch(ns) {
        let url = ""
        if (typeof (ns) === "undefined" || ns === null) {
            url = 'http://127.0.0.1:8080/api/v1/secret'
        } else {
            url = 'http://127.0.0.1:8080/api/v1/secret?'.concat('ns=', ns)
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

    useEffect(() => {

        if (!requested) {
            fetch("");
        }

        if (Object.keys(props.updateMsg).length !== 0) {
            fetch("");
        }

    }, [props, requested]);

    const handleTableChange = (pagination, filters, sorter) => {

        fetch(filters.name_space);
    }


    const renderContent = () => {

        const columns = [
            {
                title: '名称', dataIndex: 'name', render: (text) => {
                    return <a href={"ss"}>{text}</a>
                },
            },
            {
                title: '名称空间', dataIndex: 'name_space', filters: getNs(), filterMultiple: false, sorter: true
            },
        ];
        if (!isLoading) {
            return (<Content className="site-layout-background">
                <div><Table> </Table></div>
            </Content>)
        }

        return (<Content className="site-layout-background">
            <PageHeader ghost={false} title="信息" extra={[<Button key="3">创建虚拟机</Button>]}>
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                    <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <Table dataSource={data} columns={columns} onChange={handleTableChange}>
            </Table>
        </Content>)
    }


    return (<Layout>
        {getSider()}
        {renderContent()}
    </Layout>)
}
