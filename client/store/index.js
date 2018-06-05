import AppState from './app-state'
import TopicStore from './topice'

export { AppState, TopicStore }

export default {
  AppState,
  TopicStore,
}

export const createStoreMap = () => {
  return {
    appState: new AppState(),
    topicStore: new TopicStore(),
  }
}
