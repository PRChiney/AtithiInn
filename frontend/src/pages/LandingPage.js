import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listHotels } from '../actions/hotelActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import HotelSearchPage from '../components/HotelSearchPage';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const dispatch = useDispatch();

  const { loading, error, hotels = [] } = useSelector((state) => state.hotelList || {});

  const [destination, setDestination] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [guests, setGuests] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isDefaultHotels, setIsDefaultHotels] = useState(true);

  useEffect(() => {
    if (!destination.trim()) {
      dispatch(
        listHotels({
          city: '',
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          guests,
          minPrice,
          maxPrice,
        })
      );
      setIsDefaultHotels(true);
    }
  }, [
    dispatch,
    destination,
    dateRange.startDate,
    dateRange.endDate,
    guests,
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    if (destination.trim()) {
      setIsDefaultHotels(false);
      dispatch(
        listHotels({
          city: destination,
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          guests,
          minPrice,
          maxPrice,
        })
      );
    }
  }, [dispatch, destination, dateRange, guests, minPrice, maxPrice]);

  const [searchError, setSearchError] = useState('');

  const handleSearch = () => {
    if (!destination.trim()) {
      setSearchError('Please enter a destination before searching.');
      return;
    }
    setSearchError('');
    setIsDefaultHotels(false);
    dispatch(
      listHotels({
        city: destination,
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        guests,
        minPrice,
        maxPrice,
      })
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Section */}
      <div className="mb-10">
        <HotelSearchPage
          destination={destination}
          setDestination={setDestination}
          dateRange={dateRange}
          setDateRange={setDateRange}
          guests={guests}
          setGuests={setGuests}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          handleSearch={handleSearch}
        />
        {searchError && (
          <p className="text-red-500 mt-2 text-center">{searchError}</p>
        )}
      </div>

      {/* Results Section */}
      <div>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {typeof error === 'object' ? error.message : error}
          </Message>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Top Recommended Hotels
            </h2>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.isArray(hotels) && hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <div key={hotel._id} className="h-full transform transition duration-300 hover:scale-[1.02]">
                    <Link
                      to={`/hotels/${hotel._id}`}
                      className="block h-full"
                    >
                      <div className="rounded-xl shadow-lg overflow-hidden hover:shadow-xl bg-white h-full flex flex-col border border-gray-100">
                        <div className="relative overflow-hidden h-60">
                          <img
                            src={
                              hotel.photos && hotel.photos.length > 0
                                ? hotel.photos[0]
                                : '/atithi_logo.png'
                            }
                            alt={hotel.name}
                            className="w-full h-full object-cover transition duration-500 hover:scale-110"
                          />
                          {hotel.rating && (
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm">
                              ⭐ {hotel.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                            {hotel.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {hotel.city}
                          </p>
                          <div className="mt-auto">
                            <p className="text-red-500 font-bold">
                              ${hotel.cheapestPrice}{' '}
                              <span className="text-gray-500 font-normal text-sm">
                                / night
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                !isDefaultHotels && (
                  <Message variant="info">
                    No hotels found for your search criteria.
                  </Message>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LandingPage;