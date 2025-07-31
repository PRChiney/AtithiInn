import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { listHotelDetails } from '../actions/hotelActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import RoomSelection from '../components/RoomSelection';

function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedRooms, setSelectedRooms] = useState([]);

  const hotelDetails = useSelector(state => state.hotelDetails);
  const { loading, error, hotel } = hotelDetails;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(listHotelDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    console.log('Hotel data received:', hotel);
    if (hotel?.rooms) {
      console.log('Rooms data:', hotel.rooms);
    }
  }, [hotel]);

  const handleReserve = () => {
    if (!userInfo) {
      navigate('/login');
    } else {
   
      if (selectedRooms.length === 0) {
        alert('Please select at least one room');
        return;
      }

      const roomsToBook = hotel.rooms.filter(room =>
        selectedRooms.includes(room._id) && room._id
      );


      const invalidRooms = roomsToBook.filter(room => !room._id);
      if (invalidRooms.length > 0) {
        console.error('Rooms without IDs:', invalidRooms);
        alert('Some selected rooms are invalid');
        return;
      }

      console.log('Passing rooms to booking:', roomsToBook.map(r => r._id));

      navigate(`/booking/${id}`, {
        state: {
          selectedRooms: roomsToBook.map(room => ({
            _id: room._id,
            title: room.title || room.type,
            price: room.price,
            maxPeople: room.maxPeople
          }))
        }
      });
    }
  };

   return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : !hotel ? (
        <Message variant="danger">Hotel not found</Message>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-6 text-blue-900">{hotel.name}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Details + Photos */}
            <div className="lg:col-span-2">
              {/* About Section */}
              <div className="mb-8 p-6 rounded-lg bg-gradient-to-br from-white to-slate-100 border border-gray-200 shadow">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">About this property</h2>
                <p className="text-gray-700 mb-2">{hotel.description}</p>
                <p className="text-gray-700"><b>City:</b> {hotel.city}</p>
                <p className="text-gray-700"><b>Address:</b> {hotel.address}</p>
                <p className="text-gray-700"><b>Rating:</b> {hotel.rating}</p>
                <p className="text-gray-700"><b>Amenities:</b> {hotel.amenities}</p>
                <p className="text-gray-700"><b>Starting Price:</b> ₹{hotel.cheapestPrice}</p>
              </div>

              {/* Photos */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Photos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.photos && hotel.photos.length > 0 ? (
                    hotel.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-lg border border-gray-200 shadow-sm"
                      >
                        <img
                          src={photo}
                          alt={`Hotel ${index + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => (e.target.src = '/fallback-image.jpg')}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No photos available</p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Reserve Box */}
            <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-4 h-fit border border-gray-300">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Reserve</h2>

              <RoomSelection
                rooms={hotel?.rooms || []}
                selectedRooms={selectedRooms}
                setSelectedRooms={setSelectedRooms}
              />

              <button
                onClick={handleReserve}
                disabled={selectedRooms.length === 0}
                className={`mt-4 ${
                  selectedRooms.length === 0
                    ? 'bg-gray-300 text-white px-4 py-2 rounded-full font-semibold w-full shadow-sm text-sm cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition w-full shadow-md text-sm'
                }`}
              >
                Reserve Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PropertyPage;