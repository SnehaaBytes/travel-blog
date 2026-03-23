import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { form, destination } = state || {};

  // Redesigned empty state
  if (!form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 px-4 text-center">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 mb-2">
          No Booking Data 😕
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          We couldn't find your booking details. Please go back and try again.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition-colors"
        >
          Return to Booking
        </button>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      // 🔥 Fake payment success
      alert("Payment Successful 💳");

      // NOW save booking
      await axios.post("http://localhost:5000/api/bookings", {
        ...form,
        destination
      });

      navigate("/success");

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-[#0f172a] px-4 py-12 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Main Payment Card */}
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 dark:border-slate-800/50 overflow-hidden transform transition-all">
        
        {/* Header Section (Receipt Header styles) */}
        <div className="bg-slate-50/50 dark:bg-slate-800/40 px-8 py-8 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
          
          {/* Credit Card Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 border-4 border-white dark:border-slate-800 shadow-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Payment Summary</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Please review your booking details below</p>
        </div>

        {/* Details Section */}
        <div className="p-8">
          
          {/* Summary Box */}
          <div className="space-y-1 bg-slate-50/80 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            
            <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700/50">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Destination</span>
              <span className="text-base font-bold text-slate-900 dark:text-white text-right break-words max-w-[50%]">{destination}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700/50">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Full Name</span>
              <span className="text-base font-semibold text-slate-900 dark:text-white text-right truncate max-w-[50%]">{form.name}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700/50">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Guests</span>
              <span className="text-base font-semibold text-slate-900 dark:text-white text-right">
                {form.people} {Number(form.people) > 1 ? 'People' : 'Person'}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700/50">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Agency</span>
              <span className="text-base font-semibold text-slate-900 dark:text-white text-right">{form.agency}</span>
            </div>

            {/* In case you want the date included as well! */}
            {form.date && (
              <div className="flex justify-between items-center pt-3">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Travel Date</span>
                <span className="text-base font-semibold text-slate-900 dark:text-white text-right">{form.date}</span>
              </div>
            )}
          </div>

          {/* Secure Payment Button */}
          <button
            onClick={handlePayment}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200/50 dark:shadow-none transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Pay Now
          </button>

          {/* Optional Cancel Backlink added for better UX */}
          <button
             onClick={() => navigate(-1)}
             className="mt-5 w-full text-slate-900 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium transition-colors focus:outline-none"
          >
             Wait, I need to change something
          </button>

        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
