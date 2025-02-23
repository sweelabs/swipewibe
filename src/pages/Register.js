// src/pages/Register.js
import React, { useState } from "react";
import { auth, firestore } from "../firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      navigate("/"); // После регистрации перенаправляем на главную страницу
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Регистрация</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          name="firstName"
          placeholder="Имя"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Фамилия"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Электронная почта"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          onChange={handleChange}
          required
        />
        <button type="submit">Зарегистрироваться</button>
        <p>
          Уже зарегистрированы? <a href="/login">Войти</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
