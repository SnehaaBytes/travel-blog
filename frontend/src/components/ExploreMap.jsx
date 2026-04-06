import React, { useEffect, useRef, useState, useMemo } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 📍 Upgraded Coordinates Dictionary
const coordinateMap = {
  'Manali': { lat: 32.2396, lng: 77.1887 },
  'Kashmir': { lat: 34.0837, lng: 74.7973 },
  'Varanasi': { lat: 25.3176, lng: 82.9739 },
  'Vrindavan': { lat: 27.5650, lng: 77.6593 },
  'Goa': { lat: 15.2993, lng: 74.1240 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Agra': { lat: 27.1767, lng: 78.0081 },
  'Rishikesh': { lat: 30.0869, lng: 78.2676 },
  'Leh-Ladakh': { lat: 34.1526, lng: 77.5771 },
  'Mysore': { lat: 12.2958, lng: 76.6394 },
  'Darjeeling': { lat: 27.0360, lng: 88.2627 },
  'Udaipur': { lat: 24.5854, lng: 73.7125 },
  'Shimla': { lat: 31.1048, lng: 77.1734 },
  'Ranthambore': { lat: 26.0173, lng: 76.5026 },
  'Hampi': { lat: 15.3350, lng: 76.4600 },
  'Andaman': { lat: 11.7401, lng: 92.6586 },
  'Sikkim': { lat: 27.5330, lng: 88.5122 },
  'Coorg': { lat: 12.3375, lng: 75.8069 },
  'Tawang': { lat: 27.5861, lng: 91.8594 },          
  'Munnar': { lat: 10.0889, lng: 77.0595 },
  'Kerala': { lat: 10.8505, lng: 76.2711 },
  'Meghalaya': { lat: 25.4670, lng: 91.3662 },
  'Spiti Valley': { lat: 32.2461, lng: 78.0349 },
  'Cherrapunji': { lat: 25.2636, lng: 91.7335 },
  'Gokarna': { lat: 14.5500, lng: 74.3180 },
};

const mapColors = ['#06B6D4', '#F97316', '#10B981', '#EC4899', '#8B5CF6', '#3B82F6'];

export default function ExploreMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarker, setActiveMarker] = useState(null);

  // === 1. FETCH FROM DATABASE ===
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/destinations`)
      .then(res => {
        const dbDests = res.data.map((d, index) => {
          const coords = coordinateMap[d.title] || { lat: 20.5937, lng: 78.9629 };
          
          return {
            id: d._id || index.toString(),
            name: d.title,
            lat: d.lat || coords.lat,
            lng: d.lng || coords.lng,
            rating: d.rating || 4.5,
            image: d.imgSrc ? `/images/${d.imgSrc}` : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            description: d.description,
            color: d.color || mapColors[index % mapColors.length],
          };
        });
        setDestinations(dbDests);
      })
      .catch(err => console.error("Error fetching map destinations:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDestinations = useMemo(() => {
    if (searchQuery.trim() === '') return destinations;
    return destinations.filter(dest => dest.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, destinations]);

  // === 2. INITIALIZE LEAFLET MAP ===
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || loading) return;

    const map = L.map(mapRef.current, {
      center: [22.5, 78.9],
      zoom: 5,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading]);

  // === 3. UPDATE MARKERS & POPUPS ===
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (filteredDestinations.length === 0) return;

    const bounds = L.latLngBounds();

    filteredDestinations.forEach((destination) => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative; transition: all 0.3s;">
            <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.95 0 0 8.95 0 20C0 30 20 50 20 50C20 50 40 30 40 20C40 8.95 31.05 0 20 0Z" 
                    fill="${destination.color}" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))"/>
              <circle cx="20" cy="18" r="8" fill="white"/>
            </svg>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50],
      });

      const popupHtml = `
          <div class="custom-popup-content">
            <img 
              src="${destination.image}" 
              alt="${destination.name}"
              class="w-full h-40 object-cover rounded-xl mb-3 shadow-sm"
              onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'"
            />
            <div class="px-1 text-slate-900 dark:text-white">
              <div class="flex justify-between items-center mb-2">
                <h3 class="m-0 text-xl font-extrabold tracking-tight">${destination.name}</h3>
                <div class="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-md">
                  <span class="text-amber-500 font-bold text-sm">★ ${destination.rating}</span>
                </div>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">${destination.description}</p>
              <button
                onclick="window.location.href='/destinations'"
                class="w-full py-2.5 rounded-lg text-white font-bold transition-transform active:scale-95"
                style="background-color: ${destination.color};"
              >
                Explore More →
              </button>
            </div>
          </div>
        `;

      const marker = L.marker([destination.lat, destination.lng], { icon })
        .addTo(map)
        .bindPopup(popupHtml, { maxWidth: 300, className: 'theme-popup' });

      marker.on('click', () => setActiveMarker(destination.id));
      markersRef.current.push(marker);
      bounds.extend([destination.lat, destination.lng]);
    });

    if (filteredDestinations.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [filteredDestinations]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) map.removeLayer(layer);
    });

    const tileUrl = mapView === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, { attribution: '&copy; OpenStreetMap' }).addTo(map);
  }, [mapView]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pt-32 pb-24 px-6 md:px-12 font-sans relative overflow-hidden">
      
      {/* ── Decorative Background Elements (Same as Review!) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-400/10 dark:bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* ── Header Area ── */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 backdrop-blur-md mb-4 text-sm font-bold tracking-wider text-blue-700 dark:text-blue-400 uppercase">
             Interactive Directory
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">India</span> Map
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover amazing hidden gems and popular destinations across the country! Click any marker to begin your journey.
          </p>
        </div>

        {/* ── Action Bar (Search & Map/Satellite toggles) ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:w-96">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-search text-slate-400"></i>
               </div>
               <input 
                  type="text"
                  placeholder="Search map locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm backdrop-blur-md transition-all font-medium"
               />
            </div>

            <div className="flex bg-white/70 dark:bg-slate-900/70 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
               <button
                 onClick={() => setMapView('map')}
                 className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mapView === 'map' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
               >
                 <i className="fas fa-map text-lg"></i> Map
               </button>
               <button
                 onClick={() => setMapView('satellite')}
                 className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mapView === 'satellite' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
               >
                 <i className="fas fa-satellite text-lg"></i> Satellite
               </button>
            </div>
        </div>

        {/* ── Outer Map Container (Matches Review Card) ── */}
        <div className="group flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-[2.5rem] p-4 sm:p-6 border border-white dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all duration-300">
          
          {loading ? (
            <div className="h-[500px] sm:h-[650px] w-full flex flex-col items-center justify-center rounded-[2rem] bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
               <i className="fas fa-compass fa-spin text-5xl text-blue-500 mb-4 opacity-80"></i>
               <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300 animate-pulse">Plotting Destinations...</h3>
            </div>
          ) : (
            <div className="relative">
              <div 
                ref={mapRef} 
                className="h-[500px] sm:h-[650px] w-full rounded-[2rem] z-10 border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden" 
              />
            </div>
          )}

        </div>

      </div>

      {/* ── Leaflet Theme CSS ── */}
      <style>{`
        .theme-popup .leaflet-popup-content-wrapper {
          padding: 6px;
          border-radius: 1.25rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .dark .theme-popup .leaflet-popup-content-wrapper {
          background-color: #0f172a;
          color: white;
          border: 1px solid #1e293b;
        }

        .dark .theme-popup .leaflet-popup-tip {
          background-color: #0f172a;
        }

        .custom-popup-content h3 { margin: 0; }
        .custom-popup-content p { margin: 0; }
        
        .custom-marker {
          background: transparent;
          border: none;
        }
        .custom-marker:hover {
          transform: scale(1.15);
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
}
