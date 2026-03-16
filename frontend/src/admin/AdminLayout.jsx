import { Outlet, Link } from "react-router-dom";

function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "220px",
        height: "100vh",
        background: "#111",
        color: "white",
        padding: "20px"
      }}>
        <h2>Admin</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/admin/destinations" style={{ color: "white", textDecoration: "none" }}>
              Destinations
            </Link>
          </li>

          <li>
            <Link to="/admin/bookings" style={{ color: "white", textDecoration: "none" }}>
              Bookings
            </Link>
          </li>
        </ul>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, padding: "30px" }}>
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;