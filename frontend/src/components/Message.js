import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ variant = 'info', children, onClose }) => {
  const colors = {
    danger: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  };

  return (
    <div
      className={`border px-4 py-3 rounded relative mb-4 ${colors[variant] || colors.info}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex-grow">{children}</div>
        {onClose && (
          <button
            className="ml-4 text-lg font-bold text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

// Prop Types validation
Message.propTypes = {
  variant: PropTypes.oneOf(['danger', 'success', 'info', 'warning']),
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
};

export default Message;
