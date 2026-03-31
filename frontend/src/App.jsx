import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext";

// 👇 IMPORT THE THEME PROVIDER TO WRAP THE ENTIRE APP
import { ThemeProvider } from "./context/ThemeContext";

import Navbar from "./components/Navbar";

// 👇 IMPORT THE NEW ADMIN ROUTE 
import AdminRoute from "./components/AdminRoute";

import Home from "./components/Home/Home";
import Destinations from "./components/Destinations/Destinations";
import DestinationDetails from "./components/Destinations/DestinationDetails";
import About from "./components/About/About";
import Review from "./components/Review/Review";
import ExploreMap from "./components/ExploreMap";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import Dashboard from "./admin/pages/Dashboard";
import ManageDestinations from "./admin/pages/ManageDestinations";
import Bookings from "./admin/pages/Bookings";
import AdminLayout from "./admin/AdminLayout";
import BookingPage from "./pages/BookingPage";
import ManageReviews from "./admin/pages/ManageReviews";
import PaymentPage from "./pages/PaymentPage";
import Success from "./pages/Success";

import "./App.css";

// Inline layout (no separate file)
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          {/* 👇 ADDED TAILWIND GLOBAL CLASSES FOR DARK MODE BACKGROUND & TEXT */}
          <div className="app min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
            <Routes>

              {/* USER ROUTES (Public) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/destinations/:id" element={<DestinationDetails />} />
                <Route path="/review" element={<Review />} />
                <Route path="/about" element={<About />} />
                <Route path="/explore-map" element={<ExploreMap />} />
                <Route path="/book/:id" element={<BookingPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/success" element={<Success />} />
                 <Route path="/review" element={<Review />} />

              </Route>

              {/* AUTH ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 🛡️ PROTECTED ADMIN ROUTES */}
              <Route 
                path="/admin" 
                element={
                  // We wrap the entire Layout layer, protecting everything inside
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="destinations" element={<ManageDestinations />} />
                <Route path="bookings" element={<Bookings />} />
                 <Route path="reviews" element={<ManageReviews />} />  
              </Route>

            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
