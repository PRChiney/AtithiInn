import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getUserDetails } from '../actions/userActions';
import { listMyBookings } from '../actions/bookingActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { FaUserCircle, FaHotel, FaCalendarAlt, FaUsers, FaMoneyBillWave } from 'react-icons/fa';


const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Date error';
  }
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { userInfo } = useSelector(state => state.userLogin);
  const {
    loading: loadingUser,
    error: userError,
    user: userDetails
  } = useSelector(state => state.userDetails);

  const {
    loading: loadingBookings,
    error: errorBookings,
    bookings = []
  } = useSelector(state => state.bookingListMy);


  useEffect(() => {
    console.log('Current bookings:', bookings);
  }, [bookings]);


  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        await dispatch(getUserDetails());
        await dispatch(listMyBookings());
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };

    fetchData();
  }, [dispatch, navigate, userInfo]);


  const isLoading = loadingUser || loadingBookings;


  const displayUser = {
    ...(userDetails || {}),
    ...(userInfo?.user || {}),
    username: userDetails?.username || userInfo?.user?.username,
    email: userDetails?.email || userInfo?.user?.email,
    profilePicture: userDetails?.profilePicture || userInfo?.user?.profilePicture,
  };

  if (isLoading) {
    return <Loader fullPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {userError && <Message variant="danger">{userError}</Message>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[rgb(57,71,117)] text-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[rgb(247,122,63)] shadow-md">
                  {displayUser.profilePicture && displayUser.profilePicture !== 'default-avatar.jpg' ? (
                    <img src={displayUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-full h-full text-white/40" />
                  )}
                </div>
              </div>
              <h2 className="text-2xl font-bold">{displayUser.username || 'User'}</h2>
              <p className="text-sm text-white/80">{displayUser.email}</p>
              {displayUser.isAdmin && (
                <span className="mt-2 px-3 py-1 bg-[rgb(14,98,149)] text-white text-xs font-medium rounded-full">
                  Administrator
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-[rgb(32,37,55)] mb-6 flex items-center">
              <FaHotel className="mr-2 text-[rgb(247,122,63)]" /> My Bookings
            </h2>
            {errorBookings ? (
              <Message variant="danger">{errorBookings}</Message>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You have no bookings yet</p>
                <Link to="/" className="inline-block bg-[rgb(243,93,65)] hover:bg-[rgb(247,122,63)] text-white py-2 px-6 rounded-lg transition">
                  Browse Hotels
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <BookingCard key={booking._id} booking={booking} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const BookingCard = ({ booking }) => {
  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'confirmed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };

 return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h3 className="font-semibold text-lg text-[rgb(32,37,55)]">
            {booking.hotel?.name || 'Unknown Hotel'}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <FaCalendarAlt className="mr-2" />
            Booked on: {formatDate(booking.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="text-[rgb(243,93,65)]" />
          <span className="font-bold text-[rgb(32,37,55)]">
            ${booking.totalPrice || '0'}
          </span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailItem icon={<FaCalendarAlt />} label="Check-in" value={formatDate(booking.checkIn || booking.checkInDate)} />
        <DetailItem icon={<FaCalendarAlt />} label="Check-out" value={formatDate(booking.checkOut || booking.checkOutDate)} />
        <DetailItem icon={<div className={`w-3 h-3 rounded-full ${getStatusColor(booking.status)}`} />} label="Status" value={booking.status || 'Pending'} capitalize />
        <DetailItem icon={<FaUsers />} label="Guests" value={booking.guests || 'Not specified'} />
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100">
        <Link to={`/booking-details/${booking._id}`} className="text-[rgb(14,98,149)] hover:text-[rgb(247,122,63)] font-medium text-sm inline-flex items-center">
          View Booking Details →
        </Link>
      </div>
    </div>
  );
};



const DetailItem = ({ icon, label, value, capitalize = false }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-gray-400">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`font-medium ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </p>
    </div>
  </div>
);

export default ProfilePage;