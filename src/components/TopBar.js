import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { signOut } from "firebase/auth";
import "./TopBar.css";

const TopBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Ошибка выхода:", err);
    }
  };

  return (
    <div className="topbar">
      <Link to="/" className="logo">
        <span className="gradient-text">Voice</span>
        <span className="pulse">♥</span>
        <span className="gradient-text">Dating</span>
      </Link>
      <div className="nav-links">
        <Link to="/chats" className="nav-item hover-effect">
          <i className="fas fa-comments"></i>
          <span>Чаты</span>
        </Link>
        <Link to="/profile" className="nav-item hover-effect">
          <i className="fas fa-user-circle"></i>
          <span>Профиль</span>
        </Link>
        <button onClick={handleLogout} className="logout-btn glow">
          <i className="fas fa-sign-out-alt"></i>
          Выход
        </button>
      </div>
    </div>
  );
};

export default TopBar;