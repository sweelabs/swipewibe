import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { FiHeart, FiX } from 'react-icons/fi';
import './DatingCard.css';

const DatingCard = ({ user, onSwipe }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipe('left'),
    onSwipedRight: () => onSwipe('right'),
    trackMouse: true
  });

  // Добавляем защиту от отсутствия photos
  const photos = user.photos || [];

  return (
    <div {...handlers} className="dating-card">
      <div className="photo-stack">
        {photos.map((photo, index) => (
          <div 
            key={index}
            className="photo-card"
            style={{ backgroundImage: `url(${photo})` }}
          />
        ))}
      </div>
      
      <div className="profile-info">
        <h2>{user.name}, {user.age}</h2>
        <p className="city">{user.city}</p>
        <div className="interests">
          {(user.interests || '').split(',').map((interest, i) => (
            <span key={i} className="interest-tag">#{interest.trim()}</span>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button className="dislike-btn" onClick={() => onSwipe('left')}>
          <FiX size={24} />
        </button>
        <button className="like-btn" onClick={() => onSwipe('right')}>
          <FiHeart size={24} />
        </button>
      </div>
    </div>
  );
};

export default DatingCard;