import {createStore, compose , applyMiddleware} from 'redux';
// import someReduxMiddleware from 'some-redux-middleware';
// import someOtherReduxMiddleware from 'some-other-redux-middleware';
import ReduxThunk from 'redux-thunk';
import {rootReducer} from './root';
import logger from 'redux-logger'


const middleWare = applyMiddleware( ReduxThunk,logger)(createStore);

export default middleWare(rootReducer);