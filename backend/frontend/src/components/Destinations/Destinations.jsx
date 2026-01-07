import { useState, useEffect, useCallback } from 'react';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { fixImagePath } from '../../utils/helpers';
import './Destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
  
      // Mock data for testing
      const data = [
        {
          title: 'Manali',
          description: 'A beautiful hill station in Himachal Pradesh.',
          imgSrc: '/images/manali.jpg',
        },
        {
          title: 'Kashmir',
          description: 'Known as "Paradise on Earth", located in northern India.',
          imgSrc: '/images/kashmir.jpg',
        },
        {
          title: 'Varanasi',
          description: 'A spiritual city on the banks of the Ganges River.',
          imgSrc: '/images/varanasi.jpg',
        },
        {
          title: 'Vrindavan',
          description: 'A holy city associated with Lord Krishna.',
          imgSrc: '/images/vrindavan.jpg',
        },
      ];
  
      setDestinations(data);
    } catch (err) {
      setError('Failed to load destinations. Please try again later.');
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const openModal = (title, description, imgSrc) => {
    setModalContent({ title, description, imgSrc });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div className="destinations-container">
      <div className="destinations-header">
        <h1>Popular Destinations</h1>
      </div>

      <main>
        {loading ? (
          <Loading message="Loading destinations..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchDestinations} />
        ) : destinations.length === 0 ? (
          <div className="no-data">No destinations found</div>
        ) : (
          <section className="destination-list">
            {destinations.map((destination, index) => (
              <div
                key={index}
                className="destination"
                onClick={() =>
                  openModal(
                    destination.title,
                    destination.description,
                    fixImagePath(destination.imgSrc)
                  )
                }
              >
                <img
                  src={fixImagePath(destination.imgSrc)}
                  alt={destination.title}
                  className="destination-img"
                />
                <h3 className="destination-title">{destination.title}</h3>
                <p>{destination.description}</p>
              </div>
            ))}
          </section>
        )}
      </main>

      <Modal
        isOpen={!!modalContent}
        onClose={closeModal}
        title={modalContent?.title}
        description={modalContent?.description}
        imgSrc={modalContent?.imgSrc}
      />

      <footer>
        <p>&copy; 2025 Travel Blog. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Destinations;