import React, { useState } from 'react';

import SVG from 'react-inlinesvg';
const SendIcon = () => <SVG src={require('podfriend-approot/images/design/icons/send.svg')} />;

import styles from './Chat.scss';

const ChatMessageInput = ({ onMessageSubmit }) => {
	const [currentMessage,setCurrentMessage] = useState('');

	const onChatMessageTextChange = (event) => {
		setCurrentMessage(event.target.value);
	};
	const sendChatMessage = (event) => {
		event.preventDefault();
		onMessageSubmit(currentMessage);
		setCurrentMessage('');
	};

	return (
		<form className={styles.textInputPane} onSubmit={sendChatMessage}>
			<input type="text" value={currentMessage} placeholder="Send a chat message" onChange={onChatMessageTextChange} />
			<div className={styles.sendButton + ' ' + (currentMessage.length > 0 ? styles.hasMessage : styles.noMessage)} onClick={sendChatMessage}>
				<SendIcon />
			</div>
		</form>
	);
};
export default ChatMessageInput;