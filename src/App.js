import React from 'react';
import 'antd/dist/antd.min.css';
import './css/index.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Deployments from "./pages/clusters/containers/Deployments";
import Pods from "./pages/pod";
import Ingress from "./pages/ingress";
import Secret from "./pages/secret";
import Node from "./pages/node";
import Role from "./pages/role";
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
                let key = response.data.items[rvKey].metadata.name
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

        const conn = new WebSocket("ws://127.0.0.1:8080/kapis/ws");
        conn.onclose = function (evt) {
            console.log('关闭连接');
        }
        conn.onmessage = (evt) => {
            if (evt.data === "ping") {
                return
            }
            console.log("接到ws消息: ", evt.data)
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