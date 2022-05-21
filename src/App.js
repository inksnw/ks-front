import React from 'react';
import 'antd/dist/antd.min.css';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Deployments from "./list/deployment";
import Pods from "./list/pod";


class App extends React.Component {

    state = {
        data: {},
        podList: {},
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
                    <Route path="/" element={<Pods/>}/>
                    <Route path="/pods" element={<Pods/>}/>
                    <Route path="/deployments" element={<Deployments deployList={this.state.data}/>}/>
                </Routes>
            </Router>)
    }
}

export default App;