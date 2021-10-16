import React, { useEffect, useState, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { IonList, IonListHeader, IonItem, IonLabel, IonInput, IonToggle, IonRadio, IonCheckbox, IonItemSliding, IonItemOption, IonItemOptions, IonContent } from '@ionic/react';

import { setConfigOption } from 'podfriend-approot/redux/actions/settingsActions';
import { updatePodcastConfig } from 'podfriend-approot/redux/actions/podcastActions';

import Modal from 'podfriend-approot/components/AppUI/Modal';
import styles from './ValueConfigModal.scss';

import SplitRange from './SplitRange.jsx';

const SATOSHIS_BOOST_MIN = 100;
const SATOSHIS_BOOST_MAX = 1000000;
const SATOSHIS_STREAM_MIN = 0;
const SATOSHIS_STREAM_MAX = 5000;

const ValueConfigModal = ({ shown, onDismiss }) => {
	const dispatch = useDispatch();

	const activePodcast = useSelector((state) => state.podcast.activePodcast);

	const defaultBoost = useSelector((state) => state.settings.defaultBoost);
	const defaultStreamPerMinuteAmount = useSelector((state) => state.settings.defaultStreamPerMinuteAmount);

	const [showSpecificConfig,setShowSpecificConfig] = useState((activePodcast.streamAmount || activePodcast.boostAmount) ? true : false);

	const bugfixRef = useRef(null);

	const onDefaultBoostChange = (amount) => {

		if (amount < SATOSHIS_BOOST_MIN) {
			amount = SATOSHIS_BOOST_MIN;
		}
		else if (amount > SATOSHIS_BOOST_MAX) {
			amount = SATOSHIS_BOOST_MAX;
		}

		console.log('onDefaultBoostChange: ' + amount);
		dispatch(setConfigOption('defaultBoost',amount));
	};
	const onDefaultStreamPerMinuteAmountChange = (amount) => {
		if (amount < SATOSHIS_STREAM_MIN) {
			amount = SATOSHIS_STREAM_MIN;
		}
		else if (amount > SATOSHIS_STREAM_MAX) {
			amount = SATOSHIS_STREAM_MAX;
		}

		console.log('onDefaultStreamPerMinuteAmountChange: ' + amount);
		dispatch(setConfigOption('defaultStreamPerMinuteAmount',amount));
	};
	const onBoostChange = (amount) => {
		console.log('onBoostChange: ' + amount);

		if (amount < SATOSHIS_BOOST_MIN) {
			amount = SATOSHIS_BOOST_MIN;
		}
		else if (amount > SATOSHIS_BOOST_MAX) {
			amount = SATOSHIS_BOOST_MAX;
		}

		dispatch(updatePodcastConfig('boostAmount',amount));
	};
	const onStreamPerMinuteAmountChange = (amount) => {
		if (amount < SATOSHIS_STREAM_MIN) {
			amount = SATOSHIS_STREAM_MIN;
		}
		else if (amount > SATOSHIS_STREAM_MAX) {
			amount = SATOSHIS_STREAM_MAX;
		}

		console.log('onStreamPerMinuteAmountChange: ' + amount);
		dispatch(updatePodcastConfig('streamAmount',amount));
	};

	return (
		<Modal
			shown={shown}
			onClose={onDismiss}
			defaultSnap={({ maxHeight }) => maxHeight - 30}
			snapPoints={({ maxHeight }) => [ maxHeight / 2, maxHeight - 30 ]}
			initialFocusRef={bugfixRef}
			header={
				<h1>
					Value configuration
				</h1>
			  }
		  >
			<div className={styles.valueConfigPanel} ref={bugfixRef}>
				<p>
					Here you can decide how many Satoshis you want to boost and stream per minute.
				</p>

				<h2 style={{ marginTop: 40 }}>General settings</h2>
				<p>
					These settings will be used for all podcasts where you haven't specified otherwise.
				</p>

				<SplitRange label='Boost' label2='Satohis' min={SATOSHIS_BOOST_MIN} max={SATOSHIS_BOOST_MAX} value={defaultBoost} onValueChange={onDefaultBoostChange} />

				<SplitRange label='Stream' label2='Satohis per minute' min={SATOSHIS_STREAM_MIN} max={SATOSHIS_STREAM_MAX} value={defaultStreamPerMinuteAmount} onValueChange={onDefaultStreamPerMinuteAmountChange} />

				<h2 style={{ marginTop: 40 }}>Specific for <span>{activePodcast.name}</span></h2>

			  	{ showSpecificConfig === false &&
			  		<div style={{ width: '100%', color: '#666666', textDecoration: 'underline' }} onClick={() => { setShowSpecificConfig(true); }}>Change values specifically for this podcast</div>
				}
				{ showSpecificConfig === true &&
					<div>
						<p>
							These settings will be used instead of the default settings for this podcast.
						</p>
						<SplitRange label='Boost' label2='Satohis' min={SATOSHIS_BOOST_MIN} max={SATOSHIS_BOOST_MAX} value={activePodcast.boostAmount ? activePodcast.boostAmount : defaultBoost} onValueChange={onBoostChange} />

						<SplitRange label='Stream' label2='Satohis per minute' min={SATOSHIS_STREAM_MIN} max={SATOSHIS_STREAM_MAX} value={activePodcast.streamAmount ? activePodcast.streamAmount : defaultStreamPerMinuteAmount} onValueChange={onStreamPerMinuteAmountChange} />

						<h2>Info about the split for <span>{activePodcast.name}</span></h2>

						<IonList>
							{activePodcast.value.destinations.map((destination,index) => (
								<IonItem key={'destination' + index}>
									<IonLabel>
										{destination.name}
										<p>Receives <b>{destination.split}</b> shares of the value streamed</p>
									</IonLabel>
								</IonItem>
							))}
							<IonItem>
								<IonLabel>
									Podfriend
									<p>Receives <b>1</b> share of the value streamed</p>
								</IonLabel>
							</IonItem>
						</IonList>

					</div>
				}
			</div>
		</Modal>
	);
};
export default ValueConfigModal;