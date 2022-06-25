import {Button, Layout, PageHeader, Table} from "antd";
import {loading, SideBar} from "../components/common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import {fetch} from "../components/request"
import {RenderLogModal} from "../components/log";
import {renderShellModal} from "../components/shell";

export default function Pods(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [logVisible, setLogVisible] = useState(false);
    const [ShellVisible, setShellVisible] = useState(false);
    const [podName, setPodName] = useState("");
    const [ns, setns] = useState("");

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
        fetch("", "pods", setdata, setisLoading, getObj);
        if (Object.keys(props.updateMsg).length !== 0) {
            fetch("", "pods", setdata, setisLoading, getObj);
        }
    }, [props, data.items]);

    const handleTableChange = (pagination, filters, sorter) => {
        fetch(filters.namespace, "pods", setdata, setisLoading, getObj);
    }
    const showModal = (record) => {
        setLogVisible(true)
        setPodName(record.name)
        setns(record.namespace)
    }

    const renderContent = () => {

        const columns = [
            {title: '名称', dataIndex: 'name',},
            {title: '名称空间', dataIndex: 'namespace', filters: props.ns, filterMultiple: false},
            {title: '创建时间', dataIndex: 'creationTimestamp'},
            {title: '状态', dataIndex: 'status'},
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
