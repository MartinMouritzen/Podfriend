import React, { useEffect, useState, useRef } from 'react';

import { useSpring, animated } from 'react-spring'
import { useGesture } from 'react-use-gesture'

import useWindowDimensions from 'podfriend-approot/library/hooks/useWindowDimensions.js';

import styles from './DraggablePane.scss';

const DraggablePane = ({ onHide = false, onOpen = false, open = false, children, className, style }) => {
	const { height: windowHeight, width: windowWidth } = useWindowDimensions();
	const [ heightWithoutDrag, setHeightWithoutDrag ] = useState(0);

	const elementRef = useRef(null);

	const [startDragScrollOffsetY,setStartDragScrollOffsetY] = useState(0);

	const [safeAreaTop,setSafeAreaTop] = useState(0);
	const [safeAreaBottom,setSafeAreaBottom] = useState(0);

	const [{ y, height }, set] = useSpring(() => ({ y: 0, height: heightWithoutDrag }))

	const getOrientation = () => {
		return window.screen.orientation.type;
	}

	const [orientation, setOrientation] = useState(getOrientation())

	const updateOrientation = (event) => {
		setOrientation(getOrientation())
	}
	useEffect(() => {
		window.addEventListener('orientationchange',updateOrientation);
		return () => {
			window.removeEventListener('orientationchange',updateOrientation);
		}
	},[])

	useEffect(() => {
		try {
			setSafeAreaTop(parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safeAreaTop"),10));
			setSafeAreaBottom(parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safeAreaBottom"),10));
		}
		catch(exception) {
			console.log('Error parsing safeAreaBottom value in DraggablePane');
			safeAreaTop(0);
			setSafeAreaBottom(0);
		}

		if (open) {
			setHeightWithoutDrag(windowHeight - (safeAreaTop ? safeAreaTop : 24));
		}
		else {
			if (windowWidth <= 570) {
				setHeightWithoutDrag(60);
			}
			else {
				setHeightWithoutDrag(90);
			}
		}
	},[open,orientation,windowWidth]);

	useEffect(() => {
		// Giving it a little time before calling, to prevent it being triggered before mouseup, otherwise we get weird sideeffects.
		setTimeout(() => {
			set({ height: heightWithoutDrag });
		},50);
	},[heightWithoutDrag]);

	const bind = useGesture({
		onDragStart: ({}) => {
			setStartDragScrollOffsetY(elementRef.current.scrollTop);
			// elementRef.current.scrollTop = startDragScrollOffsetY;
		},
		onDrag: ({ down, initial: [ix,iy], movement: [mx, my], direction: velocity }) => {
			let dragValues = { height: heightWithoutDrag };
			
			if (my === 0) {
				return;
			}

			if (elementRef.current) {
				if (open && (elementRef.current.scrollTop > 0 || my < 0)) {
					const canScrollDown = true;

					// if (down && canScrollDown) {
						elementRef.current.scrollTop = startDragScrollOffsetY + (my * -1);
						dragValues.y = startDragScrollOffsetY + (my * -1) + 2;
						set(dragValues);
					// }
				}
				else {
					dragValues = { height: down ? heightWithoutDrag - my : heightWithoutDrag };
					if (open && my > 100 && !down) {
						if (onHide) {
							onHide();
						}
					}
					else if (!open && !down) {
						if (my < -60) {
							if (onOpen) {
								onOpen();
							}
						}
					}
					set(dragValues);
				}
			}
		}
	})
// <animated.div className={className} {...bind()} style={{ bottom: (open ? y : 0), touchAction: 'none', ...style }}>

	let dragStyle = {
		...style,
		bottom: open ? 0 : windowWidth < 900 ? (60 + safeAreaBottom) : 0,
		touchAction: 'none',
		height: height,
		y
	};


	return (
		<animated.div className={className} {...bind()} style={dragStyle} ref={elementRef}>
			{ open && 
				<div className={styles.dragHandle}>&nbsp;</div>
			}
			{children}
		</animated.div>
	);
};
export default DraggablePane;