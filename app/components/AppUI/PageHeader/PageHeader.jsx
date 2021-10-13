import React, { useEffect, useState, useRef } from 'react';

import SVG from 'react-inlinesvg';
import Wave from 'podfriend-approot/images/design/blue-wave-1.svg';

import styles from './PageHeader.scss';

const PageHeader = ({ children, onHeaderHeightChange, scrollPosition = 0 }) => {
	const headerRef = useRef(null);
	const [headerHeight,setHeaderHeight] = useState(0);

	const refreshHeaderHeight = () => {
		if (headerRef && headerRef.current) {
			var measuredHeaderHeight = headerRef.current.offsetHeight;
			onHeaderHeightChange(measuredHeaderHeight);
		}
	};
/*
	useEffect(() => {
		refreshHeaderHeight();
	},[]);
	*/

	useEffect(() => {
		setHeaderHeight(200 - scrollPosition);
	},[scrollPosition]);

	return (
		<div className={styles.pageHeader} ref={headerRef} style={{ height: headerHeight }}>
			<div className={styles.pageHeaderTitle}>
				<h1 className={styles.pageHeaderTitleInner}>
					{children}
				</h1>
			</div>
		</div>
	);
};
export default PageHeader;