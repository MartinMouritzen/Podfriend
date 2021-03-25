import React, { useEffect, useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { FaVolumeMute, FaVolumeDown, FaVolumeUp } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';

import styles from './Player.scss';

import { setConfigOption } from 'podfriend-approot/redux/actions/settingsActions';

const VolumeSlider = ({ audioElement }) => {
	const dispatch = useDispatch();

	const volumeLevel = useSelector((state) => state.settings.volumeLevel);
	const [volumeLevelBeforeMute,setVolumeLevelBeforeMute] = useState(volumeLevel);

	const onVolumeSliderChange = (newVolume) => {
		dispatch(setConfigOption('volumeLevel',newVolume));
	};

	useEffect(() => {
		// console.log('setting volume to: ' + volumeLevel);
		audioElement.volume = volumeLevel;
	},[volumeLevel,audioElement]);

	const muteOrUnmute = () => {
		// Test if muted
		if (volumeLevel === 0) {
			if (volumeLevelBeforeMute === 0) {
				volumeLevelBeforeMute = 1;
			}
			dispatch(setConfigOption('volumeLevel',volumeLevelBeforeMute));
		}
		else {
			setVolumeLevelBeforeMute(volumeLevel);
			dispatch(setConfigOption('volumeLevel',0));
		}
	};

	return (
		<div className={styles.volumeControls}>
			{ audioElement.volume === 0 &&
				<FaVolumeMute size='20px' onClick={muteOrUnmute} style={{cursor: 'pointer' }} />
			}
			{ audioElement.volume > 0 && audioElement.volume <= 0.6 &&
				<FaVolumeDown size='20px' onClick={muteOrUnmute} style={{cursor: 'pointer' }} />
			}
			{ audioElement.volume > 0.6 &&
				<FaVolumeUp size='20px' onClick={muteOrUnmute} style={{cursor: 'pointer' }} />
			}
			<Range
				step={0.05}
				values={[volumeLevel]}
				min={0}
				max={1}
				renderTrack={({ props, children }) => (
					<div
						onMouseDown={(event) => { props.onMouseDown(event); }}
						onTouchStart={(event) => { props.onTouchStart(event); }}
						style={{
							...props.style,
							height: '24px',
							width: '100%',
							display: 'flex'
						}}
					>
						<div
							ref={props.ref}
							style={{
								height: '6px',
								width: '100%',
								alignSelf: 'center',
								background: getTrackBackground({
									values: [volumeLevel],
									colors: ['#0176e5', 'rgba(10, 10, 0, 0.5)'],
									min: 0,
									max: 1
								})
							}}
						>
							{children}
						</div>
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
							backgroundColor: '#CCCCCC',
							transition: 'all 0.3s',
							boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)'
						}}
					/>
				)}
				onChange={(values) => { onVolumeSliderChange(values[0],false); }}
			/>
		</div>
	);
}
export default VolumeSlider;