import { createStore, applyMiddleware, compose, combineReducers  } from 'redux';
import { getStoredState, persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import storage from 'redux-persist/lib/storage';
import localforage from 'localforage';

// import { createBrowserHistory } from 'history';
// import { syncHistoryWithStore } from 'react-router-redux'

import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults/index';

const migrateStorage = async (state) => {
	// Migrate from async storage to indexdb
	// console.log('migrate - Attempting migration');
	// console.log(state);
	if (!state) {
		// if indexdb storage is empty try to read state from previous storage
		console.log('migrate - No state in indexdb.');
		try {
			const asyncState = await getStoredState({
				key: 'root',
				storage,
				stateReconciler: autoMergeLevel2,
				throttle: 1000,
				blacklist: ['audio','ui']
			})
			if (asyncState) {
				console.log('migrate - Async state not empty. Attempting migration.') // eslint-disable-line
				// if data exists in `AsyncStorage` - rehydrate fs persistor with it

				return asyncState;
			}
		}
		catch (ex) {
			console.warn('migrate - getStoredState error', ex) // eslint-disable-line
		}
	}
	// console.log('migrate - indexdb state not empty') // eslint-disable-line
	return state;
}

export default function configureStore(enableDevTools) {
	// console.log(enableDevTools);
	
	const persistConfig = {
		key: 'root',
		storage: localforage,
		migrate: migrateStorage,
		stateReconciler: autoMergeLevel2,
		throttle: 1000,
		blacklist: ['audio','ui']
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
				applyMiddleware(thunk, offlineMiddleware)
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