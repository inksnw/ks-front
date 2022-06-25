import axios from "axios";

function fetch(ns, name, setdata, setisLoading, getObj) {
    let url = ""
    let base = "api/v1"
    if (name === "deployments") {
        base = "apis/apps/v1"
    }
    if (name === "roles") {
        base = "apis/rbac.authorization.k8s.io/v1"
    }

    if (ns === "") {
        url = `http://127.0.0.1:8080/${base}/${name}?limit=2`
    } else {
        url = `http://127.0.0.1:8080/${base}/namespaces/${ns}/${name}?`
    }

    axios.get(url).then(response => {
        const d = []
        response.data.items.map((item, index) => {
            const obj = getObj(item, index)
            d.push(obj)
            return d
        })
        setdata(d)
        setisLoading(true)
    }).catch((error) => {
        console.log(error)
        setisLoading(false)
    })
}

export {fetch}