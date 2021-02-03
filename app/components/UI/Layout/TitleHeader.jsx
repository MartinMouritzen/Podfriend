import React from 'react';

import styles from './TitleHeader.scss';

const TitleHeader = ({children }) => {
	return (
		<h2>{children}</h2>
	);
};

export default TitleHeader;