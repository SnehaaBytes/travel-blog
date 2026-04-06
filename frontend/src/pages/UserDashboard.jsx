import { useAuth } from "../services/AuthContext";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [data, setData] = useState({ bookings: [], reviews: [], favorites: [] });
  const [loading, setLoading] = useState(true);

  // Get the logged in username from localStorage
  const { user } = useAuth();
  const username = user ? user.username : null;

   useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (!username) return; // Stop if not logged in
        
        // 1. Fetch Bookings and Favorites from the original dashboard route
        const response = await axios.get(`http://localhost:5000/api/users/${username}/dashboard`);
        
        let myReviews = [];
        try {
          // 2. Fetch EVERY review from your perfectly working generic Reviews API
          const allReviewsRes = await axios.get(`http://localhost:5000/api/reviews`);
          
          // 3. Keep ONLY the ones where the "name" matches your username!
          // (Using toLowerCase so it matches even if you typed "Neha5678")
          myReviews = allReviewsRes.data.filter(
            r => r.name && r.name.toLowerCase() === username.toLowerCase()
          );
        } catch (reviewErr) {
          console.error("Failed to load reviews from DB", reviewErr);
        }

        // 4. Combine them!
        setData({
          bookings: response.data.data.bookings || [],
          favorites: response.data.data.favorites || [],
          reviews: myReviews // 👉 Injected our bulletproof reviews here!
        });

      } catch (error) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [username]);


  if (!username) {
    return <div className="text-center mt-20 text-2xl font-semibold">Please log in to view your dashboard.</div>;
  }

  if (loading) {
    return <div className="text-center mt-20 text-xl font-semibold animate-pulse">Loading your profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome back, <span className="text-blue-600">{username}</span>!</h1>
            <p className="mt-2 text-gray-500">Manage your bookings, reviews, and favorite destinations all in one place.</p>
          </div>
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl uppercase">
            {username.charAt(0)}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-gray-200 pb-2">
          {['bookings', 'favorites', 'reviews'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-t-lg font-medium text-sm transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content Rendering */}
        <div className="bg-white rounded-b-3xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
          
          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">My Bookings</h2>
              {data.bookings.length === 0 ? (
                <p className="text-gray-500 italic">You haven't made any bookings yet.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {data.bookings.map((booking, idx) => (
                    <div key={idx} className="p-6 border rounded-2xl bg-gray-50 hover:shadow-md transition-shadow">
                      <p className="font-bold text-lg text-blue-600">{booking.destination}</p>
                      <p className="text-gray-600 mt-2">📅 Date: {booking.date}</p>
                      <p className="text-gray-600">👥 People: {booking.people}</p>
                      <span className="inline-block mt-4 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FAVORITES TAB */}
          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">My Favorites</h2>
              {data.favorites.length === 0 ? (
                <p className="text-gray-500 italic">No favorite destinations yet.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {data.favorites.map((fav, idx) => (
                    <Link 
                      to="/destinations" 
                      state={{ destinationTitle: fav.title, from: "home" }} 
                      key={idx} 
                      className="block rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="h-48 bg-gray-200 overflow-hidden relative">
                        <img 
                          src={`/images/${fav.imgSrc}`} 
                          alt={fav.title || "Destination"} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Image+Not+Found'; }}
                        />
                      </div>
                      <div className="p-4 bg-white relative">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{fav.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">My Posted Reviews</h2>
              {data.reviews.length === 0 ? (
                <p className="text-gray-500 italic">You haven't posted any reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {data.reviews.map((review, idx) => (
                    <div key={idx} className="p-6 border rounded-2xl flex justify-between items-start hover:shadow-sm">
                      <div>
                        <p className="font-bold text-lg">{review.destination || "General"}</p>
                        <p className="text-yellow-500 my-1">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</p>
                        <p className="text-gray-600">"{review.review}"</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${review.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                        {review.status || 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
