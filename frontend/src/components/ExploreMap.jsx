import React, { useEffect, useRef, useState, useMemo } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 📍 Upgraded Coordinates Dictionary with Tawang and more!
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
  'Tawang': { lat: 27.5861, lng: 91.8594 },          // Fixed!
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
    axios.get('http://localhost:5000/api/destinations')
      .then(res => {
        const dbDests = res.data.map((d, index) => {
          // Look up coordinates from our map dictionary
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

    // Create map centered on India
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

    // Clear existing markers
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
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500 pt-16">
      
      {/* Hero Section */}
      <div className="relative h-[320px] md:h-[380px] bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-900 dark:to-slate-800 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        
        <div className="relative text-center text-white px-6 max-w-3xl z-10 w-full animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight">Explore India on the Map</h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light drop-shadow-md">
            Discover amazing destinations across the country — click any marker to begin your journey!
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-16 relative z-20 mb-24">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-4 sm:p-6 shadow-2xl border border-white dark:border-slate-800 transition-colors duration-500">
          
          {loading ? (
            <div className="h-[500px] sm:h-[600px] w-full flex flex-col items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
               <i className="fas fa-compass fa-spin text-5xl text-indigo-500 mb-4"></i>
               <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">Plotting Destinations...</h3>
            </div>
          ) : (
            <div className="relative">
              <div ref={mapRef} className="h-[500px] sm:h-[600px] w-full rounded-2xl z-10 border-4 border-white dark:border-slate-800 shadow-inner" />
              
              <div className="absolute top-4 right-4 z-[400] flex gap-2">
                <button
                  onClick={() => setMapView('map')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 ${mapView === 'map' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-white'}`}
                >
                  <i className="fas fa-map"></i> Map
                </button>
                <button
                  onClick={() => setMapView('satellite')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 ${mapView === 'satellite' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-white'}`}
                >
                  <i className="fas fa-satellite"></i> Satellite
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

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
