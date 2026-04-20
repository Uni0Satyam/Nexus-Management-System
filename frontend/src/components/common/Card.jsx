import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-[#111827] bg-gradient-to-br from-gray-800/20 to-gray-900/20 border border-gray-700/50 rounded-2xl shadow-lg shadow-black/30 overflow-hidden ${hover ? 'hover:scale-[1.01] hover:border-gray-600/50' : ''} transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
