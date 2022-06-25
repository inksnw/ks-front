import React, {useEffect, useState} from "react";

import axios from "axios";
import {loading, selectNS, SideBar} from "../components/common";
import {Content} from "antd/es/layout/layout";
import {Button, Col, Form, Input, Layout, Modal, PageHeader, Row, Select, Table} from "antd";
import {fetch} from "../components/request"

export default function Secret(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [formdata, setformdata] = useState({
        name: "", key: "", namespace: "", value: ""

    });


    useEffect(() => {
        fetch("", "secrets", setdata, setisLoading, getObj);
        if (Object.keys(props.updateMsg).length !== 0) {
            fetch("", "secrets", setdata, setisLoading, getObj);
        }
    }, [props, data.items]);

    const handleTableChange = (pagination, filters, sorter) => {
        fetch(filters.namespace, "secrets", setdata, setisLoading);
    }

    function handleOk(e) {
        setVisible(false)
        const url = "http://127.0.0.1:8080/api/v1/secret"
        axios.post(url, formdata).then(response => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const getObj = (item, index) => {
        return {
            name: item.metadata.name,
            namespace: item.metadata.namespace,
            creationTimestamp: item.metadata.creationTimestamp,
            type: item.type,
            key: index
        }
    }

    function formHandle(e) {
        let son = JSON.parse(JSON.stringify(formdata))
        if (e.type === "input") {
            son[e.target.name] = e.target.value
        } else {
            son["namespace"] = e
        }
        setformdata(son)
    }

    function renderModal() {
        return (<Modal title="创建一个secret"
                       centered
                       visible={visible}
                       onOk={handleOk}
                       onCancel={() => setVisible(false)}
                       width={800}
        >
            <Form>
                <Row gutter={32}>
                    <Col span={10}>
                        <Form.Item label='名称'>
                            <Input name='name' onInput={formHandle} value={formdata.name}
                                   placeholder="name"/>
                        </Form.Item>
                    </Col>

                    <Col span={10}>
                        <Form.Item label='名称空间'>
                            <Select name='namespace' onChange={formHandle} value={formdata.namespace}>
                                {selectNS(props.ns)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={32}>
                    <Col span={8}>
                        <Form.Item label='key'>
                            <Input name='key' onInput={formHandle} value={formdata.key} placeholder='键'/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='value'>
                            <Input name='value' onInput={formHandle} value={formdata.value} placeholder='值'/>
                        </Form.Item>
                    </Col>

                </Row>

            </Form>
        </Modal>)
    }


    const renderContent = () => {

        const columns = [
            {title: '名称', dataIndex: 'name'},
            {title: '名称空间', dataIndex: 'namespace', filters: props.ns, filterMultiple: false},
            {title: '创建时间', dataIndex: 'creationTimestamp'},
            {title: '类型', dataIndex: 'type'},
        ];
        if (!isLoading) {
            return loading()
        }

        return (<Content className="site-layout-background">
            <PageHeader ghost={false} title="信息"
                        extra={[<Button key="3" onClick={() => setVisible(true)}>创建secret</Button>]}>

            </PageHeader>
            <Table dataSource={data} columns={columns} onChange={handleTableChange}>
            </Table>
        </Content>)
    }


    return (
        <Layout>
            <SideBar/>
            {renderContent()}
            {renderModal()}
        </Layout>)
}
