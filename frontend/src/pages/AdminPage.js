import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listUsers,
  deleteUser,
  createUser,
  updateUser,
} from '../actions/userActions';
import {
  listHotels,
  deleteHotel,
  createHotel,
  updateHotel,
} from '../actions/hotelActions';
import {
  listRooms,
  deleteRoom,
  createRoom,
  updateRoom,
} from '../actions/roomActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import API from '../services/api';


const isValidImage = (str) =>
  /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(str) ||
  /^data:image\/[a-zA-Z]+;base64,/.test(str);

const AdminPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('users');

  // Modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  // Edit modal state
  const [editUser, setEditUser] = useState(null);
  const [editHotel, setEditHotel] = useState(null);
  const [editRoom, setEditRoom] = useState(null);

  // Pagination state
  const [hotelPage, setHotelPage] = useState(1);
  const [allHotels, setAllHotels] = useState([]);
  const [roomPage, setRoomPage] = useState(1);
  const [allRooms, setAllRooms] = useState([]);
  const [totalRoomPages, setTotalRoomPages] = useState(1);

  // For room modal and table: all hotels for dropdown and lookup
  const [allHotelOptions, setAllHotelOptions] = useState([]);

  // Success message state
  const [successMessage, setSuccessMessage] = useState('');

  // Redux state
  const userList = useSelector((state) => state.userList);
  const hotelList = useSelector((state) => state.hotelList);
  const roomList = useSelector((state) => state.roomList);

  const { adminInfo } = useSelector((state) => state.adminLogin) || {};
  const { userInfo } = useSelector((state) => state.userLogin) || {};

  const {
    loading: loadingUsers,
    error: errorUsers,
    users,
  } = userList;

  const {
    loading: loadingHotels,
    error: errorHotels,
    hotels,
  } = hotelList;

  const {
    loading: loadingRooms,
    error: errorRooms,
    rooms,
    totalPages,
  } = roomList;

  const { success: successDelete } = useSelector((state) => state.userDelete);
  const { success: successHotelDelete } = useSelector((state) => state.hotelDelete);
  const { success: successRoomDelete } = useSelector((state) => state.roomDelete);

  // Fetch data on mount and when deletions occur
  useEffect(() => {
    if ((adminInfo && adminInfo.token) || (userInfo && userInfo.token)) {
      dispatch(listUsers());
      dispatch(listHotels());
      dispatch(listRooms());
    }
  }, [dispatch, adminInfo, userInfo, successDelete, successHotelDelete, successRoomDelete]);

  // Hotels pagination
  useEffect(() => {
    dispatch(listHotels({ page: hotelPage }));
  }, [dispatch, hotelPage]);

  useEffect(() => {
    setAllHotels(hotels || []);
  }, [hotels]);

  // Rooms pagination
  useEffect(() => {
    dispatch(listRooms({ page: roomPage }));
  }, [dispatch, roomPage]);

  useEffect(() => {
    if (rooms && rooms.length > 0) {
      setAllRooms((prev) => {
        const prevIds = new Set(prev.map(r => r._id));
        const newRooms = rooms.filter(r => !prevIds.has(r._id));
        return [...prev, ...newRooms];
      });
    }
    if (totalPages) setTotalRoomPages(totalPages);
  }, [rooms, totalPages]);

  // Fetch all hotels for room modal dropdown and for hotel name lookup in room table
  const fetchAllHotelsForRoom = async () => {
    try {
      const { data } = await API.get('/hotels/all');
      setAllHotelOptions(data.data || []);
    } catch (err) {
      setAllHotelOptions([]);
    }
  };

  // Fetch all hotels for room table and dropdown on mount
  useEffect(() => {
    fetchAllHotelsForRoom();
  }, []);

  // Show success message helper
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  // Handlers
  const deleteHandler = async (id, type) => {
    if (window.confirm('Are you sure?')) {
      let msg = '';
      switch (type) {
        case 'user':
          await dispatch(deleteUser(id));
          msg = 'User deleted successfully!';
          dispatch(listUsers());
          break;
        case 'hotel':
          await dispatch(deleteHotel(id));
          msg = 'Hotel deleted successfully!';
          setHotelPage(1);         
          setAllHotels([]);        
          dispatch(listHotels({ page: 1 })); 
          break;
        case 'room':
          await dispatch(deleteRoom(id));
          setAllRooms((prev) => prev.filter((room) => room._id !== id));
          msg = 'Room deleted successfully!';
          dispatch(listRooms({ page: roomPage })); 
          break;
        default:
          break;
      }
      showSuccess(msg);
    }
  };

  const ModalCard = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );

  const Input = (props) => (
    <input
      {...props}
      className="mb-2 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );

  const ModalActions = ({ onCancel, submitLabel }) => (
    <div className="flex justify-end mt-4">
      <button
        type="button"
        onClick={onCancel}
        className="mr-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
      >
        Cancel
      </button>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {submitLabel}
      </button>
    </div>
  );



  // Tab navigation
  const TabNavigation = () => (
    <div className="flex border-b mb-6 bg-white shadow-sm rounded-md overflow-hidden">
      {['users', 'hotels', 'rooms'].map((tab) => (
        <button
          key={tab}
          className={`flex-1 text-center px-6 py-3 font-semibold capitalize transition-colors duration-300 
          ${activeTab === tab
              ? 'border-b-4 border-red-500 text-red-600 bg-red-50'
              : 'text-gray-600 hover:text-red-500 hover:bg-gray-100'
            }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );


  // Users table
  const UsersTable = () => {
    if (loadingUsers) return <Loader />;
    if (errorUsers) return <Message variant="danger">{errorUsers}</Message>;
    if (!Array.isArray(users) || users.length === 0) return <p>No users found</p>;

    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Users</h2>
          <button
            className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:opacity-90 transition"
            onClick={() => setShowAddUserModal(true)}
          >
            + Add New User
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Email</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 text-sm text-gray-700">{user._id}</td>
                <td className="py-3 px-4 text-sm text-gray-800 font-medium">{user.username}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => setEditUser(user)}
                    className="bg-yellow-400 text-white text-sm px-3 py-1 rounded-full hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHandler(user._id, 'user')}
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded-full hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  // Hotels table
  const HotelsTable = () => {
    if (loadingHotels) return <Loader />;
    if (errorHotels) return <Message variant="danger">{errorHotels}</Message>;
    if (!Array.isArray(hotels) || hotels.length === 0) return <p>No hotels found</p>;

    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Hotels</h2>
          <button
            className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:opacity-90 transition"
            onClick={() => setShowAddHotelModal(true)}
          >
            + Add New Hotel
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                'ID', 'Name', 'Description', 'City', 'Address', 'Photos',
                'Rating', 'Num Reviews', 'Amenities', 'Cheapest Price', 'Actions',
              ].map((heading) => (
                <th
                  key={heading}
                  className="py-3 px-4 text-left font-semibold text-gray-600 uppercase"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hotels.map((hotel) => (
              <tr key={hotel._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 text-gray-700">{hotel._id}</td>
                <td className="py-3 px-4 text-gray-800 font-medium">{hotel.name}</td>
                <td className="py-3 px-4 text-gray-700">{hotel.description}</td>
                <td className="py-3 px-4 text-gray-700">{hotel.city}</td>
                <td className="py-3 px-4 text-gray-700">{hotel.address}</td>
                <td className="py-3 px-4">
                  {Array.isArray(hotel.photos) && hotel.photos.length > 0 ? (
                    <img
                      src={isValidImage(hotel.photos?.[0]) ? hotel.photos[0] : '/atithi_logo.png'}
                      alt={hotel.name}
                      className="w-20 h-20 rounded object-cover border"
                      onError={e => { e.target.src = '/atithi_logo.png'; }}
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </td>
                <td className="py-3 px-4">{hotel.rating}</td>
                <td className="py-3 px-4">{hotel.numReviews}</td>
                <td className="py-3 px-4">{hotel.amenities.join(', ')}</td>
                <td className="py-3 px-4 text-green-700 font-semibold">₹{hotel.cheapestPrice}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => setEditHotel(hotel)}
                    className="bg-yellow-400 text-white text-sm px-3 py-1 rounded-full hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHandler(hotel._id, 'hotel')}
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded-full hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setHotelPage((prev) => Math.max(prev - 1, 1))}
            disabled={hotelPage === 1}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Load Less
          </button>
          <button
            onClick={() => setHotelPage((prev) => prev + 1)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Load More
          </button>
          <span className="ml-2 text-sm text-gray-600">Page {hotelPage}</span>
        </div>
      </div>
    );
  };


  // Rooms table
  const RoomsTable = () => {
    if (loadingRooms) return <Loader />;
    if (errorRooms) return <Message variant="danger">{errorRooms}</Message>;
    if (!Array.isArray(allRooms) || allRooms.length === 0) return <p>No rooms found</p>;

    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Rooms</h2>
          <button
            className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:opacity-90 transition"
            onClick={() => {
              fetchAllHotelsForRoom();
              setShowAddRoomModal(true);
            }}
          >
            + Add New Room
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                'ID', 'Title', 'Price', 'Max People', 'Description', 'Image',
                'Room Numbers', 'Hotel', 'Actions',
              ].map((heading) => (
                <th
                  key={heading}
                  className="py-3 px-4 text-left font-semibold text-gray-600 uppercase"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allRooms.map((room) => (
              <tr key={room._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 text-gray-700">{room._id}</td>
                <td className="py-3 px-4 text-gray-800 font-medium">{room.title}</td>
                <td className="py-3 px-4 text-green-700 font-semibold">₹{room.price}</td>
                <td className="py-3 px-4">{room.maxPeople}</td>
                <td className="py-3 px-4 text-gray-700">{room.description}</td>
                <td className="py-3 px-4">
                  {room.image ? (
                    <img
                      src={isValidImage(room.image) ? room.image : '/atithi_logo.png'}
                      alt={room.title}
                      className="w-20 h-20 rounded object-cover border"
                      onError={e => { e.target.src = '/atithi_logo.png'; }}
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {Array.isArray(room.roomNumbers) && room.roomNumbers.length > 0
                    ? room.roomNumbers.map(rn => typeof rn === 'object' && rn !== null && rn.number ? rn.number : rn).join(', ')
                    : 'No Numbers'}
                </td>
                <td className="py-3 px-4">
                  {room.hotel && (
                    allHotelOptions.find((h) => h._id === room.hotel)?.name || room.hotel
                  )}
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => {
                      fetchAllHotelsForRoom();
                      setEditRoom(room);
                    }}
                    className="bg-yellow-400 text-white text-sm px-3 py-1 rounded-full hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHandler(room._id, 'room')}
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded-full hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setRoomPage((prev) => Math.max(prev - 1, 1))}
            disabled={roomPage === 1}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Load Less
          </button>
          <button
            onClick={() => setRoomPage((prev) => prev + 1)}
            disabled={roomPage >= totalRoomPages}
            className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50 hover:bg-blue-600"
          >
            Load More
          </button>
          <span className="ml-2 text-sm text-gray-600">
            Page {roomPage} of {totalRoomPages}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success popup */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 transition-all">
          {successMessage}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">
        Admin Dashboard
      </h1>

      <TabNavigation />

      {activeTab === 'users' && <UsersTable />}
      {activeTab === 'hotels' && <HotelsTable />}
      {activeTab === 'rooms' && <RoomsTable />}

      {/* Modal Reuse Styling */}
      {showAddUserModal && (
        <ModalCard title="Add New User" onClose={() => setShowAddUserModal(false)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const username = form.username.value;
              const email = form.email.value;
              const password = form.password.value;
              await dispatch(createUser({ username, email, password }));
              setShowAddUserModal(false);
              showSuccess('User added successfully!');
              dispatch(listUsers());
            }}
          >
            <Input name="username" placeholder="Username" required />
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Password" required />
            <ModalActions onCancel={() => setShowAddUserModal(false)} submitLabel="Add" />
          </form>
        </ModalCard>
      )}

      {editUser && (
        <ModalCard title="Edit User" onClose={() => setEditUser(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const username = form.username.value;
              const email = form.email.value;
              await dispatch(updateUser(editUser._id, { username, email }));
              setEditUser(null);
              showSuccess('User updated successfully!');
              dispatch(listUsers());
            }}
          >
            <Input name="username" defaultValue={editUser.username} required />
            <Input name="email" type="email" defaultValue={editUser.email} required />
            <ModalActions onCancel={() => setEditUser(null)} submitLabel="Save" />
          </form>
        </ModalCard>
      )}

      {showAddHotelModal && (
        <ModalCard title="Add New Hotel" onClose={() => setShowAddHotelModal(false)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const hotelData = {
                name: form.name.value,
                description: form.description.value,
                city: form.city.value,
                address: form.address.value,
                photos: form.photos.value
                  .split(',')
                  .map(p => p.trim())
                  .filter(Boolean)
                  .filter(isValidImage)
                  .length > 0
                  ? form.photos.value
                    .split(',')
                    .map(p => p.trim())
                    .filter(Boolean)
                    .filter(isValidImage)
                  : ['/atithi_logo.png'],
                rating: Number(form.rating.value),
                numReviews: Number(form.numReviews.value),
                amenities: form.amenities.value.split(',').map(a => a.trim()).filter(Boolean),
                cheapestPrice: Number(form.cheapestPrice.value),
              };
              await dispatch(createHotel(hotelData));
              setShowAddHotelModal(false);
              setHotelPage(1);
              setAllHotels([]);
              showSuccess('Hotel added successfully!');
              dispatch(listHotels({ page: 1 }));
            }}
          >
            <Input name="name" placeholder="Hotel Name" required />
            <Input name="description" placeholder="Description" required />
            <Input name="city" placeholder="City" required />
            <Input name="address" placeholder="Address" required />
            <Input name="photos" placeholder="Photo URLs (comma separated)" required />
            <Input name="rating" type="number" min="0" max="5" step="0.1" placeholder="Rating" required />
            <Input name="numReviews" type="number" min="0" placeholder="Number of Reviews" required />
            <Input name="amenities" placeholder="Amenities (comma separated)" required />
            <Input name="cheapestPrice" type="number" min="0" placeholder="Cheapest Price" required />
            <ModalActions onCancel={() => setShowAddHotelModal(false)} submitLabel="Add" />
          </form>
        </ModalCard>
      )}

      {editHotel && (
        <ModalCard title="Edit Hotel" onClose={() => setEditHotel(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const updatedHotel = {
                name: form.name.value,
                description: form.description.value,
                city: form.city.value,
                address: form.address.value,
                photos: form.photos.value
                  ? (
                    form.photos.value
                      .split(',')
                      .map(p => p.trim())
                      .filter(Boolean)
                      .filter(isValidImage)
                      .length > 0
                      ? form.photos.value
                        .split(',')
                        .map(p => p.trim())
                        .filter(Boolean)
                        .filter(isValidImage)
                      : editHotel.photos
                  )
                  : editHotel.photos,
                rating: Number(form.rating.value),
                numReviews: Number(form.numReviews.value),
                amenities: form.amenities.value.split(',').map(a => a.trim()).filter(Boolean),
                cheapestPrice: Number(form.cheapestPrice.value),
              };
              await dispatch(updateHotel(editHotel._id, updatedHotel));
              setEditHotel(null);
              setHotelPage(1);
              setAllHotels([]);
              showSuccess('Hotel updated successfully!');
              dispatch(listHotels({ page: 1 }));
            }}
          >
            <Input name="name" defaultValue={editHotel.name} required />
            <Input name="description" defaultValue={editHotel.description} required />
            <Input name="city" defaultValue={editHotel.city} required />
            <Input name="address" defaultValue={editHotel.address} required />
            <Input
              name="photos"
              defaultValue={editHotel.photos?.join(', ') || ''}
              required
            />
            {editHotel.photos && editHotel.photos.length > 0 && (
              <img
                src={
                  /^https?:\/\//.test(editHotel.photos[0]) ||
                    editHotel.photos[0].startsWith('data:image/')
                    ? editHotel.photos[0]
                    : '/atithi_logo.png'
                }
                alt={editHotel.name}
                className="w-20 h-20 rounded object-cover border mb-2"
                onError={e => { e.target.src = '/atithi_logo.png'; }}
              />
            )}
            <Input name="rating" type="number" defaultValue={editHotel.rating} required />
            <Input name="numReviews" type="number" defaultValue={editHotel.numReviews} required />
            <Input name="amenities" defaultValue={editHotel.amenities?.join(', ') || ''} required />
            <Input name="cheapestPrice" type="number" defaultValue={editHotel.cheapestPrice} required />
            <ModalActions onCancel={() => setEditHotel(null)} submitLabel="Save" />
          </form>
        </ModalCard>
      )}

      {showAddRoomModal && (
        <ModalCard title="Add New Room" onClose={() => setShowAddRoomModal(false)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const newRoom = {
                title: form.title.value,
                price: Number(form.price.value),
                maxPeople: Number(form.maxPeople.value),
                description: form.description.value,
                image: isValidImage(form.image.value) ? form.image.value : '/atithi_logo.png',
                roomNumbers: form.roomNumbers.value.split(',').map(r => r.trim()).filter(Boolean),
                hotel: form.hotel.value,
              };
              await dispatch(createRoom(newRoom));
              setShowAddRoomModal(false);
              setRoomPage(1);
              setAllRooms([]);
              showSuccess('Room added successfully!');
              dispatch(listRooms({ page: 1 }));
            }}
          >
            <Input name="title" placeholder="Room Title" required />
            <Input name="price" type="number" placeholder="Price" required />
            <Input name="maxPeople" type="number" placeholder="Max People" required />
            <Input name="description" placeholder="Description" required />
            <Input name="image" placeholder="Image URL or base64" required />
            <Input name="roomNumbers" placeholder="Room Numbers (comma separated)" required />
            <select name="hotel" required className="w-full border p-2 mb-2 rounded">
              <option value="">Select Hotel</option>
              {allHotelOptions.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
            <ModalActions onCancel={() => setShowAddRoomModal(false)} submitLabel="Add" />
          </form>
        </ModalCard>
      )}

      {editRoom && (
        <ModalCard title="Edit Room" onClose={() => setEditRoom(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const updatedRoom = {
                title: form.title.value,
                price: Number(form.price.value),
                maxPeople: Number(form.maxPeople.value),
                description: form.description.value,
                image: isValidImage(form.image.value) ? form.image.value : editRoom.image,
                roomNumbers: form.roomNumbers.value.split(',').map(r => r.trim()).filter(Boolean),
                hotel: form.hotel.value,
              };
              await dispatch(updateRoom(editRoom._id, updatedRoom));
              setEditRoom(null);
              setRoomPage(1);
              setAllRooms([]);
              showSuccess('Room updated successfully!');
              dispatch(listRooms({ page: 1 }));
            }}
          >
            <Input name="title" defaultValue={editRoom.title} required />
            <Input name="price" type="number" defaultValue={editRoom.price} required />
            <Input name="maxPeople" type="number" defaultValue={editRoom.maxPeople} required />
            <Input name="description" defaultValue={editRoom.description} required />
            <Input name="image" defaultValue={editRoom.image} required />
            <Input name="roomNumbers" defaultValue={editRoom.roomNumbers?.join(', ') || ''} required />
            <select name="hotel" defaultValue={editRoom.hotel} required className="w-full border p-2 mb-2 rounded">
              <option value="">Select Hotel</option>
              {allHotelOptions.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
            <ModalActions onCancel={() => setEditRoom(null)} submitLabel="Save" />
          </form>
        </ModalCard>
      )}
    </div>
  );
};

export default AdminPage;