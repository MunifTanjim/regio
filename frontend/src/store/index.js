import { throttle } from 'lodash-es';
import { applyMiddleware, compose, createStore } from 'redux';
import ReduxThunkMiddleware from 'redux-thunk';
import { loadState, saveState } from '../utils/localStorage.js';
import rootReducer from './reducers/root.js';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const middlewares = [ReduxThunkMiddleware]
const middlewareEnhancer = applyMiddleware(...middlewares)

const stateLocalStorageKey = 'regio-state'

const persistedState = loadState(stateLocalStorageKey)

export const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(middlewareEnhancer)
)

export const dispatchToStore = store.dispatch

store.subscribe(
  throttle(() => {
    const { countries } = store.getState()

    saveState(stateLocalStorageKey, { countries })
  }, 1500)
)
