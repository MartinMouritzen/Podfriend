import React from 'react';
import { Range } from 'react-range';

const ProgressBar = ({progress,duration,onProgressSliderChange}) => {
	return (
		<Range
			step={0.1}
			values={[(100 * progress) / duration]}
			min={0}
			max={100}
			renderTrack={({ props, children }) => (
				<div
					onMouseDown={(event) => { props.onMouseDown(event); }}
					onTouchStart={(event) => { props.onTouchStart(event); }}
					style={{
						...props.style,
						height: '24px',
						width: '100%',
						display: 'flex',
						backgroundColor: '#ff23aa'
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
						backgroundColor: '#FFFFFF',
						transition: 'all 0.5s',
						boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)'
					}}
				/>
		)}
		onChange={(values) => { onProgressSliderChange(values[0],false); }}
	/>
	);
};
export default ProgressBar;