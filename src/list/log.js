import React, {useEffect, useState} from "react";
import Axios from "axios";
import {Layout} from "antd";
import {getSider} from "../common";

export default function Logs(props) {
    const [logs, setlogs] = useState("");
    const [requested, setrequested] = useState(false);

    function fetch(ns) {
        let url = 'http://127.0.0.1:8080/api/v1/namespaces/default/pods/mynginx-7468d7484d-p7vcm'

        Axios({
                url: url,
                method: 'get',
                onDownloadProgress: e => {

                    const dataChunk = e.currentTarget.response
                    setlogs(logs + dataChunk)
                }
            }
        )
        setrequested(true)
    }

    useEffect(() => {

        if (!requested) {
            fetch("");
        }
    });
    const renderContent = () => {

        return (

            <div style={{whiteSpace: "pre-wrap"}}>{logs}</div>

        )
    }


    return (<Layout>
        {getSider()}
        {renderContent()}
    </Layout>)
}