// pages/ChatRoom.js
import React, { useState, useEffect, useRef } from "react";
import { firestore, auth } from "../firebase.js";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import VoiceRecorder from "../components/VoiceRecorder";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(firestore, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    await addDoc(collection(firestore, "messages"), {
      text,
      createdAt: serverTimestamp(),
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      type: "text",
    });
    setText("");
  };

  // Автопрокрутка вниз
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Чат</h2>
      <div style={{ marginBottom: "20px", maxHeight: "60vh", overflowY: "auto" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: "10px" }}>
            <strong>{msg.displayName}:</strong>{" "}
            {msg.type === "text" ? (
              <span>{msg.text}</span>
            ) : msg.type === "voice" ? (
              <audio controls src={msg.voiceUrl}>
                Ваш браузер не поддерживает аудио
              </audio>
            ) : null}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ marginBottom: "20px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение..."
          style={{ width: "80%", padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Отправить
        </button>
      </form>
      <VoiceRecorder />
    </div>
  );
};

export default ChatRoom;
