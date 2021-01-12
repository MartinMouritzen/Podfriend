import React, { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import Modal from 'podfriend-approot/components/Window/Modal';

import styles from './SleepTimerModal.scss';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

const SleepTimerModal = ({ shown, onDismiss, audioController }) => {
	const [isActive,setIsActive] = useState(audioController.sleepTimerSeconds !== false);
	const [secondsLeft,setSecondsLeft] = useState(audioController.getRemainingSleepTimerSeconds());

	const onTimerChanged = (seconds) => {
		audioController.setSleepTimer(seconds);
	};

	const addFiveMinutes = () => {
		audioController.setSleepTimer(audioController.sleepTimerSeconds + (60 * 5));
	};

	const cancelSleepTimer = () => {
		audioController.cancelSleepTimer();
		setIsActive(false);
	};
/*
	useEffect(() => {
		console.log('seconds changed: ' + audioController.sleepTimerSeconds);
		if (audioController.sleepTimerSeconds === false) {
			setIsActive(false);
		}
		else {
			setIsActive(true);
		}
	},[audioController.sleepTimerSeconds]);
	*/

	useEffect(() => {
		const interval = setInterval(() => {
			if (audioController.sleepTimerSeconds !== false) {
				setIsActive(true);


				setSecondsLeft(audioController.getRemainingSleepTimerSeconds());
			}
			else {
				setIsActive(false);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Modal shown={shown} onClose={onDismiss}>
			<div style={{ backgroundColor: '#FFFFFF' }}>
				<h1>Sleep timer</h1>
				{ isActive !== false &&
					<div className={styles.currentTimer}>
						<div>
							Current timer: {TimeUtil.formatPrettyDurationText(secondsLeft)}
						</div>
						<div>
							<div className="button" style={{ marginTop: 10 }} onClick={addFiveMinutes}>Add 5 more minutes</div>
							<div className="button" style={{ marginTop: 10 }} onClick={cancelSleepTimer}>Cancel sleep timer</div>
						</div>
					</div>
				}
				{ isActive === false &&
					<div>
						<div onClick={() => { onTimerChanged(3600 * 2); }} className={styles.sleepTimerLine}>2 hours</div>
						<div onClick={() => { onTimerChanged(3600 * 1); }} className={styles.sleepTimerLine}>1 hours</div>
						<div onClick={() => { onTimerChanged(45 * 60); }} className={styles.sleepTimerLine}>45 minutes</div>
						<div onClick={() => { onTimerChanged(30 * 60); }} className={styles.sleepTimerLine}>30 minutes</div>
						<div onClick={() => { onTimerChanged(15 * 60); }} className={styles.sleepTimerLine}>15 minutes</div>
						<div onClick={() => { onTimerChanged(5 * 60); }} className={styles.sleepTimerLine}>5 minutes</div>
					</div>
				}
			</div>
		</Modal>
	);
};

export default SleepTimerModal;