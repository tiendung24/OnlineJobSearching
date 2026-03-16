import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Role mapping (matches DB: 1=Admin, 2=JobSeeker, 3=Employer)
export const ROLES = {
  ADMIN: 1,
  JOBSEEKER: 2,
  EMPLOYER: 3,
};

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = useCallback((userData, jwtToken) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;
  const isEmployer = isAuthenticated && user?.roleId === ROLES.EMPLOYER;
  const isJobSeeker = isAuthenticated && user?.roleId === ROLES.JOBSEEKER;
  const isAdmin = isAuthenticated && user?.roleId === ROLES.ADMIN;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isEmployer, isJobSeeker, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
