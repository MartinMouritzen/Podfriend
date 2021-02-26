import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import QRCode from "react-qr-code";

import { getInvoice } from 'podfriend-approot/redux/actions/uiActions.js';

import Modal from 'podfriend-approot/components/Window/Modal';

import styles from './WalletModal.scss';

const WalletModal = ({ shown, onDismiss }) => {
	const dispatch = useDispatch();
	const walletBalance = useSelector((state) => state.ui.walletBalance);
	const walletInvoiceErrorMessage = useSelector((state) => state.ui.walletInvoiceError);
	const walletInvoiceString = useSelector((state) => state.ui.walletInvoiceString);
	

	const getPaymentString = () => {
		dispatch(getInvoice());
	};

	return (
		<Modal
			shown={shown}
			onClose={onDismiss}
			defaultSnap={({ maxHeight }) => maxHeight / 2}
			snapPoints={({ maxHeight }) => [ maxHeight / 2, maxHeight - 30 ]}
			header={
				<h2>
					Podcast Wallet
				</h2>
			  }
		  >
			<div className={styles.walletModal}>
				<div style={{ marginBottom: 20 }}>
					Your current balance is: {walletBalance}
				</div>
				{ walletInvoiceString !== false &&
					<div>
						<div>
							<QRCode value={walletInvoiceString} />
						</div>
						<input type="text" value={walletInvoiceString} />
					</div>
				}
				{ walletInvoiceErrorMessage !== false && 
					<div className={styles.errorMessage}>
						An error happened getting the invoice details.<br /><br />
						If this error keeps happening, you can report it to info@podfriend.com.<br />
						<br />
						The server reported this message:<br /><br />
						{walletInvoiceErrorMessage}
					</div>
				}
				{ walletInvoiceString === false &&
					<div>
						<div className="button" onClick={getPaymentString}>
							Add funds to your Podcast Wallet
						</div>
					</div>
				}
			</div>
		</Modal>
	);
}
export default WalletModal;