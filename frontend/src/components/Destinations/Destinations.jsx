import { useState, useEffect } from 'react';
import destinationsData from './destinationsData';
import DestinationDetails from './DestinationDetails';
import './Destinations.css';

const Destinations = () => {
  const [selectedDest, setSelectedDest] = useState(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      {/* Theme Toggle Button */}
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="destinations-container">
        <div className="destinations-header">
          <h1>Popular Destinations</h1>
        </div>

        <main>
          {destinationsData.length === 0 ? (
            <div className="no-data">No destinations found</div>
          ) : (
            <section className="destination-list">
              {destinationsData.map((dest) => (
                <div key={dest._id} className="destination">
                  <img
                    src={dest.imgSrc}
                    alt={dest.title}
                    className="destination-img"
                  />

                  <div className="destination-info">
                    <div>
                      <h3 className="destination-title">{dest.title}</h3>
                      <p>{dest.description}</p>
                    </div>

                    <button
                      className="details-btn"
                      onClick={() => setSelectedDest(dest)}
                    >
                      Show Details
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>

        <footer>
          <p>&copy; 2025 Travel Blog. All rights reserved.</p>
        </footer>

        {/* Modal */}
        {selectedDest && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn"
          >
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative p-6 animate-modalOpen">
              
              <button
                className="fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 text-black text-3xl font-bold shadow-xl hover:bg-red-600 hover:text-white transition"
                onClick={() => setSelectedDest(null)}
              >
                &times;
              </button>

              <DestinationDetails destination={selectedDest} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Destinations;