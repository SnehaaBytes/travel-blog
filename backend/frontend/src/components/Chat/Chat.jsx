import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../services/AuthContext';
import { chatService } from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { formatDate } from '../../utils/helpers';
import config from '../../config/config';
import './Chat.css';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatBoxRef = useRef(null);

  const username = user ? user.username : 'Guest';

  const fetchMessages = useCallback(async () => {
    if (!config.features.enableChat) {
      setError('Chat functionality is currently disabled.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await chatService.getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again later.');
      // Fallback to local storage
      loadMessagesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessagesFromLocalStorage = () => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    setMessages(storedMessages);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const messageData = {
      username,
      content: newMessage
    };

    // Optimistically add message to UI
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');

    try {
      // Send to server
      await chatService.sendMessage(messageData);
    } catch (err) {
      console.error('Error sending message:', err);
      // Save to localStorage as fallback
      saveMessageToLocalStorage(messageData);
    }
  };

  const saveMessageToLocalStorage = (message) => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    storedMessages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(storedMessages));
  };

  const handleDeleteMessage = (index) => {
    setMessages(prev => prev.filter((_, i) => i !== index));
    // In a real app, you would also send a DELETE request to the server
  };

  return (
    <div className="chat-page-container">
      <div className="chat-background">
        <div className="chat-container">
          {loading ? (
            <Loading message="Loading messages..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchMessages} />
          ) : (
            <div className="chat-box" ref={chatBoxRef}>
              {messages.length === 0 ? (
                <div className="no-messages">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.username === username ? 'my-message' : ''}`}
                  >
                    <span className="message-content">
                      <strong>{message.username}:</strong> {message.content}
                      <small className="message-time">
                        {message.createdAt ? formatDate(message.createdAt, { hour: '2-digit', minute: '2-digit' }) : ''}
                      </small>
                    </span>
                    {message.username === username && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteMessage(index)}
                        aria-label="Delete message"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
<form className="chat-input flex items-center gap-2" onSubmit={handleSendMessage}>
<input
  type="text"
  value={newMessage}
  onChange={(e) => setNewMessage(e.target.value)}
  placeholder="Type a message..."
  disabled={!user}
  className="flex-grow px-6 py-4 rounded-md border border-gray-300 w-[90%] text-lg"
 />
  <button
    type="submit"
    disabled={!user}
    className="px-2 py-1 text-xs bg-blue-400 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
  >
    Send
  </button>
</form>
          {!user && (
            <div className="login-prompt">
              Please <a href="/login">login</a> to join the conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
