import {action, observable} from 'mobx'

export default class RootStore {
    @observable
    actions = {}

    @action
    triggerAction(id, ...rest) {
        this.actions[id] && this.actions[id].on(...rest)
    }
}