import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function HotelCard({ hotel }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/property/${hotel._id}`}>
        <img 
          src={hotel.photos[0] || 'https://via.placeholder.com/400x300'} 
          alt={hotel.name} 
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg">{hotel.name}</h3>
          <p className="text-gray-600">{hotel.city}</p>
          <p className="mt-2 font-semibold">${hotel.cheapestPrice} / night</p>
          <div className="flex items-center mt-2">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${index < hotel.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm">{hotel.type}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

HotelCard.propTypes = {
  hotel: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    photos: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    cheapestPrice: PropTypes.number.isRequired,
    rating: PropTypes.number,
    type: PropTypes.string,
  }).isRequired,
};

export default HotelCard;