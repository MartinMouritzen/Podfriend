import React, { useEffect, useState } from 'react';

import InformationalModal from 'podfriend-approot/components/UI/Layout/InformationalModal.jsx';

import { useSelector, useDispatch } from 'react-redux';

import SVG from 'react-inlinesvg';
// const ValueInfographic = () => <SVG src={require('podfriend-approot/images/design/onboarding/value4value.png')} />;
import ValueInfographic from 'podfriend-approot/images/design/onboarding/value4value.png';
import ValueInfographicWallet from 'podfriend-approot/images/design/onboarding/value4value-wallet.png';
import ValueInfographicDonate from 'podfriend-approot/images/design/onboarding/value4value-donate.png';
import ValueInfographicDecision from 'podfriend-approot/images/design/onboarding/value4value-decision.png';

import { setConfigOption } from 'podfriend-approot/redux/actions/settingsActions';

import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// import styles from 'podfriend-approot/components/UI/Layout/InformationModal.scss';
import styles from './Value4ValueModal.scss';

const Value4ValueModal = () => {
	const dispatch = useDispatch();

	const [shown,setShown] = useState(true);

	const onClose = () => {
		setShown(false);
	};

	const [section,setSection] = useState(1);

	const changeSection = (number) => {
		setSection(number);
	};

	const enableWallet = () => {
		dispatch(setConfigOption('value4ValueEnabled',true));
		dispatch(setConfigOption('value4ValueOnboarded',true));
		onClose();
	};
	const disableWallet = () => {
		dispatch(setConfigOption('value4ValueEnabled',false));
		dispatch(setConfigOption('value4ValueOnboarded',true));
		onClose();
	};

	if (shown) {
		return (
			<InformationalModal
				title={'Support this podcast'}
				onClose={onClose}
				shown={shown}
				text={
					<div className={styles.valueForValueModal} style={{ maxWidth: '600px', padding: '40px' }}>
						{ section === 1 &&
							<section className={styles.informationSection}>
								<img src={ValueInfographic} className={styles.informationImage} />
								<h3>Psssst....</h3>
								<p>
									You're listening to a Podcast that allows you to show appreciation of their content by donating while listening. This concept is known as &quot;Value for Value&quot;
								</p>
							</section>
						}
						{ section === 2 &&
							<section className={styles.informationSection}>
								<img src={ValueInfographicWallet} className={styles.informationImage} />
								<h3>What does this mean for me?</h3>
								<p>
									You have the option to enable a &quot;Podcast Wallet&quot; in Podfriend. This wallet allows you to deposit a bit of Bitcoin (Satoshis).
								</p>
								<p>
									If this sounds hard, then don't worry, we'll do our best to make it super easy for you!
								</p>
								<p>
									You will then have the choice to stream this to the podcasts you listen to, or even give one time boosts at moments in the podcasts you think they are doing an especially awesome job!
								</p>
							</section>
						}
						{ section === 3 &&
							<section className={styles.informationSection}>
								<img src={ValueInfographicDonate} className={styles.informationImage} />
								<h3>Why should I bother?</h3>
								<p>
									Not only does it help minimize ads, but showing your support of your favorite podcasts, is a great way to ensure that you keep getting valuable content to listen to!<br /><br />
									In the future we might enable other cool things like earning small amounts for writing reviews, commenting and other ways of adding value.
								</p>
							</section>
						}
						{ section === 4 &&
							<section className={styles.informationSection}>
								<img src={ValueInfographicDecision} className={styles.informationImage} />
								<h3>Time to decide</h3>
								<p>
									If you enable the wallet, it will appear in Podfriend, where you will be able to put money into it. Nothing will happen without your permission, and we will guide you every step of the way.
								</p>
								<p>
									When that is said, <b>this IS a beta</b>, and until it is more battle-test <i>ANYTHING</i> can happen. You could lose all the money you deposit. This is a REAL risk, and we likely won't be able to do anything about it, since we likely can't access your wallet.
								</p>
								<p>
									This is also why we have a limit, so you cannot easily deposit more than $50 to your account, and we recommend you adding less than that.
								</p>
								<p>
									But if you do want to take the risk, we will be so super grateful. We believe you are part of history testing this.
								</p>
								<p>
									This is the future of how we will consume entertainment.
								</p>
								<p>
									If you regret your decision, you can always change your decision under &quot;settings&quot; by clicking your profile name.
								</p>
								<div style={{ marginBottom: '20px' }}>
									<button className="success fullWidth" onClick={enableWallet}><FaCheckCircle style={{ fill: '#000000', opacity: '0.4'}} />Enable my wallet</button>
								</div>
								<div>
									<button className="fullWidth" onClick={disableWallet}><FaTimesCircle style={{ fill: '#000000', opacity: '0.4'}} />Do not enable anything</button>
								</div>
							</section>
						}
					</div>
				}
				footer={
					<div className='informationFooter'>
						{ section === 1 &&
							<button style={{ width: '100%' }} onClick={() => { changeSection(2); }}>Hmmm, what does this mean for me?</button>
						}
						{ section === 2 &&
							<button style={{ width: '100%' }} onClick={() => { changeSection(3); }}>Why should I bother?</button>
						}
						{ section === 3 &&
							<button style={{ width: '100%' }} onClick={() => { changeSection(4); }}>Sounds awesome! Let me decide!</button>
						}
					</div>
				}
			/>
		);
	}
	else {
		return null;
	}
};

export default Value4ValueModal;