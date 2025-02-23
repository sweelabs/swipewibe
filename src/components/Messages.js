import React, { useState, useEffect } from "react";
import axios from "axios";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Получаем сообщения с сервера
    axios.get("http://localhost:5000/messages")
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Ошибка при загрузке сообщений", error));
  }, []);

  return (
    <div>
      <h2>Голосовые сообщения</h2>
      {messages.map((message, index) => (
        <div key={index}>
          <audio controls src={`http://localhost:5000${message.voiceUrl}`} />
          <p>{message.displayName}</p>
        </div>
      ))}
    </div>
  );
};

export default Messages;
