import React, { useEffect, useState } from "react";
import axios from "axios";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 NEW: Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can change how many items show per page here

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

  // 🔥 NEW: Delete Function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${id}`);
        // Remove from the UI list
        const updatedBookings = bookings.filter((b) => b._id !== id);
        setBookings(updatedBookings);
        
        // Go back a page if we deleted the last item on the current page
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

  // 🔥 NEW: Edit Function
  const handleEdit = (booking) => {
    console.log("Edit booking:", booking);
    alert(`Edit mode for ${booking.name}. Implement your edit modal here!`);
  };

  // 🔥 NEW: Paging Calculations
  const totalPages = Math.ceil(bookings.length / itemsPerPage) || 1;
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Dynamic stats with expanded theme data
  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: "fas fa-ticket-alt",
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Pending Approval",
      value: bookings.filter(b => b.status === "pending").length,
      icon: "fas fa-clock",
      color: "from-amber-400 to-orange-500",
      bgLight: "bg-amber-50",
      iconColor: "text-amber-500"
    },
    {
      title: "Completed Trips",
      value: bookings.filter(b => b.status === "completed").length,
      icon: "fas fa-check-circle",
      color: "from-emerald-400 to-emerald-500",
      bgLight: "bg-emerald-50",
      iconColor: "text-emerald-500"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      
      {/* HEADER & REFRESH BUTTON */}
      <div className="flex flex-col md:flex-row md:items-end w-full justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Bookings Overview
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Manage and track all your travel reservations
          </p>
        </div>
        
        <button
          onClick={fetchBookings}
          disabled={isLoading}
          className="group flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
        >
          <i className={`fas fa-sync-alt ${isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}></i>
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            {/* Left Accent Bar */}
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${stat.color}`}></div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">
                  {stat.title}
                </p>
                <h3 className="text-4xl font-black text-gray-800">
                  {stat.value}
                </h3>
              </div>
              <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${stat.bgLight} group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${stat.icon} text-2xl ${stat.iconColor}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE OR EMPTY STATE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
            {bookings.length} total
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-folder-open text-3xl text-gray-300"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">No bookings found</h3>
            <p className="text-gray-500 max-w-sm">When new bookings are made, they will appear here in your dashboard.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold first:pl-6">Guest Info</th>
                    <th className="p-4 font-bold">Destination</th>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold text-center">Guests</th>
                    <th className="p-4 font-bold">Agency</th>
                    <th className="p-4 font-bold">Status</th>
                    {/* 🔥 NEW: Actions Header */}
                    <th className="p-4 font-bold text-center last:pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {paginatedBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 first:pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold shadow-inner">
                            {b.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="font-semibold text-gray-800">{b.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-map-marker-alt text-red-400"></i>
                          {b.destination}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 border-none whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <i className="far fa-calendar-alt text-gray-400"></i>
                          {b.date}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-xs">
                          {b.people}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 font-medium">
                        {b.agency}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                            b.status === "pending"
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${b.status === "pending" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}></span>
                          {b.status === "pending" ? "Pending" : "Completed"}
                        </span>
                      </td>
                      {/* 🔥 NEW: Actions Buttons */}
                      <td className="p-4 text-center last:pr-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(b)}
                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors flex items-center justify-center shadow-sm"
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(b._id)}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors flex items-center justify-center shadow-sm"
                            title="Delete"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 🔥 NEW: Pagination Controls */}
            {bookings.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-gray-500 font-medium">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, bookings.length)} of {bookings.length} entries
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${
                        currentPage === idx + 1
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>

    </div>
  );
}

export default Bookings;
