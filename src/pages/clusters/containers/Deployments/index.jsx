import React from 'react'
import withList, {ListPage} from "components/HOCs/withList";
import {ResourceTable} from "pages/clusters/components/ResourceTable";
import WorkloadStore from 'stores/workload'


withList({
    injectStores: ['rootStore', 'clusterStore'], ...{
        store: new WorkloadStore('deployments'),
        module: 'deployments',
        name: 'WORKLOAD',
        rowKey: 'uid',
    }
})


export default class Deployments extends React.Component {
    render() {
        const {match, tableProps} = this.props
        return (
            <ListPage {...this.props}>

                <ResourceTable
                    {...tableProps}
                    itemActions={this.itemActions}
                    selectActions={this.selectActions}
                    columns={this.getColumns()}
                    onCreate={this.showCreate}
                    cluster={match.params.cluster}
                    getCheckboxProps={this.getCheckboxProps}
                />
            </ListPage>
        )
    }
}