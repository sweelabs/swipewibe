// src/pages/AdminFiles.js
import React, { useState, useEffect } from 'react';

const AdminFiles = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  // Функция для загрузки списка файлов
  const fetchFiles = async () => {
    try {
      const res = await fetch('/files');
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      setError('Ошибка загрузки файлов');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Функция для удаления файла по ID
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/files/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFiles(files.filter(file => file._id !== id));
      } else {
        const data = await res.json();
        alert('Ошибка удаления: ' + data.error);
      }
    } catch (err) {
      alert('Ошибка удаления файла');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Админ-панель: Загруженные файлы</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Оригинальное имя</th>
            <th>Имя файла</th>
            <th>MIME</th>
            <th>Размер (Б)</th>
            <th>Дата загрузки</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file._id}>
              <td>{file.originalName}</td>
              <td>{file.filename}</td>
              <td>{file.mimeType}</td>
              <td>{file.size}</td>
              <td>{new Date(file.uploadDate).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDelete(file._id)}>Удалить</button>
                {/* При желании можно добавить кнопку "Редактировать", которая откроет форму для изменения метаданных */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFiles;
