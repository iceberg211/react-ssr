import { createStore } from 'redux';
// import { sagaMiddleware } from '../saga';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  // https://github.com/zalmoxisus/redux-devtools-extension

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
