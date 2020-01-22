import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import { rootReducer } from './root';

const middleWare = applyMiddleware(ReduxThunk, logger)(createStore);

export default middleWare(rootReducer);
