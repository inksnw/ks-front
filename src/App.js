import React from 'react';
import 'antd/dist/antd.min.css';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Deployments from "./list/deployment";
import Pods from "./list/pod";
import Ingress from "./list/ingress";
import Secret from "./list/secret";
import Node from "./list/node";
import Role from "./list/role";
import axios from "axios";


class App extends React.Component {

    state = {
        data: {},
        connected: false,
        ns: [],
        nsinit: false
    }

    getNs = () => {
        if (this.state.nsinit) {
            return
        }

        const url = 'http://127.0.0.1:8080/api/v1/namespaces'
        let rv = []
        axios.get(url).then(response => {
            for (const rvKey in response.data.items) {
                let key = response.data.items[rvKey].name
                rv.push({value: key, text: key})
            }
            this.setState(
                {
                    ns: rv,
                    nsinit: true
                }
            )

        }).catch((error) => {
            console.log(error)
            this.setState(
                {
                    nsinit: true
                }
            )
        })
    }


    ws = () => {
        if (this.state.connected) {
            return
        }

        const conn = new WebSocket("ws://127.0.0.1:8080/ws");
        conn.onclose = function (evt) {
            console.log('关闭连接');
        }
        conn.onmessage = (evt) => {
            if (evt.data === "ping") {
                return
            }
            console.log("接到ws消息: ", evt.data)
            // const obj = JSON.parse(props.deployList);
            this.setState(
                {
                    data: evt.data,
                    connected: true
                }
            )
        }
    }


    render() {
        this.ws()
        this.getNs()

        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Pods updateMsg={this.state.data} ns={this.state.ns}/>}/>
                    <Route path="/pods" element={<Pods updateMsg={this.state.data} ns={this.state.ns}/>}/>
                    <Route path="/deployments" element={<Deployments updateMsg={this.state.data} ns={this.state.ns}/>}/>
                    <Route path="/ingress" element={<Ingress updateMsg={this.state.data} ns={this.state.ns}/>}/>
                    <Route path="/secret" element={<Secret updateMsg={this.state.data} ns={this.state.ns}/>}/>
                    <Route path="/node" element={<Node/>}/>
                    <Route path="/role" element={<Role updateMsg={this.state.data} ns={this.state.ns}/>}/>

                </Routes>
            </Router>)
    }
}

export default App;