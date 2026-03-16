import React, { useState, useEffect } from "react";
import axios from "axios";

function ManageDestinations() {

  const [destinations, setDestinations] = useState([]);

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
      activities: activities.split(",").map((a) => a.trim()),
      itinerary: itinerary.split(",").map((i) => i.trim()),
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

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchDestinations();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ FIXED: all fields are now populated on edit
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
  };

  return (
    <div>

      <h1>Manage Destinations</h1>

      <h3>{editId ? "Edit Destination" : "Add Destination"}</h3>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="text"
        placeholder="Image Name (example: manali.jpg)"
        value={imgSrc}
        onChange={(e) => setImgSrc(e.target.value)}
      />

      <input
        type="text"
        placeholder="Best Time To Visit"
        value={bestTimeToVisit}
        onChange={(e) => setBestTimeToVisit(e.target.value)}
      />

      <input
        type="text"
        placeholder="Tips"
        value={tips}
        onChange={(e) => setTips(e.target.value)}
      />

      <input
        type="text"
        placeholder="Activities (comma separated)"
        value={activities}
        onChange={(e) => setActivities(e.target.value)}
      />

      <input
        type="text"
        placeholder="Itinerary (comma separated)"
        value={itinerary}
        onChange={(e) => setItinerary(e.target.value)}
      />

      <input
        type="text"
        placeholder="Google Map Link"
        value={mapLink}
        onChange={(e) => setMapLink(e.target.value)}
      />

      <h4>Budget Plan</h4>

      <input
        type="text"
        placeholder="Low Budget"
        value={budgetLow}
        onChange={(e) => setBudgetLow(e.target.value)}
      />

      <input
        type="text"
        placeholder="Medium Budget"
        value={budgetMedium}
        onChange={(e) => setBudgetMedium(e.target.value)}
      />

      <input
        type="text"
        placeholder="High Budget"
        value={budgetHigh}
        onChange={(e) => setBudgetHigh(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {editId ? "Update Destination" : "Add Destination"}
      </button>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>

        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Location</th>
            <th>Best Time</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {destinations.map((dest) => (
            <tr key={dest._id}>

              <td>
                {dest.imgSrc && (
                  <img
                    src={`/images/${dest.imgSrc}`}
                    alt={dest.title}
                    width="80"
                  />
                )}
              </td>

              <td>{dest.title}</td>
              <td>{dest.location}</td>
              <td>{dest.bestTimeToVisit}</td>

              <td>
                <button onClick={() => handleEdit(dest)}>
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(dest._id)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default ManageDestinations;