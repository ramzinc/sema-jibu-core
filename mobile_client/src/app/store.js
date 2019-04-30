import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import RootReducer from '../reducers/RootReducer'

// Connect our store to the reducers
export default createStore(RootReducer, applyMiddleware(thunk));
