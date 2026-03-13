import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50" data-purpose="main-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold text-brand-900 tracking-tight">Online Job Searching</span>
          </Link>
          {/* Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link className="text-slate-600 hover:text-brand-600 font-medium" to="/">Home</Link>
            <Link className="text-slate-600 hover:text-brand-600 font-medium" to="/jobs">Find Jobs</Link>
            <Link className="text-slate-600 hover:text-brand-600 font-medium" to="/companies">Companies</Link>
            <Link className="text-slate-600 hover:text-brand-600 font-medium" to="/employer/dashboard">For Employers</Link>
          </div>
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link className="text-slate-600 hover:text-brand-600 font-medium px-4 py-2" to="/login">Login</Link>
            <Link className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all" to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
