import { combineReducers } from "redux";

// import { routerReducer } from 'react-router-redux'

import podcastReducer from './podcastReducer';
import audioReducer from './audioReducer';
import userReducer from './userReducer';
import settingsReducer from './settingsReducer';
import uiReducer from './uiReducer';


const rootReducer = combineReducers({
	podcast: podcastReducer,
	audio: audioReducer,
	user: userReducer,
	settings: settingsReducer,
	ui: uiReducer
	// routing: routerReducer
});


export default rootReducer;