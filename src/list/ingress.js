import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Layout,
    Modal,
    notification,
    PageHeader,
    Row,
    Select,
    Space,
    Table
} from "antd";
import {loading, selectNS, sideBar} from "../components/common";
import React, {useEffect, useState} from "react";
import {Content} from "antd/es/layout/layout";
import axios from "axios";


const Context = React.createContext({
    name: "Default"
});

export default function Ingress(props) {

    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [requested, setrequested] = useState(false);
    const [visible, setVisible] = useState(false);
    const [nameSpace, setnameSpace] = useState([]);
    const [formdata, setformdata] = useState({
        name: "",
        namespace: "",
        host: "",
        paths: [{
            path: "",
            svc_name: "",
            port: ""
        }]
    });

    const [api, contextHolder] = notification.useNotification();


    function fetch(ns) {

        let url
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

    function deleteIngress(record) {
        const url = `http://127.0.0.1:8080/api/v1/namespaces/${record.namespace}/ingress/${record.name}`
        axios.delete(url).then(response => {
            console.log(response.data)
            api.info({
                message: `操作结果`,
                description: (
                    <Context.Consumer>{({name}) => `删除成功`}</Context.Consumer>
                ),
            });

        }).catch((error) => {
            api.info({
                message: `操作结果`,
                description: (
                    <Context.Consumer>{({name}) => `删除失败${error}`}</Context.Consumer>
                ),
            });
        })

    }

    function addPath() {
        let son = JSON.parse(JSON.stringify(formdata))
        son.paths.push({
            path: "",
            svc_name: "",
            port: ""
        })
        setformdata(son)
    }

    function deletePath() {
        let son = JSON.parse(JSON.stringify(formdata))
        son.paths.pop()
        setformdata(son)
    }

    useEffect(() => {
        if (!requested) {
            fetch("");
            setnameSpace(props.ns)
        }

        if (Object.keys(props.updateMsg).length !== 0) {
            console.log("接到消息", props.updateMsg)
            fetch("");
        }

    }, [props, requested]);


    function getPath() {
        return formdata.paths.map((item, index) => (
            <Row gutter={32} key={index}>
                <Col span={6}>
                    <Form.Item label='Path'>
                        <Input placeholder='Path' name='path' id={index} onInput={formHandle}/>
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item label='服务名'>
                        <Input placeholder='填写service name' id={index} name='svc_name' onInput={formHandle}/>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label='端口'>
                        <Input placeholder='80' name='port' id={index} onInput={formHandle}/>
                    </Form.Item>
                </Col>

            </Row>
        ))
    }

    function handleOk(e) {
        setVisible(false)
        const url = "http://127.0.0.1:8080/api/v1/ingress"
        axios.post(url, formdata).then(response => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    function formHandle(e) {
        const dicInput = ["path", "svc_name", "port"]
        let son = JSON.parse(JSON.stringify(formdata))
        if (e.type === "input") {
            if (dicInput.indexOf(e.target.name) > -1) {
                son.paths[e.target.id][e.target.name] = e.target.value
            } else {
                son[e.target.name] = e.target.value
            }
        } else {
            son["namespace"] = e
        }
        setformdata(son)
    }


    function renderModal() {
        return (
            <Modal title="创建一个ingress"
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
                                       placeholder="ingress名称"/>
                            </Form.Item>
                        </Col>

                        <Col span={10}>
                            <Form.Item label='名称空间'>
                                <Select name='namespace' onChange={formHandle} value={formdata.namespace}>
                                    {selectNS(nameSpace)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={32}>
                        <Col span={8}>
                            <Form.Item label='域名'>
                                <Input name='host' onInput={formHandle} value={formdata.host} placeholder='填写域名'/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item>
                                <Button onClick={addPath}>添加</Button>
                                <Button onClick={deletePath}>删除</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                    {getPath()}
                </Form>
            </Modal>)
    }


    const renderContent = () => {
        const columns = [
            {
                title: '名称', dataIndex: 'name', render: (text) => {
                    return <a href={text}>{text}</a>
                },
            },
            {
                title: '名称空间', dataIndex: 'namespace', filters: props.ns, filterMultiple: false, sorter: true
            },
            {
                title: 'Host', dataIndex: 'host'
            },
            {title: '创建时间', dataIndex: 'create_time'},
            {
                title: '操作', dataIndex: 'xxx', render: (e, record) =>
                    <div>
                        <Button key="3" onClick={() => deleteIngress(record)}>删除</Button>
                    </div>
            },

        ];
        if (!isLoading) {
            return loading()
        }
        return (
            <Content className="site-layout-background">
                <PageHeader ghost={false} title="Ingress"
                            extra={[<Button key="3" onClick={() => setVisible(true)}>创建ingress</Button>]}>


                    <Context.Provider value={{name: "Ant Design"}}>
                        {contextHolder}
                        <Space> </Space>
                        <Divider/>
                    </Context.Provider>

                </PageHeader>
                <Table dataSource={data} columns={columns} onChange={handleTableChange} compact={true}>
                </Table>
            </Content>)
    }
    return (<Layout>
        {sideBar()}
        {renderContent()}
        {renderModal()}
    </Layout>)
}


