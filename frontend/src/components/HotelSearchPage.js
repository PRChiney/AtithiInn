import React, { useState } from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const HotelSearchPage = ({
  destination,
  setDestination,
  dateRange = { startDate: new Date(), endDate: new Date(), key: 'selection' },
  setDateRange,
  guests,
  setGuests,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handleSearch,
}) => {
  const [openCheckIn, setOpenCheckIn] = useState(false);
  const [openCheckOut, setOpenCheckOut] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleGuestChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setGuests(value);
    }
  };

  const handleDateChange = (date, type) => {
    if (type === 'start') {
      if (date > dateRange.endDate) {
        setDateRange({ ...dateRange, startDate: date, endDate: date });
      } else {
        setDateRange({ ...dateRange, startDate: date });
      }
      setOpenCheckIn(false);
    } else {
      if (date < dateRange.startDate) {
        setDateRange({ ...dateRange, endDate: date, startDate: date });
      } else {
        setDateRange({ ...dateRange, endDate: date });
      }
      setOpenCheckOut(false);
    }
  };

  return (
    <div className="relative w-full h-[500px] md:h-[400px] mt-16 md:mt-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('https://png.pngtree.com/background/20250107/original/pngtree-exotic-coastline-with-lush-palm-trees-and-serene-ocean-view-picture-image_16034469.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Text Overlay */}
      <div className="absolute top-1/4 left-0 right-0 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          𝒸𝒽ℴℴ𝓈ℯ 𝓎ℴ�𝓊𝓇 𝒹ℯ𝓈𝓉𝒾𝓃𝒶𝓉𝒾ℴ𝓃
        </h1>
      </div>
      
      {/* Search Bar Container - Positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white shadow-lg rounded-2xl md:rounded-full flex flex-col md:flex-row items-center justify-between px-5 md:px-7 py-4 md:py-2 gap-4 p-2">
          {/* Destination */}
          <div className="w-full md:w-auto md:flex-1 min-w-0 border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0 md:pr-4">
            <label htmlFor="destination" className="block text-s font-semibold text-gray-500 mb-1">Where</label>
            <input
              id="destination"
              type="text"
              placeholder="Search destinations"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-sm md:text-base font-medium focus:outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Check-In */}
          <div className="w-full md:w-auto md:flex-1 min-w-0 border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0 md:pr-4 relative">
            <label htmlFor="check-in" className="block text-s font-semibold text-gray-500 mb-1">Check-In</label>
            <input
              id="check-in"
              type="text"
              readOnly
              value={formatDate(dateRange.startDate)}
              onClick={() => {
                setOpenCheckIn(!openCheckIn);
                setOpenCheckOut(false);
              }}
              className="w-full bg-transparent text-sm md:text-base font-medium cursor-pointer focus:outline-none"
            />
            {openCheckIn && (
              <div className="absolute top-14 md:top-12 left-0 z-50 shadow-xl bg-white rounded-lg">
                <Calendar
                  date={dateRange.startDate}
                  onChange={(date) => handleDateChange(date, 'start')}
                  minDate={new Date()}
                />
              </div>
            )}
          </div>

          {/* Check-Out */}
          <div className="w-full md:w-auto md:flex-1 min-w-0 border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0 md:pr-4 relative">
            <label htmlFor="check-out" className="block text-s font-semibold text-gray-500 mb-1">Check-Out</label>
            <input
              id="check-out"
              type="text"
              readOnly
              value={formatDate(dateRange.endDate)}
              onClick={() => {
                setOpenCheckOut(!openCheckOut);
                setOpenCheckIn(false);
              }}
              className="w-full bg-transparent text-sm md:text-base font-medium cursor-pointer focus:outline-none"
            />
            {openCheckOut && (
              <div className="absolute top-14 md:top-12 left-0 z-50 shadow-xl bg-white rounded-lg">
                <Calendar
                  date={dateRange.endDate}
                  onChange={(date) => handleDateChange(date, 'end')}
                  minDate={dateRange.startDate || new Date()}
                />
              </div>
            )}
          </div>

          {/* Guests */}
          <div className="w-full md:w-auto md:flex-1 min-w-0 border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0 md:pr-4">
            <label htmlFor="guests" className="block text-s font-semibold text-gray-500 mb-1">Guests</label>
            <input
              id="guests"
              type="text"
              min="1"
              placeholder="Number"
              value={guests}
              onChange={handleGuestChange}
              className="w-full bg-transparent text-sm md:text-base font-medium focus:outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Price Range */}
          <div className="w-full md:w-auto md:flex-1 min-w-0">
            <label className="block text-s font-semibold text-gray-500 mb-1">Price Range</label>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="w-full sm:w-1/2 bg-transparent text-sm md:text-base font-medium focus:outline-none placeholder:text-gray-400"
              />
              <span className="hidden sm:inline text-gray-400">-</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="w-full sm:w-1/2 bg-transparent text-sm md:text-base font-medium focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto mt-2 md:mt-0">
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-3 px-6 rounded-full transition duration-300 w-full md:w-auto flex items-center justify-center"
              aria-label="Search"
            >
              <span className="md:hidden mr-2">Search</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSearchPage;