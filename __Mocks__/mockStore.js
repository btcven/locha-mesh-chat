import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { rootReducer } from '../src/store/root';

const middleWare = applyMiddleware(ReduxThunk)(createStore);

export default middleWare(rootReducer);
