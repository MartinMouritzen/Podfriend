import { createStore, applyMiddleware, compose, combineReducers  } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// import { createBrowserHistory } from 'history';
// import { syncHistoryWithStore } from 'react-router-redux'

import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults/index';

export default function configureStore(storage,enableDevTools) {
	const persistConfig = {
		key: 'root',
		storage,
		stateReconciler: autoMergeLevel2,
		throttle: 1000,
		blacklist: ['audio']
	};
	// export const history = createBrowserHistory();

	const {
		middleware: offlineMiddleware,
		enhanceReducer: offlineEnhanceReducer,
		enhanceStore: offlineEnhanceStore
	} = createOffline({
		...offlineConfig,
		persist: false
	});

	const persistedReducer = persistReducer(
		persistConfig,
		offlineEnhanceReducer(rootReducer)
	);

	// Hot module replacement
	if (process.env.NODE_ENV !== 'production' && module.hot) {
		module.hot.accept('./reducers/rootReducer', () => store.replaceReducer(rootReducer))
	}

	let store = createStore(
		persistedReducer,
		(process.env.NODE_ENV !== 'production' && enableDevTools) ? 
			compose(
				offlineEnhanceStore,
				applyMiddleware(thunk, offlineMiddleware),
				window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
			)
		:
			compose(
				offlineEnhanceStore,
				applyMiddleware(thunk, offlineMiddleware)
			)
	);
	let persistor = persistStore(store);

	// const browserHistory = createBrowserHistory();
	// const history = syncHistoryWithStore(browserHistory, store);
	var history = false;

	return [
		store,
		persistor,
		history
	]
}