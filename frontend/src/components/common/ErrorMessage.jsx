import React from 'react';

const ErrorMessage = ({ message = "We encountered an unexpected error.", onRetry }) => {
  return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-8 text-center shadow-lg w-full">
      <i className="fas fa-exclamation-circle text-5xl text-rose-500 mb-4 animate-bounce"></i>
      <h3 className="text-2xl font-black text-rose-700 dark:text-rose-400 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-rose-600 dark:text-rose-300 mb-6 font-medium text-lg">
        {message}
      </p>
      
      {/* If an 'onRetry' function was passed in, it shows a reset button */}
      {onRetry && (
        <button 
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-8 py-3 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow-md hover:-translate-y-1"
        >
          <i className="fas fa-redo-alt"></i> Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
