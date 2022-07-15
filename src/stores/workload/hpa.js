import {action} from 'mobx'
import Base from '../base'
import request from 'utils/request'
import { getHpaFormattedData } from 'utils/workload'

export default class HpaStore extends Base {
    module = 'horizontalpodautoscalers'

    @action
    create(data, params) {
        return this.submitting(
            request.post(this.getListUrl(params), getHpaFormattedData(data))
        )
    }

    @action
    async patch(params, newObject) {
        await this.submitting(
            request.patch(this.getDetailUrl(params), getHpaFormattedData(newObject))
        )
    }

    @action
    reset() {
        this.detail = {}
    }
}
