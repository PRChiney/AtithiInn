// src/components/HotelList.js
import React, { useEffect, useState } from 'react';
import API from '../services/api'; 

const HotelList = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await API.get('/hotels'); 
        setHotels(response.data.data); 
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="hotel-list">
      <h1>Hotel Listings</h1>
      {hotels.length > 0 ? (
        <div className="hotel-grid">
          {hotels.map(hotel => (
            <div key={hotel._id} className="hotel-card">
              <h2>{hotel.title}</h2>
              <p>{hotel.description}</p>
              <p><strong>Location:</strong> {hotel.city}, {hotel.address}</p>
              <p><strong>Price:</strong> ₹{hotel.cheapestPrice}</p>
              <p><strong>Rating:</strong> {hotel.rating} / 5</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hotels available.</p>
      )}
    </div>
  );
};

export default HotelList;
