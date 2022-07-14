import React from 'react'
import BaseTable from "components/Tables/Base";

export class ResourceTable extends React.Component {
    render() {
        return (
            <BaseTable
                customFilter={this.renderCustomFilter()}
                showEmpty={this.showEmpty}
                {...this.props}
            />
        )
    }

    renderCustomFilter() {

    }
}