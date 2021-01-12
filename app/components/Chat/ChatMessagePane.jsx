import React, { useRef, useEffect } from 'react';

import styles from './Chat.scss';

const ChatMessagePane = ({ messages = [] }) => {
	const messagePane = useRef(null);

	useEffect(() => {
		/*
		if (messagePane) {
			messagePane.current.scrollTop = messagePane.current.scrollHeight;
		}
		*/
		var bottomSheetContent = document.querySelector('[data-rsbs-content]');
		if (bottomSheetContent) {
			// bottomSheetContent.style.maxHeight = '50vh';
			bottomSheetContent.scrollTop = bottomSheetContent.scrollHeight;
		}
	},[messages]);

	return (
		<div ref={messagePane} className={styles.messagePane}>
			{ messages.map((message,index) => {
				return (
					<div key={index} className={styles.messageLine}>
						<span className={styles.messageUsername}>{message.name}:</span>
						<span className={styles.messageText}>{message.text}</span>
					</div>
				);
			} ) }
		</div>
	);
};
export default ChatMessagePane;