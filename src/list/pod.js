import {Button, Layout, PageHeader, Table} from "antd";
import {loading, sideBar} from "../components/common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import axios from "axios";
import {RenderLogModal} from "../components/log";
import {renderShellModal} from "../components/shell";

export default function Pods(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [logVisible, setLogVisible] = useState(false);
    const [ShellVisible, setShellVisible] = useState(false);
    const [podName, setPodName] = useState("");
    const [ns, setns] = useState("");

    function fetch(ns) {
        let url = ""
        if (typeof (ns) === "undefined" || ns === null || ns === "") {
            url = 'http://127.0.0.1:8080/api/v1/pods'
        } else {
            url = `http://127.0.0.1:8080/api/v1/namespaces/${ns}/pods?`
        }

        axios.get(url).then(response => {
            setdata(response.data.items)
            setisLoading(true)
        }).catch((error) => {
            console.log(error)
            setisLoading(false)
        })
    }

//todo ws消息传递给content组件就可以了
    useEffect(() => {
        fetch("");
        if (Object.keys(props.updateMsg).length !== 0) {
            fetch("");
        }
    }, [props, data.items]);

    const handleTableChange = (pagination, filters, sorter) => {

        fetch(filters.name_space);
    }
    const showModal = (record) => {
        setLogVisible(true)
        setPodName(record.name)
        setns(record.name_space)
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
            {title: '镜像', dataIndex: 'images', width: "20"},
            {title: 'node_name', dataIndex: 'node_name'},
            {title: 'IP', dataIndex: 'IP'},
            {title: '状态', dataIndex: 'phase'},
            {title: '创建时间', dataIndex: 'create_time'},
            {
                title: '操作', dataIndex: 'xxx', render: (e, record) =>
                    <div>
                        <Button key="3" onClick={() => showModal(record)}>查看日志</Button>
                        <Button key="4" onClick={() => setShellVisible(true)}>运行shell</Button>
                    </div>
            },
        ];
        if (!isLoading) {
            return loading()
        }
        return (
            <Content className="site-layout-background">
                <PageHeader ghost={false} title="信息" extra={[<Button key="3">创建虚拟机</Button>]}> </PageHeader>
                <Table dataSource={data} columns={columns} onChange={handleTableChange}> </Table>
            </Content>
        )
    }


    console.log("渲染render")

    return (
        <Layout>
            {sideBar()}
            {renderContent()}
            {RenderLogModal(logVisible, setLogVisible, ns, podName)}
            {renderShellModal(ShellVisible, setShellVisible, 'ws://localhost:8080/webshell')}
        </Layout>)
}
