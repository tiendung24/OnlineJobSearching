import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * A wrapper that redirects users who don't meet the role requirement.
 * Use as a route element with nested routes (uses Outlet pattern).
 *
 * Usage in App.jsx:
 *   <Route element={<ProtectedRoute requiredRole={ROLES.EMPLOYER} />}>
 *     <Route element={<EmployerLayout />}>
 *       <Route path="dashboard" element={<Dashboard />} />
 *     </Route>
 *   </Route>
 *
 * If requiredRole is omitted, just checks if the user is authenticated.
 */
const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Not logged in → send to login, remember where they came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole !== undefined && user?.roleId !== requiredRole) {
    // Logged in but wrong role → redirect home
    return <Navigate to="/" replace />;
  }

  // Authenticated and authorized → render child routes
  return <Outlet />;
};

export default ProtectedRoute;
