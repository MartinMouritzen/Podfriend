import { StylesProvider } from '@material-ui/styles';
import React, { useState, useEffect } from 'react';

import { Range, getTrackBackground } from 'react-range';

import styles from './SplitRange.scss';

const SplitRange = ({ label, label2 = false, min, max, value: startValue, onValueChange = false }) => {

	const [value,setValue] = useState(startValue);

	const onSplitSliderChange = (amount) => {
		setValue(amount);
		if (onValueChange) {
			onValueChange(amount);
		}
	};

	return (
		<div className={styles.splitRange}>
			<div className={styles.splitLabel}>
				<div className={styles.splitLabelText}>
					{label}
				</div>
				<div>
					<input type="number" value={value} min={min} max={max} onChange={(event) => { onSplitSliderChange(event.target.value); }} />
				</div>
				{ label2 !== false &&
					<div className={styles.splitLabel2Text}>
						{label2}
					</div>
				}
			</div>
			<Range
				step={1}
				values={[value]}
				min={min}
				max={max}
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
									values: [value],
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
							backgroundColor: '#FFFFFF',
							transition: 'all 0.3s',
							boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
							color: '#000000',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
							
						}}
					/>
				)}
				onChange={(values) => { onSplitSliderChange(values[0]); }}
			/>
		</div>
	);
};
export default SplitRange;