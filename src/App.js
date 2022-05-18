import React from 'react';
import 'antd/dist/antd.min.css';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Deployments from "./list/deployment";
import Pods from "./list/pod";


class Demo extends React.Component {
    render() {
        return (<Router>
            <Routes>
                <Route path="/" element={<Pods/>}/>
                <Route path="/pods" element={<Pods/>}/>
                <Route path="/deployments" element={<Deployments/>}/>
            </Routes>
        </Router>)
    }
}

export default Demo;