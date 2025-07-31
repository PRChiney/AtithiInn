import React from 'react';
const FormContainer = ({ children }) => {
  return (
    <div className="max-w-md mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      {children}
    </div>
  );
};

export default FormContainer;
