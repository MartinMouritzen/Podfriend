import React from 'react';

import { Range } from 'react-range';

import styles from './../Player.scss';

import { FaVolumeMute, FaVolumeDown, FaVolumeUp } from "react-icons/fa";

const VolumeSlider = ({ audioElement }) => {
	const onVolumeSliderChange = (newVolume) => {
		audioElement.volume = newVolume;
	};

	return (
		<div className={styles.volumeControls}>
			{ audioElement.volume === 0 &&
				<FaVolumeMute size='20px' />
			}
			{ audioElement.volume > 0 && audioElement.volume <= 0.6 &&
				<FaVolumeDown size='20px' />
			}
			{ audioElement.volume > 0.6 &&
				<FaVolumeUp size='20px' />
			}
			<Range
				step={0.05}
				values={[audioElement.volume]}
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
								backgroundColor: 'rgba(10, 10, 0, 0.5)'
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