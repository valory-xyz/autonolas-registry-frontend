import {
  combineReducers, createStore, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
import exampleStore from './example-store';

const rootReducer = combineReducers({ exampleStore });

const enhancers = [];
const middleware = [thunk];

const composeWithDevTools = typeof window === 'object'
  && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  && (process.env.NODE_ENV === 'development')
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

const composedEnhancers = composeWithDevTools(
  applyMiddleware(...middleware),
  ...enhancers,
);

export default () => createStore(rootReducer, composedEnhancers);
