import React from 'react';
import 'antd/dist/antd.min.css';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Deployments from "./list/deployment";
import Pods from "./list/pod";
import Ingress from "./list/ingress";


class App extends React.Component {

    state = {
        data: {},
        connected: false
    }


    listen_ws = () => {
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
        this.listen_ws()

        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Pods updateMsg={this.state.data}/>}/>
                    <Route path="/pods" element={<Pods updateMsg={this.state.data}/>}/>
                    <Route path="/deployments" element={<Deployments updateMsg={this.state.data}/>}/>
                    <Route path="/ingress" element={<Ingress updateMsg={this.state.data}/>}/>
                </Routes>
            </Router>)
    }
}

export default App;