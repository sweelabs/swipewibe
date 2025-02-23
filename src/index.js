import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js'; // добавляем расширение .js
import reportWebVitals from './reportWebVitals.js'; // добавляем расширение .js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
