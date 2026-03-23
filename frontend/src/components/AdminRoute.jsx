import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext'; // Adjust path if needed!

const AdminRoute = ({ children }) => {
  const { user } = useAuth(); // Destructure whatever state holds your logged-in user

  // If there is no user logged in, OR the user is logged in but is NOT an admin
  if (!user || user.isAdmin !== true) {
    // Kick them back to the home page or login page
    return <Navigate to="/" replace />;
  }

  // If they are an admin, render the protected component!
  return children; 
};

export default AdminRoute;
