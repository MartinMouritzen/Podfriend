import React, { useState, useEffect } from 'react';

import styles from './ChatPane.scss';

import socketIOClient from "socket.io-client";

const chatServerURI = "http://127.0.0.1:9999";

const ChatMessageInput = ({ onMessageSubmit }) => {
	const [currentMessage,setCurrentMessage] = useState('');

	const onChatMessageTextChange = (event) => {
		setCurrentMessage(event.target.value);
	};
	const sendChatMessage = () => {
		onMessageSubmit(currentMessage);
		setCurrentMessage('');
	};

	return (
		<div>
			<input type="text" value={currentMessage} onChange={onChatMessageTextChange} /> <button onClick={sendChatMessage}>Send message</button>
		</div>
	);
};

const ChatPane = () => {
	const [messages,setMessages] = useState([]);
	const [socket,setSocket] = useState(false);

	const onMessageSubmit = (message) => {
		socket.emit('chatMessage',{
			message: message
		});
	};

	useEffect(() => {
		setSocket(socketIOClient(chatServerURI));
	},[]);

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on('connect',() => {
			console.log('Chat connected!');
		});
		socket.on("chatMessage", data => {
			console.log(data);
			const newMessage = {
				user: data.user,
				text: data.text
			};
			setMessages((messages) => { return [...messages, newMessage]; });
		});
		return () => {
			socket.disconnect();
		};
	}, [ socket ]);

	return (
		<div>
			Messages:
			{ messages.map((message) => {
				return (
					<div>
						{message.user}: {message.text}
					</div>
				);
			} ) }
			<ChatMessageInput onMessageSubmit={onMessageSubmit} />

		</div>
	);
};
export default ChatPane;