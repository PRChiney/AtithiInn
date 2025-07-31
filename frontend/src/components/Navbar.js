
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import { logoutAdmin } from '../actions/adminActions';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const { adminInfo } = useSelector((state) => state.adminLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = adminInfo?.admin?.isAdmin || userInfo?.isAdmin;
  const currentUser = adminInfo?.admin || userInfo;

  const logoutHandler = () => {
    if (adminInfo?.admin?.isAdmin) {
      dispatch(logoutAdmin());
      navigate('/admin/login');
    } else {
      dispatch(logout());
      navigate('/login');
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitial = () => {
    if (adminInfo?.admin?.name) {
      return adminInfo.admin.name.charAt(0).toUpperCase();
    }
    if (userInfo?.user?.username) {
      return userInfo.user.username.charAt(0).toUpperCase();
    }
    return '?';
  };

  const getAvatarStyle = () => {
    return isAdmin
      ? 'bg-gradient-to-br from-purple-600 to-blue-500 text-white'
      : 'bg-gradient-to-br from-red-500 to-orange-400 text-white';
  };

  return (
    <header className="sticky top-0 z-50 bg-[rgb(32,37,55)] shadow-lg border-b border-gray-700 py-2 transition-all">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2">
          <img
            src="/atithi_logo.png"
            alt="Atithi Logo"
            className="h-12 w-auto object-contain transition-transform hover:scale-105"
          />
        </Link>

        <div className="flex items-center space-x-5">
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-300 hover:text-white font-medium transition duration-200 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18"
              width="18"
              viewBox="0 0 576 512"
              className="text-gray-400 group-hover:text-white transition-transform duration-200 group-hover:scale-110"
            >
              <path
                fill="currentColor"
                d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
              />
            </svg>
            <span>Home</span>
          </Link>



          {currentUser ? (
            <>
              {!isAdmin && userInfo && (
                <Link
                  to="/admin-request"
                  className="text-gray-300 hover:text-white font-medium transition duration-200 text-sm"
                >
                  Become an Admin
                </Link>
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none transition-transform hover:scale-105"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  <div className={`w-9 h-9 rounded-full border-2 border-white shadow-md flex items-center justify-center overflow-hidden ${getAvatarStyle()} transition-all duration-300 hover:scale-105`}>

                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="font-bold text-sm">{getInitial()}</span>
                    )}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[rgb(32,37,55)] rounded-xl shadow-2xl py-2 z-50 border border-gray-600 transition-all duration-300">
                    {userInfo && (
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded-md mx-1 my-0.5"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Admin Profile
                      </Link>
                    )}
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center gap-1 text-gray-300 hover:text-white font-medium transition duration-200 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="16"
                  viewBox="0 0 448 512"
                  className="text-gray-400 group-hover:text-white transition-colors duration-200"
                >
                  <path
                    fill="currentColor"
                    d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
                  />
                </svg>
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-1.5 rounded-full font-semibold hover:opacity-90 transition text-sm shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
