import { createStore } from 'redux';
// import { sagaMiddleware } from '../saga';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  const debug = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__()  // eslint-disable-line
    : f => f;

  if (initialState) {
    return createStore(
      rootReducer,
      initialState,
    );
  }
  return createStore(
    rootReducer,
  );
}
