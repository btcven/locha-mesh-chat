import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import { rootReducer } from './root';

let middleWare;
if (process.env.JEST_WORKER_ID) {
  middleWare = applyMiddleware(ReduxThunk)(createStore);
} else {
  middleWare = applyMiddleware(ReduxThunk)(createStore);
}


export default middleWare(rootReducer);
