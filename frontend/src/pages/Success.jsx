import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-[#0f172a] px-4 py-12 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Centered Success Card */}
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 dark:border-slate-800/50 overflow-hidden transform transition-all text-center p-10 sm:p-14">
        
        {/* Animated Checkmark Circle */}
        <div className="flex justify-center mb-8">
          <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            {/* Pulsing ring for visual flare */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" style={{ animationDuration: '3s' }}></div>
            {/* Static inner ring */}
            <div className="absolute inset-2 rounded-full border-4 border-emerald-500/40"></div>
            
            <svg 
              className="w-12 h-12 text-emerald-500 drop-shadow-sm" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        
        {/* Celebration Header */}
        <h1 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">
          Booking Confirmed! <span className="inline-block animate-bounce" style={{ animationDuration: '2s' }}>🎉</span>
        </h1>
        
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
          Your payment was successful and your trip is officially secured. Get ready for an amazing experience!
        </p>

        {/* Call to Action */}
        <button
          onClick={() => navigate("/destinations")}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dark:focus:ring-offset-slate-900"
        >
          Explore More Destinations
        </button>
        
      </div>
    </div>
  );
}

export default Success;
