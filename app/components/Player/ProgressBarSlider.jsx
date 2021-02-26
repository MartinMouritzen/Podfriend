import React, { useState, useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import styles from './ProgressBarSlider.scss';

const ProgressBarSlider = ({progress,duration,fullPlayerOpen,onProgressSliderChange}) => {
	const [sliderValue,setSliderValue] = useState((100 * progress) / duration);
	const [dragValue,setDragValue] = useState(false);
	const [useDragValue,setUseDragValue] = useState(sliderValue);

	const [isDraggingSlider,setIsDraggingSlider] = useState(false);


	useEffect(() => {
		let newValue = (100 * progress) / duration;

		if (isDraggingSlider) {
			newValue = dragValue;
		}
		setSliderValue(newValue);
	},[progress,duration,dragValue,isDraggingSlider]);

	const sliderDragged = (values) => {
		setDragValue(values[0]);
	};

	const sliderDragStopped = (values) => {
		setIsDraggingSlider(false);
		onProgressSliderChange(values[0],false);
		setSliderValue(values[0]);
	};

	return (
		<Range
			step={0.1}
			values={[sliderValue]}
			min={0}
			max={100}
			renderTrack={({ props, children }) => (
				<div
					onMouseDown={(event) => { console.log('onMouseDown'); setIsDraggingSlider(true); props.onMouseDown(event); }}
					onTouchStart={(event) => { console.log('touchstart'); setIsDraggingSlider(true); props.onTouchStart(event); }}
					style={{
						...props.style,
						height: fullPlayerOpen ? '36px' : '24px',
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
								values: [sliderValue],
								colors: ['#29bd73', 'rgba(10, 10, 0, 0.5)'],
								min: 0,
								max: 100
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
						backgroundColor: '#FFFFFF',
						transition: 'all 0.3s',
						boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)'
					}}
				>
					{ isDraggingSlider &&
						<div
							className={styles.timePreview}
						>
							{TimeUtil.formatPrettyDurationText((sliderValue * duration) / 100)}
						</div>
					}
				</div>
			)}
			onChange={sliderDragged}
			onFinalChange={sliderDragStopped}
		/>
	);
};

export default ProgressBarSlider;