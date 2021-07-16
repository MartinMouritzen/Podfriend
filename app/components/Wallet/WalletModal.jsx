import React, { useEffect, useState, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
// import QRCode from "react-qr-code";
import { QRCode } from 'react-qrcode-logo';

import { getInvoice, synchronizeWallet } from 'podfriend-approot/redux/actions/uiActions.js';
import { setConfigOption } from 'podfriend-approot/redux/actions/settingsActions';

import { FaCopy, FaCheck } from 'react-icons/fa';

import logo from 'podfriend-approot/images/logo/podfriend_logo.svg';

import { Snackbar } from '@material-ui/core/';
import { Alert } from  '@material-ui/lab/';

import EmptyWallet from 'podfriend-approot/images/design/onboarding/value4value-wallet.png';
import WalletAmount from 'podfriend-approot/images/design/onboarding/value4value-amount.png';
import WalletError from 'podfriend-approot/images/design/onboarding/value4value-amount.png';

import Reward from 'react-rewards';

import CreditCard from './CreditCard.jsx';

import Modal from 'podfriend-approot/components/Window/Modal';

import styles from './WalletModal.scss';

let invoiceTimeoutId = false;

const WalletModal = ({ shown, onDismiss }) => {
	const [status,setStatus] = useState(false);
	const [priceStatus,setPriceStatus] = useState(false);
	const [priceData,setPriceData] = useState(false);
	const [transferAmount,setTransferAmount] = useState(false);

	const [invoiceStatus,setInvoiceStatus] = useState(false);
	const [showCopySuccessMessage,setShowCopySuccessMessage] = useState(false);

	const dispatch = useDispatch();
	const walletBalance = useSelector((state) => state.ui.walletBalance);
	const walletInvoiceErrorMessage = useSelector((state) => state.ui.walletInvoiceError);

	const walletInvoiceId = useSelector((state) => state.ui.walletInvoiceId);
	const walletInvoiceString = useSelector((state) => state.ui.walletInvoiceString);
	const value4ValueEnabled = useSelector((state) => state.settings.value4ValueEnabled);
	const value4ValueOnboarded = useSelector((state) => state.settings.value4ValueOnboarded);

	const userName = useSelector((state) => state.user.profileData.username);

	const authToken = useSelector((state) => state.user.authToken);

	const rewardElement = useRef(null);

	useEffect(() => {
		setPriceStatus(false);
	},[]);

	const componentIsMounted = useRef(true)
    
	useEffect(() => {
        return () => {
            componentIsMounted.current = false
        }
    },[])

	const continousCheckInvoice = () => {
		checkTransferStatus();

		if (invoiceStatus !== 'paid' && componentIsMounted.current) {
			console.log('checking invoice status');
			invoiceTimeoutId = setTimeout(continousCheckInvoice,3000);
		}
	};

	useEffect(() => {
		if (status === 'transfer' && walletInvoiceId !== false) {
			continousCheckInvoice();
		}
	},[status,walletInvoiceId]);
	
	const retrieveBitcoinAmount = () => {
		setPriceStatus('loading');
		fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
		.then((resp) => {
			return resp.json()
		})
		.then((content) => {
			setPriceStatus('loaded');
			setPriceData(content);
		})
		.catch((error) => {
			console.log(error);
		});
	};

	const checkTransferStatus = () => {
		setInvoiceStatus(false);
		fetch('https://api.podfriend.com/user/wallet/invoice/?invoiceId=' + walletInvoiceId, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${authToken}`
			}
		})
		.then((resp) => {
			return resp.json()
		})
		.then((content) => {
			if (content.settled) {
				setInvoiceStatus('paid');
				if (rewardElement.current) {
					rewardElement.current.rewardMe();
				}
				clearTimeout(invoiceTimeoutId);
				dispatch(synchronizeWallet());
			}

			// Delete this when done testing
			/*
			setInvoiceStatus('paid');
			if (rewardElement.current) {
				rewardElement.current.rewardMe();
			}
			clearTimeout(invoiceTimeoutId);
			dispatch(synchronizeWallet());
			*/
		})
		.catch((error) => {
			console.log(error);
		});
	};

	const showAddFunds = () => {
		setStatus('funds');
	};

	const showFundsAmount = () => {
		retrieveBitcoinAmount();
		setStatus('amount');
	};

	const getPaymentString = (amount) => {
		setStatus('transfer');
		setTransferAmount(amount);
		dispatch(getInvoice(amount));
	};

	const enableWallet = () => {
		dispatch(setConfigOption('value4ValueEnabled',true));
	};

	const disableWallet = () => {
		dispatch(setConfigOption('value4ValueEnabled',false));
	};

	const restartOnboarding = () => {
		dispatch(setConfigOption('value4ValueOnboarded',false));
	};

	const copyInvoiceString = () => {
		if (window.isSecureContext) {
			navigator.clipboard.writeText(walletInvoiceString);
			setShowCopySuccessMessage(true);
		}
		else {
			console.log('Copying of clipboard only works on a secure context (HTTPS)');
		}
	};

	const onHideCopySuccessMessage = () => {
		setShowCopySuccessMessage(false);
	};

	return (
		<Modal
			shown={shown}
			onClose={onDismiss}
			defaultSnap={({ maxHeight }) => maxHeight - 30}
			snapPoints={({ maxHeight }) => [ maxHeight / 2, maxHeight - 30 ]}
			header={
				<h1>
					Podcast Wallet
				</h1>
			  }
		  >
			<div className={styles.walletModal}>
				{ value4ValueEnabled === false &&
					<div style={{ maxWidth: 400 }}>
						{ value4ValueOnboarded === true &&
							<div className="button" onClick={restartOnboarding}>
								Turn on the &quot;Podcast Wallet&quot; tutorial
							</div>
						}
						{ value4ValueOnboarded === false &&
							<div>
								You will see the value for value tutorial the next time you play a value for value podcast.<br /><br />
								If you are in a hurry we recommend Podcasting 2.0
							</div>
						}
						<hr />
						<div className="button success" onClick={enableWallet}>
							I want to turn the Podcast Wallet on
						</div>
					</div>
				}
				{ value4ValueEnabled === true &&
					<>
						{ status === false &&
							<>
								<div style={{ marginBottom: 20 }}>
									<CreditCard walletBalance={walletBalance} userName={userName} />
								</div>
								{ walletBalance === 0 &&
									<div>
										<p>
											Before you can start supporting podcasts you will have to put some bitcoins in your wallet. Don't worry we will guide you how best to do it, if you are not familiar with the process.
										</p>
									</div>
								}
							</>
						}
						{ status === 'funds' &&
							<div>
								<div style={{ textAlign: 'center' }}>
									<img src={EmptyWallet} style={{ width: '200px' }} />
								</div>
								<h4>Before you start</h4>
								<p>
									Before you can put some Bitcoin in your wallet, you will have to actually purchase some first (unless you already own some, in which case you can skip this step).
								</p>
								<p>
									It would be fantastic if you could do that directly here in Podfriend, but alas, we're not quite there yet. That means you have to do this at another website. Websites where you can buy Bitcoin are known as &quot;Exchanges&quot;
								</p>
								<h4>Recommended ways of buying Bitcoin</h4>
								<p>
									In the US <a href="https://beta.strike.me/" target="_blank">Strike</a> or <a href="https://cash.app/" target="_blank">Cash App</a> are quite well known and easy.
								</p>
								<p>
									In other countries, where Stripe is not available, you can buy Bitcoin on exchanges and move to a 3rd party wallet. Just remember that the wallet need to have Lightning support.
								</p>
								<p>
									A good wallet is <a href="https://bluewallet.io/" target="_blank">BlueWallet</a>. You can buy Bitcoin on <a href="https://www.coinbase.com/join/mourit_1" target="_blank">Coinbase.com</a> or <a href="https://crypto.com/app/g7qyayze28/" target="_blank">Crypto.com</a> among others.
								</p>
								<p>
									All of the above allows you to buy Bitcoin and then send it to your Podfriend wallet. We do not have a guide ready yet, but if you would like one, email info@podfriend.com and tell us, so we know it's something we should spend time on!
								</p>
								<h4>What's in it for Podfriend?</h4>
								<p>
									We have no affiliation with any of the exchanges we mention, however we have added a referal code to the links. This means that both Podfriend and you will benefit in small ways if you use the links. If you prefer not to get and give Podfriend any benefits, you can go directly to the domains.
								</p>
								<p>
									Once you have some Bitcoin in Stripe, BlueWallet or any other wallet or exchange that supports Lightning payment you can continue to the next step
								</p>
								<div className="button" onClick={showFundsAmount}>
									Ready? Decide on an amount to transfer
								</div>
							</div>
						}
						{ status === 'amount' &&
							<div className={styles.amountScreen}>
								<div>
									<div style={{ textAlign: 'center' }}>
										<img src={WalletAmount} style={{ width: '200px' }} />
									</div>
									<p>How much would you like to transfer?</p>
									<p>This is the time to again really stress that <i>THIS IS BETA SOFTWARE</i>. Bugs are likely to happen. Before you decide on an amount you should basically consider this amount lost.</p>
									<p>Let me say this again: Consider everything you transfer lost. If you are not ready for this, you need to wait until Podfriend is no longer in beta.</p>
									<p>CoinDesk have graciously allowed us to show price data, but it is only an indicator and might divert from the real price.</p>
								</div>
								<div>
									<div className="button" onClick={() => { getPaymentString(5000); }} style={{ marginBottom: 5 }}>
										{(5000).toLocaleString()} satoshis <BitcoinPrice amount="5000" priceData={priceData} priceStatus={priceStatus} />
									</div>
									<div className="button" onClick={() => { getPaymentString(10000); }} style={{ marginBottom: 5 }}>
										{(10000).toLocaleString()} satoshis <BitcoinPrice amount="10000" priceData={priceData} priceStatus={priceStatus} />
									</div>
									<div className="button" onClick={() => { getPaymentString(20000); }}>
										{(20000).toLocaleString()} satoshis <BitcoinPrice amount="20000" priceData={priceData} priceStatus={priceStatus} />
									</div>
								</div>
							</div>

						}
						{ status === 'transfer' && walletInvoiceErrorMessage === false && 
							<div>
								<div>
									<h2>Transfer request for {transferAmount.toLocaleString()} Satoshis</h2>
								</div>
								{ invoiceStatus === 'paid' &&
									<div style={{ padding: 60, textAlign: 'center' }}>
										<Reward
											ref={rewardElement}
											type='confetti'
											config={{
												zIndex: 1000,
												lifeTime: 3800,
												elementCount: 200
											}}
										>
											<div style={{ backgroundColor: '#28bd72', width: 100, height: 100, borderRadius: '50%', display: 'flex', alignItems: 'center',justifyContent: 'center',marginLeft: 'auto',marginRight: 'auto', marginBottom: '20px' }}
												onClick={() => { rewardElement.current.rewardMe(); }}
											>
												<FaCheck size={60} fill="#FFFFFF" />
											</div>
											<div>
												Bitcoin deposited!
											</div>
										</Reward>
										<div className="button" onClick={onDismiss} style={{ marginTop: '30px' }}>
											Return to Podfriend
										</div>
									</div>
								}
								{ invoiceStatus !== 'paid' &&
									<>
										<p>
											To transfer Bitcoin to your Podfriend Wallet you can either scan the QR code, or use the &quot;Lightning invoice address&quot;. Please be aware, that this is not a Bitcoin Address.
										</p>
										{ walletInvoiceString !== false &&
											<div style={{ textAlign: 'center' }}>
												<div>
													<QRCode logoImage={logo} size="320" value={walletInvoiceString} />
												</div>
												<div style={{ width: '320px', marginTop: 10, textAlign: 'left', marginLeft: 'auto', marginRight: 'auto' }}>
													Lightning invoice address
												</div>
												<div className={styles.walletInvoiceAddressContainer}>
													<input className={styles.invoiceInput} value={walletInvoiceString} /> <FaCopy onClick={copyInvoiceString} />
													<Snackbar
														anchorOrigin={{
															vertical: 'bottom',
															horizontal: 'center',
														}}
														open={showCopySuccessMessage}
														autoHideDuration={3000}
														onClose={onHideCopySuccessMessage}
													>
														<Alert severity="info">Lightning invoice address copied</Alert>
													</Snackbar>
												</div>
												<div className={styles.statusText}>

												</div>
											</div>
										}
										{ walletInvoiceString === false &&
											<div>
												Loading...
											</div>
										}
									</>
								}
							</div>
						}
						{ status === 'transfer' && walletInvoiceErrorMessage !== false && 
							<div>
								<div style={{ textAlign: 'center' }}>
									<img src={WalletAmount} style={{ width: '200px' }} />
								</div>
								<div className={styles.errorMessage}>
									An error happened getting the invoice details.<br /><br />
									If this error keeps happening, you can report it to info@podfriend.com.<br />
									<br />
									The server reported this message:<br /><br />
									{walletInvoiceErrorMessage}
								</div>
							</div>
						}
						{ status === false &&
							<div>
								{ false &&
									<div className="button secondaryButton" style={{ marginBottom: 10 }}>
										See past payments
									</div>
								}
								<div className="button" onClick={showAddFunds}>
									Add funds to your Podcast Wallet
								</div>
								<hr />
								<div className="button dangerousButton" onClick={disableWallet}>
									I want to turn off the Podcast Wallet
								</div>


								<div style={{ marginTop: 20, textAlign: 'right' }}>
									<div style={{ textTransform: 'uppercase', fontSize: 12, marginBottom: 5 }}>Powered by</div>
									<a href="https://lnpay.co/" target="_blank"><img src='https://lnpay.co/frontend-resources/assets/logo_full.svg' style={{ height: 20 }} /></a>
								</div>
							</div>
						}
					</>
				}
			</div>
		</Modal>
	);
}

const BitcoinPrice = ({amount, priceData, priceStatus}) => {
	if (priceStatus === 'loading') {
		return (
			<>(Loading price)</>
		);
	}
	else if (priceStatus === 'loaded' && priceData) {
		console.log(priceData);
		var currency = 'USD';
		var bitcoinPrice = priceData.bpi[currency].rate_float;
		var satoshiPrice = bitcoinPrice / 100000000;
		var amountPrice = (amount * satoshiPrice).toFixed(2).toLocaleString();
		return (
			<>
				(${amountPrice})
			</>
		);
	}
	return null;
};

export default WalletModal;