import PropTypes from 'prop-types';

/**
 * Reusable Loading component
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message to display
 * @returns {React.ReactElement} Loading component
 */
const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium text-lg">{message}</p>
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string
};

export default Loading;
