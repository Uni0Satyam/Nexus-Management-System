import React from 'react';

const Badge = ({ children, variant = 'gray' }) => {
  const variants = {
    green: 'bg-green-500/20 text-green-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-300',
    gray: 'bg-gray-500/20 text-gray-400',
    indigo: 'bg-indigo-500/20 text-indigo-300',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-tight uppercase border border-white/5 ${variants[variant] || variants.gray}`}>
      {children}
    </span>
  );
};

export default Badge;
