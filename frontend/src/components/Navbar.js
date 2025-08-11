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

  return (
    <header className="sticky top-0 z-50 bg-[rgb(32,37,55)] shadow-lg border-b border-gray-700 py-3 transition-all">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2 group">
          <img
            src="/atithi_logo.png"
            alt="Atithi Logo"
            className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span className="hidden md:inline-block text-white font-bold text-lg">Atithi</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="hidden md:flex items-center gap-1.5 text-gray-300 hover:text-white font-medium transition duration-200 text-sm group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 group-hover:text-white transition duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Home</span>
          </Link>

          {currentUser ? (
            <>
              {!isAdmin && userInfo && (
                <Link
                  to="/admin-request"
                  className="hidden md:block text-gray-300 hover:text-white font-medium transition duration-200 text-sm"
                >
                  Become an Admin
                </Link>
              )}

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden ${isAdmin ? 'bg-gradient-to-br from-purple-600 to-blue-500' : 'bg-gradient-to-br from-red-500 to-orange-400'} text-white shadow-md transition-all duration-200 hover:shadow-lg`}>
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-sm">{getInitial()}</span>
                    )}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[rgb(32,37,55)] rounded-lg shadow-xl py-1 z-50 border border-gray-600 transition-all duration-200">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-white font-medium">
                        {currentUser.name || currentUser.username}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <div className="py-1">
                      {userInfo && (
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          My Profile
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          to="/admin/profile"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logoutHandler}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-gray-300 hover:text-white font-medium transition duration-200 text-sm group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 group-hover:text-white transition duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden sm:inline">Login</span>
              </Link>

              <Link
                to="/register"
                className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition duration-200 text-sm shadow-md hover:shadow-lg"
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