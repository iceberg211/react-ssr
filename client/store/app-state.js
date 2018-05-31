import { observable, computed, action } from 'mobx'


class AppState {
  @observable count = 0
  @observable name = 'hewei'
  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }
  @action changeName(name) {
    this.name = name
    this.count += 1;
  }
}

const appState = new AppState()

export default appState;



