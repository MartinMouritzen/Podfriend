import React, { useState } from 'react';

import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from "react-virtualized";

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

import Events from 'podfriend-approot/library/Events.js';

import styles from './SubtitleSearchModal.scss';

const SubtitleSearchModal = React.memo(({ subtitleContent }) => {
	const [searchText,setSearchText] = useState('');
	const onSearchQueryChange = (event) => {
		setSearchText(event.target.value.toLowerCase());
	};

	const cellCache = new CellMeasurerCache({
		fixedWidth: true,
		minHeight: 35,
	});

	const stripHtml = (html) => {
	   let tmp = document.createElement("DIV");
	   tmp.innerHTML = html;
	   return tmp.textContent || tmp.innerText || "";
	}

	const onSubtitleSelected = (startTime) => {
		Events.emit('PodfriendSetCurrentTime',startTime);
	};

	// const data = subtitleContent;

	const data = subtitleContent.filter(item =>
		item.text.toLowerCase().includes(searchText)
	);

	const renderRow = ({ index, isVisible, isScrolling, key, parent, style }) => {
		const content = data[index];

		return (
			<CellMeasurer
				cache={cellCache}
				columnIndex={0}
				key={key}
				parent={parent}
				rowIndex={index}
			>
				{({ measure }) => (
					<div className={styles.searchResult} style={style} onClick={() => { onSubtitleSelected(content.start); }}>
						<div className={styles.time}>
							{TimeUtil.formatPrettyDurationText(content.start)}
						</div>
						<div className={styles.caption}>
							{stripHtml(content.text)}
						</div>
					</div>
				)}
			</CellMeasurer>
		);
		/*
		return (
			<div className={styles.searchResult} key={'subtitle_' + index} onClick={() => { onSubtitleSelected(content.start); }}>
				<div className={styles.time}>
					{TimeUtil.formatPrettyDurationText(content.start)}
				</div>
				<div className={styles.caption}>
					{stripHtml(content.text)}
				</div>
			</div>
		);
		*/
	};


	return (
		<div className={styles.subtitleSearchPane}>
			<h1>Search transcript</h1>
			<div style={{ padding: 20 }}>
				<input type="text" placeholder="Input search term here" value={searchText} onChange={onSearchQueryChange} />
				<div className={styles.searchResults}>
					<AutoSizer>
					{({height, width}) => (
						<List
							width={width}
							height={height}
							deferredMeasurementCache={cellCache}
							rowHeight={cellCache.rowHeight}
							rowRenderer={renderRow}
							rowCount={data.length}
						/>
					)}
					</AutoSizer>
				</div>
			</div>
		</div>
	);

	/*
	return (
		<div className={styles.subtitleSearchPane}>
			<h1>Search transcript</h1>
			<div style={{ padding: 20 }}>
				<input type="text" placeholder="Input search term here" value={searchText} onChange={onSearchQueryChange} />
				<div className={styles.searchResults}>
					{ data.map((content,index) => {
						// var position = content.text.toLowerCase().search(searchText)
						// if (position !== -1) {
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
						// }
					}) }
				</div>
			</div>
		</div>
	);
	*/
});
export default SubtitleSearchModal;