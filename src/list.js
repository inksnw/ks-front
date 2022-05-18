import React from 'react';
import 'antd/dist/antd.min.css';
import './index.css';
import axios from "axios";
import {Button, Descriptions, Input, Modal, PageHeader, Table} from 'antd';


class ListVm extends React.Component {

    state = {
        data: [],
        isLoading: false,
        visible: false,
        clone_title: ""
    };


    handleOpenStop(action, name) {
        let url = ""
        if (action === "关机") {
            url = 'http://127.0.0.1:8000/close/' + name
        }
        if (action === "运行") {
            url = 'http://127.0.0.1:8000/open/' + name
        }
        axios.get(url).then(response => {
            alert(response.data.msg)
        }).catch((error) => {
            console.log(error)
        })
    }

    handleClone(obj) {
        this.setState({
                visible: true,
                clone_title: "基于" + obj.ins_name + "克隆一台虚拟机"
            }
        )
    }

    handleOk = (obj) => {
        const URL = "http://127.0.0.1:8000/events"
        const source = new EventSource(URL)
        source.onmessage = e => {
            console.log(e.data)
            console.log("状态", e.data === "2")
            this.setState({
                    clone_title: "基于" + obj.ins_name + "克隆一台虚拟机进度: " + e.data + "%"
                }
            )
            if (e.data === "20") {
                source.close()
            }
        }
    };


    componentDidMount() {
        const url = 'http://127.0.0.1:8080/api/v1/pods'
        axios.get(url).then(response => {
            this.setState({
                data: response.data.items,
                isLoading: true
            })
        }).catch((error) => {
            console.log(error)
            this.setState({
                data: [], isLoading: false
            },)
        })
    }

    render() {
        
        const columns = [
            {
                title: '名称', dataIndex: 'name', render: (text) => {
                    return <a href={"ss"}>{text}</a>
                },
            },
            {title: '名称空间', dataIndex: 'name_space'},
            {title: '创建时间', dataIndex: 'create_time'},
            {title: '状态', dataIndex: 'status'}
        ];
        if (!this.state.isLoading) {
            return (<div><Table> </Table></div>)
        }
        return (<div>
            <PageHeader ghost={false} title="信息" extra={[<Button key="3">创建虚拟机</Button>]}>
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                    <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                    <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                    <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                    <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <Table dataSource={this.state.data} columns={columns}>
            </Table>
        </div>)
    }

    renderClone(obj) {

        return (
            <div>
                <Button
                    onClick={() => this.handleClone(obj)}>
                    克隆
                </Button>
                <Modal title={this.state.clone_title}
                       mask={false}
                       visible={this.state.visible}
                       onOk={() => this.handleOk(obj)}
                       confirmLoading={this.confirmLoading}
                       onCancel={() => {
                           this.setState({
                                   visible: false
                               }
                           )
                       }}
                >
                    <p>请输入新主机的名称</p>
                    <Input placeholder="请输入名称"/>
                </Modal>
            </div>
        )
    }

    renderSwitch(obj) {
        let action = obj.state === "运行中" ? '关机' : '运行';
        return (
            <div>
                <Button type="primary" onClick={() => this.handleOpenStop(action, obj.ins_name)}>
                    {action}
                </Button>
            </div>
        )
    }
}

export default ListVm;