import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import TopBar from '../components/TopBar';
import './ProfilePage.css';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    gender: '',
    interests: '',
    photos: []
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setFormData(docSnap.data());
      }
    };
    loadProfile();
  }, []);

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/photos/${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, url]
      }));
    } catch (error) {
      console.error('Upload error:', error);
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(firestore, 'users', auth.currentUser.uid), {
        ...formData,
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        timestamp: new Date()
      }, { merge: true });
      alert('Профиль сохранен!');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="profile-page">
      <TopBar />
      <div className="profile-container">
        <h2>Редактирование профиля</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group">
              <label>Имя:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Возраст:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                min="18"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label>Город:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Пол:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                required
              >
                <option value="">Выберите</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>

            <div className="form-group">
              <label>Интересы (через запятую):</label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
                placeholder="спорт, музыка, кино"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Фотографии</h3>
            <div className="photo-grid">
              {formData.photos.map((photo, index) => (
                <div 
                  key={index}
                  className="photo-preview"
                  style={{ backgroundImage: `url(${photo})` }}
                />
              ))}
              <label className={`upload-box ${uploading ? 'disabled' : ''}`}>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  accept="image/*"
                  disabled={uploading}
                />
                {uploading ? 'Загрузка...' : '+'}
              </label>
            </div>
          </div>

          <button type="submit" className="save-button">
            Сохранить изменения
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;