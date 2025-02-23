import React, { useState, useEffect, useRef } from 'react';
import { firestore, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import TopBar from '../components/TopBar';
import './ChatPage.css';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(firestore, 'messages'),
      orderBy('timestamp', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      await addDoc(collection(firestore, 'messages'), {
        text: input.trim(),
        sender: auth.currentUser.uid,
        timestamp: new Date(),
        displayName: auth.currentUser.displayName
      });
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-page">
      <TopBar />
      <div className="chat-container">
        <div className="chat-header neon-border">
          <h2><i className="fas fa-comments"></i> Чат</h2>
        </div>
        <div className="chat-messages">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`message ${msg.sender === auth.currentUser?.uid ? 'sent' : 'received'}`}
            >
              <div className="message-bubble glow-on-hover">
                <div className="message-author">
                  {msg.displayName || 'Аноним'}
                </div>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-container glassmorphism">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите сообщение..."
            rows="1"
            className="message-input"
          />
          <button onClick={handleSend} className="send-button pulse-on-hover">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;