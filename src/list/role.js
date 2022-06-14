import {Button, Layout, PageHeader, Table} from "antd";
import {loading, SideBar} from "../components/common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import axios from "axios";


export default function Role(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);

    function fetch(ns) {
        let url = ""
        if (typeof (ns) === "undefined" || ns === null) {
            url = 'http://127.0.0.1:8080/api/v1/role'
        } else {
            url = 'http://127.0.0.1:8080/api/v1/role?'.concat('ns=', ns)
        }

        axios.get(url).then(response => {
            setdata(response.data.items)
            setisLoading(true)
        }).catch((error) => {
            console.log(error)
            setisLoading(false)
        })
    }

    useEffect(() => {
        fetch("");
        if (Object.keys(props.updateMsg).length !== 0) {
            fetch("");
        }
    }, [props, data.items]);

    const handleTableChange = (pagination, filters, sorter) => {

        fetch(filters.name_space);
    }


    const renderContent = () => {

        const columns = [
            {
                title: '名称', dataIndex: 'name', render: (text) => {
                    return <a href={"logs"}>{text}</a>
                },
            },
            {
                title: '名称空间', dataIndex: 'name_space', filters: props.ns, filterMultiple: false, sorter: true
            },
            {title: '创建时间', dataIndex: 'create_time'},
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
