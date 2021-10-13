import React, { useState } from 'react';

import SVG from 'react-inlinesvg';
import Wave from 'podfriend-approot/images/design/blue-wave-1.svg';

import styles from './PageHeaderToolbar.scss';

const PageHeaderToolbar = ({ children }) => {


	return (
		<div className={styles.pageHeaderToolbar}>
			{children}
		</div>
	);
};
export default PageHeaderToolbar;