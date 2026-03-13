import React from 'react';

const HeroSection = () => {
  return (
    <header className="hero-gradient text-white py-20 lg:py-32 relative overflow-hidden" data-purpose="hero-banner">
      {/* Abstract background decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <svg className="w-full h-full scale-150 transform translate-x-1/4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M44.7,-76.4C58.3,-69.2,69.8,-57.3,77.3,-43.7C84.8,-30.1,88.3,-15.1,86.2,-0.9C84.1,13.2,76.5,26.4,67.6,37.6C58.8,48.8,48.8,58,37,64.8C25.3,71.7,11.8,76.2,-1.5,78.8C-14.8,81.4,-29.6,82,-42.6,76.4C-55.5,70.9,-66.6,59.1,-73.9,45.4C-81.2,31.7,-84.7,15.8,-83.4,0.7C-82.1,-14.4,-76,-28.7,-67,-40.8C-58,-52.8,-46.1,-62.5,-33.1,-70C-20.2,-77.5,-6.3,-82.7,8.6,-97.6C23.6,-112.5,44.7,-76.4,44.7,-76.4Z" fill="#FFFFFF" transform="translate(100 100)"></path>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
        <div className="lg:flex items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Find Your Dream Job Today
            </h1>
            <p className="text-lg md:text-xl text-brand-100 mb-10 max-w-xl mx-auto lg:mx-0">
              Connect with top companies and explore thousands of opportunities that match your skills and passion.
            </p>
            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto lg:mx-0">
              <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-100 py-2">
                <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                <input className="w-full border-none focus:ring-0 text-slate-900 placeholder-slate-400 p-2 outline-none" placeholder="Job title or keyword" type="text" />
              </div>
              <div className="flex-1 flex items-center px-4 py-2">
                <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                <input className="w-full border-none focus:ring-0 text-slate-900 placeholder-slate-400 p-2 outline-none" placeholder="City or remote" type="text" />
              </div>
              <button className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                Search
              </button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4 text-sm font-medium text-brand-100">
              <span>Popular:</span>
              <a className="underline hover:text-white" href="#">Product Designer</a>
              <a className="underline hover:text-white" href="#">Fullstack Dev</a>
              <a className="underline hover:text-white" href="#">Marketing</a>
            </div>
          </div>
          {/* Hero Illustration/Image */}
          <div className="lg:w-1/2 mt-16 lg:mt-0 relative hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl absolute -left-10 top-20 shadow-xl z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-400"></div>
                <div>
                  <p className="text-xs font-bold text-white">New Application</p>
                  <p className="text-[10px] text-brand-100">Senior UI Designer</p>
                </div>
              </div>
            </div>
            <img alt="Modern professional illustration" className="rounded-3xl shadow-2xl w-full max-w-md mx-auto transform rotate-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABbA11_e_3y76Z-BwyORM2G45uXym6NN_h8ts98gl9BhBmAf-IdP1PDef7iEg_SxG6s44cggcVonvWMwsUjLeSfqgCrdnBIHGJmWak22xSN2EWwl2AMjDm-YAtUe9qlQ2GxEn2QCCrbNVT1o3pHG4KL0A5_1QooZL4Zg18928XxlhES526t_OgRT3EbMkC5_eEkSAAc0OdXZFuY5SrDmfjyWKi95uoyKPF2ChoRydHpZy_QInuCfCcK5l-V24ZZgR5GIPu59XAqlMe" />
            <div className="bg-white p-4 rounded-3xl absolute -right-4 bottom-10 shadow-xl z-20 text-slate-900">
              <div className="flex items-center gap-3">
                <div className="bg-brand-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-brand-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" clipRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-bold">95% Match</p>
                  <p className="text-[10px] text-slate-500">Based on your skills</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
