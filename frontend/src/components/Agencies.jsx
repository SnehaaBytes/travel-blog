import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Agencies = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get exactly 1 or 2 initials from the agency name
  const getInitials = (name) => {
    if (!name) return "AG";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  // Helper to verify if we should just show the initials instead of the broken placeholder
  const shouldShowInitials = (url) => {
    if (!url) return true;
    if (url.includes("placeholder.com")) return true; // Catch the backend's default placeholder
    if (url.length < 10) return true; // Catch random typing like 'asiwdg'
    return false;
  };

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/agencies');
        if (response.ok) {
          const result = await response.json();
          setAgencies(result.data);
        }
      } catch (error) {
        console.error('Error fetching agencies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, []);

  return (
    // 👉 ADDED pt-32 (padding-top) HERE SO IT DOESN'T HIDE BEHIND NAVBAR!
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pt-32 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Our Trusted <span className="text-blue-600 dark:text-blue-500">Partner Agencies</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            We collaborate with the world's most premium travel agencies to guarantee you safe, unforgettable adventures. Explore our network below.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && agencies.map((agency) => (
            <div 
              key={agency._id} 
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
            >
              {/* Card Header (Logo & Name) */}
              <div className="flex items-center gap-4 mb-5">
                
                {/* 👉 DYNAMIC LOGO LOGIC (Initials vs Real Image) */}
                {shouldShowInitials(agency.logoUrl) ? (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border-4 border-blue-50 dark:border-slate-800 shadow-sm flex items-center justify-center text-white text-xl font-black tracking-wider shrink-0">
                    {getInitials(agency.name)}
                  </div>
                ) : (
                  <img 
                    src={agency.logoUrl} 
                    alt={agency.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-50 dark:border-slate-800 shadow-sm shrink-0"
                    onError={(e) => {
                      // If the provided link is completely broken, fallback to a dummy image automatically
                      e.target.src = "https://images.unsplash.com/photo-1560179707-11c7dfdfa453?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80";
                    }}
                  />
                )}

                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white capitalize">
                    {agency.name}
                  </h3>
                  <div className="flex text-amber-400 text-sm mt-1">
                    {[...Array(agency.rating || 5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                </div>
              </div>

              {/* Agency Description */}
              <p className="text-slate-600 dark:text-slate-400 text-sm flex-grow mb-6 leading-relaxed">
                {agency.description}
              </p>

              {/* Contact Info Footer */}
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 flex justify-center items-center text-blue-600 dark:text-blue-400 shrink-0">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <a href={`mailto:${agency.email}`} className="hover:text-blue-600 transition-colors truncate">
                    {agency.email}
                  </a>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 flex justify-center items-center text-blue-600 dark:text-blue-400 shrink-0">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <span>{agency.phone}</span>
                </div>
              </div>

              {/* View Destination Button */}
              <Link to="/destinations" className="mt-6 w-full text-center py-3 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors duration-300">
                Explore Destinations
              </Link>
            </div>
          ))}
        </div>

        {!loading && agencies.length === 0 && (
          <div className="text-center text-slate-500 py-10">
            No partner agencies listed yet. Check back soon!
          </div>
        )}

      </div>
    </div>
  );
};

export default Agencies;
