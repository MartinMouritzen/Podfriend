import {
	UI_SHOW_SPEED_SETTING_WINDOW,
	UI_HIDE_SPEED_SETTING_WINDOW,
	UI_SHOW_SHARE_WINDOW,
	UI_SHOW_SLEEPTIMER_WINDOW,
	UI_SHOW_LOGIN,
	UI_HIDE_LOGIN,
	UI_SHOW_FULLPLAYER,
	UI_HIDE_FULLPLAYER,
	USER_SYNCING,
	WALLET_SYNCING,
	WALLET_SYNC_COMPLETE,
	WALLET_INVOICE_LOAD,
	WALLET_INVOICE_SUCCESS,
	WALLET_INVOICE_ERROR,
	UI_SHOW_WALLET_WINDOW
} from "../constants/ui-types";

import {
	USER_LOGGED_IN
} from '../constants/action-types.js';

const initialState = {
	showSpeedSettingWindow: false,
	showShareWindow: false,
	showSleepTimerWindow: false,
	showLogin: false,
	showFullPlayer: false,
	syncHappening: false,
	syncedPodcastsThisSession: false,
	syncLastDate: false,
	walletSyncHappening: false,
	walletLastSyncDate: false,
	walletBalance: false,
	showWalletModal: false,
	walletInvoiceLoading: false,
	walletInvoiceError: false,
	walletInvoiceId: false,
	walletInvoiceString: false,
	walletInvoiceDate: false
};

const uiReducer = (state = initialState, action) => {
	if (action.type === UI_SHOW_SPEED_SETTING_WINDOW) {
		return Object.assign({}, state, {
			showSpeedSettingWindow: action.payload
		});
	}
	else if (action.type === UI_HIDE_SPEED_SETTING_WINDOW) {
		return Object.assign({}, state, {
			showSpeedSettingWindow: action.payload
		});
	}
	else if (action.type === UI_SHOW_SHARE_WINDOW) {
		return Object.assign({}, state, {
			showShareWindow: action.payload
		});
	}
	else if (action.type === UI_SHOW_SLEEPTIMER_WINDOW) {
		return Object.assign({}, state, {
			showSleepTimerWindow: action.payload
		});
	}
	else if (action.type === UI_SHOW_LOGIN) {
		return Object.assign({}, state, {
			showLogin: true
		});
	}
	else if (action.type === UI_HIDE_LOGIN || action.type === USER_LOGGED_IN) {
		if (action.payload.preserveLoginForm) {
			return Object.assign({}, state, {
				showLogin: true
			});
		}
		else {
			return Object.assign({}, state, {
				showLogin: false
			});
		}
	}
	else if (action.type === UI_SHOW_FULLPLAYER) {
		return Object.assign({}, state, {
			showFullPlayer: true
		});
	}
	else if (action.type === UI_HIDE_FULLPLAYER) {
		return Object.assign({}, state, {
			showFullPlayer: false
		});
	}
	else if (action.type === USER_SYNCING) {
		// console.log(action.payload);
		return Object.assign({}, state, {
			syncHappening: action.payload,
			syncedPodcastsThisSession: true
		});
	}
	else if (action.type === WALLET_SYNCING) {
		return Object.assign({}, state, {
			walletSyncHappening: action.payload
		});
	}
	else if (action.type === WALLET_SYNC_COMPLETE) {
		return Object.assign({}, state, {
			walletSyncHappening: false,
			walletBalance: action.payload.walletBalance
		});
	}
	else if (action.type === UI_SHOW_WALLET_WINDOW) {
		return Object.assign({}, state, {
			showWalletModal: action.payload
		});
	}

	else if (action.type === WALLET_INVOICE_LOAD) {
		return Object.assign({}, state, {
			walletInvoiceLoading: true,
			walletInvoiceError: false,
			walletInvoiceId: false,
			walletInvoiceString: false,
			walletInvoiceDate: false
		});
	}
	else if (action.type === WALLET_INVOICE_SUCCESS) {
		return Object.assign({}, state, {
			walletInvoiceLoading: false,
			walletInvoiceError: false,
			walletInvoiceId: action.payload['id'],
			walletInvoiceString: action.payload['payment_request'],
			walletInvoiceDate: new Date()
		});
	}
	else if (action.type === WALLET_INVOICE_ERROR) {
		return Object.assign({}, state, {
			walletInvoiceLoading: false,
			walletInvoiceError: action.payload,
			walletInvoiceId: false,
			walletInvoiceString: false,
			walletInvoiceDate: false
		});
	}

	return state;
};
export default uiReducer;