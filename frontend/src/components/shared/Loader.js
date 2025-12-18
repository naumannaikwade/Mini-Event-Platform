import React from 'react';

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-t-2 border-b-2',
    large: 'h-16 w-16 border-t-4 border-b-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-blue-600 mb-4`}></div>
      <p className="text-gray-600">{text}</p>
    </div>
  );
};

export default Loader;