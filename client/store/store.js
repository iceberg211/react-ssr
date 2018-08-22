import AppStateClass from './app-state'

export const AppState = AppStateClass

export default {
  AppState,
}
// 给服务端渲染提供sotre
export const createStoreMap = () => {
  return {
    appState: new AppState(),
  }
}
