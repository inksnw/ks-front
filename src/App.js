import React from 'react';
import Breadcrumb from 'components/Base/Breadcrumb'
import {Route, Router, Routes} from "react-router";


class App extends React.Component {

    render() {
        const breadcrumbs = [
            {
                label: 'Project',
                url: '/projects/:namespace',
            },
            {
                label: 'Deployments',
                url: `/projects/:namespace/deployments`,
            },
        ]

        const routes = [
            {
                name: 'resource-status',
                title: 'RESOURCE_STATUS',
                path: '/projects/:namespace/deployments/:name/resource-status',
            },
            {
                name: 'revision-control',
                title: 'Revision Records',
                path: '/projects/:namespace/deployments/:name/revision-control',
            },
        ]

        const props = {
            params: {namespace: 'kubesphere-system', name: 'ks-console'},
            pathname:
                '/projects/kubesphere-system/deployments/ks-console/resource-status',
            breadcrumbs,
            routes,
        }
        return (
            <Router location={"/"} navigator={"3"}>
                <Routes>
                    <Route path="/" element={<Breadcrumb {...props} />}/>
                </Routes>
            </Router>
        )
    }
}

export default App;