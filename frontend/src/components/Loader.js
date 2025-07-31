import React from 'react';
import PropTypes from 'prop-types';

function Loader({ color = 'blue' }) {
  return (
    <div className="flex justify-center items-center h-32">
      <div className={`w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`
            h-full bg-${color}-500 animate-progressBar
          `}
          style={{
            width: '100%',
            animation: 'progress 1.5s infinite linear'
          }}
        ></div>
      </div>

      <style>
        {`
          @keyframes progress {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-progressBar {
            animation: progress 1.5s infinite linear;
          }
        `}
      </style>
    </div>
  );
}

Loader.propTypes = {
  color: PropTypes.string,
};

export default Loader;