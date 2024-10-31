import { useState } from 'react';
import '../styles/Chat.css';
import back from '../assets/images/back.svg'

interface Chat {
  id: number;
  firstName: string;
  lastName: string;
  lastMessage: string;
  unreadMessages: number;
  profilePic: string; // New field for profile picture
}

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  // Static chat data with profile pictures
  const chats: Chat[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', lastMessage: 'Hey there!', unreadMessages: 2, profilePic: 'https://c-backend.hardope.tech/assets/bfef6e4b-bc5a-4bb1-8e8b-19f48b2f3588.jpeg' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', lastMessage: 'What’s up?', unreadMessages: 0, profilePic: 'https://c-backend.hardope.tech/assets/bfef6e4b-bc5a-4bb1-8e8b-19f48b2f3588.jpeg' },
    { id: 3, firstName: 'Mike', lastName: 'Johnson', lastMessage: 'Let’s meet tomorrow.', unreadMessages: 5, profilePic: 'https://c-backend.hardope.tech/assets/bfef6e4b-bc5a-4bb1-8e8b-19f48b2f3588.jpeg' },
    { id: 4, firstName: 'Emily', lastName: 'Brown', lastMessage: 'Got it, thanks!', unreadMessages: 1, profilePic: 'https://c-backend.hardope.tech/assets/bfef6e4b-bc5a-4bb1-8e8b-19f48b2f3588.jpeg' },
    // Add more chat items as needed
  ];

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
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

      {/* Chat Messages Popup */}
      {selectedChat && (
        <div className="chat-popup">
          <div className="chat-header">
            <span>
              <img src={selectedChat.profilePic} alt={`${selectedChat.firstName} ${selectedChat.lastName}`} className="profile-pic" />
              <span id='names'>{selectedChat.firstName} {selectedChat.lastName}</span>
            </span>
              <img src={back} alt="Close Chat" className="close-chat" onClick={handleCloseChat} />
          </div>
          <div className="chat-messages">
            {/* Static messages - can be replaced with real chat data */}
            <div className="message sent">Hello!</div>
            <div className="message received">Hi, how are you?</div>
            <div className="message sent">I’m good, thanks!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
