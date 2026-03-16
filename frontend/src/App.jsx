import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home/Home';
import Destinations from './components/Destinations/Destinations';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import About from './components/About/About';
import DestinationDetails from './components/Destinations/DestinationDetails';
import './App.css';
import Review from './components/Review/Review';
import ExploreMap from './components/ExploreMap';
import Dashboard from "./admin/pages/Dashboard";
import ManageDestinations from "./admin/pages/ManageDestinations";
import Bookings from "./admin/pages/Bookings";
import AdminLayout from "./admin/AdminLayout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">

          <Routes>

            {/* USER ROUTES */}

            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                </>
              }
            />

            <Route
              path="/destinations"
              element={
                <>
                  <Navbar />
                  <Destinations />
                </>
              }
            />

            <Route
              path="/destinations/:id"
              element={
                <>
                  <Navbar />
                  <DestinationDetails />
                </>
              }
            />

            <Route
              path="/review"
              element={
                <>
                  <Navbar />
                  <Review />
                </>
              }
            />

            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <About />
                </>
              }
            />

            <Route
              path="/explore-map"
              element={
                <>
                  <Navbar />
                  <ExploreMap />
                </>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ADMIN ROUTES */}

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