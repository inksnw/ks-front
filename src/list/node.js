import {Button, Descriptions, Layout, Modal, PageHeader, Table} from "antd";
import {getNs, getSider} from "../common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import axios from "axios";
import WebSSH from "../components/shell";

export default function Node(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [requested, setrequested] = useState(false);
    const [ShellVisible, setShellVisible] = useState(false);

    function fetch(ns) {
        let url = 'http://127.0.0.1:8080/api/v1/nodes'

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

    }, [props, requested]);


    function renderShellModal() {
        return (
            <Modal title="shell"
                   visible={ShellVisible}
                   centered
                   onOk={() => setShellVisible(false)}
                   onCancel={() => setShellVisible(false)}
                   width={800}
            >
                <WebSSH/>

            </Modal>)
    }

    const renderContent = () => {
        let rv = []
        getNs(rv)
        const columns = [
            {
                title: '名称', dataIndex: 'name', render: (text) => {
                    return <a href={"logs"}>{text}</a>
                },
            },
            {
                title: '操作', dataIndex: 'xxx', render: (e, record) =>
                    <div>
                        <Button key="4" onClick={() => setShellVisible(true)}>运行shell</Button>
                    </div>
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
            <Table dataSource={data} columns={columns}>
            </Table>
        </Content>)
    }


    return (<Layout>
        {getSider()}
        {renderContent()}
        {renderShellModal()}
    </Layout>)
}
