import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import './star-rating.css';

const StarRating = ({rating, setRating}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating-container">
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(rating)}
          >
            {star <= (hover || rating) ? (
              <StarIcon sx={{ color: '#FFDF88', fontSize: 40 }} />
            ) : (
              <StarBorderIcon sx={{ color: '#DDDDDD', fontSize: 40 }} />
            )}
          </div>
        ))}
      </div>
      <h3>Selected rating: {rating}</h3>
    </div>
  );
};

export default StarRating;