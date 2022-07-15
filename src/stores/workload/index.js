import Base from 'stores/base'
import HpaStore from './hpa'

export default class WorkloadStore extends Base {
    constructor(module) {
        super(module)

        this.hpaStore = new HpaStore()
    }
}