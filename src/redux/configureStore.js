import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { persistCombineReducers, persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage'

import rootReducer from './createReducer'
import rootSaga from './rootSaga'


const persistConfig = {
  timeout: 0,
  key: 'root',
  storage,
  blacklist: ['util']
}
const combineReducer = persistCombineReducers(persistConfig, rootReducer)
export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducer,
    initialState,
    applyMiddleware(
      sagaMiddleware,
      __DEV__ ? createLogger() : null
    ),
  );
  persistStore(
    store,
    null,
    () =>{
      store.getState();
    }
  );
  sagaMiddleware.run(rootSaga)

  return store
}