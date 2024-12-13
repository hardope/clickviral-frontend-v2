import { useState, useRef, useEffect } from 'react';
import '../styles/Chat.css';
import backIcon from '../assets/images/back.svg';
import sendIcon from '../assets/images/back.svg';
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
    attachments?: string[];
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
    const [selectedChat, setSelectedChat] = useState<Chat | any>(null);
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState<Chat[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connected, setConnected] = useState(false);
    const loggedInUser = JSON.parse(localStorage.getItem('user') as string) as User;

    const messageBoxRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        if (messageInputRef.current) {
            messageInputRef.current.style.height = 'auto';
            messageInputRef.current.style.height = `${Math.min(messageInputRef.current.scrollHeight, 120)}px`;
        }
    };

    const handleChatClick = (chat: Chat) => {
        setSelectedChat(chat);
        setTimeout(() => {
            if (messageBoxRef.current) {
                messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
            }
        }, 100);
    };

    const handleCloseChat = () => {
        setSelectedChat(null);
    };

    const handleSendMessage = () => {
        if (message.trim() && socket?.readyState === WebSocket.OPEN) {
            const tempId = crypto.randomUUID();
            const newMessage: Message = {
                id: tempId,
                tempId,
                sender: loggedInUser.id,
                replyId: '',
                message,
                read: false,
                created_at: new Date().toISOString(),
            };

            socket.send(
                JSON.stringify({
                    action: 'send_message',
                    tempId: newMessage.tempId,
                    chat: selectedChat?.id,
                    message: newMessage.message,
                })
            );

            setChats((prevChats) =>
                prevChats?.map((chat) =>
                    chat.id === selectedChat?.id
                        ? { ...chat, messages: [...chat.messages, newMessage], last_message: newMessage }
                        : chat
                ) || []
            );

			setSelectedChat((prevChat: any) => {
				if (prevChat) {
					return { ...prevChat, messages: [...prevChat.messages, newMessage], last_message: newMessage };
				}
			}
			);

            setMessage('');
            adjustHeight();

            setTimeout(() => {
                if (messageBoxRef.current) {
                    messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
                }
            }, 100);
        } else {
            Notify('Check your internet connection.', 'error', 'Error');
        }
    };

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:3002/messenger/${localStorage.getItem('access_token')}`);
        setSocket(ws);

        ws.onopen = () => {

            setConnected(true);
        };

        ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			
			switch (data.action) {
				case 'get_chats':
					setChats(data.chats);
					console.log(data.chats);	
					console.log('Chats:', chats);
					break;
				case 'message_callback':
					console.log('Updating chat:', data.chat);
					setChats(prevChats => {
						return prevChats.map(chat => {
							if (chat.id === data.chat) {
								const updatedChat = {...chat};
								updatedChat.messages = updatedChat.messages.map(msg => 
									msg.tempId === data.tempId ? {...msg, id: data.message.id, tempId: undefined } : msg
								);
								updatedChat.last_message = updatedChat.messages[updatedChat.messages.length - 1];
								console.log('Updated chat:', updatedChat);
								return updatedChat;
							}
							return chat;
						});
					});
					break;
				case "receive_message":
					const newMessage: Message = {
						id: data.id,
						sender: data.sender,
						replyId: '',
						message: data.message,
						read: false,
						created_at: data.created_at,
						attachments: data.attachments || [],
					};
					console.log(newMessage);
					console.log(selectedChat);
					console.log(chats);
					setChats((prevChats) =>
						prevChats?.map((chat) =>
							chat.id === data.chat
								? {
									...chat,
									messages: [...chat.messages, newMessage],
									last_message: newMessage
								}
								: chat
						) || []
					);
					
					if (selectedChat?.id === data.chat) {
						setSelectedChat((prevChat: any) =>
							prevChat
								? {
									...prevChat,
									messages: [...prevChat.messages, newMessage],
									last_message: newMessage
								}
								: prevChat
						);
						setTimeout(() => {
							if (messageBoxRef.current) {
								messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
							}
						}, 100);
					}
					break;
			}
		};
					
		

        ws.onclose = () => {
            setTimeout(() => {
                const newWs = new WebSocket(
                    `ws://localhost:3002/messenger/${localStorage.getItem('access_token')}`
                );
                setSocket(newWs);
            }, 500);
        };

        ws.onerror = (event) => {
            console.error('WebSocket error:', event);
        };

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    }, [selectedChat]);

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
                    chats.map((chat) => (
                        <div
                            key={chat.id}
                            className="chat-item"
                            onClick={() => handleChatClick(chat)}
                        >
                            <img
                                src={chat.user.profileImage}
                                alt="Profile"
                                className="profile-pic"
                            />
                            <div className="chat-info">
                                <div className="chat-name">
                                    {chat.user.first_name} {chat.user.last_name}
                                </div>
                                <div className="last-message">
                                    {chat.last_message?.message}
                                </div>
                            </div>
                            {chat.unread > 0 && <div className="unread-count">{chat.unread}</div>}
                        </div>
                    ))
                )}
            </div>

            {selectedChat && (
                <div className="chat-popup">
                    <div className="chat-header">
                        <span className="chat-header-info">
                            <img
                                src={selectedChat.user.profileImage}
                                alt="Profile"
                                className="profile-pic"
                            />
                            <span className="names">
                                {selectedChat.user.first_name} {selectedChat.user.last_name}
                            </span>
                        </span>
                        <img
                            src={backIcon}
                            alt="Close Chat"
                            className="close-chat"
                            onClick={handleCloseChat}
                        />
                    </div>
                    <div className="chat-messages" ref={messageBoxRef}>
                        {selectedChat.messages.map((msg: any) => (
                            <div
                                key={msg.id}
                                className={`message ${
                                    msg.sender === loggedInUser.id ? 'sent' : 'received'
                                }`}
                            >
                                {msg.message}
                            </div>
                        ))}
                    </div>

                    <div className="chat-input">
                        <textarea
                            ref={messageInputRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message"
                            className="message-box"
                            rows={1}
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
