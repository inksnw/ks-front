import {Button, Layout, PageHeader, Table} from "antd";
import {loading, SideBar} from "../components/common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import {renderShellModal} from "../components/shell";
import {fetch} from "../components/request"

export default function Node(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [ShellVisible, setShellVisible] = useState(false);
    const getObj = (item, index) => {
        return {
            name: item.metadata.name,
            creationTimestamp: item.metadata.creationTimestamp,
            cpu: item.status.capacity.cpu,
            memory: item.status.capacity.memory,
            ip: item.status.addresses[0].address,
            status: item.status.phase,
            key: index
        }
    }

    useEffect(() => {
        fetch("", "nodes", setdata, setisLoading, getObj);
    }, [data.items]);


    const renderContent = () => {

        const columns = [
                {title: '名称', dataIndex: 'name'},
                {title: 'cpu', dataIndex: 'cpu'},
                {title: '内存', dataIndex: 'memory'},
                {title: 'IP', dataIndex: 'ip'},
                {
                    title: '操作', dataIndex: 'xxx', render:
                        (e, record) => <div>
                            <Button key="4" onClick={() => setShellVisible(true)}>运行shell</Button>
                        </div>
                }
            ]
        ;
        if (!isLoading) {
            return loading()
        }

        return (<Content className="site-layout-background">
            <PageHeader ghost={false} title="信息" extra={[<Button key="3">创建虚拟机</Button>]}>

            </PageHeader>
            <Table dataSource={data} columns={columns}>
            </Table>
        </Content>)
    }


    return (<Layout>
        <SideBar/>
        {renderContent()}
        {renderShellModal(ShellVisible, setShellVisible, 'ws://localhost:8080/nodeshell')}
    </Layout>)
}
