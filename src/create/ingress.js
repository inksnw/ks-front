import {Button, Col, Form, Input, Modal, Row, Select} from "antd";
import {selectNS} from "../components/common";
import React, {useState} from "react";
import axios from "axios";

function RenderModal(visible, setVisible, nameSpace) {

    const [formData, setFormData] = useState({
        name: "", namespace: "", host: "", paths: [{
            path: "", svc_name: "", port: ""
        }]
    });

    function addPath() {
        let son = JSON.parse(JSON.stringify(formData))
        const newPath = {
            path: "", svc_name: "", port: ""
        }
        son.paths = [...son.paths, newPath]
        setFormData(son)
    }

    function deletePath() {
        let son = JSON.parse(JSON.stringify(formData))
        son.paths.pop()
        setFormData(son)
    }


    function getPath() {
        return formData.paths.map((item, index) => (<Row gutter={32} key={index}>
            <Col span={6}>
                <Form.Item label='Path'>
                    <Input placeholder='Path' name='path' id={index} onInput={subHandle}/>
                </Form.Item>
            </Col>

            <Col span={6}>
                <Form.Item label='服务名'>
                    <Input placeholder='填写service name' id={index} name='svc_name' onInput={subHandle}/>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label='端口'>
                    <Input placeholder='80' name='port' id={index} onInput={subHandle}/>
                </Form.Item>
            </Col>

        </Row>))
    }


    function subHandle(e) {
        let son = JSON.parse(JSON.stringify(formData))
        son.paths[e.target.id][e.target.name] = e.target.value
        setFormData(son)
    }

    function formHandle(e) {

        let son = JSON.parse(JSON.stringify(formData))
        if (e.type === "input") {
            son[e.target.name] = e.target.value
        } else {
            son["namespace"] = e
        }
        setFormData(son)
    }

    function handleOk(e) {
        setVisible(false)
        const url = "http://127.0.0.1:8080/api/v1/ingress"
        axios.post(url, formData).then(response => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (<Modal title="创建一个ingress"
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
                        <Input name='name' onInput={formHandle} value={formData.name}
                               placeholder="ingress名称"/>
                    </Form.Item>
                </Col>

                <Col span={10}>
                    <Form.Item label='名称空间'>
                        <Select name='namespace' onSelect={formHandle} value={formData.namespace}>
                            {selectNS(nameSpace)}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={32}>
                <Col span={8}>
                    <Form.Item label='域名'>
                        <Input name='host' onInput={formHandle} value={formData.host} placeholder='填写域名'/>
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

export default RenderModal