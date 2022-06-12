import React from 'react';
import {Terminal} from 'xterm';
import 'xterm/css/xterm.css';
import {FitAddon} from 'xterm-addon-fit';
import {Modal} from "antd";

function renderShellModal(ShellVisible, setShellVisible, url) {
    return (
        <Modal title="shell"
               visible={ShellVisible}
               centered
               onOk={() => setShellVisible(false)}
               onCancel={() => setShellVisible(false)}
               width={800}
        >
            <WebSSH url={url}/>

        </Modal>)
}


class WebSSH extends React.Component {


    componentDidMount() {
        const fitAddon = new FitAddon();
        const term = new Terminal({
            rendererType: "canvas", //渲染类型
            // rows: Math.ceil((document.getElementById("terminal").clientHeight - 100) / 14), //行数
            convertEol: true, //启用时，光标将设置为下一行的开头
            scrollback: 300,//终端中的回滚量
            disableStdin: false, //是否应禁用输入。
            cursorStyle: 'bar', //光标样式
            cursorBlink: true, //光标闪烁
            row: 70,
            theme: {
                foreground: 'green', //字体
                background: '#060101', //背景色
            }
        });

        term.loadAddon(fitAddon);
        term.open(document.getElementById('terminal'));
        if (term._initialized) {
            return
        }
        term._initialized = true

        const webSocket = new WebSocket(this.props.url);//建立通道
        term.onKey(e => {
            webSocket.send(e.key);
        })
        webSocket.onmessage = function (evt) {
            term.write(evt.data);
        };
    }

    render() {
        return (
            <div id="terminal" style={{height: "100%"}}></div> //terminal容器
        )
    }
}

export {WebSSH, renderShellModal}