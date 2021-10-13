import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Modal from 'podfriend-approot/components/AppUI/Modal';

import { Range } from 'react-range';

import styles from './AudioSpeedSettingModal.scss';

import { setAudioPlaybackSpeed } from 'podfriend-approot/redux/actions/settingsActions';

const AudioSpeedSettingModal = ({ onClose }) => {
	const dispatch = useDispatch();
	const speedButtons = [0.75,1.0,1.25,1.5];

	var audioSpeed = useSelector((state) => {
		return state.settings.audioPlaybackSpeed;
	});
	if (!audioSpeed) {
		audioSpeed = 1;
	}

	const onSpeedChange = (value) => {
		var scaledValue = Number.parseFloat(map_range(value,0,100,0.7,3.0)).toFixed(2);
		saveAudioSpeed(scaledValue);
	};

	const saveAudioSpeed = (speed) => {
		dispatch(setAudioPlaybackSpeed(speed));
	};

	const map_range = (value, low1, high1, low2, high2) => {
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}

	const percentage = Number.parseInt(map_range(audioSpeed,0.7,3,0,100));

	return (
		<Modal onClose={onClose} title='Audio speed'>
			<div className={'modalPage ' + styles.audioSpeedSettingModal}>
				<div>
					<h2>{audioSpeed}x</h2>
					<div>Selected speed</div>
				</div>
				<div className={styles.speedRange}>
					<div>0.7x</div>

					{ /*
					<Range
						value={percentage}
						min={1}
						max={100}
						thumbSize={16}
						height={6}
						width="100%"
						fillColor={{
							r: 40,
							g: 189,
							b: 114,
							a: 1,
						}}
						trackColor={{
							r: 10,
							g: 10,
							b: 0,
							a: 0.5,
						}}
						onChange={onSpeedChange}
					/>
					*/ }

					<Range
						step={0.1}
						values={[percentage]}
						min={0}
						max={100}
						renderTrack={({ props, children }) => (
							<div
							onMouseDown={props.onMouseDown}
							onTouchStart={props.onTouchStart}
								{...props}
								style={{
									...props.style,
									height: '6px',
									width: '100%',
									backgroundColor: 'rgba(10, 10, 0, 0.5)'
								}}
							>
								{children}
							</div>
							)}
							renderThumb={({ props, isDragged }) => (
							<div
								{...props}
								style={{
								...props.style,
								height: '16px',
								width: '16px',
								borderRadius: '50%',
								backgroundColor: '#FFFFFF',
								boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)'
								}}
							/>
							)}
						onChange={(values) => { onSpeedChange(values[0]); }}
					/>
					<div>3x</div>
				</div>
				<div className={styles.speedButtons}>
					<div className={styles.speedButtonsTitle}>
						Shortcuts
					</div>
					{ speedButtons.map((speed) => {
						return (
							<button key={speed} className={'podfriendButton ' + styles.speedButton + ' ' + (Number.parseFloat(speed) === Number.parseFloat(audioSpeed) ? 'active' : 'nonActive')} onClick={() => { saveAudioSpeed(speed); }}>{speed}x</button>
						);
					}) }
				</div>
				<div className={styles.closeButtonContainer}>
					<button className='podfriendButton' onClick={onClose}>Close</button>
				</div>
			</div>
		</Modal>
	);
};

export default AudioSpeedSettingModal;