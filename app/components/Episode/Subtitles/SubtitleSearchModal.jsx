import React, { useState } from 'react';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import Events from 'podfriend-approot/library/Events.js';

import styles from './SubtitleSearchModal.scss';

const SubtitleSearchModal = React.memo(({ subtitleContent }) => {
	const [searchText,setSearchText] = useState('');
	const onSearchQueryChange = (event) => {
		setSearchText(event.target.value.toLowerCase());
	};

	const stripHtml = (html) => {
	   let tmp = document.createElement("DIV");
	   tmp.innerHTML = html;
	   return tmp.textContent || tmp.innerText || "";
	}

	const onSubtitleSelected = (startTime) => {
		Events.emit('PodfriendSetCurrentTime',startTime);
	};

	return (
		<div className={styles.subtitleSearchPane}>
			<h1>Search transcript</h1>
			<div style={{ padding: 20 }}>
				<input type="text" placeholder="Input search term here" value={searchText} onChange={onSearchQueryChange} />
				<div className={styles.searchResults}>
					{ searchText && subtitleContent.map((content,index) => {
						var position = content.text.toLowerCase().search(searchText)
						if (position !== -1) {
							return (
								<div className={styles.searchResult} key={'subtitle_' + index} onClick={() => { onSubtitleSelected(content.start); }}>
									<div className={styles.time}>
										{TimeUtil.formatPrettyDurationText(content.start)}
									</div>
									<div className={styles.caption}>
										{stripHtml(content.text)}
									</div>
								</div>
							)
						}
						else {
							return null;
						}
					}) }
				</div>
			</div>
		</div>
	);
});
export default SubtitleSearchModal;