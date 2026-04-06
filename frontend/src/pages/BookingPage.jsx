import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [agenciesList, setAgenciesList] = useState([]); 
  const [form, setForm] = useState({
    name: "",
    date: "",
    people: "1", 
    agency: ""   
  });

  const today = new Date();
  const maxDate = new Date(today.getFullYear() + 5, today.getMonth(), today.getDate()).toISOString().split("T")[0];
  const minDate = today.toISOString().split("T")[0];

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/destinations`)
      .then(res => {
        const found = res.data.find(d => String(d._id) === id); 
        setDestination(found);
      })
      .catch(err => console.error(err));

    axios.get(`${import.meta.env.VITE_API_URL}/agencies`)
      .then(res => {
        setAgenciesList(res.data.data || []);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === "agency" && e.target.value === "redirect_to_agencies") {
      navigate('/agencies');
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const basePricePerPerson = destination?.price || 7499; 
  const guestCount = parseInt(form.people) >= 1 ? parseInt(form.people) : 1;
  const totalPrice = basePricePerPerson * guestCount;

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
        destination: destination.title,
        totalPrice: totalPrice 
      }
    });
  };

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950">
        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl border border-slate-100 dark:border-slate-700">
          <i className="fas fa-compass text-4xl text-indigo-500 animate-spin-slow"></i>
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white animate-pulse tracking-wide">
          Preparing your journey...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center relative overflow-hidden lg:overflow-y-auto pt-32 pb-16 px-4 sm:px-6 font-sans">
      
      {/* --- Destination Background Imagery (Smart fetch!) --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src={destination.imgSrc ? `/images/${destination.imgSrc}` : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"} 
          alt={destination.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/80 dark:bg-black/85 backdrop-blur-[4px]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {/* --- Main Premium Split Card --- */}
      <div className="relative z-10 w-full max-w-6xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/20 dark:border-slate-800 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ── LEFT SIDE: Destination Summary ── */}
        <div className="w-full lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-indigo-700 to-blue-800 text-white p-10 md:p-14 flex flex-col justify-between">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1.5px,_transparent_1.5px)] bg-[length:24px_24px]"></div>
          
          <div className="relative z-10 mb-12">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm shadow-sm">
              Booking Details
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-tight tracking-tight text-white drop-shadow-md">
              Discover <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
                {destination.title}
              </span>
            </h1>
            
            <p className="text-indigo-100 text-lg opacity-90 leading-relaxed font-light mb-8">
              {destination.description}
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl mt-auto">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Base Price</p>
                   <p className="text-white font-extrabold text-3xl tracking-tight">₹{basePricePerPerson.toLocaleString('en-IN')}</p>
                   <p className="text-indigo-200 text-sm mt-1 flex items-center gap-2 font-medium">
                     <i className="fas fa-user-tag"></i> per person
                   </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-white/20 flex flex-shrink-0 items-center justify-center border border-white/30 text-white text-2xl shadow-inner">
                   <i className="fas fa-ticket-alt"></i>
                </div>
             </div>
          </div>
        </div>

        {/* ── RIGHT SIDE: Booking Form ── */}
        <div className="w-full lg:w-7/12 p-8 md:p-12 lg:p-14 flex flex-col bg-slate-50 dark:bg-transparent">
          
          <div className="mb-8 overflow-hidden">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Traveler Details</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Please enter your dates, agency, and party size to proceed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase ml-1" htmlFor="name">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-user text-slate-400"></i>
                  </div>
                  <input
                    id="name" type="text" name="name" placeholder="E.g. Rahul Sharma"
                    value={form.name} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase ml-1" htmlFor="date">Travel Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-calendar-alt text-slate-400"></i>
                  </div>
                  <input
                    id="date" type="date" name="date" min={minDate} max={maxDate}
                    value={form.date} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              {/* People Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase ml-1" htmlFor="people">Guests</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-users text-slate-400"></i>
                  </div>
                  <input
                    id="people" type="number" name="people" placeholder="E.g. 2" min="1"
                    value={form.people} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              {/* Dynamic Agency Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase ml-1" htmlFor="agency">Travel Partner</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-building text-slate-400"></i>
                  </div>
                  <select
                    id="agency" name="agency"
                    value={form.agency} onChange={handleChange}
                    className="w-full pl-11 pr-10 py-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm font-medium"
                  >
                    <option value="" disabled>Select an agency</option>
                    {agenciesList.length === 0 ? (
                      <option value="" disabled>Loading agencies...</option>
                    ) : (
                      agenciesList.map((agency) => (
                        <option key={agency._id} value={agency.name}>{agency.name}</option>
                      ))
                    )}
                    <option value="redirect_to_agencies" className="text-indigo-600 font-bold bg-indigo-50 dark:bg-slate-800">
                      View details of these agencies...
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <i className="fas fa-chevron-down text-sm"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="mt-8 p-6 lg:p-8 bg-white dark:bg-slate-800/40 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm">
              <div className="flex flex-col text-center sm:text-left">
                 <span className="text-slate-500 dark:text-slate-400 font-bold tracking-wide text-xs uppercase">Quick Math</span>
                 <div className="text-slate-800 dark:text-slate-300 mt-2 font-medium flex items-center justify-center sm:justify-start gap-2">
                    <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600">₹{basePricePerPerson.toLocaleString('en-IN')}</span>
                    <span className="text-slate-400 font-bold">×</span> 
                    <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600">{guestCount} Guests</span>
                 </div>
              </div>
              <div className="w-full sm:w-px h-px sm:h-16 bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex flex-col text-center sm:text-right">
                <span className="text-slate-500 dark:text-slate-400 font-bold tracking-wide text-xs uppercase mb-1">Total Estimate</span>
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 py-5 px-6 rounded-2xl font-extrabold text-xl flex items-center justify-center gap-3 shadow-xl transition-all duration-300 outline-none focus:ring-4 focus:ring-indigo-500/50 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-[length:200%_auto] text-white hover:bg-right hover:shadow-indigo-500/30 transform hover:-translate-y-1"
              >
                Proceed to Payment <i className="fas fa-arrow-right"></i>
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-none sm:w-1/3 py-5 px-6 rounded-2xl font-bold text-lg text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
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
