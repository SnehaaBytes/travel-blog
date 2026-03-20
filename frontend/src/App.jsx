import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext";

import Navbar from "./components/Navbar";

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
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>

            {/* USER ROUTES */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:id" element={<DestinationDetails />} />
              <Route path="/review" element={<Review />} />
              <Route path="/about" element={<About />} />
              <Route path="/explore-map" element={<ExploreMap />} />
            </Route>

            {/* AUTH */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ADMIN */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="destinations" element={<ManageDestinations />} />
              <Route path="bookings" element={<Bookings />} />
            </Route>

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;