import React, { useState, useEffect, Suspense, lazy } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { synchronizeWallet, showWalletModal, hideWalletModal } from 'podfriend-approot/redux/actions/uiActions.js';

import WalletModal from './WalletModal.jsx';
// const WalletModal = lazy(() => import('./WalletModal.jsx'));

import styles from './WalletBalance.scss';

const WalletBalance = () => {
	const dispatch = useDispatch();

	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const isSyncing = useSelector((state) => state.ui.walletSyncHappening);
	const walletBalance = useSelector((state) => state.ui.walletBalance);
	const showingWalletModal = useSelector((state) => state.ui.showWalletModal);

	useEffect(() => {
		if (isLoggedIn) {
			dispatch(synchronizeWallet());
		}
	},[isLoggedIn]);

	const onShowWalletModal = () => {
		dispatch(showWalletModal());
	};

	if (isLoggedIn) {
		return (
			<div className={styles.walletIndicator} onClick={onShowWalletModal}>
				<div className={styles.walletBalanceLabel}>
					Podcast wallet balance:
				</div>
				<div className={styles.walletBalance}>
					{ walletBalance === false &&
						<>
							Loading
						</>
					}
					{ walletBalance !== false &&
						<>
							{walletBalance}
						</>
					}
				</div>
				
				{ showingWalletModal &&
					<Suspense fallback={<></>}>
						<WalletModal shown={showingWalletModal} onDismiss={() => { dispatch(hideWalletModal()); }} />
					</Suspense>
				}
			</div>
		);
	}
	else {
		return null;
	}
};
export default WalletBalance;