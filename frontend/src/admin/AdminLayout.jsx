import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./AdminLayout.css"; // Ensure this CSS file is linked!

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Define navigation items to easily map over them
  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Destinations", path: "/admin/destinations" },
    { name: "Bookings", path: "/admin/bookings" },
  ];

  return (
    <div className="admin-layout-wrapper">
      
      {/* Mobile Top Header (Only visible on screens 768px and smaller) */}
      <div className="mobile-header">
        <h2 className="mobile-title">Admin</h2>
        <button className="mobile-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Dark Overlay for Mobile (Closes menu when clicking outside) */}
      <div 
        className={`sidebar-overlay ${isOpen ? "active" : ""}`} 
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar Component */}
      <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="admin-sidebar-title">Admin</h2>

        <ul className="admin-sidebar-nav">
          {navItems.map((item) => {
            // Checks if the current URL matches the link
            const isActive = location.pathname === item.path || (location.pathname === item.path + '/'); 

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`admin-sidebar-link ${isActive ? "active" : ""}`}
                  onClick={() => setIsOpen(false)} // Auto-close menu on mobile after clicking a link
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Page content - Your nested routes will render here inside the Outlet */}
      <div className="admin-page-content">
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;
