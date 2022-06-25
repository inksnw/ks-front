import {Button, Layout, PageHeader, Table} from "antd";
import {loading, SideBar} from "../components/common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import axios from "axios";
import {renderShellModal} from "../components/shell";

export default function Node(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [ShellVisible, setShellVisible] = useState(false);

    function fetch(ns) {
        let url = 'http://127.0.0.1:8080/api/v1/nodes'

        axios.get(url).then(response => {
            const d = []
            response.data.items.map((item, index) => {
                console.log(item.metadata.name);
                const obj = {
                    name: item.metadata.name,
                    cpu: item.status.capacity.cpu,
                    memory: parseInt(item.status.capacity.memory) / 1000 / 1000,
                    ip: item.status.addresses[0].address,
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
    }, [data.items]);


    const renderContent = () => {

        const columns = [
                {
                    title: '名称', dataIndex: 'name', render: (text) => {
                        return <a href={"logs"}>{text}</a>
                    },
                },
                {
                    title: 'cpu', dataIndex: 'cpu'
                },
                {
                    title: '内存', dataIndex: 'memory'
                },
                {
                    title: 'IP', dataIndex: 'ip'
                },
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
