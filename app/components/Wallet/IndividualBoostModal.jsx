import React, { useEffect, useState, useRef } from 'react';

import Modal from 'podfriend-approot/components/Window/Modal.jsx';

import { IonList, IonListHeader, IonItem, IonLabel, IonThumbnail, IonImg, IonInput, IonToggle, IonRadio, IonCheckbox, IonItemSliding, IonItemOption, IonItemOptions, IonContent } from '@ionic/react';

import { boostPodcast, synchronizeWallet } from "podfriend-approot/redux/actions/uiActions";

import TextField from '@material-ui/core/TextField';

import { useSelector, useDispatch } from 'react-redux';

import SplitRange from 'podfriend-approot/components/Wallet/ValueConfigModal/SplitRange.jsx';

import iconPodfriend from 'podfriend-approot/images/logo/podfriend_logo.svg';
import iconUser from 'podfriend-approot/images/design/icons/user.svg';
import iconGroup from 'podfriend-approot/images/design/icons/group.svg';

import { FaRocket } from 'react-icons/fa';
import SVG from 'react-inlinesvg';
import Reward from 'react-rewards';

import styles from './IndividualBoostModal.scss';

const SATOSHIS_BOOST_MIN = 100;
const SATOSHIS_BOOST_MAX = 100000;

const IndividualBoostModal = ({ shown, onClose }) => {
	const dispatch = useDispatch();

	const activePodcast = useSelector((state) => state.podcast.activePodcast);
	const defaultBoost = useSelector((state) => state.settings.defaultBoost);
	const [boostValue,setBoostValue] = useState(activePodcast.boostAmount ? activePodcast.boostAmount : defaultBoost);
	const [selectedDestination,setSelectedDestination] = useState(false);
	const [boostMessage,setBoostMessage] = useState('');
	const [boostFrom,setBoostFrom] = useState('');
	const [boostPending,setBoostPending] = useState(false);

	const rewardElement = useRef(null);

	const formatAmount = (number) => {
		if (isNaN(number)) {
			return number;
		}
		else {
			return number.toLocaleString();
		}
	};
	const onBoostChange = (amount) => {
		console.log('onBoostChange: ' + amount);

		if (amount < SATOSHIS_BOOST_MIN) {
			amount = SATOSHIS_BOOST_MIN;
		}
		else if (amount > SATOSHIS_BOOST_MAX) {
			amount = SATOSHIS_BOOST_MAX;
		}
		setBoostValue(amount);
	};
	const onBoostRecipientSelected = (destination) => {
		if (destination.name) {
			console.log('Want to boost: ' + destination.name);
			setSelectedDestination(destination);
		}
		else if (destination === 'podfriend') {
			console.log('Want to boost: ' + destination);

			/*
			$destinations[] = [
				"name" => "Podfriend",
				"address" => "03437da0f1e006bb118a43fad3cf2fb7e05b12319a090358928e4a85d11f14ec67",
				"type" => "node",
				"split" => 1,
				"calculatedPercentage" => 1,
				"calculatedAmount" => round(($satoshiAmount * 1) / 100)
			];
			*/

			setSelectedDestination({
				name: 'Podfriend',
				address: '03437da0f1e006bb118a43fad3cf2fb7e05b12319a090358928e4a85d11f14ec67',
				type: 'node',
				split: 100
			});
		}
		else if (Array.isArray(destination)) {
			setSelectedDestination(destination);
		}
		else {
			console.log('Unknown destination');
			console.log(destination);
		}
	};

	const checkUserIcon = (name) => {
		if (name === 'Podcastindex.org') {
			return 'https://podcastindex.org/images/pci_avatar.jpg';
		}
		else if (name.includes('Dreb Scott')) {
			return 'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/003/911/original/946716e5a873702d.jpg';
		}
		else if (name.includes('Podnews')) {
			return 'https://pbs.twimg.com/profile_images/1048525405907345408/Ss7WraSg.jpg';
		}
		return iconUser;
	};

	const onBoost = () => {
		setBoostPending(true);

		dispatch(boostPodcast(
			activePodcast.value,
			boostValue,
			selectedDestination,
			boostFrom,
			boostMessage
		))
		.then((status) => {
			if (status.success === 1) {
				setBoostPending(false);
				rewardElement.current.rewardMe();
				dispatch(synchronizeWallet());
			}
			else {
				setBoostPending(false);
				console.log(status);
				rewardElement.current.punishMe();
			}
		})
		.catch((error) => {
			console.log('Error boosting');
			console.log(error);
		});
	};

	var headline = 'Send Boost';
	var footer = null;

	if (selectedDestination !== false) {
		headline = `Boosting ${selectedDestination.name ? selectedDestination.name : Array.isArray(selectedDestination) ? 'everyone' : 'Podfriend' }`;
		// headline = 'Do you want to add a message?';

		footer = (
			<div style={{ textAlign: 'center', padding: 10 }}>
				<Reward
					ref={rewardElement}
					type='confetti'
					config={{
						zIndex: 1000,
						lifeTime: 800
					}}
				>
					<div className={'button boostButton'}>
						{ boostPending === false &&
							<div className="buttonPrimaryAction" onClick={onBoost}>
								<FaRocket style={{ fill: '#FFFFFF', opacity: '0.8'}} /> BOOST {formatAmount(boostValue)}
							</div>
						}
						{ boostPending === true &&
							<div className="buttonPrimaryAction">
								<SVG src={require('podfriend-approot/images/design/loading/loading-circle-white.svg')} style={{ display: 'inline' }}/> BOOSTING
							</div>
						}
					</div>
				</Reward>
			</div>
		);
	}

	return (
		<Modal
			shown={shown}
			onClose={onClose}
			defaultSnap={({ maxHeight }) => maxHeight - 30}
			header={
				<h1>
					{headline}
				</h1>
			  }
			footer={footer}
		>
			<div className={styles.individualBoostModal}>
				<div style={{ padding: 20 }}>
					{ selectedDestination !== false &&
						<>
							<div>
								<SplitRange label='Boost' label2='Satohis' min={SATOSHIS_BOOST_MIN} max={SATOSHIS_BOOST_MAX} value={boostValue} onValueChange={onBoostChange} />
							</div>
							<div>
								{ /*
								<textarea placeholder={`Optional message to ${selectedDestination.name ? selectedDestination.name : selectedDestination}`} value={boostMessage} onChange={(event) => { setBoostMessage(event.target.message); }} />
								*/ }

								<TextField
									id="boostFrom"
									name="boostFrom"
									label="Your name (optional)"
									value={boostFrom}
									onChange={(event) => { setBoostFrom(event.target.value); }}
									fullWidth
									variant={'outlined'}
									style={{ marginBottom: 10 }}
								/>

								<TextField
									id='message'
									name='message'
									label='Optional message'
									value={boostMessage}
									onChange={(event) => { setBoostMessage(event.target.value); }}
									rows={6}
									variant={'outlined'}
									multiline
									fullWidth
									style={{ marginBottom: 10 }}
								/>


							</div>
						</>
					}
					{ selectedDestination === false &&
						<>
							<IonList>
								<IonItem button onClick={() => { onBoostRecipientSelected(activePodcast.value.destinations); }}>
									<IonThumbnail slot="start">
										<img src={iconGroup} />
									</IonThumbnail>
									<IonLabel>
										Everyone!
									</IonLabel>
								</IonItem>
								{activePodcast.value.destinations.map((destination,index) => (
									<IonItem key={'destination' + index} button onClick={() => { onBoostRecipientSelected(destination,index); }}>
										<IonThumbnail slot="start">
											<img src={checkUserIcon(destination.name)} style={{ borderRadius: 5 }} />
										</IonThumbnail>
										<IonLabel>
											{destination.name}
										</IonLabel>
									</IonItem>
								))}
								<IonItem button onClick={() => { onBoostRecipientSelected('podfriend'); }}>
									<IonThumbnail slot="start">
										<img src={iconPodfriend} />
									</IonThumbnail>
									<IonLabel>
										Podfriend
									</IonLabel>
								</IonItem>
							</IonList>
						</>
					}
				</div>
			</div>
		</Modal>
	);
};
export default IndividualBoostModal;