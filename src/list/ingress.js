import {Button, Col, Descriptions, Form, Input, Layout, Modal, PageHeader, Row, Select, Table} from "antd";
import {getNs, getSider} from "../common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import axios from "axios";

export default function Ingress(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [requested, setrequested] = useState(false);
    const [visible, setVisible] = useState(false);
    const [nameSpace, setnameSpace] = useState([]);
    const [pathCount, setpathCount] = useState(1);


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

    function addPath() {
        setpathCount(pathCount + 1)
    }

    useEffect(() => {
        if (!requested) {
            fetch("");
            setnameSpace(getNs())
        }

        if (Object.keys(props.updateMsg).length !== 0) {
            fetch("");
        }

    }, [props, requested]);


    function getPath() {
        const items = []
        for (let i = 0; i < pathCount; i++) {
            items.push(
                <Row gutter={24} key={i}>
                    <Col span={8}>
                        <Form.Item label='Path'>
                            <Input placeholder='Path'/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label='服务名'>
                            <Input placeholder='填写service name'/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='端口'>
                            <Input placeholder='80'/>
                        </Form.Item>
                    </Col>
                </Row>)

        }
        return items
    }

    function renderModal() {
        return (<Modal title="创建一个ingress"
                       centered
                       visible={visible}
                       onOk={() => setVisible(false)}
                       onCancel={() => setVisible(false)}
                       width={560}
        >
            <Form>
                <Row gutter={24}>
                    <Col span={10}>
                        <Form.Item label='名称'>
                            <Input placeholder="ingress名称"/>
                        </Form.Item>
                    </Col>

                    <Col span={10}>
                        <Form.Item label='名称空间'>
                            <Select>
                                {nameSpace.map((item, index) => (<Select.Option key={index}
                                                                                value={item.value}>{item.value}</Select.Option>))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label='域名'>
                            <Input placeholder='填写域名'/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item>
                            <Button onClick={addPath}>添加</Button>
                        </Form.Item>
                    </Col>
                </Row>
                {getPath()}
            </Form>
        </Modal>)
    }

    const renderContent = () => {
        const columns = [{
            title: '名称', dataIndex: 'name', render: (text) => {
                return <a href={text}>{text}</a>
            },
        }, {
            title: '名称空间', dataIndex: 'name_space', filters: getNs(), filterMultiple: false, sorter: true
        }, {title: '创建时间', dataIndex: 'create_time'},

        ];
        if (!isLoading) {
            return (<Content className="site-layout-background">
                <div><Table> </Table></div>
            </Content>)
        }
        return (<Content className="site-layout-background">
            <PageHeader ghost={false} title="信息"
                        extra={[<Button key="3" onClick={() => setVisible(true)}>创建ingress</Button>]}>
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                    <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                </Descriptions>

            </PageHeader>
            <Table dataSource={data} columns={columns} onChange={handleTableChange} compact={true}>
            </Table>
        </Content>)
    }
    return (<Layout>
        {getSider()}
        {renderContent()}
        {renderModal()}
    </Layout>)
}


