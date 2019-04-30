import { createStore, applyMiddleware } from 'redux';
import persistedReducer from 'reducers/RootReducer';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import { axiosMiddleware } from 'services';

export default function configureStore() {
	const store = createStore(
		persistedReducer,
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
		applyMiddleware(thunk, axiosMiddleware)
	);

	const persistor = persistStore(store);

	return { store, persistor };
}
