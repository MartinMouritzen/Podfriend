import React, { useEffect, useState } from 'react';

import SVG from 'react-inlinesvg';
const InformationIcon = () => <SVG src={require('podfriend-approot/images/design/icons/information.svg')} />;

import styles from './Notice.scss';

const Notice = ({ type, style, title, children, targetClass, targetPlatform }) => {
	const [shown,setShown] = useState(false);

	const isIOS = () => {
		return [
		'iPad Simulator',
		'iPhone Simulator',
		'iPod Simulator',
		'iPad',
		'iPhone',
		'iPod'
		].includes(navigator.platform)
		// iPad on iOS 13 detection
		|| (navigator.userAgent.includes("Mac") && "ontouchend" in document)
	}

	useEffect(() => {
		var shouldShow = false;
		return;
		if (targetPlatform === 'ios') {
			if (isIOS()) {
				setShown(true);
			}
			else {
				setShown(false);
			}
		}
	},[targetPlatform]);

	if (shown) {
		return (
			<div className={styles.notice + ' ' + styles.['notice_' + type]} style={style}>
				<div className={styles.icon}>
					<InformationIcon />
				</div>
				<div>
					<div className={styles.headline}>
						{title}
					</div>
					<div className={styles.text}>
						{children}
					</div>
				</div>
			</div>
		);
	}
	else {
		return null;
	}
};
export default Notice;