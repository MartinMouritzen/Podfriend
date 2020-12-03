import React, { useState, useEffect, useRef } from 'react';

import styles from './ContextMenu.css';

/**
*
*/
const ContextMenu = ({ showType = 'auto', position = 'auto', showTrigger, element, target, style = {}, children }) => {
	const contextMenuElement = useRef(null);
	const [show,setShow] = useState(false);
	const [top,setTop] = useState(0);
	const [bottom,setBottom] = useState(0);
	const [left,setLeft] = useState(0);

	const onWindowBlur = () => {
		if (showType == 'auto') {
			setShow(false);
		}
	}
	const onContextMenu = (event) => {
		if (!target) {
			return;
		}

		if (!show && event.target.matches(target + ', ' + target + ' *')) {
			setShow(true);
		}
		else if (show && showType == 'auto') {
			setShow(false);
		}
	}
	const onWindowClick = (event) => {
		if (show && showType == 'auto') {
			setShow(false);
		}
	}
	const showContextMenu = (event) => {
		event.preventDefault();
		event.stopImmediatePropagation();

		if (!show) { // If not showing, that means we want to set the position now, before we show
			setContextMenuPosition(event);
		}
		setShow(!show);
	};
	const setContextMenuPosition = (event) => {
		if (element.current) {
			var bodyRect = document.body.getBoundingClientRect();
			var elemRect = element.current.getBoundingClientRect();
			var contextMenuElementRect = contextMenuElement.current.getBoundingClientRect();

			var offsetTop = elemRect.top - bodyRect.top;
			var offsetLeft = elemRect.left - bodyRect.left;
			var offsetBottom = false;

			if (offsetLeft + 200 > bodyRect.right) {
				offsetLeft = offsetLeft - 150;
			}

			if (position === 'top') {
				offsetTop = false;
				offsetBottom = window.innerHeight - elemRect.top;
			}
			else if (position === 'bottom') {
				offsetTop = elemRect.bottom;
				offsetBottom = false;
			}
			else {
				offsetTop = offsetTop + elemRect.bottom + 5;
			}

			setBottom(offsetBottom);

			setTop(offsetTop);
			setLeft(offsetLeft);
		}
	};

	useEffect(() => {
		window.addEventListener('click',onWindowClick, false);
		// Check if is string, then we can use that instead of a target (to add a listener to window and listen for classname instead etc.)
		if (element && element.current && showTrigger === 'click') {
			element.current.addEventListener('click',showContextMenu, false);
		}
		// window.addEventListener('contextmenu',this.onContextMenu, false);
		window.addEventListener('blur',onWindowBlur, false);

		return () => {
			if (element && element.current && showTrigger === 'click') {
				element.current.removeEventListener('click',showContextMenu, false);
			}
			window.removeEventListener('click',onWindowClick, false);
			// window.removeEventListener('contextmenu',this.onContextMenu, false);
			window.removeEventListener('blur',onWindowBlur, false);
		};
	});

	return (
		<div className={styles.contextMenu} ref={contextMenuElement} style={{...style, display: show ? 'block' : 'none', top: top, left: left, bottom: bottom }}>
			{children}
		</div>
	);
}
const ContextMenuItem = ({ style = {}, icon = null, children, onClick }) => {
	const Icon = icon;
	const isLink = children && children.type && children.type.displayName === 'Link' ? true : false;
	
	var innerMenuItem = (
		<div className={styles.contextMenuItem + ' ' + (isLink ? styles.isLink : '')} style={style} onClick={onClick}>
			{children}
		</div>
	);

	return innerMenuItem;
}
export {
	ContextMenu,
	ContextMenuItem
}