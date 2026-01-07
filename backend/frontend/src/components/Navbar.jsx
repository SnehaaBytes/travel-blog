import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [searchVisible, setSearchVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleSearchBar = () => {
    setSearchVisible(!searchVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 shadow-lg py-2' : 'bg-black py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Travel<span className="text-primary">Blogs</span></h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-primary transition-colors font-medium">Home</Link>
            <Link to="/destinations" className="text-white hover:text-primary transition-colors font-medium">Destinations</Link>
            <Link to="/chat" className="text-white hover:text-primary transition-colors font-medium">Chat</Link>
            <Link to="/about" className="text-white hover:text-primary transition-colors font-medium">About</Link>

          {/* Search */}
<div className="relative">
  <button
    onClick={toggleSearchBar}
    className="text-[#00008B] hover:text-[#00008B] transition-colors" // Dark blue color
    aria-label="Search"
  >
    <i className="fas fa-search text-sm"></i> {/* Adjusted size using text-sm */}
  </button>
  {searchVisible && (
    <div className="absolute right-0 top-10 w-60 bg-[#00008B] text-white rounded-md shadow-lg overflow-hidden transition-all duration-300">
      <input
        type="text"
        className="w-full p-3 focus:outline-none bg-[#00008B] text-white" // Dark blue background
        placeholder="Search destinations..."
      />
    </div>
  )}
</div>

            {/* User Authentication */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">Welcome, {user.username}</span>
                <button
                  onClick={logout}
                  className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-4 py-4">
            <Link to="/" className="text-white hover:text-primary transition-colors font-medium">Home</Link>
            <Link to="/destinations" className="text-white hover:text-primary transition-colors font-medium">Destinations</Link>
            <Link to="/chat" className="text-white hover:text-primary transition-colors font-medium">Chat</Link>
            <Link to="/about" className="text-white hover:text-primary transition-colors font-medium">About</Link>

            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none"
                placeholder="Search destinations..."
              />
            </div>

            {/* Mobile User Authentication */}
            {user ? (
              <div className="flex flex-col space-y-2">
                <span className="text-white font-medium">Welcome, {user.username}</span>
                <button
                  onClick={logout}
                  className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md transition-colors text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
