import React, { useState, useRef } from 'react';
import ColorThief from 'color-thief-browser';
import destinations from './destinationsData';
import './Destinations.css';

const AllDestinations = () => {
  const [colors, setColors] = useState({});
  const imgRefs = useRef({});

  const handleImgLoad = (_id) => {
    const img = imgRefs.current[_id];
    if (img) {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        setColors(prev => ({ ...prev, [_id]: color }));
      } catch (err) {
        console.error("Color extraction failed", err);
      }
    }
  };

  return (
    <div className="destinations-container">
      <h1 className="destinations-header">Popular Destinations</h1>
      <div className="destination-grid">
        {destinations.map(dest => {
          const bgColor = colors[dest._id] ? `rgb(${colors[dest._id].join(',')})` : '#ccc';
          return (
            <div key={dest._id} className="destination-card" style={{ backgroundColor: bgColor }}>
              <img
                src={dest.imgSrc}
                alt={dest.title}
                ref={el => (imgRefs.current[dest._id] = el)}
                crossOrigin="anonymous"
                onLoad={() => handleImgLoad(dest._id)}
              />
              <div className="destination-info">
                <h3>{dest.title}</h3>
                <p><strong>Location:</strong> {dest.location}</p>
                <p><strong>Best Time:</strong> {dest.bestTimeToVisit}</p>
                <p><strong>Activities:</strong> {dest.activities.join(', ')}</p>
                <p><strong>Tips:</strong> {dest.tips}</p>
                <p><strong>Itinerary:</strong> {dest.itinerary.join(', ')}</p>
                <a href={dest.mapLink} target="_blank" rel="noopener noreferrer">
                  View on Map
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllDestinations;

