import PropTypes from 'prop-types';

/**
 * Reusable Error Message component
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onRetry - Optional retry function
 * @returns {React.ReactElement} Error Message component
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center text-center">
      <div className="text-red-500 text-4xl mb-4">
        <i className="fas fa-exclamation-circle"></i>
      </div>
      <p className="text-red-800 mb-6 font-medium">{message}</p>
      {onRetry && (
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func
};

export default ErrorMessage;
