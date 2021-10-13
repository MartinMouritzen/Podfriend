import React, { useState } from 'react';

import styles from './Page.scss';

const Page = ({ children }) => {
	const [scrollPosition,setScrollPosition] = useState(0);
	const [headerHeight,setHeaderHeight] = useState(0);
	

	const onContentScrollChange = (y) => {
		setScrollPosition(y);
	};
	const onHeaderHeightChange = (height) => {
		setHeaderHeight(height);
	};


	// { React.cloneElement(children, { scrollPosition: scrollPosition }) }
	return (
		<div className={styles.page}>
			{ React.Children.map(children, (child => React.cloneElement(child, { headerHeight, onHeaderHeightChange, onContentScrollChange, scrollPosition }))) }
		</div>
	);
};
export default Page;