import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import DatingCard from '../components/DatingCard';
import TopBar from '../components/TopBar';
import './HomePage.css';

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(firestore, 'users'));
      const usersData = snapshot.docs.map(doc => ({
        ...doc.data(),
        photos: doc.data().photos || [] // Защита от undefined
      }));
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  const handleSwipe = (direction) => {
    console.log(`Swiped ${direction} on ${users[currentIndex].name}`);
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="home-page">
      <TopBar />
      
      <div className="cards-container">
        {users.slice(currentIndex, currentIndex + 3).map((user, index) => (
          <DatingCard
            key={user.uid}
            user={user}
            onSwipe={handleSwipe}
            style={{
              zIndex: users.length - index,
              transform: `scale(${1 - index * 0.05})`
            }}
          />
        ))}
      </div>

      {currentIndex >= users.length && (
        <div className="no-more-profiles">
          Пользователей больше нет 😢
        </div>
      )}
    </div>
  );
};

export default HomePage;