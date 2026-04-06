import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { form, destination, totalPrice } = state || {};

  if (!form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 p-8 text-center font-sans">
        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl border border-slate-100 dark:border-slate-700">
          <i className="fas fa-compass text-4xl text-slate-400 dark:text-slate-500 animate-spin-slow"></i>
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          No Booking Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md text-lg">
          Your travel details seem to have wandered off. Please return to the destinations page and try again.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
        >
          <i className="fas fa-arrow-left"></i> Return to Booking
        </button>
      </div>
    );
  }

  // ── Razorpay payment handler 
  const handlePayment = async () => {
    setLoading(true);
    try {
      const exactAmount = totalPrice || form.amount || 999;
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/payment/create-order`, {
        amount: exactAmount,
        bookingId: form._id || `booking_${Date.now()}`,
      });

      const { order } = data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: "ExploreEase",
        description: `Trip to ${destination}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verify = await axios.post(`${import.meta.env.VITE_API_URL}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verify.data.success) {
              alert("Payment verification failed. Please contact support.");
              return;
            }

            await axios.post(`${import.meta.env.VITE_API_URL}/bookings`, {
              ...form,
              destination,
              paymentId: verify.data.paymentId,
              orderId: response.razorpay_order_id,
              totalAmount: exactAmount
            });

            navigate("/success");
          } catch (err) {
            console.error("Post-payment error:", err);
            alert("Something went wrong after payment. Please contact support.");
          }
        },
        prefill: {
          name: form.name,
          email: form.email || "",
          contact: form.phone || "",
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      alert("Could not initiate payment. Please try again.");
      setLoading(false);
    }
  };

  const finalAmount = totalPrice || form.amount;

  // ── Booking detail rows 
  const rows = [
    { label: "Destination", value: destination, icon: "fas fa-map-marker-alt" },
    { label: "Full Name", value: form.name, icon: "fas fa-user" },
    {
      label: "Guests",
      value: `${form.people} ${Number(form.people) > 1 ? "Travellers" : "Traveller"}`,
      icon: "fas fa-users",
    },
    { label: "Partner Agency", value: form.agency, icon: "fas fa-building" },
    ...(form.date ? [{ label: "Travel Date", value: form.date, icon: "fas fa-calendar-alt" }] : []),
    ...(finalAmount
      ? [{ label: "Total Amount Payable", value: `₹${Number(finalAmount).toLocaleString("en-IN")}`, icon: "fas fa-rupee-sign" }]
      : []),
  ];

  
  return (
        <div className="min-h-screen flex flex-col justify-center relative pt-32 pb-16 px-4 sm:px-6 font-sans overflow-y-auto">

      
      {/* --- Stunning Background Imagery --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
          alt="Travel Background" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-slate-900/80 dark:bg-black/85 backdrop-blur-[4px]"></div>
        {/* Soft glowing accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {/* --- Main Premium Split Card --- */}
      <div className="relative z-10 w-full max-w-5xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/20 dark:border-slate-800 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ── LEFT SIDE: Visual Journey Summary ── */}
        <div className="w-full lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-indigo-700 to-blue-800 text-white p-10 md:p-14 flex flex-col justify-between">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1.5px,_transparent_1.5px)] bg-[length:24px_24px]"></div>
          
          <div className="relative z-10 mb-12">
            <h3 className="text-indigo-200 text-sm font-bold tracking-[0.2em] uppercase mb-4 opacity-90">Secure Checkout</h3>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight tracking-tight">Your Journey Awaits!</h2>
            <p className="text-indigo-100 text-lg opacity-90 leading-relaxed font-light">
              Get ready to explore the stunning beauty of <span className="font-bold text-white block mt-1 text-2xl">{destination}</span>
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-white/20 flex flex-shrink-0 items-center justify-center border border-white/30">
                   <i className="fas fa-plane-departure text-white text-xl ml-1"></i>
                </div>
                <div>
                   <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Official Partner</p>
                   <p className="text-white font-extrabold text-xl font-serif">{form.agency}</p>
                </div>
             </div>
          </div>
        </div>

        {/* ── RIGHT SIDE: Receipt & Payment ── */}
        <div className="w-full lg:w-7/12 p-8 md:p-14 flex flex-col bg-slate-50 dark:bg-transparent">
           
           <div className="mb-8 flex justify-between items-end">
             <div>
               <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Order Summary</h3>
               <p className="text-slate-500 dark:text-slate-400 font-medium">Please review your booking details.</p>
             </div>
             {/* Security Icon Badge */}
             <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
               <i className="fas fa-shield-check text-xl"></i>
             </div>
           </div>

           {/* Receipt Rows */}
           <div className="bg-white dark:bg-slate-800/40 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-700/50 shadow-sm mb-10 space-y-5">
             {rows.map((row) => {
               const isAmount = row.label === "Total Amount Payable";
               return (
                  <div key={row.label} className={`flex justify-between items-center ${isAmount ? "pt-6 mt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-700" : ""}`}>
                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                        <i className={`${row.icon} text-indigo-500 dark:text-indigo-400`}></i>
                      </div>
                      <span className="text-sm font-bold tracking-wide">{row.label}</span>
                    </div>
                    <span className={`${isAmount ? "text-3xl font-black text-indigo-600 dark:text-indigo-400" : "text-base font-bold text-slate-800 dark:text-white"}`}>
                      {row.value}
                    </span>
                  </div>
               );
             })}
           </div>

           {/* Pay Button Area */}
           <div className="mt-auto">
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full py-5 px-6 rounded-2xl font-extrabold text-xl flex items-center justify-center gap-3 shadow-xl transition-all duration-500 outline-none focus:ring-4 focus:ring-indigo-500/50 ${
                  loading 
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none" 
                    : "bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-[length:200%_auto] text-white hover:bg-right hover:shadow-indigo-500/30 transform hover:-translate-y-1"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock text-indigo-200"></i>
                    Pay Securely Now
                  </>
                )}
              </button>

              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => navigate(-1)}
                  disabled={loading}
                  className="text-sm font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-arrow-left"></i> Edit Details
                </button>

                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold flex items-center gap-2">
                  <i className="fas fa-lock text-slate-300 dark:text-slate-600"></i>
                  Guaranteed by Razorpay
                </p>
              </div>
           </div>
           
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
