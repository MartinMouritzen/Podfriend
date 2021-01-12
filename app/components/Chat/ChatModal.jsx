import React, { useEffect, useState } from 'react';

import Modal from 'podfriend-approot/components/Window/Modal';

import ChatMessageInput from './ChatMessageInput.jsx';
import ChatMessagePane from 'podfriend-approot/components/Chat/ChatMessagePane.jsx';

const ChatModal = ({ shown, onDismiss, isLoggedIn, activePodcast, activeEpisode, onMessageSubmit, messages }) => {
	return (
		<Modal
			shown={shown}
			onClose={onDismiss}
			onlyBottomSheet={true}
			defaultSnap={({ maxHeight }) => maxHeight / 2}
			snapPoints={({ maxHeight }) => [ maxHeight / 2, maxHeight - 30 ]}
			header={
				<h2>
				  CHAT
				</h2>
			  }
			  footer={
				<ChatMessageInput isLoggedIn={isLoggedIn} onMessageSubmit={onMessageSubmit} />
			  }
		  >
				<ChatMessagePane messages={messages} />
		</Modal>
	);
}
export default ChatModal;