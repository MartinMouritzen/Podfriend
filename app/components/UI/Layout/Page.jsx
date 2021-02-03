import React from 'react';

import styles from './Page.scss';

const Page = ({ children }) => {
	return (
		<div className={'podcastPage ' + styles.page}>
			{children}
		</div>
	);
};

export default Page;