import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiMapPin, FiArrowLeft } from "react-icons/fi";
import "./ManageDestinations.css";

function ManageDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [bestTimeToVisit, setBestTimeToVisit] = useState("");
  const [tips, setTips] = useState("");
  const [activities, setActivities] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [mapLink, setMapLink] = useState("");

  const [budgetLow, setBudgetLow] = useState("");
  const [budgetMedium, setBudgetMedium] = useState("");
  const [budgetHigh, setBudgetHigh] = useState("");

  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:5000/api/destinations";

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

  return (
    <div className="md-wrapper">
      {/* Ambient background glows inherited from Dashboard style */}
      <div className="md-background-glow glow-primary"></div>
      <div className="md-background-glow glow-secondary"></div>

      <div className="md-container">
        
        {/* === VIEW 1: TABLE LIBRARY === */}
        {!showForm && (
          <div className="glass-panel fade-in md-full-height">
            {/* Toolbar Header */}
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
                    <th>Best Season</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDestinations.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="md-empty-state">
                        {searchQuery ? "No matching locations." : "No destinations found. Add one above!"}
                      </td>
                    </tr>
                  ) : (
                    filteredDestinations.map((dest) => (
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
            </div>
          </div>
        )}

        {/* === VIEW 2: FORM SECTION === */}
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

            {/* Form Fields wrapped in glass sections */}
            <div className="md-form-section">
              <h4 className="md-section-label">Core Details</h4>
              <div className="md-grid-2">
                <div className="md-input-group">
                  <label>Title</label>
                  <input type="text" placeholder="e.g. Manali" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="md-input-group">
                  <label>Location</label>
                  <input type="text" placeholder="e.g. India" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="md-input-group">
                  <label>Image Name</label>
                  <input type="text" placeholder="e.g. manali.jpg" value={imgSrc} onChange={(e) => setImgSrc(e.target.value)} />
                </div>
                <div className="md-input-group">
                  <label>Google Map Link</label>
                  <input type="text" placeholder="https://..." value={mapLink} onChange={(e) => setMapLink(e.target.value)} />
                </div>
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
