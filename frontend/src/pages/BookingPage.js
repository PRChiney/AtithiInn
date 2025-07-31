import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createBooking } from '../actions/bookingActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

function BookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [localError, setLocalError] = useState(null);
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [guests, setGuests] = useState(1); 
  const { selectedRooms = [] } = location.state || {};

  const { userInfo } = useSelector((state) => state.userLogin);
  const { loading, error: bookingError, success, booking } = useSelector(
    (state) => state.bookingCreate
  );

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (success) {
      navigate('/profile');
    }
  }, [success, navigate]);

  useEffect(() => {
    console.log('Location state received:', location.state);
    console.log('Selected rooms from location:', selectedRooms);
  }, [location.state, selectedRooms]);

  const handleGuestChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setGuests(value);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!selectedRooms || selectedRooms.length === 0) {
      setLocalError('Please select at least one room');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('userInfo'));
    if (!currentUser) {
      setLocalError('Session expired. Please login again.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    } 

    if (!userInfo || !userInfo.user || !userInfo.user._id) {
      setLocalError('User information is missing. Please login again.');
      return;
    }

    const roomIds = selectedRooms.map(room => {
      if (!room?._id) {
        console.error('Invalid room object:', room);
        return null;
      }
      return room._id.toString();
    }).filter(id => id !== null);

    if (roomIds.length === 0) {
      setLocalError('Selected rooms have invalid IDs');
      return;
    }

    const bookingData = {
      hotel: id,
      paymentMethod,
      checkInDate: new Date(checkInDate).toISOString(),
      checkOutDate: new Date(checkOutDate).toISOString(),
      rooms: roomIds,
      user: userInfo.user._id,
      guests: parseInt(guests) || 1 
    };

    console.log('Final booking payload:', bookingData);
    dispatch(createBooking(bookingData));
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Complete Your Booking
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Booking Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Booking Details</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Check-In Date
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Check-Out Date
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Guests
              </label>
              <input
                type="text"
                min="1"
                placeholder="Guests"
                value={guests}
                onChange={handleGuestChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition w-full shadow-md text-sm"
            >
              Confirm Booking
            </button>
          </form>
        </div>

        {/* Right: Booking Summary */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Booking Summary</h2>

          {loading && <Loader />}
          {localError && <Message variant="danger">{localError}</Message>}
          {bookingError && <Message variant="danger">{bookingError}</Message>}

          {success && booking && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Booking Confirmed!</h3>
              <p><strong>Booking ID:</strong> {booking._id}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
              <p><strong>Payment:</strong> {booking.paymentMethod}</p>
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {selectedRooms && selectedRooms.length > 0 ? (
              selectedRooms.map((room, index) => (
                <div key={index} className="py-4">
                  <h3 className="text-lg font-medium">{room.title}</h3>
                  <p className="text-sm text-gray-600">Price: ₹{room.price}</p>
                  <p className="text-sm text-gray-600">Max People: {room.maxPeople}</p>
                  <p className="text-sm text-gray-600">Room ID: {room._id}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No rooms selected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;