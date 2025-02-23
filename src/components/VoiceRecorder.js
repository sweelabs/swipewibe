import React, { useState } from 'react';
import axios from 'axios';

const VoiceRecorder = () => {
  const [audioFile, setAudioFile] = useState(null);

  // Обработчик выбора файла
  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  // Отправка файла на сервер
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audioFile) {
      alert('Пожалуйста, выберите аудиофайл');
      return;
    }

    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Сообщение успешно отправлено');
    } catch (error) {
      console.error('Ошибка при отправке сообщения', error);
      alert('Произошла ошибка при отправке сообщения');
    }
  };

  return (
    <div>
      <h2>Загрузить голосовое сообщение</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default VoiceRecorder;
