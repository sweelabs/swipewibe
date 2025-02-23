import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import TopBar from '../components/TopBar';
import './UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(firestore, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setUserData(docSnap.data());
    };
    fetchData();
  }, [userId]);

  if (!userData) return <div>Загрузка...</div>;

  return (
    <div className="user-profile">
      <TopBar />
      <div className="profile-content">
        <img src={userData.photoUrl} alt="Profile" />
        <h2>{userData.name}</h2>
        <p>Возраст: {userData.age}</p>
        <p>Город: {userData.city}</p>
        <p>Интересы: {userData.interests}</p>
      </div>
    </div>
  );
};

export default UserProfile;