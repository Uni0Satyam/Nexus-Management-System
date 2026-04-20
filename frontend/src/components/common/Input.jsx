import React from 'react';

const Input = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
          error ? 'border-rose-500 focus:ring-rose-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-rose-500 mt-1">{error}</span>
      )}
    </div>
  );
};

export default Input;
