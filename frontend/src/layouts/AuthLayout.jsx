import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Column: Form Area */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Logo Section */}
          <div className="mb-8 flex items-center gap-2">
            <Link to="/" className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center hover:bg-brand-700 transition">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </Link>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Online Job Searching</span>
          </div>

          {/* Render child routes (Login or Register) here */}
          <Outlet />
        </div>
      </div>

      {/* Right Column: Decorative Area (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative overflow-hidden bg-brand-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="hero-gradient absolute inset-0 opacity-80"></div>
        
        <div className="relative z-10 px-12 text-center text-white max-w-xl">
          <h2 className="text-4xl font-bold mb-6">Find the job that fits your life</h2>
          <p className="text-brand-100 text-lg">
            Join thousands of professionals who have found their dream companies and employers who have discovered top talent on Online Job Searching.
          </p>
        </div>
        
        {/* Abstract shapes matching the landing page theme */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full scale-150 transform translate-x-1/4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M44.7,-76.4C58.3,-69.2,69.8,-57.3,77.3,-43.7C84.8,-30.1,88.3,-15.1,86.2,-0.9C84.1,13.2,76.5,26.4,67.6,37.6C58.8,48.8,48.8,58,37,64.8C25.3,71.7,11.8,76.2,-1.5,78.8C-14.8,81.4,-29.6,82,-42.6,76.4C-55.5,70.9,-66.6,59.1,-73.9,45.4C-81.2,31.7,-84.7,15.8,-83.4,0.7C-82.1,-14.4,-76,-28.7,-67,-40.8C-58,-52.8,-46.1,-62.5,-33.1,-70C-20.2,-77.5,-6.3,-82.7,8.6,-97.6C23.6,-112.5,44.7,-76.4,44.7,-76.4Z" fill="#FFFFFF" transform="translate(100 100)"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
