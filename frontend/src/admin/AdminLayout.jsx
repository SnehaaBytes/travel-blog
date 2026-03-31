import React, { useState, useEffect } from "react";
// 👉 Added useNavigate
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
// 👉 Imported the useAuth to handle logging out
import { useAuth } from "../services/AuthContext";
import "./AdminLayout.css";

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  
  // 👉 Hook up our router and auth logic
  const navigate = useNavigate();
  const { logout, user } = useAuth(); 

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Auto-close sidebar on mobile when navigation occurs
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset" };
  }, [isOpen]);

  // Theme Logic: Load from storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("adminTheme");
    if (savedTheme === "dark") setIsDarkMode(true);
  }, []);

  // Theme Logic: Toggle and save
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("adminTheme", !isDarkMode ? "dark" : "light");
  };

  // 👉 Handle Secure Logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of the Admin panel?")) {
      logout(); // Wipes context and localstorage
      navigate("/login"); // Immediately kicks you back to the shiny login screen
    }
  };

  // Upgraded navItems with FontAwesome icons for a premium feel
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: "fas fa-chart-pie" },
    { name: "Destinations", path: "/admin/destinations", icon: "fas fa-map-marked-alt" },
    { name: "Bookings", path: "/admin/bookings", icon: "fas fa-calendar-alt" },
  ];

  // Dynamic header title based on current route
  const currentTitle = navItems.find((item) => 
    item.path !== "/admin" && location.pathname.startsWith(item.path)
  )?.name || "Dashboard";

  return (
    // ✨ Wrapping the entire layout to inject the 'dark' Tailwind class globally
    <div className={isDarkMode ? "dark" : ""}>
      
      {/* Notice the dark:bg-slate-900 and dark:text-slate-100 below */}
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans overflow-hidden text-slate-800 dark:text-slate-100 transition-colors duration-300">
        
        {/* ======================= Mobile Header ======================= */}
        <div className="md:hidden fixed top-0 w-full z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-5 py-3.5 flex justify-between items-center shadow-sm transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <i className="fas fa-plane-departure text-sm"></i>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Travel<span className="text-blue-600 dark:text-blue-500">Admin</span>
            </h2>
          </div>
          
          <div className="flex gap-2">
            {/* ✨ Mobile Theme Toggle Button */}
            <button 
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-amber-500 transition-colors active:scale-95"
              onClick={toggleTheme} 
              aria-label="Toggle theme"
            >
              <i className={`fas ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon'} text-lg`}></i>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors active:scale-95"
              onClick={toggleSidebar} 
              aria-label="Toggle menu"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>
        </div>

        {/* ======================= Mobile Overlay ======================= */}
        <div 
          className={`fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`} 
          onClick={toggleSidebar}
        ></div>

        {/* ======================= Premium Sidebar ======================= */}
        <aside 
          className={`fixed md:static inset-y-0 left-0 z-50 w-[280px] bg-[#0b1121] text-slate-300 transform transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col shadow-2xl md:shadow-none ${
            isOpen ? "translate-x-0 pt-20" : "-translate-x-full md:translate-x-0 md:pt-0"
          }`}
        >
          {/* Desktop Sidebar Logo Header */}
          <div className="hidden md:flex items-center gap-3 px-8 h-24 border-b border-slate-800/60 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <i className="fas fa-plane-departure text-xl"></i>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Travel<span className="text-blue-500">Admin</span>
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-8 px-5 space-y-2 scrollbar-hide">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Menu
            </p>
            
            {navItems.map((item) => {
              const isActive = item.path === "/admin" 
                ? location.pathname === "/admin" || location.pathname === "/admin/"
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                  }`}
                >
                  {/* Icon Box */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "bg-slate-800/80 text-slate-400 group-hover:bg-slate-700 group-hover:text-white"
                  }`}>
                    <i className={item.icon}></i>
                  </div>
                  
                  <span className="text-[0.95rem] tracking-wide">{item.name}</span>
                  
                  {/* Active Dot Indicator */}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 👉 Profile & Logout Area */}
          <div className="p-5 border-t border-slate-800/60 flex flex-col gap-3 shrink-0">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-600 to-slate-700 flex items-center justify-center text-white border border-slate-600">
                <i className="fas fa-user-shield text-sm"></i>
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-sm font-bold text-white truncate capitalize">
                  {user?.username || "Administrator"}
                </h3>
                <p className="text-[0.65rem] font-medium text-slate-400 truncate uppercase tracking-wider">Super Admin</p>
              </div>
            </div>
            
            {/* Main Sidebar Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800/40 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all shadow-sm"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="text-sm font-semibold tracking-wide">Secure Logout</span>
            </button>
          </div>
        </aside>

        {/* ======================= Main Layout Area ======================= */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          
          {/* Desktop Navbar / Page Context Header */}
          <header className="hidden md:flex h-24 items-center justify-between px-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 z-10 sticky top-0 transition-colors">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                {currentTitle}
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Welcome back! Here's an overview of your platform.
              </p>
            </div>
            
            {/* 👉 Action Tools */}
            <div className="flex items-center gap-3">
              
              {/* ✨ Desktop Theme Toggle Button */}
              <button 
                onClick={toggleTheme}
                className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center justify-center hover:-translate-y-0.5"
                title="Toggle Theme"
              >
                <i className={`fas ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon'} text-lg`}></i>
              </button>

              {/* Search Button */}
              <button 
                onClick={() => alert("Search functionality will be implemented soon!")}
                className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center justify-center hover:-translate-y-0.5"
                title="Search Data"
              >
                <i className="fas fa-search"></i>
              </button>
              
              {/* Notification Bell Button */}
              <button 
                onClick={() => alert("You have 0 new notifications.")}
                className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center justify-center relative hover:-translate-y-0.5"
                title="Notifications"
              >
                <i className="far fa-bell"></i>
                <span className="absolute top-2.5 right-3 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-slate-800"></span>
              </button>
              
              <div className="h-6 border-l border-slate-200 dark:border-slate-700 mx-1"></div>
              
              {/* Quick Logout Button */}
              <button 
                onClick={handleLogout}
                className="w-11 h-11 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/30 text-rose-500 dark:text-rose-400 hover:text-white dark:hover:text-white hover:border-rose-500 hover:bg-rose-500 transition-all shadow-sm flex items-center justify-center hover:-translate-y-0.5"
                title="Quick Logout"
              >
                <i className="fas fa-power-off"></i>
              </button>
            </div>
          </header>

          {/* Nested Route Outlet Workspace */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10 pt-24 md:pt-10 scroll-smooth">
            <div className="max-w-7xl mx-auto w-full animate-[fadeIn_0.5s_cubic-bezier(0.4,0,0.2,1)_forwards] opacity-0">
              <Outlet />
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;
