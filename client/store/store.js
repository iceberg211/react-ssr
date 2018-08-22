import AppState from './app-state'
import TopicStore from './topice';

// export const AppState = AppStateClass
export { AppState, TopicStore }

export default {
  AppState,
  TopicStore,
}
// 给服务端渲染提供sotre
export const createStoreMap = () => {
  return {
    appState: new AppState(),
    topicStore: new TopicStore(),
  }
}
