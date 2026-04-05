import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiRefreshCw, FiEdit2, FiTrash2, FiMapPin, FiSearch } from "react-icons/fi";
// 👉 Boom! The magic CSS file that unifies the dashboard
import "./ManageDestinations.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${id}`);
        const updatedBookings = bookings.filter((b) => b._id !== id);
        setBookings(updatedBookings);
        
        const newTotalPages = Math.ceil(updatedBookings.length / itemsPerPage) || 1;
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
      } catch (err) {
        console.error("Failed to delete booking:", err);
        alert("Failed to delete the booking.");
      }
    }
  };

  const handleEdit = (booking) => {
    console.log("Edit booking:", booking);
    alert(`Edit mode for ${booking.name}. Modal can be integrated here!`);
  };

  // Search Filter
  const filteredBookings = bookings.filter((b) => 
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.agency?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Dynamic stats
  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: "fas fa-ticket-alt",
      color: "var(--primary-color, #4facfe)"
    },
    {
      title: "Pending Approval",
      value: bookings.filter(b => b.status === "pending").length,
      icon: "fas fa-clock",
      color: "#f5c842"
    },
    {
      title: "Completed Trips",
      value: bookings.filter(b => b.status !== "pending").length,
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
              <h3>Reservations</h3>
              <span className="md-pill-count">{filteredBookings.length} Found</span>
            </div>
            
            <div className="md-toolbar-right">
              <div className="md-search-glass">
                <FiSearch />
                <input 
                  type="text" 
                  placeholder="Search guests or destinations..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button className="md-btn-outline" onClick={fetchBookings} disabled={isLoading}>
                <FiRefreshCw className={isLoading ? "fa-spin" : ""} /> {isLoading ? "Refreshing..." : "Sync Data"}
              </button>
            </div>
          </div>

          <div className="md-table-wrapper">
            <table className="md-glass-table">
              <thead>
                <tr>
                  <th>Guest Info</th>
                  <th>Destination</th>
                  <th>Travel Date</th>
                  <th style={{textAlign: 'center'}}>Guests</th>
                  <th>Partner Agency</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="7" className="md-empty-state"><i className="fas fa-compass fa-spin"></i> Fetching bookings...</td></tr>
                ) : filteredBookings.length === 0 ? (
                  <tr><td colSpan="7" className="md-empty-state">{searchQuery ? "No matching bookings." : "Your travel agenda is empty."}</td></tr>
                ) : (
                  paginatedBookings.map((b) => (
                    <tr key={b._id} className="md-table-row">
                      
                      <td>
                        <div className="md-cell-flex">
                           <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)', fontSize: '18px'}}>
                             {b.name?.charAt(0)?.toUpperCase() || "?"}
                           </div>
                           <strong className="md-row-title">{b.name}</strong>
                        </div>
                      </td>
                      
                      <td style={{color: 'rgba(255,255,255,0.9)', fontWeight: 500}}>
                        <FiMapPin style={{marginRight: '6px', color: '#f5c842', verticalAlign: 'text-bottom'}} /> 
                        {b.destination}
                      </td>
                      
                      <td style={{color: 'rgba(255,255,255,0.7)'}}>
                        <i className="far fa-calendar-alt" style={{marginRight: '6px'}}></i> 
                        {b.date}
                      </td>
                      
                      <td style={{textAlign: 'center'}}>
                        <span style={{background: 'rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', color: 'white', border: '1px solid rgba(255,255,255,0.1)'}}>
                          {b.people}
                        </span>
                      </td>
                      
                      <td style={{color: 'rgba(255,255,255,0.8)', fontStyle: 'italic'}}>{b.agency}</td>
                      
                      <td>
                        <span style={{
                          padding: '6px 12px', 
                          borderRadius: '8px', 
                          fontSize: '11px', 
                          fontWeight: 'bold', 
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          background: b.status === "pending" ? 'rgba(245, 200, 66, 0.15)' : 'rgba(76, 175, 80, 0.15)',
                          color: b.status === "pending" ? '#f5c842' : '#4caf50',
                          border: `1px solid ${b.status === "pending" ? 'rgba(245, 200, 66, 0.3)' : 'rgba(76, 175, 80, 0.3)'}`
                        }}>
                          {b.status === "pending" ? (
                            <><i className="fas fa-circle" style={{fontSize: '8px', marginRight: '4px', verticalAlign: 'middle'}}></i> PENDING</>
                          ) : (
                            <><i className="fas fa-check" style={{marginRight: '4px'}}></i> CONFIRMED</>
                          )}
                        </span>
                      </td>
                      
                      <td>
                        <div className="md-action-group">
                          <button className="md-icon-action edit" onClick={() => handleEdit(b)} title="Edit">
                            <FiEdit2 />
                          </button>
                          <button className="md-icon-action delete" onClick={() => handleDelete(b._id)} title="Delete">
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
            {filteredBookings.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length}
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
}

export default Bookings;
