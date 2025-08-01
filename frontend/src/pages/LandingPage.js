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
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(hotels) && hotels.length > 0 ? (
              hotels.map((hotel) => (
                <div key={hotel._id} className="h-full">
                  <Link
                    to={`/hotels/${hotel._id}`}
                    className="block h-full transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="rounded-xl shadow-md overflow-hidden hover:shadow-lg bg-white h-full flex flex-col">
                      <img
                        src={
                          hotel.photos && hotel.photos.length > 0
                            ? hotel.photos[0]
                            : '/atithi_logo.png'
                        }
                        alt={hotel.name}
                        className="w-full h-60 object-cover"
                      />
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {hotel.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          {hotel.city}
                        </p>
                        <p className="text-red-500 font-bold mt-auto">
                          ${hotel.cheapestPrice}{' '}
                          <span className="text-gray-500 font-normal">
                            / night
                          </span>
                        </p>
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