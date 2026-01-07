import React, { useState, useEffect } from 'react';

const DestinationDetails = ({ destination }) => {
  const [visibleSections, setVisibleSections] = useState({});

  // Scroll-based visibility
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.fade-section');
      const updatedVisible = {};
      sections.forEach((section, index) => {
        const top = section.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
          updatedVisible[index] = true;
        }
      });
      setVisibleSections(prev => ({ ...prev, ...updatedVisible }));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!destination) return null;

  return (
    <div className="space-y-8">
      {/* Hero Image */}
      <div className={`relative w-full h-64 md:h-96 rounded-xl overflow-hidden fade-section transition-opacity duration-1000 ${visibleSections[0] ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src={destination.imgSrc}
          alt={destination.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg">
            {destination.title}
          </h1>
        </div>
      </div>

      {/* Description */}
      <p className={`text-gray-700 text-center max-w-3xl mx-auto leading-relaxed fade-section transition-opacity duration-1000 ${visibleSections[1] ? 'opacity-100' : 'opacity-0'}`}>
        {destination.description}
      </p>

      {/* Details Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 fade-section transition-opacity duration-1000 ${visibleSections[2] ? 'opacity-100' : 'opacity-0'}`}>
        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-blue-600 mb-1">📍 Location</h3>
          <p className="text-gray-600">{destination.location}</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-yellow-600 mb-1">🕒 Best Time</h3>
          <p className="text-gray-600">{destination.bestTimeToVisit}</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-green-600 mb-1">🎯 Activities</h3>
          <div className="flex flex-wrap gap-2">
            {destination.activities.map((act, i) => (
              <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                {act}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-purple-600 mb-1">💡 Tips</h3>
          <p className="bg-purple-50 p-2 rounded">{destination.tips}</p>
        </div>

        {destination.budgetPlan && (
          <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200 col-span-full">
            <h3 className="font-semibold text-red-600 mb-2">💰 Budget Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="bg-green-100 text-green-800 p-2 rounded text-center">Low: {destination.budgetPlan.low}</div>
              <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-center">Medium: {destination.budgetPlan.medium}</div>
              <div className="bg-red-100 text-red-800 p-2 rounded text-center">High: {destination.budgetPlan.high}</div>
            </div>
          </div>
        )}

        {destination.itinerary?.length > 0 && (
          <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200 col-span-full">
            <h3 className="font-semibold text-indigo-600 mb-2">📅 Itinerary</h3>
            <ul className="list-decimal list-inside text-gray-700 space-y-1">
              {destination.itinerary.map((day, i) => (
                <li key={i}>{day}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Map */}
      {destination.mapLink && (
        <div className="mt-4 rounded-xl overflow-hidden shadow-md">
          <iframe
            src={destination.mapLink}
            width="100%"
            height="250"
            className="rounded-xl border-2 border-blue-200"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default DestinationDetails;

