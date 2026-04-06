import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FiUsers,
  FiMapPin,
  FiTrendingUp,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./Dashboard.css";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

// Stat Card
const StatCard = ({ title, value, icon }) => (
  <div className="dash-stat-card glass-panel">
    <div className="dash-stat-header">
      <div>
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
      <div className="dash-stat-icon-wrapper">{icon}</div>
    </div>
  </div>
);

function Dashboard() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = `${import.meta.env.VITE_API_URL}/destinations`;

  useEffect(() => {
    axios
      .get(API)
      .then((res) => setDestinations(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 🔥 REAL ANALYTICS

  const totalDestinations = destinations.length;

  const popularDestinations = destinations.filter((d) => d.isPopular).length;

  const totalStates = new Set(destinations.map((d) => d.location)).size;

  // 📊 Chart 1: Destinations per state
  const stateData = Object.values(
    destinations.reduce((acc, curr) => {
      acc[curr.location] = acc[curr.location] || {
        name: curr.location,
        count: 0,
      };
      acc[curr.location].count += 1;
      return acc;
    }, {})
  );

  // 📊 Chart 2: Popular vs Normal
  const popularityData = [
    { name: "Popular", value: popularDestinations },
    { name: "Normal", value: totalDestinations - popularDestinations },
  ];

  const recentDestinations = [...destinations].reverse().slice(0, 5);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Real-time analytics of your travel platform</p>
          </div>

          <Link to="/admin/destinations" className="dash-btn">
            <FiPlus /> Add Destination
          </Link>
        </div>

        {/* Stats */}
        <div className="dash-metrics-grid">
          <StatCard
            title="Total Destinations"
            value={loading ? "..." : totalDestinations}
            icon={<FiMapPin />}
          />

          <StatCard
            title="Popular Destinations"
            value={loading ? "..." : popularDestinations}
            icon={<FiTrendingUp />}
          />

          <StatCard
            title="States Covered"
            value={loading ? "..." : totalStates}
            icon={<FiUsers />}
          />
        </div>

        {/* 📊 Charts Section */}
        <div className="dash-charts-grid">

          {/* Bar Chart */}
          <div className="glass-panel chart-box">
            <h3>Destinations per State</h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stateData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="glass-panel chart-box">
            <h3>Popularity Distribution</h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={popularityData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {popularityData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="dash-recent-section glass-panel">
          <div className="dash-section-header">
            <h3>Recent Destinations</h3>
            <Link to="/admin/destinations">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="dash-table-wrapper">
            <table className="dash-list-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3">Loading...</td>
                  </tr>
                ) : (
                  recentDestinations.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="dash-table-cell-img">
                          <img
                            src={`/images/${item.imgSrc}`}
                            alt={item.title}
                          />
                          <span>{item.title}</span>
                        </div>
                      </td>

                      <td>{item.location}</td>

                      <td>
                        {item.isPopular ? "Popular" : "Normal"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;