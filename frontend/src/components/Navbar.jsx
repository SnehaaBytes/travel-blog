import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useAuth } from "../services/AuthContext";
import { useTheme } from "../context/ThemeContext";
import destinationsData from "./Destinations/destinationsData";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Scroll background effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setSuggestions([]);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300
        ${isScrolled
          ? "bg-zinc-900/70 backdrop-blur-xl border-b border-white/10"
          : "bg-gradient-to-r from-zinc-900/90 via-black/80 to-zinc-900/90"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="text-xl font-semibold text-white">
            Travel<span className="text-indigo-400 font-bold">Blogs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">

            {/* Links */}
            <div className="flex gap-6 text-sm font-medium">
  {["Home", "Destinations", "Explore Map", "Review", "About"].map((item) => {
    // Create proper route paths
    const getRoutePath = (itemName) => {
      if (itemName === "Home") return "/";
      if (itemName === "Explore Map") return "/explore-map";
      return `/${itemName.toLowerCase()}`;
    };

    return (
      <Link
        key={item}
        to={getRoutePath(item)}
        className="text-white/70 hover:text-white transition"
      >
        {item}
      </Link>
    );
  })}
</div>

            {/* Actions */}
            <div className="flex items-center gap-3">

              {/* Search with Suggestions */}
              <div className="relative w-56">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);

                    if (!value.trim()) {
                      setSuggestions([]);
                      return;
                    }

                    const filtered = destinationsData.filter((dest) =>
                      dest.title
                        .toLowerCase()
                        .startsWith(value.toLowerCase())
                    );

                    setSuggestions(filtered.slice(0, 5));
                  }}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Search destinations"
                  className="w-full bg-white/5 text-white text-sm
                             pl-9 pr-4 py-2 rounded-full
                             border border-white/10
                             placeholder:text-white/40
                             focus:outline-none"
                />

                {suggestions.length > 0 && (
                  <ul className="absolute top-11 left-0 w-full bg-zinc-900
                                 border border-white/10 rounded-xl
                                 overflow-hidden z-50">
                    {suggestions.map((dest) => (
                      <li
                        key={dest._id}
                        className="px-4 py-2 text-sm text-white/80
                                   hover:bg-indigo-500/20 cursor-pointer"
                        onClick={() => {
                          navigate(
                            `/destinations?search=${encodeURIComponent(
                              dest.title
                            )}`
                          );
                          setSearchTerm("");
                          setSuggestions([]);
                        }}
                      >
                        {dest.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="h-9 w-9 flex items-center justify-center
                           rounded-full bg-white/5 border
                           border-white/10 text-white/70"
              >
                {theme === "light" ? <FiMoon /> : <FiSun />}
              </button>

              {/* Auth */}
              {user ? (
                <div className="flex items-center gap-3 min-w-[180px] justify-end">
                  <span className="text-white/80 text-sm hidden sm:block">
                    Welcome,{" "}
                    <span className="font-semibold">
                      {user?.username || user?.name || "User"}
                    </span>
                  </span>

                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium
                               rounded-full bg-indigo-500
                               hover:bg-indigo-600 text-white transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium
                             rounded-full bg-indigo-500
                             hover:bg-indigo-600 text-white transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
