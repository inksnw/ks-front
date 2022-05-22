import {Button, Descriptions, Form, Input, Layout, Modal, PageHeader, Select, Table} from "antd";
import {getNs, getSider} from "../common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import axios from "axios";

export default function Ingress(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [requested, setrequested] = useState(false);
    const [visible, setVisible] = useState(false);


    function fetch(ns) {

        let url = ""
        if (typeof (ns) === "undefined" || ns === null) {
            url = 'http://127.0.0.1:8080/api/v1/ingress'
        } else {
            url = 'http://127.0.0.1:8080/api/v1/ingress?'.concat('ns=', ns)
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
            {
                title: '名称空间', dataIndex: 'name_space', filters: getNs(), filterMultiple: false, sorter: true
            },
            {title: '创建时间', dataIndex: 'create_time'},

        ];
        if (!isLoading) {
            return (
                <Content className="site-layout-background">
                    <div><Table> </Table></div>
                </Content>
            )
        }


        return (
            <Content className="site-layout-background">
                <PageHeader ghost={false} title="信息"
                            extra={[<Button key="3" onClick={() => setVisible(true)}>创建ingress</Button>

                            ]}>
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                        <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                    </Descriptions>
                    <Modal
                        title="Modal 1000px width"
                        centered
                        visible={visible}
                        onOk={() => setVisible(false)}
                        onCancel={() => setVisible(false)}
                        width={1000}
                    >
                        <Form>
                            <Form.Item label="名称" required>
                                <Form.Item
                                    style={{display: 'inline-flex', width: 'calc(45% - 4px)'}}
                                    name="名称"
                                    rules={[{required: true, message: '不能为空'}]}
                                >
                                    <Input placeholder="ingress名称"/>
                                </Form.Item>

                                <Select
                                    style={{display: 'inline-flex', width: 'calc(55% - 12px)'}}
                                    name="名称"
                                    placement="bottomLeft"
                                >
                                    {/*todo 搞不懂怎么远程获取了*/}
                                    <Select.Option value="default">default</Select.Option>

                                </Select>

                            </Form.Item>

                            <p>some contents...</p>
                            <p>some contents...</p>

                        </Form>

                    </Modal>
                </PageHeader>
                <Table dataSource={data} columns={columns} onChange={handleTableChange} compact={true}>
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


