import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Destination data
const destinations = [
  {
    id: 1,
    name: 'Agra',
    lat: 27.1767,
    lng: 78.0081,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
    description: 'Home to the iconic Taj Mahal, a UNESCO World Heritage Site and...',
    color: '#06B6D4',
  },
  {
    id: 2,
    name: 'Jaipur',
    lat: 26.9124,
    lng: 75.7873,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400',
    description: 'The Pink City with magnificent palaces and vibrant culture',
    color: '#F97316',
  },
  {
    id: 3,
    name: 'Goa',
    lat: 15.2993,
    lng: 74.1240,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400',
    description: 'Pristine beaches, Portuguese heritage, and vibrant nightlife',
    color: '#10B981',
  },
  {
    id: 4,
    name: 'Varanasi',
    lat: 25.3176,
    lng: 82.9739,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400',
    description: 'Ancient spiritual city on the banks of the holy Ganges River',
    color: '#EC4899',
  },
  {
    id: 5,
    name: 'Kashmir',
    lat: 34.0837,
    lng: 74.7973,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400',
    description: 'Paradise on Earth with stunning valleys and Dal Lake',
    color: '#8B5CF6',
  },
  {
    id: 6,
    name: 'Manali',
    lat: 32.2396,
    lng: 77.1887,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1626621341517-4a2613150d91?w=400',
    description: 'Himalayan hill station with adventure sports and scenic beauty',
    color: '#3B82F6',
  },
  {
    id: 7,
    name: 'Rishikesh',
    lat: 30.0869,
    lng: 78.2676,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf2d19b8f68?w=400',
    description: 'Yoga capital of the world and adventure hub',
    color: '#059669',
  },
  {
    id: 8,
    name: 'Leh-Ladakh',
    lat: 34.1526,
    lng: 77.5771,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    description: 'High-altitude desert with breathtaking monasteries and landscapes',
    color: '#7C3AED',
  },
];

export default function ExploreMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);


  const [mapView, setMapView] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState(destinations);
  const [activeMarker, setActiveMarker] = useState(null);

  // Filter destinations based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDestinations(destinations);
    } else {
      const filtered = destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDestinations(filtered);
    }
  }, [searchQuery]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map
    const map = L.map(mapRef.current, {
      center: [23.5, 78.9],
      zoom: 5,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // Add tile layer
    const tileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tileLayer.addTo(map);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when destinations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (filteredDestinations.length === 0) return;

    // Add new markers
    const bounds = L.latLngBounds();

    filteredDestinations.forEach((destination) => {
      // Create custom icon
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative;">
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

      // Create marker
      const marker = L.marker([destination.lat, destination.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="width: 300px; font-family: 'Inter', sans-serif;">
            <img 
              src="${destination.image}" 
              alt="${destination.name}"
              style="width: 100%; height: 180px; object-fit: cover; margin-bottom: 12px; border-radius: 8px;"
              onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'"
            />
            <div style="padding: 0 4px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #1e293b;">${destination.name}</h3>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FCD34D">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span style="font-size: 15px; font-weight: 600; color: #1e293b;">${destination.rating}</span>
                </div>
              </div>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b; line-height: 1.5;">${destination.description}</p>
              <button
              onclick="window.location.href='/destinations'"
              style={{
                  width: "100%",
                  padding: "10px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "white",
                  backgroundColor: destination.color,
                  cursor: "pointer",
                }}
              >
                Explore More →
              </button>
            </div>
          </div>
        `, {
          maxWidth: 320,
          className: 'custom-popup'
        });

      marker.on('click', () => setActiveMarker(destination.id));
      markersRef.current.push(marker);
      bounds.extend([destination.lat, destination.lng]);
    });

    // Fit bounds to show all markers
    if (filteredDestinations.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [filteredDestinations]);

  // Update map tiles when view changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add new tile layer
    const tileUrl = mapView === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }, [mapView]);

  const handleDestinationClick = (destination) => {
    setActiveMarker(destination.id);

    const map = mapInstanceRef.current;
    if (map) {
      map.setView([destination.lat, destination.lng], 10, {
        animate: true,
        duration: 1,
      });

      // Open popup for this marker
      const marker = markersRef.current.find(m =>
        m.getLatLng().lat === destination.lat && m.getLatLng().lng === destination.lng
      );
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div style={styles.breadcrumb}>
            {/* <span>Home</span>
            <span style={{ margin: '0 8px', opacity: 0.6 }}>/</span>
            <span style={{ opacity: 0.8 }}>Explore Map</span> */}
          </div>
          <h1 style={styles.title}>Explore India on the Map</h1>
          <p style={styles.subtitle}>
            Discover amazing destinations across the country — click any marker to begin your journey
          </p>
        </div>
      </div>

      {/* Search Bar and View Toggle */}
      <div style={styles.controlsContainer}>
        {/* <div style={styles.searchWrapper}>
          <svg style={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div> */}

        <div>
          {/* <button
            onClick={() => setMapView('map')}
            style={{
              ...styles.toggleButton,
              ...(mapView === 'map' ? styles.toggleButtonActive : {}),
            }}
          >
            <svg style={styles.toggleIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l-6 4v10l6-4m0-10l6 4m-6-4v10m6-6l6-4v10l-6 4m0-10v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Map
          </button>
          <button
            onClick={() => setMapView('satellite')}
            style={{
              ...styles.toggleButton,
              ...(mapView === 'satellite' ? styles.toggleButtonActive : {}),
            }}
          >
            <svg style={styles.toggleIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
            </svg>
            Satellite
          </button> */}
        </div>
      </div>

      {/* Map Container */}
      <div style={styles.mapWrapper}>
        <div ref={mapRef} style={styles.map} />
      </div>

      {/* Destination Pills Slider */}
      {/* <div style={styles.sliderContainer}>
        <button style={styles.sliderArrow} onClick={() => {
          document.getElementById('destinationSlider')?.scrollBy({ left: -200, behavior: 'smooth' });
        }}>
          ◀
        </button>
        
        <div id="destinationSlider" style={styles.slider}>
          {filteredDestinations.map((destination) => (
            <button
              key={destination.id}
              onClick={() => handleDestinationClick(destination)}
              style={{
                ...styles.pill,
                ...(activeMarker === destination.id ? { 
                  backgroundColor: destination.color,
                  color: 'white',
                  transform: 'scale(1.05)',
                } : {}),
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {destination.name}
            </button>
          ))}
        </div>

        <button style={styles.sliderArrow} onClick={() => {
          document.getElementById('destinationSlider')?.scrollBy({ left: 200, behavior: 'smooth' });
        }}>
          ▶
        </button>
      </div> */}

      <style>{`
        .leaflet-popup-content-wrapper {
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
        .custom-marker:hover {
          transform: scale(1.1);
          transition: transform 0.2s;
        }
        .custom-popup .leaflet-popup-close-button {
          font-size: 20px;
          padding: 4px 8px;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  hero: {
    position: 'relative',
    height: '380px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
    `,
  },

  heroContent: {
    position: 'relative',
    textAlign: 'center',
    color: 'white',
    padding: '0 20px',
    maxWidth: '800px',
  },

  breadcrumb: {
    fontSize: '14px',
    marginBottom: '16px',
    opacity: 0.9,
  },

  title: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    margin: '0 0 16px 0',
    letterSpacing: '-0.02em',
    textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)',
  },

  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    opacity: 0.95,
    lineHeight: 1.6,
    maxWidth: '600px',
    margin: '0 auto',
  },

  controlsContainer: {
    display: 'flex',
    gap: '16px',
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  searchWrapper: {
    position: 'relative',
    flex: '1 1 300px',
    minWidth: '250px',
  },

  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    pointerEvents: 'none',
  },

  searchInput: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: 'white',
  },

  viewToggle: {
    display: 'flex-end',
    gap: '8px',
    backgroundColor: 'white',
    padding: '6px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
  },

  toggleButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: 'transparent',
    color: '#64748b',
  },

  toggleButtonActive: {
    backgroundColor: '#667eea',
    color: 'white',
  },

  toggleIcon: {
    width: '18px',
    height: '18px',
  },

  mapWrapper: {
    maxWidth: '1400px',
    margin: '0 auto 24px',
    padding: '0 24px',
  },

  map: {
    height: '600px',
    borderRadius: '20px',
    border: '3px solid white',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },

  sliderContainer: {
    maxWidth: '1400px',
    margin: '0 auto 40px',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  sliderArrow: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid #e2e8f0',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
  },

  slider: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    padding: '8px 0',
    flex: 1,
  },

  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '50px',
    border: '2px solid #e2e8f0',
    backgroundColor: 'white',
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    cursor: 'pointer',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
};