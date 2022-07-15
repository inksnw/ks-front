import {get, isEmpty, set} from 'lodash'
import {action, observable} from 'mobx'
import List from './base.list'
import request from 'utils/request'

export default class BaseStore {
    list = new List()

    @observable
    detail = {}

    @observable
    isLoading = true

    @observable
    isSubmitting = false

    @observable
    ksVersion = 3.1

    constructor(module) {
        this.module = module
    }

    get apiVersion() {
        return API_VERSIONS[this.module] || ''
    }

    get mapper() {
        return ObjectMapper[this.module] || (data => data)
    }

    getPath({cluster, namespace} = {}) {
        let path = ''
        if (cluster) {
            path += `/klusters/${cluster}`
        }
        if (namespace) {
            path += `/namespaces/${namespace}`
        }
        return path
    }

    getListUrl = (params = {}) =>
        `${this.apiVersion}${this.getPath(params)}/${this.module}${
            params.dryRun ? '?dryRun=All' : ''
        }`

    getDetailUrl = (params = {}) => `${this.getListUrl(params)}/${params.name}`

    getWatchListUrl = (params = {}) =>
        `${this.apiVersion}/watch${this.getPath(params)}/${this.module}`

    getWatchUrl = (params = {}) =>
        `${this.getWatchListUrl(params)}/${params.name}`

    getResourceUrl = (params = {}) =>
        `kapis/resources.kubesphere.io/v1alpha3${this.getPath(params)}/${
            this.module
        }`

    getFilterParams = params => {
        const result = {...params}
        if (result.app) {
            result.labelSelector = result.labelSelector || ''
            result.labelSelector += `app.kubernetes.io/name=${result.app}`
            delete result.app
        }
        return result
    }

    @action
    setModule(module) {
        this.module = module
    }

    @action
    submitting = promise => {
        this.isSubmitting = true

        setTimeout(() => {
            promise
                .catch(() => {
                })
                .finally(() => {
                    this.isSubmitting = false
                })
        }, 500)

        return promise
    }

    @action
    async fetchList({
                        cluster,
                        workspace,
                        namespace,
                        more,
                        devops,
                        ...params
                    } = {}) {
        this.list.isLoading = true

        if (!params.sortBy && params.ascending === undefined) {
            params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
        }

        if (params.limit === Infinity || params.limit === -1) {
            params.limit = -1
            params.page = 1
        }

        params.limit = params.limit || 10

        const result = await request.get(
            this.getResourceUrl({cluster, workspace, namespace, devops}),
            this.getFilterParams(params)
        )
        const data = (get(result, 'items') || []).map(item => ({
            cluster,
            namespace,
            ...this.mapper(item),
        }))

        this.list.update({
            data: more ? [...this.list.data, ...data] : data,
            total: result.totalItems || result.total_count || data.length || 0,
            ...params,
            limit: Number(params.limit) || 10,
            page: Number(params.page) || 1,
            isLoading: false,
            ...(this.list.silent ? {} : {selectedRowKeys: []}),
        })

        return data
    }

    @action
    async fetchListByK8s({cluster, namespace, module, ...rest} = {}) {
        this.list.isLoading = true

        if (module) {
            this.module = module
        }

        const params = rest

        const result = await request.get(
            this.getListUrl({cluster, namespace, module}),
            params,
            {},
            () => {
                return {items: []}
            }
        )

        const data = Array.isArray(result.items)
            ? result.items.map(item => ({
                cluster,
                module: module || this.module,
                ...this.mapper(item),
            }))
            : []

        this.list.update({
            data,
            total: result.items.length || 0,
            isLoading: false,
        })

        return data
    }

    @action
    async fetchDetail(params) {
        this.isLoading = true

        const result = await request.get(this.getDetailUrl(params))
        const detail = {...params, ...this.mapper(result)}

        this.detail = detail
        this.isLoading = false
        return detail
    }

    @action
    async fetchDetailWithoutWarning(params) {
        let urlNotSupport = false
        this.isLoading = true

        const result = await request.get(
            this.getDetailUrl(params),
            {},
            {},
            (error, response) => {
                if (error) {
                    if (error.status === 404) {
                        urlNotSupport = true
                    }
                    return {}
                }
                return response
            }
        )

        if (urlNotSupport) {
            return {urlNotSupport}
        }

        const detail = !isEmpty(result) ? {...params, ...this.mapper(result)} : {}

        this.detail = detail
        this.isLoading = false
        return detail
    }

    @action
    setSelectRowKeys(selectedRowKeys) {
        this.list.selectedRowKeys.replace(selectedRowKeys)
    }

    @action
    create(data, params = {}) {
        return this.submitting(request.post(this.getListUrl(params), data))
    }

    @action
    async update(params, newObject) {
        const result = await request.get(this.getDetailUrl(params))
        const resourceVersion = get(result, 'metadata.resourceVersion')
        if (resourceVersion) {
            set(newObject, 'metadata.resourceVersion', resourceVersion)
        }
        return this.submitting(request.put(this.getDetailUrl(params), newObject))
    }

    @action
    patch(params, newObject) {
        return this.submitting(request.patch(this.getDetailUrl(params), newObject))
    }

    @action
    delete(params) {
        return this.submitting(request.delete(this.getDetailUrl(params)))
    }

    @action
    batchDelete(rowKeys) {
        return this.submitting(
            Promise.all(
                rowKeys.map(name => {
                    const item = this.list.data.find(_item => _item.name === name)
                    return request.delete(this.getDetailUrl(item))
                })
            )
        )
    }

    @action
    checkName(params, query) {
        return request.get(
            this.getDetailUrl(params),
            {...query},
            {
                headers: {'x-check-exist': true},
            }
        )
    }

    @action
    checkLabels({labels, ...params}) {
        return request.get(
            this.getListUrl(params),
            {
                labelSelector: Object.keys(labels)
                    .map(key => `${key}=${labels[key]}`)
                    .join(','),
            },
            {headers: {'x-check-exist': true}}
        )
    }

    reject = res => {
        this.isSubmitting = false
        window.onunhandledrejection(res)
    }

    async getKsVersion(params) {
        let result
        let ksVersion
        const configVersion = get(
            globals.clusterConfig,
            `${params.cluster}.ksVersion`,
            ''
        )
        if (configVersion !== '') {
            ksVersion = configVersion.replace(/[^\d.]/g, '')
        } else {
            if (globals.ksConfig.multicluster) {
                result = await request.get(`/kapis/clusters/${params.cluster}/version`)
            } else {
                result = await request.get(`/kapis/version`)
            }
            ksVersion = result.gitVersion.replace(/[^\d.]/g, '')
        }
        const version = Number(
            ksVersion
                .split('.')
                .slice(0, 2)
                .join('.')
        )
        this.ksVersion = version
        return version
    }
}
