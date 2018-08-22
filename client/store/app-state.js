import {
  observable,
  computed,
  action,
} from 'mobx'


/**
 *
 * @export
 * @class AppState ，mobx store的一个类，非实例
 */
export default class AppState {
  constructor({ count, name } = { count: 0, name: 'Jokcy' }) {
    this.count = count
    this.name = name
  }
  @observable count
  @observable name
  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }
  @action add() {
    this.count += 1
  }
  @action changeName(name) {
    this.name = name
  }
  // toJosn的作用就是把服务端渲染中得到的数据同步到sotre中
  toJson() {
    return {
      count: this.count,
      name: this.name,
    }
  }
}

