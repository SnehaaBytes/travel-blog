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

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300
        ${
          isScrolled
            ? "bg-zinc-900/70 backdrop-blur-xl border-b border-white/10"
            : "bg-gradient-to-r from-zinc-900/90 via-black/80 to-zinc-900/90"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-white"
          >
            Travel<span className="text-indigo-400 font-bold">Blogs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">

            {/* Links */}
            <div className="flex gap-6 text-sm font-medium">
              {["Home", "Destinations", "Review", "About"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-white/70 hover:text-white transition relative
                             after:absolute after:left-0 after:-bottom-1
                             after:h-[2px] after:w-0 after:bg-indigo-400
                             hover:after:w-full after:transition-all"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">

              {/* Search */}
              <div className="relative group">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Search destinations"
                  className="w-44 focus:w-56 transition-all
                             bg-white/5 text-white text-sm
                             pl-9 pr-4 py-2 rounded-full
                             border border-white/10
                             placeholder:text-white/40
                             focus:outline-none
                             focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="h-9 w-9 flex items-center justify-center
                           rounded-full
                           bg-white/5 border border-white/10
                           text-white/70
                           hover:bg-white/10 hover:text-white
                           transition"
              >
                {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
              </button>

              {/* Auth */}
              {user ? (
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium rounded-full
                             bg-indigo-500 hover:bg-indigo-600
                             text-white transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium rounded-full
                             bg-indigo-500 hover:bg-indigo-600
                             text-white transition"
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
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden mt-4 p-4 space-y-4 rounded-2xl
                       bg-zinc-900/80 backdrop-blur-xl
                       border border-white/10"
          >
            {["Home", "Destinations", "Review", "About"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="block text-white/80 hover:text-white transition"
              >
                {item}
              </Link>
            ))}

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search"
              className="w-full bg-white/10 px-4 py-2 rounded-full
                         text-white placeholder:text-white/40
                         focus:outline-none"
            />

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-white/80"
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
              Toggle theme
            </button>

            {user ? (
              <button
                onClick={logout}
                className="w-full bg-indigo-500 py-2 rounded-full"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block text-center bg-indigo-500 py-2 rounded-full"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
