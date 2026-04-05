import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiRefreshCw, FiTrash2, FiSearch, FiCheck, FiX, FiLink } from "react-icons/fi";
// 👉 Import the unified admin CSS
import "./ManageDestinations.css";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchReviews = async () => {
    try {
      setLoading(true);
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
        const updatedReviews = reviews.filter(review => review._id !== id);
        setReviews(updatedReviews);
        
        // Go back a page if we deleted the last item on the current page
        const newTotalPages = Math.ceil(updatedReviews.length / itemsPerPage) || 1;
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
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

  // Search Filter
  const filteredReviews = reviews.filter((r) => 
    r.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.comment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Dynamic stats
  const stats = [
    {
      title: "Total Reviews",
      value: reviews.length,
      icon: "fas fa-comments",
      color: "var(--primary-color, #4facfe)"
    },
    {
      title: "Pending Approval",
      value: reviews.filter(r => r.status === "pending").length,
      icon: "fas fa-clock",
      color: "#f5c842"
    },
    {
      title: "Approved",
      value: reviews.filter(r => r.status === "approved").length,
      icon: "fas fa-check-circle",
      color: "#4caf50"
    }
  ];

  return (
    <div className="md-wrapper">
      <div className="md-background-glow glow-primary"></div>
      <div className="md-background-glow glow-secondary"></div>

      <div className="md-container">
        
        {/* --- DYNAMIC STATS WIDGETS --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
           {stats.map((stat, idx) => (
             <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <p style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', marginBottom: '8px' }}>{stat.title}</p>
                 <h3 style={{ fontSize: '38px', margin: 0, color: 'white', fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{stat.value}</h3>
               </div>
               <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 4px 10px rgba(255,255,255,0.05)' }}>
                 <i className={stat.icon} style={{ fontSize: '24px', color: stat.color, filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))' }}></i>
               </div>
             </div>
           ))}
        </div>

        {/* --- MAIN TABLE PANEL --- */}
        <div className="glass-panel fade-in md-full-height">
          
          <div className="md-toolbar">
            <div className="md-toolbar-left">
              <h3>Moderate Reviews</h3>
              <span className="md-pill-count">{filteredReviews.length} Found</span>
            </div>
            
            <div className="md-toolbar-right">
              <div className="md-search-glass">
                <FiSearch />
                <input 
                  type="text" 
                  placeholder="Search reviews or authors..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button className="md-btn-outline" onClick={fetchReviews} disabled={loading}>
                <FiRefreshCw className={loading ? "fa-spin" : ""} /> {loading ? "Refreshing..." : "Sync Data"}
              </button>
            </div>
          </div>

          <div className="md-table-wrapper">
            <table className="md-glass-table">
              <thead>
                <tr>
                  <th>Author & Destination</th>
                  <th>Review Snippet</th>
                  <th style={{textAlign: 'center'}}>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="md-empty-state"><i className="fas fa-spinner fa-spin"></i> Fetching reviews...</td></tr>
                ) : filteredReviews.length === 0 ? (
                  <tr><td colSpan="4" className="md-empty-state">{searchQuery ? "No matching reviews." : "No traveler reviews submitted yet."}</td></tr>
                ) : (
                  paginatedReviews.map((review) => (
                    <tr key={review._id} className="md-table-row">
                      
                      {/* Author & Dest */}
                      <td>
                        <div className="md-cell-flex" style={{ alignItems: 'flex-start' }}>
                           <img 
                             src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.name || 'Anonymous')}&background=random&color=fff&bold=true`} 
                             alt={review.name} 
                             style={{width: '44px', height: '44px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', objectFit: 'cover'}}
                           />
                           <div>
                             <strong className="md-row-title" style={{ display: 'block', marginBottom: '2px' }}>{review.name}</strong>
                             <span style={{ fontSize: '13px', color: '#4facfe', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                               <i className="fas fa-map-marker-alt"></i> {review.destination}
                             </span>
                             <div style={{ display: 'flex', gap: '3px', color: '#f5c842', fontSize: '11px', marginTop: '6px' }}>
                               {Array.from({ length: 5 }).map((_, i) => (
                                 <i key={i} className={`fas fa-star ${i >= review.rating ? 'opacity-30' : ''}`}></i>
                               ))}
                             </div>
                             {review.blogUrl && (
                               <a href={review.blogUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(79, 172, 254, 0.2)', color: '#4facfe', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', marginTop: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                                 <FiLink /> Visit Blog
                               </a>
                             )}
                           </div>
                        </div>
                      </td>
                      
                      {/* Review Snippet */}
                      <td style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '320px', fontStyle: 'italic', fontSize: '13px', lineHeight: '1.6' }}>
                        "{review.comment.length > 120 ? review.comment.substring(0, 120) + "..." : review.comment}"
                      </td>
                      
                      {/* Status */}
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          padding: '6px 12px', 
                          borderRadius: '8px', 
                          fontSize: '11px', 
                          fontWeight: 'bold', 
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          background: review.status === 'approved' ? 'rgba(76, 175, 80, 0.15)' : review.status === 'rejected' ? 'rgba(244, 67, 54, 0.15)' : 'rgba(245, 200, 66, 0.15)',
                          color: review.status === 'approved' ? '#4caf50' : review.status === 'rejected' ? '#f44336' : '#f5c842',
                          border: `1px solid ${review.status === 'approved' ? 'rgba(76, 175, 80, 0.3)' : review.status === 'rejected' ? 'rgba(244, 67, 54, 0.3)' : 'rgba(245, 200, 66, 0.3)'}`
                        }}>
                          {review.status}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td>
                        <div className="md-action-group" style={{ justifyContent: 'flex-start' }}>
                          {review.status !== 'approved' && (
                            <button className="md-icon-action" style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', border: '1px solid rgba(76, 175, 80, 0.3)' }} onClick={() => updateStatus(review._id, 'approved')} title="Approve">
                               <FiCheck />
                            </button>
                          )}
                          {review.status !== 'rejected' && (
                            <button className="md-icon-action" style={{ background: 'rgba(255, 152, 0, 0.1)', color: '#ff9800', border: '1px solid rgba(255, 152, 0, 0.3)' }} onClick={() => updateStatus(review._id, 'rejected')} title="Reject">
                               <FiX />
                            </button>
                          )}
                          <button className="md-icon-action delete" onClick={() => handleDelete(review._id)} title="Delete">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {filteredReviews.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredReviews.length)} of {filteredReviews.length}
                </span>
                
                <div style={{ display: "flex", gap: "6px" }}>
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", margin: 0, color: "white", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1, fontWeight: 'bold' }}
                  >
                    Prev
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      style={{ 
                        width: "34px", height: "34px", borderRadius: "8px", 
                        border: currentPage === idx + 1 ? "none" : "1px solid rgba(255,255,255,0.1)", 
                        background: currentPage === idx + 1 ? "var(--primary-color, #4facfe)" : "rgba(255,255,255,0.05)", 
                        color: "white", cursor: "pointer", fontWeight: "bold",
                        boxShadow: currentPage === idx + 1 ? '0 4px 10px rgba(79, 172, 254, 0.4)' : 'none'
                      }}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", margin: 0, color: "white", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1, fontWeight: 'bold' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageReviews;
