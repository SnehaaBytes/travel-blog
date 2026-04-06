import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import DestinationDetails from "./DestinationDetails";
import { useAuth } from "../../services/AuthContext";
import "./Destinations.css";

const Destinations = () => {
  const [destinationsData, setDestinationsData] = useState([]);
  const [selectedDest, setSelectedDest] = useState(null);
  const [openedFromHome, setOpenedFromHome] = useState(false);
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* ================= FETCH DATA & FAVORITES ================= */
  useEffect(() => {
    // 1. Fetch all destinations
    axios
      .get(`${import.meta.env.VITE_API_URL}/destinations`)
      .then((res) => setDestinationsData(res.data))
      .catch((err) => console.error(err));

    // 2. Fetch User's Favorites if logged in
    if (user) {
      axios.get(`${import.meta.env.VITE_API_URL}/users/${user.username}/dashboard`)
        .then(res => {
          // Extract just the IDs so we can easily check them
          const favIds = res.data.data.favorites.map(fav => fav._id || fav);
          setFavoriteIds(favIds);
        })
        .catch(err => console.error("Error fetching favorites", err));
    }
  }, [user]);

  /* ================= FAVORITE TOGGLE LOGIC ================= */
  const toggleFavorite = async (e, destinationId) => {
    e.stopPropagation(); // Stop the card from opening the modal when clicking the heart!
    
    if (!user) {
      alert("You must be logged in to favorite a destination!");
      return;
    }

    // Optimistic UI Update (Change it on screen instantly)
    const isAlreadyFav = favoriteIds.includes(destinationId);
    if (isAlreadyFav) {
      setFavoriteIds(favoriteIds.filter(id => id !== destinationId));
    } else {
      setFavoriteIds([...favoriteIds, destinationId]);
    }

    // Send the request to the database
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/${user.username}/favorites`, {
        destinationId
      });
    } catch (err) {
      console.error("Failed to update favorite", err);
      // Revert if it failed (optional but good practice)
      if (isAlreadyFav) {
        setFavoriteIds([...favoriteIds, destinationId]);
      } else {
        setFavoriteIds(favoriteIds.filter(id => id !== destinationId));
      }
    }
  };

  /* ================= SEARCH LOGIC ================= */
  const search = (searchParams.get("search") || "").trim().toLowerCase();

  const filteredDestinations = destinationsData.filter((dest) => {
    const text = `${dest.title || ""} ${dest.description || ""}`.toLowerCase();
    return text.includes(search);
  });

  /* ================= AUTO OPEN FROM HOME ================= */
  useEffect(() => {
    if (location.state?.destinationTitle && destinationsData.length > 0) {
      const foundDest = destinationsData.find(
        (d) => d.title === location.state.destinationTitle
      );

      if (foundDest) {
        setSelectedDest(foundDest);
        setOpenedFromHome(location.state.from === "home");
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, destinationsData]);

  /* ================= LOCK SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow = selectedDest ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [selectedDest]);

  return (
    <div className="destinations-container relative flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans selection:bg-blue-500/30">
      
      {/* BACKGROUND DECORATIVE BLOBS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-400/20 dark:bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-10 pb-10 lg:pt-15 lg:pb-14">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-5 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 backdrop-blur-md mb-2 shadow-sm">
            <p className="text-sm font-bold tracking-wider text-blue-700 dark:text-blue-300 uppercase">
              Curated Escapes
            </p>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Discover <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              Hidden Gems
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Explore the world's most breathtaking locations, carefully curated to provide unforgettable experiences.
          </p>
        </div>
      </div>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 pb-24">
        
        {filteredDestinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 text-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none mx-auto max-w-2xl">
            <div className="w-20 h-20 mb-6 bg-slate-100 dark:bg-slate-800/80 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              No Destinations Found
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              We couldn't find any locations matching{" "}
              <span className="text-blue-600 dark:text-blue-400 font-semibold px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                "{search || "your search"}"
              </span>
            </p>
            <button 
              onClick={() => navigate('/destinations')} 
              className="mt-8 px-8 py-3 font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Clear Search
            </button>
          </div>
        ) : (

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredDestinations.map((dest) => (
              <div
                key={dest._id}
                className="group relative flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-[2rem] overflow-hidden border border-white dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all duration-500 hover:-translate-y-2"
              >
                {/* IMAGE CONTAINER */}
                <div className="relative h-60 overflow-hidden m-2 rounded-[1.5rem]">
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  
                  {/* 👉 NEW: SVG HEART BUTTON */}
                  <button
                    onClick={(e) => toggleFavorite(e, dest._id)}
                    className="absolute top-4 right-4 z-20 p-2.5 bg-white/30 hover:bg-white/90 dark:bg-black/30 dark:hover:bg-black/80 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 group/fav"
                  >
                    <svg 
                      className={`w-6 h-6 transform transition-transform duration-300 group-hover/fav:scale-110 ${
                        favoriteIds.includes(dest._id) 
                          ? "text-red-500 fill-current" // Solid Red if favorited!
                          : "text-white fill-transparent stroke-current stroke-[2px]" // Transparent outlined if not
                      }`} 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>

                  <img
                    src={`/images/${dest.imgSrc}`}
                    alt={dest.title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="px-6 py-5 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {dest.title}
                  </h3>

                  <p className="text-base text-slate-600 dark:text-slate-400 flex-grow line-clamp-3 leading-relaxed">
                    {dest.description}
                  </p>

                  <button
                    className="mt-6 w-full relative overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl group/btn transition-all duration-300 hover:shadow-lg focus:ring-4 focus:ring-blue-500/20 active:scale-[0.98]"
                    onClick={() => {
                      setSelectedDest(dest);
                      setOpenedFromHome(false);
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Explore Details
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-blue-600 dark:bg-blue-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300 ease-out" />
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* MODAL */}
      {selectedDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:py-12">
          {/* BACKDROP */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setSelectedDest(null);
              if (openedFromHome) navigate("/");
            }}
          />

          <div className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-white/20 dark:border-slate-700 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-300">
            
            <div className="absolute top-4 right-4 z-20">
              <button
                className="p-2.5 bg-black/40 hover:bg-black/60 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-105 active:scale-95"
                aria-label="Close modal"
                onClick={() => {
                  setSelectedDest(null);
                  if (openedFromHome) navigate("/");
                }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto overflow-x-hidden flex-1 p-0 custom-scrollbar">
              <DestinationDetails destination={selectedDest} />
            </div>

            <div className="p-6 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setSelectedDest(null);
                  if (user) {
                    navigate(`/book/${selectedDest._id}`);
                  } else {
                    alert("Please log in to book this experience!");
                    navigate('/login');
                  }
                }}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-blue-500/30 transform transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Book This Experience
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STYLES FOR SCROLLBAR INJECTION */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(71, 85, 105, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </div>
  );
};

export default Destinations;
