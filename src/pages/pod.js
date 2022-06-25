import {Button, Layout, PageHeader, Table} from "antd";
import {loading, SideBar} from "../components/common";
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
            url = 'http://127.0.0.1:8080/api/v1/pods?limit=2'
        } else {
            url = `http://127.0.0.1:8080/api/v1/namespaces/${ns}/pods?`
        }

        axios.get(url).then(response => {
            const d = []
            response.data.items.map((item, index) => {
                console.log(item.metadata.name);
                const obj = {
                    name: item.metadata.name,
                    namespace: item.metadata.namespace,
                    creationTimestamp: item.metadata.creationTimestamp,
                    status: item.status.phase,
                    key: index
                }
                d.push(obj)
                return d
            })
            setdata(d)
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
    const showModal = (record) => {
        setLogVisible(true)
        setPodName(record.name)
        setns(record.name_space)
    }

    const renderContent = () => {

        const columns = [
            {
                title: '名称', dataIndex: 'name',
            },
            {
                title: '名称空间', dataIndex: 'namespace', filters: props.ns, filterMultiple: false, sorter: true
            },
            {
                title: '创建时间', dataIndex: 'creationTimestamp',
            },
            {
                title: '状态', dataIndex: 'status',
            },
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
            <SideBar/>
            {renderContent()}
            {RenderLogModal(logVisible, setLogVisible, ns, podName)}
            {renderShellModal(ShellVisible, setShellVisible, 'ws://localhost:8080/webshell')}
        </Layout>)
}
