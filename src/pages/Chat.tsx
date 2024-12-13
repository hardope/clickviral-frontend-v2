import { useState, useRef, useEffect } from 'react';
import '../styles/Chat.css';
import back from '../assets/images/back.svg';
import sendIcon from '../assets/images/back.svg'; // Add your send button icon
// import Notify from '../utils/Notify';
import Loader from '../components/Loader';
import Notify from '../utils/Notify';

interface User {
	id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	profileImage: string;
	coverImage: string;
	bio: string;
	last_seen: string;
}

interface Message {
	id: string;
	tempId?: string;
	sender: string;
	replyId: string;
	attachments?: [string];
	message: string;
	read: boolean;
	created_at: string;
}

interface Chat {
	id: string;
	type: string;
	user: User;
	last_message: Message;
	messages: Message[];
	unread: number;
}

const Chat = () => {
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
	const [message, setMessage] = useState(''); // State to store the message input
	const [chats, setChats] = useState<Chat[] | null>(null); // State to store the chat list
	const messageBoxRef = useRef(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [connected, setConnected] = useState(false);
	const loggedInUser = JSON.parse(localStorage.getItem('user') as string) as User;

	const adjustHeight = () => {
		const messageBox = messageBoxRef.current as any;
		if (!messageBox) return;
		messageBox.style.height = 'auto'; // Reset height to auto to calculate scroll height
		messageBox.style.height = `${Math.min(messageBox.scrollHeight, 120)}px`; // Set to min of scrollHeight or max-height
	};

	const handleChatClick = (chat: Chat) => {
		setSelectedChat(chat);
	};

	const handleCloseChat = () => {
		setSelectedChat(null);
	};

	const handleSendMessage = () => {
		if (message.trim()) {
			// Logic to send the message
			const new_message: Message = {
				id: crypto.randomUUID(),
				tempId: crypto.randomUUID(),
				sender: loggedInUser.id,
				replyId: '',
				message: message,
				read: false,
				created_at: new Date().toISOString(),
			};
			if (socket?.readyState === WebSocket.OPEN) {

				console.log("Sending message: ", new_message);
				socket.send(JSON.stringify({
					action: "send_message",
					tempId: new_message.tempId,
					chat: selectedChat?.id,
					message: new_message.message
				}));
				const newChat = { ...selectedChat } as Chat;
				newChat.messages.push(new_message);
				const updatedChats = chats?.map(chat => {
					if (chat.id === selectedChat?.id) {
						return newChat;
					}
					return chat;
				});
				console.log(updatedChats);
				setChats(updatedChats);
				console.log(`chats ${chats}`);
				setMessage(''); // Clear the input after sending
			} else {
				Notify('Check internet connection', 'error', 'Error');
			}

		}
	};

	useEffect(() => {

		const ws = new WebSocket('ws://localhost:3002/messenger/' + localStorage.getItem('access_token'));
		setSocket(ws);

		ws.onopen = () => {
			console.log("Connected to WebSocket");
			setConnected(true);
		}

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.action == "get_chats") {
				console.log(data.chats);
				setChats(data.chats);
			} else if (data.action == "message_callback") {
				console.log("-------------callback----------------")
				console.log(chats)
				const newChats = chats?.map(chat => {
					console.log(`chat ------------- ${chat}`);
					if (chat.id === data.chat) {
						console.log("Here")
						const newChat = { ...chat } as Chat;
						newChat.messages = newChat.messages.map(msg => {
							let newMessage = msg;
							
							if (msg.tempId === data.tempId) {
								console.log("Message sent successfully");
								newMessage = {
									...msg,
									id: data.message.id,
									tempId: undefined
								}
								console.log(newMessage);
								return newMessage;
							}
							newChat.last_message = newMessage;
							return msg;
						});
						// setSelectedChat(newChat);
					}
				});
				console.log(newChats);
				setChats(newChats as unknown as Chat[]);
			} else {
				console.log(data);
			}
		};

		ws.onclose = (_event) => {
			
			setTimeout(() => {
				const ws = new WebSocket('ws://localhost:3002/messenger/' + localStorage.getItem('access_token'));
				setSocket(ws);
			}, 500); // Reconnect after 1/2 second
		};

		ws.onerror = (event) => {
			console.warn(event);
		}

		return () => {
			ws.close();
		}
	}, []);

	return (
		<div className="chat-page">
			<div className="chat-list">
				{!chats ? (
					<Loader />
				) : chats.length === 0 ? (
					<div className="no-chats">
						<b>No chats found</b>
					</div>
				) : (
					chats.map(chat => (
					<div key={chat.id} className="chat-item" onClick={() => handleChatClick(chat)}>
						<img src={chat.user.profileImage} alt='pic' className="profile-pic" />
						<div className="chat-info">
							<div className="chat-name">
								{chat.user.first_name} {chat.user.last_name}
							</div>
							<div className="last-message">
								{chat.last_message?.message}
							</div>
						</div>
						{chat.unread > 0 && (
							<div className="unread-count">
								{/* You can customize the unread count display */}
								{chat.unread}
							</div>
						)}
					</div>
				))
				)}
			</div>

			{selectedChat && (
				<div className="chat-popup">
					<div className="chat-header">
						<span className='chat-header-info'>
							<img src={selectedChat.user.profileImage} alt={`${selectedChat.user.first_name} ${selectedChat.user.last_name}`} className="profile-pic" />
							<span className="names">{selectedChat.user.first_name} {selectedChat.user.last_name}</span>
						</span>
						<img src={back} alt="Close Chat" className="close-chat" onClick={handleCloseChat} />
					</div>
					<div className="chat-messages">
						{selectedChat.messages.map((msg) => (
							<div key={msg.id} className={`message ${msg.sender === loggedInUser.id ? 'sent' : 'received'}`}>
								{msg.message}
							</div>
						))}
					</div>

					{/* Message Input Field */}
					<div className="chat-input">
						<textarea
							ref={messageBoxRef}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Type a message"
							className="message-box"
							rows={1} // Automatically expands as text increases
							onInput={adjustHeight}
						/>
						<button onClick={handleSendMessage} className="send-button">
							<img src={sendIcon} alt="Send" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Chat;
