import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../services/AuthContext";
import { useTheme } from "../context/ThemeContext";
import destinationsData from "./Destinations/destinationsData";

/* ================= SEARCH BAR ================= */
const SearchBar = ({ onSearchCallback, placeholder = "Search..." }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      const trimmed = query.trim().toLowerCase();

      if (!trimmed) {
        setSuggestions([]);
        return;
      }

      const filtered = destinationsData.filter((dest) =>
        dest.title?.toLowerCase().includes(trimmed)
      );

      setSuggestions(filtered.slice(0, 5));
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const executeSearch = (searchTerm) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    navigate(`/destinations?search=${encodeURIComponent(trimmed)}`);
    setQuery("");
    setSuggestions([]);

    if (onSearchCallback) onSearchCallback();
  };

  return (
    <div className="relative w-full lg:w-64" ref={wrapperRef}>
      <button
        onClick={() => executeSearch(query)}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-indigo-500 dark:hover:text-white transition-colors"
      >
        <FiSearch />
      </button>

      <input
        type="text"
        value={query}
        autoComplete="off"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && executeSearch(query)}
        placeholder={placeholder}
        className="w-full bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
      />

      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-zinc-800 rounded-xl z-50 overflow-hidden shadow-xl border border-slate-200 dark:border-white/5 transition-colors">
          {suggestions.map((d) => (
            <li
              key={d.title}
              onMouseDown={() => executeSearch(d.title)}
              className="px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-indigo-500/20 text-slate-700 dark:text-white transition-colors"
            >
              {d.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ================= NAVBAR ================= */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();

  // 🔥 NEW: Base links for everyone
  const baseNavLinks = ["Home", "Destinations", "Explore Map", "Review", "About"];
  
  // 🔥 NEW: Dynamically add "Admin Panel" only if the logged-in user is an admin
  const navLinks = user?.isAdmin ? [...baseNavLinks, "Admin Panel"] : baseNavLinks;

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // 🔥 NEW: Handle routing correctly for the special Admin item
  const getRoutePath = (item) => {
    if (item === "Home") return "/";
    if (item === "Explore Map") return "/explore-map";
    if (item === "Admin Panel") return "/admin"; // Update to /admin/dashboard if that's your route
    return `/${item.toLowerCase()}`;
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg"
          : "bg-gradient-to-r from-white/90 via-slate-50/80 to-white/90 dark:from-zinc-900/90 dark:via-black/80 dark:to-zinc-900/90"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center text-2xl font-bold text-slate-900 dark:text-white transition-colors">
            Travel<span className="text-indigo-600 dark:text-indigo-500">Blogs</span>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center flex-1 ml-10">
            
            {/* Links */}
            <div className="flex items-center gap-8 text-sm">
              {navLinks.map((item) => {
                const isCurrent = location.pathname === getRoutePath(item);
                const isAdminLink = item === "Admin Panel";
                
                return (
                  <Link
                    key={item}
                    to={getRoutePath(item)}
                    className={`transition-colors font-medium flex items-center ${
                      isAdminLink 
                        ? "text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                        : isCurrent
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-slate-600 hover:text-indigo-600 dark:text-white/70 dark:hover:text-indigo-400"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4 ml-auto">
              
              {/* ONLY ONE SEARCH (Desktop) */}
              <SearchBar placeholder="Search destinations..." />

              <button
                onClick={toggleTheme}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                {theme === "light" ? (
                  <FiMoon className="w-5 h-5" />
                ) : (
                  <FiSun className="w-5 h-5" />
                )}
              </button>

              {user ? (
                <button onClick={logout} className="font-medium text-slate-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Logout
                </button>
              ) : (
                <Link to="/login" className="font-medium text-slate-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="lg:hidden flex items-center gap-3">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-slate-600 dark:text-white bg-slate-100 dark:bg-white/5 rounded-full"
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 text-slate-900 dark:text-white"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-4 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-lg space-y-4">
          
          {/* Mobile Search */}
          <SearchBar
            placeholder="Search..."
            onSearchCallback={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Links */}
          <div className="flex flex-col gap-4">
            {navLinks.map((item) => {
              const isCurrent = location.pathname === getRoutePath(item);
              const isAdminLink = item === "Admin Panel";
              
              return (
                <Link
                  key={item}
                  to={getRoutePath(item)}
                  className={`font-medium transition-colors ${
                    isAdminLink
                      ? "text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-500/30"
                      : isCurrent
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-700 dark:text-white/80 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
            
            {/* Mobile Auth button */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/5">
              {user ? (
                <button onClick={logout} className="w-full text-left font-medium text-slate-700 dark:text-white active:text-indigo-600">
                  Logout
                </button>
              ) : (
                <Link to="/login" className="block font-medium text-slate-700 dark:text-white active:text-indigo-600">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
