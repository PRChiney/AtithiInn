import React from 'react';
import PropTypes from 'prop-types';

const RoomSelection = ({ rooms = [], selectedRooms = [], setSelectedRooms }) => {
  const handleSelect = (roomId) => {
    setSelectedRooms(prev => {
      const currentSelection = Array.isArray(prev) ? prev : [];
      return currentSelection.includes(roomId)
        ? currentSelection.filter(id => id !== roomId)
        : [...currentSelection, roomId];
    });
  };


  const validRooms = Array.isArray(rooms) 
    ? rooms.filter(room => room?._id && room?.title) 
    : [];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Select Rooms</h3>
      
      {validRooms.length === 0 ? (
        <p className="text-gray-500">No rooms available for this property.</p>
      ) : (
        validRooms.map(room => (
          <div 
            key={room._id}
            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedRooms.includes(room._id) 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300'
            }`}
            onClick={() => handleSelect(room._id)}
            role="button"
            tabIndex="0"
          >
            {/* Room Image - using the 'image' field from your data */}
            {room.image && (
              <img 
                src={room.image} 
                alt={room.title}
                className="w-full h-32 object-cover rounded mb-2"
                onError={(e) => e.target.src = '/fallback-room.jpg'}
              />
            )}
            
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium">{room.title}</h4>
                <p className="text-sm text-gray-600">
                  {room.description || 'No description available'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${room.price || '0'}</p>
                <p className="text-sm">Max {room.maxPeople || '0'} people</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

RoomSelection.propTypes = {
  rooms: PropTypes.array.isRequired,
  selectedRooms: PropTypes.array.isRequired,
  setSelectedRooms: PropTypes.func.isRequired,
};

export default RoomSelection;