import React, {useEffect, useState} from "react";
import Axios from "axios";
import axios from "axios";
import {Layout, Modal} from "antd";


function RenderLogModal(logVisible, setLogVisible, ns, podName) {
    const [logs, setlogs] = useState("");
    const [requested, setrequested] = useState(false);

    function cancel() {
        source.cancel('Operation canceled by the user.');
        console.log("关闭连接")
    }

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    function fetch() {
        setlogs("")
        if (ns === "") {
            return
        }

        let url = `http://127.0.0.1:8080/api/v1/namespaces/${ns}/pods/${podName}`
        Axios({
                url: url,
                method: 'get',
                onDownloadProgress: e => {
                    const dataChunk = e.currentTarget.response
                    setlogs(logs + dataChunk)
                },
                cancelToken: source.token
            }
        )
        setrequested(true)
    }

    useEffect(() => {
        if (!requested && logVisible) {
            fetch();
        }
    });

    function closeModal() {
        setLogVisible(false)
        setrequested(false)
        cancel()
    }


    return (
        <Modal title="log"
               visible={logVisible}
               centered
               onOk={closeModal}
               onCancel={closeModal}
               width={800}
               bodyStyle={{height: '400px', overflowY: 'auto'}}
        >

            <Layout>
                <div style={{whiteSpace: "pre-wrap"}}>{logs}</div>
            </Layout>

        </Modal>)
}


export {RenderLogModal}