import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import destinationsData from "./destinationsData";
import DestinationDetails from "./DestinationDetails";
import DestinationSearch from "../Search/DestinationSearch";
import "./Destinations.css";

const Destinations = () => {
  const [selectedDest, setSelectedDest] = useState(null);
  const [openedFromHome, setOpenedFromHome] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Auto-open modal when redirected from Home
  useEffect(() => {
    if (location.state?.destinationTitle) {
      const foundDest = destinationsData.find(
        (d) => d.title === location.state.destinationTitle
      );

      if (foundDest) {
        setSelectedDest(foundDest);
        setOpenedFromHome(location.state.from === "home");

        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  return (
    <div className="destinations-container">
      <div className="destinations-header">
        <h1>Popular Destinations</h1>
      </div>

      <main>
        <DestinationSearch data={destinationsData}>
          {(filteredDestinations, search) =>
            filteredDestinations.length === 0 ? (
              <div className="no-data">
                No destinations found{search && ` for "${search}"`}
              </div>
            ) : (
              <section className="destination-list">
                {filteredDestinations.map((dest) => (
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
                        onClick={() => {
                          setSelectedDest(dest);
                          setOpenedFromHome(false);
                        }}
                      >
                        Show Details
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )
          }
        </DestinationSearch>
      </main>

      <footer>
        <p>&copy; 2025 Travel Blog. All rights reserved.</p>
      </footer>

      {/* Modal */}
      {selectedDest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative p-6">

            <button
              className="fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white text-black text-3xl font-bold shadow-xl hover:bg-red-600 hover:text-white transition"
              onClick={() => {
                setSelectedDest(null);
                if (openedFromHome) navigate("/");
              }}
            >
              &times;
            </button>

            <DestinationDetails destination={selectedDest} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Destinations;
