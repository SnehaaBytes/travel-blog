import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiSearch, FiTrash2, FiArrowLeft } from "react-icons/fi";
import "./ManageDestinations.css";

const ManageAgencies = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    logoUrl: '' 
  });

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      // Using axios for consistency and better error handling
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/agencies`);
      setAgencies(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', description: '', logoUrl: '' });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload on form submit
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/agencies`, formData);
      
      resetForm();
      fetchAgencies();
      alert("Travel Agency added successfully!");
    } catch (error) {
      console.error('Error saving agency:', error);
      // Alerts you immediately if the backend rejects the save
      alert(`Failed to save agency: ${error.response?.data?.message || 'Server Error. Please try again.'}`);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this partner agency?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/agencies/${id}`);
      
      fetchAgencies();
      if (paginatedAgencies.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error deleting agency:', error);
      alert("Failed to delete agency.");
    }
  };

  const filteredAgencies = agencies.filter((a) => 
    a.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage) || 1;
  const paginatedAgencies = filteredAgencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="md-wrapper">
      <div className="md-background-glow glow-primary"></div>
      <div className="md-background-glow glow-secondary"></div>

      <div className="md-container">
        
        {/* --- MAIN TABLE VIEW --- */}
        {!showForm && (
          <div className="glass-panel fade-in md-full-height">
            
            {/* Toolbar */}
            <div className="md-toolbar">
               <div className="md-toolbar-left">
                  <h3>Manage Agencies</h3>
                  <span className="md-pill-count">{filteredAgencies.length} Total</span>
               </div>
               
               <div className="md-toolbar-right">
                  <div className="md-search-glass">
                    <FiSearch />
                    <input 
                      type="text" 
                      placeholder="Search agencies..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <button className="md-btn-glow" onClick={() => setShowForm(true)}>
                    <FiPlus /> New Agency
                  </button>
               </div>
            </div>

            {/* Table Area */}
            <div className="md-table-wrapper">
              <table className="md-glass-table">
                <thead>
                  <tr>
                    <th>Agency Details</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                   {loading ? (
                       <tr><td colSpan="4" className="md-empty-state">Loading agencies...</td></tr>
                   ) : filteredAgencies.length === 0 ? (
                       <tr><td colSpan="4" className="md-empty-state">{searchQuery ? "No matching partner agencies." : "No agencies found. Add one above!"}</td></tr>
                   ) : (
                       paginatedAgencies.map((agency) => (
                           <tr key={agency._id} className="md-table-row">
                              <td>
                                 <div className="md-cell-flex">
                                    {agency.logoUrl ? (
                                      <img src={agency.logoUrl} alt={agency.name} className="md-row-img" style={{objectFit: 'cover'}} />
                                    ) : (
                                      <div className="md-no-img">N/A</div>
                                    )}
                                    <div>
                                      <strong className="md-row-title">{agency.name}</strong>
                                    </div>
                                 </div>
                              </td>
                              <td style={{color: 'rgba(255,255,255,0.8)'}}>{agency.email}</td>
                              <td style={{color: 'rgba(255,255,255,0.8)'}}>{agency.phone}</td>
                              <td>
                                <div className="md-action-group">
                                   <button className="md-icon-action delete" onClick={() => handleDelete(agency._id)} title="Delete">
                                      <FiTrash2 /> Drop
                                   </button>
                                </div>
                              </td>
                           </tr>
                       ))
                   )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {filteredAgencies.length > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAgencies.length)} of {filteredAgencies.length}
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

        {/* --- ADD AGENCY FORM VIEW --- */}
        {showForm && (
          /* 👉 FIX: Added proper <form> element with onSubmit event */
          <form className="glass-panel fade-in" onSubmit={handleSubmit}>
             <div className="md-form-header">
                <div className="md-header-flex">
                   <button type="button" className="md-btn-back" onClick={resetForm} aria-label="Go back">
                     <FiArrowLeft />
                   </button>
                   <h3>Register Partner Agency</h3>
                </div>
             </div>

             <div className="md-form-section">
                <h4 className="md-section-label">Agency Details</h4>
                <div className="md-grid-2">
                   <div className="md-input-group">
                     <label>Agency Name</label>
                     <input type="text" name="name" placeholder="e.g. Dream Travels" value={formData.name} onChange={handleChange} required />
                   </div>
                   <div className="md-input-group">
                     <label>Contact Email</label>
                     <input type="email" name="email" placeholder="e.g. info@dreamtravels.com" value={formData.email} onChange={handleChange} required />
                   </div>
                   <div className="md-input-group">
                     <label>Phone Number</label>
                     <input type="text" name="phone" placeholder="e.g. +91 98765 43210" value={formData.phone} onChange={handleChange} required />
                   </div>
                   <div className="md-input-group">
                     <label>Logo Image URL (Optional)</label>
                     <input type="text" name="logoUrl" placeholder="https://..." value={formData.logoUrl} onChange={handleChange} />
                   </div>
                </div>
                <div className="md-input-group mt-xl">
                    <label>Description</label>
                    <textarea name="description" placeholder="Write a short description about this travel partner..." value={formData.description} onChange={handleChange} required rows="3"></textarea>
                </div>
             </div>

             <div className="md-form-footer">
               <button type="button" className="md-btn-outline" onClick={resetForm}>Cancel</button>
               {/* 👉 FIX: Changed to type="submit" so native required validation works */}
               <button type="submit" className="md-btn-glow">Save Agency</button>
             </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManageAgencies;
