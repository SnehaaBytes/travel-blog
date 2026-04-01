import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { form, destination } = state || {};

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (!form) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a0a00 0%, #2d1200 50%, #1a0800 100%)",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');`}</style>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🕌</div>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#f5c842",
            marginBottom: "0.5rem",
            letterSpacing: "0.05em",
          }}
        >
          No Booking Found
        </h2>
        <p style={{ color: "#a07840", marginBottom: "2rem", fontSize: "1.05rem" }}>
          Your journey details seem to have wandered off. Please go back and try again.
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "0.85rem 2rem",
            background: "linear-gradient(135deg, #c8860a, #f5c842)",
            color: "#1a0800",
            border: "none",
            borderRadius: "50px",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            fontWeight: "700",
            cursor: "pointer",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Return to Booking
        </button>
      </div>
    );
  }

  // ── Razorpay payment handler ─────────────────────────────────────────────────
  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Create order on backend
      const { data } = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: form.amount || 999,
        bookingId: form._id || `booking_${Date.now()}`,
      });

      const { order } = data;

      // Step 2: Open Razorpay popup
      const options = {
        key: "rzp_test_SXw0QRjqGyZuBA",
        amount: order.amount,
        currency: order.currency,
        name: "Wanderlust India",
        description: `Trip to ${destination}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Step 3: Verify signature on backend
            const verify = await axios.post("http://localhost:5000/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verify.data.success) {
              alert("Payment verification failed. Please contact support.");
              return;
            }

            // Step 4: Save booking only after verified payment
            await axios.post("http://localhost:5000/api/bookings", {
              ...form,
              destination,
              paymentId: verify.data.paymentId,
              orderId: response.razorpay_order_id,
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
          color: "#c8860a",
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

  // ── Booking detail rows ──────────────────────────────────────────────────────
  const rows = [
    { label: "Destination", value: destination, icon: "✦" },
    { label: "Full Name", value: form.name, icon: "◈" },
    {
      label: "Guests",
      value: `${form.people} ${Number(form.people) > 1 ? "Travellers" : "Traveller"}`,
      icon: "◇",
    },
    { label: "Agency", value: form.agency, icon: "⬡" },
    ...(form.date ? [{ label: "Travel Date", value: form.date, icon: "◉" }] : []),
    ...(form.amount
      ? [{ label: "Total Amount", value: `₹${Number(form.amount).toLocaleString("en-IN")}`, icon: "◆" }]
      : []),
  ];

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(160deg, #100500 0%, #1f0c00 40%, #2a1200 70%, #140800 100%)",
        padding: "2rem 1rem",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
      `}</style>

      {/* Background radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(197,133,10,0.08) 0%, transparent 40%),
            radial-gradient(circle at 85% 80%, rgba(197,133,10,0.06) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(255,165,0,0.03) 0%, transparent 60%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Mandala-inspired ring accents */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-200px",
          right: "-200px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          border: "1px solid rgba(197,133,10,0.06)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-160px",
          right: "-160px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          border: "1px solid rgba(197,133,10,0.04)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-180px",
          left: "-180px",
          width: "460px",
          height: "460px",
          borderRadius: "50%",
          border: "1px solid rgba(197,133,10,0.05)",
          pointerEvents: "none",
        }}
      />

      {/* ── Card ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background:
            "linear-gradient(160deg, rgba(42,20,5,0.97) 0%, rgba(30,12,2,0.98) 100%)",
          borderRadius: "20px",
          border: "1px solid rgba(197,133,10,0.3)",
          boxShadow:
            "0 0 0 1px rgba(197,133,10,0.08), 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(197,133,10,0.04)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Gold top stripe */}
        <div
          style={{
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, #c8860a 30%, #f5c842 50%, #c8860a 70%, transparent)",
          }}
        />

        {/* ── Header ── */}
        <div
          style={{
            padding: "2.5rem 2.5rem 2rem",
            textAlign: "center",
            borderBottom: "1px solid rgba(197,133,10,0.12)",
          }}
        >
          {/* Diya icon circle */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(197,133,10,0.15), rgba(197,133,10,0.05))",
              border: "1px solid rgba(197,133,10,0.35)",
              marginBottom: "1.25rem",
              fontSize: "1.6rem",
            }}
          >
            🪔
          </div>

          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              color: "#c8860a",
              textTransform: "uppercase",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            Secure Checkout
          </div>

          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#f0d070",
              margin: 0,
              letterSpacing: "0.02em",
              lineHeight: 1.2,
            }}
          >
            Payment Summary
          </h2>
          <p
            style={{
              color: "#7a5a30",
              marginTop: "0.5rem",
              fontSize: "0.95rem",
              fontStyle: "italic",
            }}
          >
            Review your journey before confirming
          </p>
        </div>

        {/* ── Booking Details ── */}
        <div style={{ padding: "2rem 2.5rem" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(197,133,10,0.15)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {rows.map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.95rem 1.25rem",
                  borderBottom:
                    i < rows.length - 1
                      ? "1px solid rgba(197,133,10,0.08)"
                      : "none",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "#c8860a", fontSize: "0.7rem" }}>{row.icon}</span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#7a5a30",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.95rem",
                    color: row.label === "Total Amount" ? "#f5c842" : "#e8c870",
                    fontWeight: row.label === "Total Amount" ? "700" : "600",
                    textAlign: "right",
                    maxWidth: "55%",
                    wordBreak: "break-word",
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Ornamental divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              margin: "1.75rem 0",
            }}
          >
            <div
              style={{ flex: 1, height: "1px", background: "rgba(197,133,10,0.15)" }}
            />
            <span style={{ color: "#c8860a", fontSize: "0.7rem" }}>✦ ✦ ✦</span>
            <div
              style={{ flex: 1, height: "1px", background: "rgba(197,133,10,0.15)" }}
            />
          </div>

          {/* ── Pay Button ── */}
          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              background: loading
                ? "rgba(100,60,10,0.4)"
                : "linear-gradient(135deg, #b8750a 0%, #e8b830 50%, #c8860a 100%)",
              color: loading ? "#7a5a30" : "#1a0800",
              border: "none",
              borderRadius: "10px",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
              fontWeight: "700",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              boxShadow: loading
                ? "none"
                : "0 4px 24px rgba(197,133,10,0.25), 0 1px 0 rgba(255,220,100,0.3) inset",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow =
                  "0 6px 32px rgba(197,133,10,0.4), 0 1px 0 rgba(255,220,100,0.3) inset";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 24px rgba(197,133,10,0.25), 0 1px 0 rgba(255,220,100,0.3) inset";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {loading ? (
              <>
                <span style={{ fontSize: "1rem" }}>⏳</span> Processing…
              </>
            ) : (
              <>
                <span style={{ fontSize: "1rem" }}>🔐</span> Confirm & Pay
              </>
            )}
          </button>

          {/* ── Back link ── */}
          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: "1.1rem",
              width: "100%",
              background: "transparent",
              border: "none",
              color: "#5a3e1a",
              fontSize: "0.85rem",
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c8860a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#5a3e1a")}
          >
            ← Change booking details
          </button>
        </div>

        {/* Gold bottom stripe */}
        <div
          style={{
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, #c8860a 30%, #f5c842 50%, #c8860a 70%, transparent)",
          }}
        />
      </div>
    </div>
  );
}

export default PaymentPage;
