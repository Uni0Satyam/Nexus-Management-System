import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'outline', className = '', disabled = false }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent',
    outline: 'bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 hover:text-white',
    danger: 'bg-transparent border border-gray-700 text-gray-300 hover:bg-rose-600 hover:border-rose-600 hover:text-white',
    ghost: 'bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.outline} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
