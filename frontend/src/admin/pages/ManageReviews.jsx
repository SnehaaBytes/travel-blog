import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Fetching the /admin endpoint which gets ALL reviews (even pending ones)
      const res = await axios.get('http://localhost:5000/api/reviews/admin'); 
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this review?")) {
      try {
        await axios.delete(`http://localhost:5000/api/reviews/${id}`);
        setReviews(reviews.filter(review => review._id !== id));
      } catch (error) {
        console.error("Error deleting review", error);
      }
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/reviews/${id}/status`, { status: newStatus });
      setReviews(reviews.map(review => review._id === id ? { ...review, status: newStatus } : review));
    } catch (error) {
      console.error("Error updating review status", error);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-bold text-xl"><i className="fas fa-spinner fa-spin mr-2"></i> Loading Reviews...</div>;

  return (
    <div className="p-8 font-sans w-full max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">Moderate Reviews</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Approve, reject, or delete user-submitted travel stories.</p>
      
      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <th className="p-5 font-bold text-slate-700 dark:text-slate-300">Author & Dest.</th>
              <th className="p-5 font-bold text-slate-700 dark:text-slate-300">Review Snippet</th>
              <th className="p-5 font-bold text-slate-700 dark:text-slate-300 text-center">Status</th>
              <th className="p-5 font-bold text-slate-700 dark:text-slate-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition duration-150">
                
                <td className="p-5 align-top">
                  <div className="font-bold text-lg text-slate-900 dark:text-white">{review.name}</div>
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1"><i className="fas fa-map-marker-alt"></i> {review.destination}</div>
                  <div className="flex gap-1 text-xs text-amber-500 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < review.rating ? '' : 'text-slate-300 dark:text-slate-700'}`}></i>
                    ))}
                  </div>
                  {review.blogUrl && (
                    <a href={review.blogUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:underline">
                      <i className="fas fa-link mr-1"></i> Visit Blog
                    </a>
                  )}
                </td>
                
                <td className="p-5 align-top text-slate-600 dark:text-slate-400 max-w-sm">
                  <p className="line-clamp-4 italic">"{review.comment}"</p>
                </td>
                
                <td className="p-5 align-middle text-center">
                  <span className={`px-4 py-1.5 text-xs font-black tracking-wider uppercase rounded-full ${
                    review.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    review.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {review.status}
                  </span>
                </td>

                <td className="p-5 align-middle text-center">
                  <div className="flex items-center justify-center gap-2">
                    {review.status !== 'approved' && (
                      <button onClick={() => updateStatus(review._id, 'approved')} className="w-10 h-10 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white dark:bg-green-900/20 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white rounded-xl transition-all shadow-sm" title="Approve">
                        <i className="fas fa-check"></i>
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button onClick={() => updateStatus(review._id, 'rejected')} className="w-10 h-10 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white dark:bg-orange-900/20 dark:text-orange-500 dark:hover:bg-orange-600 dark:hover:text-white rounded-xl transition-all shadow-sm" title="Reject">
                         <i className="fas fa-times"></i>
                      </button>
                    )}
                    <button onClick={() => handleDelete(review._id)} className="w-10 h-10 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white dark:bg-red-900/20 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white rounded-xl transition-all shadow-sm" title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {reviews.length === 0 && (
              <tr>
                <td colSpan="4" className="p-16 text-center text-slate-500 dark:text-slate-400 border-none font-semibold text-lg">
                  <i className="fas fa-inbox text-4xl mb-4 text-slate-300 dark:text-slate-700 block"></i>
                  No reviews have been submitted yet!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageReviews;
