import React from 'react'
import {Table,} from '@kube-design/components'
import classnames from "classnames";
import styles from './index.scss'
import {toJS} from 'mobx'

export default class BaseTable extends React.Component {

    render() {
        const {
            className,
            data,
            isLoading,
            silentLoading,
            rowKey,
            selectedRowKeys,
            onSelectRowKeys,
            hideHeader,
            hideFooter,
            extraProps,
            getCheckboxProps,
        } = this.props

        if (this.showEmpty) {
            return this.renderEmpty()
        }

        const props = {}

        if (!hideHeader) {
            props.title = this.renderTableTitle()
        }

        if (!hideFooter) {
            props.footer = this.renderTableFooter()
        }

        if (onSelectRowKeys) {
            props.rowSelection = {
                selectedRowKeys,
                getCheckboxProps,
                onSelect: (record, checked, rowKeys) => {
                    onSelectRowKeys(rowKeys)
                },
                onSelectAll: (checked, rowKeys) => {
                    onSelectRowKeys(rowKeys)
                },
            }
        }

        return (
            <Table
                className={classnames(styles.table, 'ks-table', className)}
                rowKey={rowKey}
                columns={this.filteredColumns}
                dataSource={toJS(data)}
                loading={silentLoading ? false : isLoading}
                onChange={this.handleChange}
                emptyText={this.renderEmptyText()}
                {...props}
                {...extraProps}
            />
        )
    }
}