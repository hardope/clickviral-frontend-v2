import { useState, useRef, useEffect } from 'react';
import '../styles/Chat.css';
import back from '../assets/images/back.svg';
import sendIcon from '../assets/images/back.svg'; // Add your send button icon
// import Notify from '../utils/Notify';
import Loader from '../components/Loader';

interface User {
	id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	profileImage: string;
}

interface LastMessage {
	id: string;
	sender: string;
	recipient: string;
	message: string;
	read: boolean;
	created_at: string;
}

interface Chat {
	user: User;
	lastMessage: LastMessage;
	unread: number;
}

const Chat = () => {
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
	const [message, setMessage] = useState(''); // State to store the message input
	const [chats, setChats] = useState<Chat[] | null>(null); // State to store the chat list
	const messageBoxRef = useRef(null);
	const ws = useRef<WebSocket | null>(null);

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
			console.log(message);
			setMessage(''); // Clear the input after sending
		}
	};

	useEffect(() => {

		ws.current = new WebSocket('wss://c-backend.hardope.tech/messenger/' + localStorage.getItem('access_token'));

		ws.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.action == "get_chats") {
				console.log(data.chats);
				setChats(data.chats);
			}

		};

		ws.current.onclose = () => {
			
			setTimeout(() => {
				ws.current = new WebSocket('wss://c-backend.hardope.tech/messenger/' + localStorage.getItem('access_token'));
			}, 1000); // Reconnect after 1 second
		};
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
					chats.map((chat, index) => (
					<div key={index} className="chat-item" onClick={() => handleChatClick(chat)}>
						<img src={chat.user.profileImage} alt={`${chat.user.first_name} ${chat.user.last_name}`} className="profile-pic" />
						<div className="chat-info">
							<div className="chat-name">
								{chat.user.first_name} {chat.user.last_name}
							</div>
							<div className="last-message">
								{chat.lastMessage.message}
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
						<div className="message sent">Hello!</div>
						<div className="message received">Hi, how are you?</div>
						<div className="message sent">I’m good, thanks!</div>
						{/* Add more messages as needed */}
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
