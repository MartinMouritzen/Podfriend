import React, { useState, useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import styles from './ProgressBarSlider.scss';

const ProgressBarSlider = ({progress,duration,fullPlayerOpen,onProgressSliderChange}) => {
	var sliderInitial = (100 * progress) / duration;
	if (sliderInitial < 0) {
		sliderInitial = 0;
	}
	else if (sliderInitial > 100) {
		sliderInitial = 100;
	}

	const [sliderValue,setSliderValue] = useState(sliderInitial);
	const [dragValue,setDragValue] = useState(false);
	const [useDragValue,setUseDragValue] = useState(sliderValue);

	const [isDraggingSlider,setIsDraggingSlider] = useState(false);


	useEffect(() => {
		let newValue = (100 * progress) / duration;

		if (isDraggingSlider) {
			newValue = dragValue;
		}
		if (newValue < 0) {
			newValue = 0;
		}
		else if (newValue > 100) {
			newValue = 100;
		}
		setSliderValue(newValue);
	},[progress,duration,dragValue,isDraggingSlider]);

	const sliderDragged = (values) => {
		setDragValue(values[0]);
	};

	const sliderDragStopped = (values) => {
		setIsDraggingSlider(false);

		if (values[0] < 0) {
			values[0] = 0;
		}
		else if (values[0] > 100) {
			values[0] = 100;
		}

		onProgressSliderChange(values[0],false);
		setSliderValue(values[0]);
	};

	/*
	// Note: doesn't work, because react-range wants to make a mark per step interval, not custom values. 
	// We could experiment with putting divs on top of the progress bar, but it would really only work for hover-enabled
	// devices like destop, and is not reaaaally needed.

	const STEP = 10;

	renderMark={({ props, index }) => {
		if (index > 40 && index < 151) {
			return (
				<div
					{...props}
					style={{
						...props.style,
						height: '16px',
						width: '5px',
						backgroundColor: index * STEP < sliderValue ? '#29bd73' : '#0b1c2c'
					}}
				/>
			);
		}
	}}
	*/

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
							borderRadius: '3px',
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