import Base from 'stores/base'

export default class WorkloadStore extends Base {
    constructor(module) {
        super(module)

        this.hpaStore = new HpaStore()
    }
}