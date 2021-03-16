import React from 'react';

import styles from './TitleHeader.scss';

const TitleHeader = ({children }) => {
	return (
		<div className={styles.titleHeader}>
			<h2>{children}</h2>
		</div>
	);
};

export default TitleHeader;