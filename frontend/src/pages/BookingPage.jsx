import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [form, setForm] = useState({
    name: "",
    date: "",
    people: "",
    agency: ""   
  });

  // 🔥 Fetch destination
  useEffect(() => {
    axios.get("http://localhost:5000/api/destinations")
      .then(res => {
        const found = res.data.find(d => String(d._id) === id); // ✅ FIXED
        setDestination(found);
      })
      .catch(err => console.error(err));
  }, [id]);

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Submit → go to payment page
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.date || !form.people) {
      alert("Fill all fields");
      return;
    }
    if (!form.agency) {
      alert("Please select a travel agency");
      return;
    }

    navigate("/payment", {
      state: {
        form,
        destination: destination.title
      }
    });
  };

  // Improved Loading State
  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <h2 className="text-xl font-medium text-slate-600 dark:text-slate-300 animate-pulse">
          Loading destination details...
        </h2>
      </div>
    );
  }

  const agencies = [
    "MakeMyTrip",
    "Yatra",
    "Goibibo",
    "TravelTriangle"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-[#0f172a] px-4 py-12 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Main Card Container */}
      <div className="w-full max-w-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 dark:border-slate-800/50 overflow-hidden transform transition-all">
        
        {/* Header Section */}
        <div className="px-8 pt-10 pb-6 sm:px-12 sm:pt-14 border-b border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
            Booking Details
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">
            Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">{destination.title}</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            {destination.description}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8 sm:p-12 bg-slate-50/50 dark:bg-slate-800/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="date">Travel Date</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>

              {/* People Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="people">Number of Guests</label>
                <input
                  id="people"
                  type="number"
                  name="people"
                  placeholder="e.g. 2"
                  min="1"
                  value={form.people}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>

              {/* Agency Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="agency">Travel Agency</label>
                <div className="relative">
                  <select
                    id="agency"
                    name="agency"
                    value={form.agency}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                  >
                    <option value="" disabled>Select an agency</option>
                    {agencies.map((agencyName, index) => (
                      <option key={index} value={agencyName}>{agencyName}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dark:focus:ring-offset-slate-900"
              >
                Proceed to Payment
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-none sm:w-1/3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 py-3.5 px-6 rounded-xl font-bold text-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 dark:focus:ring-offset-slate-900"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
