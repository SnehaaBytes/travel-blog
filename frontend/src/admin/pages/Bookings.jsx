import React, { useEffect, useState } from "react";
import axios from "axios";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Dynamic stats
  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: "fas fa-ticket-alt",
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Pending Approval",
      value: bookings.filter(b => b.status === "pending").length,
      icon: "fas fa-clock",
      color: "from-amber-400 to-orange-500"
    },
    {
      title: "Completed Trips",
      value: bookings.filter(b => b.status === "completed").length,
      icon: "fas fa-check-circle",
      color: "from-emerald-400 to-emerald-500"
    }
  ];

  return (
    <div className="w-full p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">Bookings Overview</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-400 text-sm">{stat.title}</p>
            <h3 className="text-3xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* TABLE OR EMPTY STATE */}
      {bookings.length === 0 ? (
        <h2 className="text-center text-gray-500">No bookings yet</h2>
      ) : (
        <table className="w-full bg-white rounded-xl overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Destination</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">People</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Agency</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="p-3">{b.name}</td>
                <td className="p-3">{b.destination}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">{b.people}</td>
                <td className="p-3">
                  {b.status === "pending" ? "🟡 Pending" : "🟢 Completed"}
                </td>
                <td className="p-3">{b.agency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* REFRESH BUTTON */}
      <div className="mt-6">
        <button
          onClick={fetchBookings}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Refresh
        </button>
      </div>

    </div>
  );
}

export default Bookings;