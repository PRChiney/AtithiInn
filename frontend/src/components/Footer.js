import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16" role="contentinfo">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-extrabold text-white mb-4">Atithi</h3>
            <p className="text-sm leading-relaxed">
              Discover your perfect stay. From cozy rooms to luxurious hotels, Atithi helps you book confidently for your next trip.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-red-400 transition-colors duration-200">Home</a>
              </li>
              <li>
                <a href="/" className="hover:text-red-400 transition-colors duration-200">About</a>
              </li>
              <li>
                <a href="/" className="hover:text-red-400 transition-colors duration-200">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@atithi.com" className="hover:text-red-400 transition-colors duration-200">
                  support@atithi.com
                </a>
              </li>
              <li>
                <a href="tel:+11234567890" className="hover:text-red-400 transition-colors duration-200">
                  +1 (123) 456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} <span className="font-medium text-white">Atithi</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
