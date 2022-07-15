import React from 'react'
import {inject, observer} from 'mobx-react'
import {isEmpty} from 'lodash'
import {toJS} from "mobx";

export function withClusterList(options) {
    return withList({injectStores: ['rootStore', 'clusterStore'], ...options})
}

export class ListPage extends React.Component {
    render() {
        return this.props.children
    }
}

function withList(options) {
    return WrappedComponent => {
        const ObserverComponent = observer(WrappedComponent)

        class ListWrapper extends React.Component {
            constructor(props) {
                super(props)
                this.store = options.store || {}
                this.list = this.store.list || {}
                this.module = options.module || ''
                this.authKey = options.authKey || options.module
                this.name = options.name || ''
                this.title = `${options.name}_PL`
                this.rowKey = options.rowKey || 'name'
                this.query = {}
            }

            get routing() {
                return this.props.rootStore.routing
            }

            get prefix() {
                return this.props.match.url
            }

            get defaultItemActions() {
                return [
                    {
                        key: 'edit',
                        icon: 'pen',
                        text: ('EDIT_INFORMATION'),
                        action: 'edit',
                        onClick: item =>
                            this.trigger('resource.baseinfo.edit', {
                                detail: item,
                                success: this.routing.query,
                            }),
                    },
                    {
                        key: 'delete',
                        icon: 'trash',
                        text: ('DELETE'),
                        action: 'delete',
                        onClick: item =>
                            this.trigger('resource.delete', {
                                type: this.name,
                                resource: item.name,
                                detail: item,
                                success: this.routing.query,
                            }),
                    },
                ]
            }

            get enabledActions() {
                return globals.app.getActions({
                    module: this.authKey,
                    ...this.props.match.params,
                    project: this.props.match.params.namespace,
                    devops: this.props.match.params.devops,
                })
            }

            get defaultTableActions() {
                return {
                    onFetch: this.routing.query,
                    onSelectRowKeys: this.list.setSelectRowKeys,
                    selectActions: [
                        {
                            key: 'delete',
                            type: 'danger',
                            text: ('DELETE'),
                            action: 'delete',
                            onClick: () =>
                                this.trigger('resource.batch.delete', {
                                    type: this.name,
                                    rowKey: this.rowKey,
                                    success: this.routing.query,
                                }),
                        },
                    ],
                }
            }

            get searchByApp() {
                return options.searchByApp ?? false
            }

            getData = async ({silent, ...params} = {}) => {
                this.query = params

                const namespaceParams = {}
                if (this.props.clusterStore) {
                    namespaceParams.namespace = this.props.clusterStore.project
                }

                silent && (this.list.silent = true)
                const paramsObj = {
                    ...namespaceParams,
                    ...this.props.match.params,
                    ...params,
                }
                if (this.searchByApp) {
                    paramsObj.searchByApp = this.searchByApp
                }
                await this.store.fetchLis(paramsObj)
                this.list.silent = false
            }

            getTableProps() {
                const {
                    data,
                    filters = {},
                    keyword,
                    selectedRowKeys,
                    isLoading,
                    total,
                    page,
                    limit,
                    silent,
                } = this.list

                const pagination = {total, page, limit}

                const isEmptyList =
                    isLoading === false &&
                    total === 0 &&
                    Object.keys(filters).length <= 0 &&
                    isEmpty(keyword)

                return {
                    data,
                    filters,
                    keyword,
                    pagination,
                    isLoading,
                    selectedRowKeys: toJS(selectedRowKeys),
                    silentLoading: silent,
                    isEmptyList,
                    rowKey: this.rowKey,
                    module: this.module,
                    name: this.name,
                    enabledActions: this.enabledActions,
                    itemActions: this.defaultItemActions,
                    tableActions: this.defaultTableActions,
                    tableId: this.props.match.path,
                }
            }

            getBannerProps() {
                return {
                    className: 'margin-b12',
                    title: (this.title),
                    description: (
                        `${this.name.replace(/\s+/g, '_').toUpperCase()}_DESC`
                    ),
                    module: this.module,
                }
            }

            getSortOrder = dataIndex =>
                this.list.order === dataIndex &&
                (this.list.reverse ? 'descend' : 'ascend')

            getFilteredValue = dataIndex => this.list.filters[dataIndex]

            render() {
                return (
                    <ObserverComponent
                        name={this.name}
                        module={this.module}
                        store={this.store}
                        prefix={this.prefix}
                        routing={this.routing}
                        query={this.query}
                        bannerProps={this.getBannerProps()}
                        tableProps={this.getTableProps()}
                        getSortOrder={this.getSortOrder}
                        getFilteredValue={this.getFilteredValue}
                        enabledActions={this.enabledActions}
                        trigger={this.trigger.bind(this)}
                        getData={this.getData}
                        {...this.props}
                    />
                )
            }
        }

        const injectStores = options.injectStores || ['rootStore']

        return inject(...injectStores)(observer(trigger(ListWrapper)))
    }
}


