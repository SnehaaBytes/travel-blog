import PropTypes from 'prop-types';

/**
 * Reusable Modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {string} props.title - Modal title
 * @param {string} props.description - Modal description
 * @param {string} props.imgSrc - Image source URL
 * @param {React.ReactNode} props.children - Additional content to render in the modal
 * @returns {React.ReactElement|null} Modal component or null if not open
 */
const Modal = ({ isOpen, onClose, title, description, imgSrc, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {imgSrc && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={imgSrc}
                alt={title || 'Modal image'}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                onClick={onClose}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {!imgSrc && (
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-6">
          {title && <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>}

          {description && <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>}

          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  imgSrc: PropTypes.string,
  children: PropTypes.node
};

export default Modal;
