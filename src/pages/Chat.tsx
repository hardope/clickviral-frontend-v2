import { useState, useRef } from 'react';
import '../styles/Chat.css';
import back from '../assets/images/back.svg';
import sendIcon from '../assets/images/back.svg'; // Add your send button icon

interface Chat {
	id: number;
	firstName: string;
	lastName: string;
	lastMessage: string;
	unreadMessages: number;
	profilePic: string;
}

const Chat = () => {
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
	const [message, setMessage] = useState(''); // State to store the message input
	const messageBoxRef = useRef(null);

	const adjustHeight = () => {
		const messageBox = messageBoxRef.current as any;
		if (!messageBox) return;
		messageBox.style.height = 'auto'; // Reset height to auto to calculate scroll height
		messageBox.style.height = `${Math.min(messageBox.scrollHeight, 120)}px`; // Set to min of scrollHeight or max-height
	};


	const chats: Chat[] = [
		{ id: 1, firstName: 'John', lastName: 'Doe', lastMessage: 'Hey there!', unreadMessages: 2, profilePic: 'https://c-backend.hardope.tech/assets/bfef6e4b-bc5a-4bb1-8e8b-19f48b2f3588.jpeg' },
		// ... other chats
	];

	const handleChatClick = (chat: Chat) => {
		setSelectedChat(chat);
	};

	const handleCloseChat = () => {
		setSelectedChat(null);
	};

	const handleSendMessage = () => {
		if (message.trim()) {
		// Logic to send the message
		setMessage(''); // Clear the input after sending
		}
	};

	return (
		<div className="chat-page">
			<div className="chat-list">
				{chats.map(chat => (
				<div key={chat.id} className="chat-item" onClick={() => handleChatClick(chat)}>
					<img src={chat.profilePic} alt={`${chat.firstName} ${chat.lastName}`} className="profile-pic" />
					<div className="chat-info">
						<div className="chat-name">
							{chat.firstName} {chat.lastName}
						</div>
						<div className="last-message">
							{chat.lastMessage}
						</div>
					</div>
					{chat.unreadMessages > 0 && (
						<div className="unread-count">
							{chat.unreadMessages}
						</div>
					)}
				</div>
			))}
		</div>

		{selectedChat && (
			<div className="chat-popup">
				<div className="chat-header">
					<span>
						<img src={selectedChat.profilePic} alt={`${selectedChat.firstName} ${selectedChat.lastName}`} className="profile-pic" />
						<span id="names">{selectedChat.firstName} {selectedChat.lastName}</span>
					</span>
					<img src={back} alt="Close Chat" className="close-chat" onClick={handleCloseChat} />
				</div>
				<div className="chat-messages">
					<div className="message sent">Hello!</div>
					<div className="message received">Hi, how are you?</div>
					<div className="message sent">I’m good, thanks!</div>
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
