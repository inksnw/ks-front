import {Button, Col, Form, Input, Modal, Row, Select} from "antd";
import {selectNS} from "../components/common";
import React, {useState} from "react";
import axios from "axios";

function RenderModal(visible, setVisible, nameSpace) {

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

    function handleOk(e) {
        setVisible(false)
        const url = "http://127.0.0.1:8080/api/v1/ingress"
        axios.post(url, formdata).then(response => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

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

export default RenderModal