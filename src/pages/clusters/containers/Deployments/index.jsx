import React from 'react'
import {ListPage, withClusterList} from "components/HOCs/withList";
import {ResourceTable} from "pages/clusters/components/ResourceTable";
import {get} from "lodash";
import {Link} from 'react-router-dom'
import {WORKLOAD_STATUS} from "utils/constants";
import {getWorkloadStatus} from "utils/status";
import StatusReason from 'pages/projects/components/StatusReason'
import Avatar from 'components/Base/Avatar'
import WorkloadStore from "stores/workload";
import WorkloadStatus from 'pages/projects/components/WorkloadStatus'

@withClusterList({
    store: new WorkloadStore('deployments'),
    module: 'deployments',
    name: 'WORKLOAD',
    rowKey: 'uid',
})

export default class Deployments extends React.Component {
    handleTabChange = value => {
        const {cluster} = this.props.match.params
        this.props.routing.push(`/clusters/${cluster}/${value}`)
    }

    get tabs() {
        return {
            value: this.props.module,
            onChange: this.handleTabChange,
            options: [
                {
                    value: 'deployments',
                    label: ('DEPLOYMENTS'),
                },
                {
                    value: 'statefulsets',
                    label: ('STATEFULSETS'),
                },
                {
                    value: 'daemonsets',
                    label: ('DAEMONSETS'),
                },
            ],
        }
    }

    showAction = record => !record.isFedManaged

    get selectActions() {
        const {tableProps, trigger, name, rootStore} = this.props
        return [
            ...get(tableProps, 'tableActions.selectActions', {}),
            {
                key: 'stop',
                text: ('STOP'),
                onClick: () =>
                    trigger('resource.batch.stop', {
                        type: name,
                        rowKey: 'uid',
                        success: rootStore.routing.query(),
                    }),
            },
        ]
    }

    get itemActions() {
        const {module, name, trigger} = this.props
        return [
            {
                key: 'edit',
                icon: 'pen',
                text: ('EDIT_INFORMATION'),
                action: 'edit',
                show: this.showAction,
                onClick: item =>
                    trigger('resource.baseinfo.edit', {
                        detail: item,
                    }),
            },
            {
                key: 'editYaml',
                icon: 'pen',
                text: ('EDIT_YAML'),
                action: 'edit',
                show: this.showAction,
                onClick: item =>
                    trigger('resource.yaml.edit', {
                        detail: item,
                    }),
            },
            {
                key: 'redeploy',
                icon: 'restart',
                text: ('RECREATE'),
                action: 'edit',
                show: this.showAction,
                onClick: item =>
                    trigger('workload.redeploy', {
                        module,
                        detail: item,
                    }),
            },
            {
                key: 'delete',
                icon: 'trash',
                text: ('DELETE'),
                action: 'delete',
                show: this.showAction,
                onClick: item =>
                    trigger('resource.delete', {
                        type: name,
                        detail: item,
                    }),
            },
        ]
    }

    getStatus() {
        return WORKLOAD_STATUS.map(status => ({
            text: (status.text),
            value: status.value,
        }))
    }

    getItemDesc = record => {
        const {status, reason} = getWorkloadStatus(record, this.props.module)
        const desc = reason ? (
            <StatusReason status={status} reason={t(reason)} data={record}/>
        ) : (
            record.description || '-'
        )

        return desc
    }

    getCheckboxProps = record => ({
        disabled: record.isFedManaged,
        name: record.name,
    })

    getColumns = () => {
        const {getSortOrder, getFilteredValue, module} = this.props
        const {cluster} = this.props.match.params

        return [
            {
                title: ('NAME'),
                dataIndex: 'name',
                sorter: true,
                sortOrder: getSortOrder('name'),
                search: true,
                render: (name, record) => (
                    <Avatar
                        icon={ICON_TYPES[module]}
                        iconSize={40}
                        title={getDisplayName(record)}
                        desc={this.getItemDesc(record)}
                        isMultiCluster={record.isFedManaged}
                        to={`/clusters/${cluster}/projects/${record.namespace}/${module}/${name}`}
                    />
                ),
            },
            {
                title: ('STATUS'),
                dataIndex: 'status',
                filters: this.getStatus(),
                filteredValue: getFilteredValue('status'),
                isHideable: true,
                search: true,
                width: '22%',
                render: (status, record) => (
                    <WorkloadStatus data={record} module={module}/>
                ),
            },
            {
                title: ('PROJECT'),
                dataIndex: 'namespace',
                isHideable: true,
                width: '22%',
                render: namespace => (
                    <Link to={`/clusters/${cluster}/projects/${namespace}`}>
                        {namespace}
                    </Link>
                ),
            },
            {
                title: ('UPDATE_TIME_TCAP'),
                dataIndex: 'updateTime',
                sorter: true,
                sortOrder: getSortOrder('updateTime'),
                isHideable: true,
                width: 150,
                render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
            },
        ]
    }

    showCreate = () => {
        const {query, match, module} = this.props
        return this.props.trigger('workload.create', {
            module,
            namespace: query.namespace,
            cluster: match.params.cluster,
            supportGpuSelect: true,
        })
    }

    render() {
        const { match, bannerProps, tableProps } = this.props
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
