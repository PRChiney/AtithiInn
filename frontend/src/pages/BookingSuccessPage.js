// src/pages/BookingSuccessPage.js
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBookingDetails } from '../actions/bookingActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
    FaHotel,
    FaCalendarAlt,
    FaUsers,
    FaMoneyBillWave,
    FaCheckCircle,
    FaTimesCircle,
    FaClock
} from 'react-icons/fa';
import { cancelBooking } from '../actions/bookingActions';

const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Date error';
    }
};

const getStatusIcon = (status) => {
    switch ((status || '').toLowerCase()) {
        case 'confirmed':
            return <FaCheckCircle className="text-green-500" />;
        case 'cancelled':
            return <FaTimesCircle className="text-red-500" />;
        default:
            return <FaClock className="text-yellow-500" />;
    }
};

const BookingSuccessPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, booking } = useSelector((state) => state.bookingDetails);
    const { userInfo } = useSelector((state) => state.userLogin);
    const { loading: loadingCancel, error: errorCancel } = useSelector(
        (state) => state.bookingDetails
    );

    const cancelHandler = () => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            dispatch(cancelBooking(id));
        }
    };

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            dispatch(getBookingDetails(id));
        }
    }, [dispatch, id, navigate, userInfo]);

   
    useEffect(() => {
        if (booking) {
            console.group("Booking Details Debug");
            console.log("Full Booking Object:", booking);
            console.log("Guests Count:", booking?.guests);
            console.log("Payment Method Available:", booking.paymentMethod !== undefined);
            console.log("Payment Info Available:", booking.paymentInfo !== undefined);
            if (booking.paymentInfo) {
                console.log("Payment Info Details:", {
                    method: booking.paymentInfo.method,
                    status: booking.paymentInfo.status,
                    id: booking.paymentInfo.id
                });
            }
            console.groupEnd();
        }
    }, [booking]);

    if (loading) return <Loader fullPage />;
    if (error) return <Message variant="danger">{error}</Message>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Booking Details</h1>
                            <p className="text-blue-100">Booking ID: {booking?._id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusIcon(booking?.status)}
                            <span className="font-medium capitalize">
                                {booking?.status || 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    {/* Hotel Info */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FaHotel className="text-blue-500" />
                            Hotel Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Hotel Name</p>
                                <p className="font-medium">{booking?.hotel?.name || 'Unknown Hotel'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Room Type</p>
                                <p className="font-medium">{booking?.room?.title || 'Standard Room'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Max Capacity</p>
                                <p className="font-medium">{booking?.room?.maxPeople || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Dates */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-500" />
                            Booking Dates
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Check-In</p>
                                <p className="font-medium">{formatDate(booking?.checkIn || booking?.checkInDate)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Check-Out</p>
                                <p className="font-medium">{formatDate(booking?.checkOut || booking?.checkOutDate)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Booked On</p>
                                <p className="font-medium">{formatDate(booking?.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Guest and Payment Info */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FaUsers className="text-blue-500" />
                            Guest & Payment Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Number of Guests</p>
                                <p className="font-medium">
                                    {booking?.guests ? `${booking.guests} guest${booking.guests !== 1 ? 's' : ''}` : '1 guest'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Payment Method</p>
                                <p className="font-medium">
                                    {booking?.paymentMethod || 
                                     booking?.paymentInfo?.method ||
                                     (booking?.paymentInfo?.id ? 'Online Payment' : 'Not specified')}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Payment Status</p>
                                <p className="font-medium capitalize">
                                    {booking?.paymentInfo?.status || 'pending'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FaMoneyBillWave className="text-blue-500" />
                            Price Summary
                        </h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-gray-600">Room Price (per night)</p>
                                <p className="font-medium">${booking?.room?.price || booking?.totalPrice}</p>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-gray-600">Duration</p>
                                <p className="font-medium">
                                    {Math.ceil(
                                        (new Date(booking?.checkOut || booking?.checkOutDate) -
                                            new Date(booking?.checkIn || booking?.checkInDate)) /
                                        (1000 * 60 * 60 * 24)
                                    )} nights
                                </p>
                            </div>
                            <div className="border-t border-gray-200 my-3"></div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-800 font-semibold">Total Amount</p>
                                <p className="text-blue-600 font-bold text-lg">
                                    ${booking?.totalPrice}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/profile')}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                        >
                            Back to My Bookings
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
                        >
                            Back to Home
                        </button>
                        {booking?.status !== 'cancelled' && (
                            <button
                                onClick={cancelHandler}
                                disabled={loadingCancel}
                                className={`px-6 py-3 rounded-lg transition ${loadingCancel
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                    }`}
                            >
                                {loadingCancel ? 'Cancelling...' : 'Cancel Booking'}
                            </button>
                        )}
                    </div>
                    {errorCancel && (
                        <div className="mb-4">
                            <Message variant="danger">{errorCancel}</Message>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;