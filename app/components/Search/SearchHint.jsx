import React from 'react';

import styles from './SearchHints.scss';

const SearchHint = ({ hint, Events }) => {
	return (
		<div
			className={styles.searchHintResult}
			onClick={() => { Events.emit('OnSearch',hint); }}
		>
			<div className={styles.searchHintLabel}>Podcast</div>
			<div className={styles.searchHintText}>
				{hint}
			</div>
		</div>
	);
};
export default SearchHint;