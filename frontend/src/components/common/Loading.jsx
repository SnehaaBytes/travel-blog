import React from 'react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin shadow-lg"></div>
      <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loading;
