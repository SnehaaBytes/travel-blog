import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../services/AuthContext";
import { useTheme } from "../context/ThemeContext";
import destinationsData from "./Destinations/destinationsData";

// ✅ 1. Isolated Search Component: Completely prevents Desktop & Mobile from conflicting
const SearchBar = ({ onSearchCallback, placeholder = "Search...", isMobile = false }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Click outside listener specifically for this input instance
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Independent Debounce logic
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      const filtered = destinationsData.filter((dest) =>
        dest.title.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const executeSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    navigate(`/destinations?search=${encodeURIComponent(searchTerm)}`);
    setQuery("");
    setSuggestions([]);
    if (onSearchCallback) onSearchCallback(); // Closes menu if on mobile
  };
console.log("Navbar rendered");
  return (
    <div className={`relative ${isMobile ? "w-full" : "w-64"}`} ref={wrapperRef}>
      <button
        onClick={() => executeSearch(query)}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
      >
        <FiSearch />
      </button>

      <input
        type="text"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && executeSearch(query)}
        placeholder={placeholder}
        className="w-full bg-white/5 text-white pl-10 pr-4 py-2.5 rounded-full border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      />

      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 mt-2 w-full bg-zinc-800 rounded-xl z-50 overflow-hidden shadow-xl border border-white/5">
          {suggestions.map((d) => (
            <li
              key={d._id}
              // ✅ onMouseDown prevents click-out from destroying suggestions before routing
              onMouseDown={() => executeSearch(d.title)}
              className="px-4 py-3 cursor-pointer hover:bg-indigo-500/20 text-white transition-colors"
            >
              {d.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ✅ 2. Main Navbar Component
const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();

  const navLinks = ["Home", "Destinations", "Explore Map", "Review", "About"];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const getRoutePath = (item) => {
    if (item === "Home") return "/";
    if (item === "Explore Map") return "/explore-map";
    return `/${item.toLowerCase()}`;
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-zinc-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-gradient-to-r from-zinc-900/90 via-black/80 to-zinc-900/90"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            Travel<span className="text-indigo-500">Blogs</span>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center flex-1 ml-10">
            {/* Links */}
            <div className="flex gap-8 text-sm">
              {navLinks.map((item) => (
                <Link
                  key={item}
                  to={getRoutePath(item)}
                  className={`hover:text-indigo-400 transition-colors ${
                    location.pathname === getRoutePath(item)
                      ? "text-indigo-400"
                      : "text-white/70"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 ml-auto">
              
              {/* Desktop Search */}
              <SearchBar placeholder="Search destinations..." />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <FiMoon className="text-white" /> : <FiSun className="text-white" />}
              </button>

              {/* Auth */}
              {user ? (
                <button onClick={logout} className="text-white hover:text-indigo-400 transition-colors">Logout</button>
              ) : (
                <Link to="/login" className="text-white hover:text-indigo-400 transition-colors">Login</Link>
              )}
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="lg:hidden flex gap-3">
            <button onClick={toggleTheme} className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-white">
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
            <button 
              onClick={() => setMobileMenuOpen((p) => !p)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-white"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (CSS controlled) */}
      <div
        className={`lg:hidden transition-all overflow-hidden ${
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 border-t border-white/10 bg-zinc-900/95 backdrop-blur-xl">
          {/* Mobile Search */}
          <SearchBar 
            isMobile={true} 
            placeholder="Search..." 
            onSearchCallback={() => setMobileMenuOpen(false)} 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
