import React from 'react';
import 'antd/dist/antd.min.css';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Deployments from "./list/deployment";
import Pods from "./list/pod";


class App extends React.Component {

    listen_ws() {
        const conn = new WebSocket("ws://127.0.0.1:8080/ws");
        conn.onclose = function (evt) {
            console.log('关闭连接');
        }
        conn.onmessage = function (evt) {
            console.log('接到消息', evt.data);
        }
    }


    render() {
        this.listen_ws()
        return (<Router>
            <Routes>
                <Route path="/" element={<Pods/>}/>
                <Route path="/pods" element={<Pods/>}/>
                <Route path="/deployments" element={<Deployments/>}/>
            </Routes>
        </Router>)
    }
}

export default App;