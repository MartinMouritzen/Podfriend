import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import socketIOClient from "socket.io-client";

const chatServerURI = process.env.NODE_ENV === 'development' ? "http://192.168.86.89:9999" : 'https://chat.podfriend.com:9999/';

const ChatProvider = ({ chatModal, roomId }) => {
	const [socket,setSocket] = useState(false);
	const [messages,setMessages] = useState([]);
	const isLoggedIn = useSelector((state) => { return state.user.isLoggedIn});
	const authToken = useSelector((state) => { return state.user.authToken});

	const onMessageSubmit = (message) => {
		socket.emit('chatMessage',{
			message: message
		});
	};

	useEffect(() => {
		setSocket(socketIOClient(chatServerURI));
	},[]);

	useEffect(() => {
		if (socket) {
			socket.emit('login',{
				authToken: authToken,
				roomId: roomId
			});
		}
	},[socket]);

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on('connect',() => {
			console.log('Chat connected!');
		});
		socket.on('loginCompleted',(data) => {
			console.log('Logged into chat!');
			console.log(data);
		});
		socket.on("chatMessage", data => {
			const newMessage = {
				name: data.name,
				text: data.text
			};
			setMessages((messages) => { return [...messages, newMessage]; });
		});
		return () => {
			socket.disconnect();
		};
	}, [ socket ]);

	const ChatModal = chatModal;

	return (
		<ChatModal
			onMessageSubmit={onMessageSubmit}
			messages={messages}
			isLoggedIn={isLoggedIn}
		/>
	);
};
export default ChatProvider;