import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiMapPin, FiArrowLeft, FiImage } from "react-icons/fi";
import "./ManageDestinations.css";

function ManageDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [price, setPrice] = useState(""); 
  
  const [bestTimeToVisit, setBestTimeToVisit] = useState("");
  const [tips, setTips] = useState("");
  const [activities, setActivities] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [mapLink, setMapLink] = useState("");

  const [budgetLow, setBudgetLow] = useState("");
  const [budgetMedium, setBudgetMedium] = useState("");
  const [budgetHigh, setBudgetHigh] = useState("");

  const [editId, setEditId] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/destinations`;

  const fetchDestinations = async () => {
    try {
      const res = await axios.get(API_URL);
      setDestinations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleSubmit = async () => {
    const destinationData = {
      title,
      description,
      location,
      imgSrc,
      price: price ? Number(price) : 12499, 
      bestTimeToVisit,
      tips,
      mapLink,
      activities: activities
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a !== ""),
      itinerary: itinerary
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i !== ""),
      budgetPlan: {
        low: budgetLow,
        medium: budgetMedium,
        high: budgetHigh,
      },
    };

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, destinationData);
      } else {
        await axios.post(API_URL, destinationData);
      }

      fetchDestinations();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchDestinations();
        
        if (paginatedDestinations.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (dest) => {
    setTitle(dest.title);
    setDescription(dest.description);
    setLocation(dest.location);
    setImgSrc(dest.imgSrc);
    setPrice(dest.price || ""); 
    setBestTimeToVisit(dest.bestTimeToVisit);
    setTips(dest.tips);
    setMapLink(dest.mapLink || "");
    setActivities(dest.activities ? dest.activities.join(", ") : "");
    setItinerary(dest.itinerary ? dest.itinerary.join(", ") : "");
    setBudgetLow(dest.budgetPlan?.low || "");
    setBudgetMedium(dest.budgetPlan?.medium || "");
    setBudgetHigh(dest.budgetPlan?.high || "");
    setEditId(dest._id);
    
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
      setTitle("");
      setDescription("");
      setLocation("");
      setImgSrc("");
      setPrice(""); 
      setBestTimeToVisit("");
      setTips("");
      setActivities("");
      setItinerary("");
      setMapLink("");
      setBudgetLow("");
      setBudgetMedium("");
      setBudgetHigh("");
      setEditId(null);
      
      setShowForm(false);
  };

  const filteredDestinations = destinations.filter((dest) => 
    dest.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    dest.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage) || 1;
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="md-wrapper">
      <div className="md-background-glow glow-primary"></div>
      <div className="md-background-glow glow-secondary"></div>

      <div className="md-container">
        
        {!showForm && (
          <div className="glass-panel fade-in md-full-height">
            <div className="md-toolbar">
              <div className="md-toolbar-left">
                <h3>Destination Directory</h3>
                <span className="md-pill-count">{filteredDestinations.length} Total</span>
              </div>
              
              <div className="md-toolbar-right">
                <div className="md-search-glass">
                  <FiSearch />
                  <input 
                    type="text" 
                    placeholder="Search locations..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <button className="md-btn-glow" onClick={() => setShowForm(true)}>
                  <FiPlus /> New Destination
                </button>
              </div>
            </div>

            <div className="md-table-wrapper">
              <table className="md-glass-table">
                <thead>
                  <tr>
                    <th>Location Data</th>
                    <th>Price</th>
                    <th>Best Season</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDestinations.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="md-empty-state">
                        {searchQuery ? "No matching locations." : "No destinations found. Add one above!"}
                      </td>
                    </tr>
                  ) : (
                    paginatedDestinations.map((dest) => (
                      <tr key={dest._id} className="md-table-row">
                        <td>
                          <div className="md-cell-flex">
                            {dest.imgSrc ? (
                              <img src={`/images/${dest.imgSrc}`} alt={dest.title} className="md-row-img" />
                            ) : (
                              <div className="md-no-img">N/A</div>
                            )}
                            <div>
                              <strong className="md-row-title">{dest.title}</strong>
                              <span className="md-row-subtitle"><FiMapPin /> {dest.location}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                           <span style={{color: '#f5c842', fontWeight: 600}}>₹{dest.price ? dest.price.toLocaleString('en-IN') : '12,499'}</span>
                        </td>
                        <td>
                          <span className="md-season-badge">{dest.bestTimeToVisit || "Year Round"}</span>
                        </td>
                        <td>
                          <div className="md-action-group">
                            <button className="md-icon-action edit" onClick={() => handleEdit(dest)} title="Edit">
                              <FiEdit2 /> Edit
                            </button>
                            <button className="md-icon-action delete" onClick={() => handleDelete(dest._id)} title="Delete">
                              <FiTrash2 /> Drop
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {filteredDestinations.length > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDestinations.length)} of {filteredDestinations.length}
                  </span>
                  
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", margin: 0, color: "white", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}
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
                          color: "white", cursor: "pointer", fontWeight: "bold"
                        }}
                      >
                        {idx + 1}
                      </button>
                    ))}

                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", margin: 0, color: "white", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showForm && (
          <div className="glass-panel fade-in">
            <div className="md-form-header">
              <div className="md-header-flex">
                  <button className="md-btn-back" onClick={resetForm} aria-label="Go back">
                    <FiArrowLeft />
                  </button>
                  <h3>{editId ? "Update Platform Destination" : "Add Platform Destination"}</h3>
              </div>
              {editId && <span className="md-badge editing"><span className="pulse-dot"></span> EDITING MODE</span>}
            </div>

            <div className="md-form-section">
              <h4 className="md-section-label">Core Details</h4>
              <div className="md-grid-2">
                <div className="md-input-group">
                  <label>Title</label>
                  <input type="text" placeholder="e.g. Manali" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="md-input-group">
                  <label>Price Per Person (₹)</label>
                  <input type="number" placeholder="e.g. 15000" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="md-input-group">
                  <label>Location</label>
                  <input type="text" placeholder="e.g. India" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                
                {/* 👉 NEW: Native File Picker for selecting image names directly from device! */}
                <div className="md-input-group">
                  <label>Destination Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                      <FiImage style={{ fontSize: '18px' }} />
                      Choose File
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                             setImgSrc(file.name); 
                          }
                        }} 
                      />
                    </label>

                    {imgSrc && (
                       <span style={{ fontSize: '13px', color: '#4facfe', fontWeight: '600', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '6px 12px', background: 'rgba(79, 172, 254, 0.1)', borderRadius: '6px', border: '1px solid rgba(79, 172, 254, 0.3)' }}>
                          {imgSrc}
                       </span>
                    )}

                  </div>
                </div>

              </div>
              <div className="md-input-group mt-xl">
                <label>Google Map Link</label>
                <input type="text" placeholder="https://..." value={mapLink} onChange={(e) => setMapLink(e.target.value)} />
              </div>
              <div className="md-input-group mt-xl">
                <label>Description</label>
                <textarea placeholder="Write a captivating description..." value={description} onChange={(e) => setDescription(e.target.value)} rows="3"></textarea>
              </div>
            </div>

            <div className="md-form-section">
              <h4 className="md-section-label">Travel Intel</h4>
              <div className="md-grid-2">
                <div className="md-input-group">
                  <label>Best Time To Visit</label>
                  <input type="text" placeholder="e.g. October to February" value={bestTimeToVisit} onChange={(e) => setBestTimeToVisit(e.target.value)} />
                </div>
                <div className="md-input-group">
                  <label>Tips</label>
                  <input type="text" placeholder="e.g. Carry warm clothes" value={tips} onChange={(e) => setTips(e.target.value)} />
                </div>
              </div>
              <div className="md-input-group mt-xl">
                <label>Activities <span className="md-hint">(Comma separated)</span></label>
                <input type="text" placeholder="e.g. Skiing, Trekking" value={activities} onChange={(e) => setActivities(e.target.value)} />
              </div>
              <div className="md-input-group mt-xl">
                <label>Itinerary <span className="md-hint">(Comma separated)</span></label>
                <textarea placeholder="Day 1: Arrival..." value={itinerary} onChange={(e) => setItinerary(e.target.value)} rows="3"></textarea>
              </div>
            </div>

            <div className="md-form-section">
              <h4 className="md-section-label">Budget Forecast</h4>
              <div className="md-grid-3">
                <div className="md-input-group">
                  <label>Low Budget</label>
                  <input type="text" placeholder="e.g. $500" value={budgetLow} onChange={(e) => setBudgetLow(e.target.value)} />
                </div>
                <div className="md-input-group">
                  <label>Medium Budget</label>
                  <input type="text" placeholder="e.g. $1000" value={budgetMedium} onChange={(e) => setBudgetMedium(e.target.value)} />
                </div>
                <div className="md-input-group">
                  <label>High Budget</label>
                  <input type="text" placeholder="e.g. $2000+" value={budgetHigh} onChange={(e) => setBudgetHigh(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="md-form-footer">
              <button className="md-btn-outline" onClick={resetForm}>
                Cancel
              </button>
              <button className="md-btn-glow" onClick={handleSubmit}>
                {editId ? "Update Destination" : "Save Destination"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ManageDestinations;
