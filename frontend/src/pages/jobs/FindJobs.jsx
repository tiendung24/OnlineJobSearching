import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FindJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="bg-brand-900 rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="hero-gradient absolute inset-0 opacity-80"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Find Your Next Opportunity</h1>
            
            <form className="bg-white p-2 md:p-3 rounded-2xl flex flex-col md:flex-row gap-2 shadow-xl max-w-4xl">
              <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-3 md:py-0 border border-transparent focus-within:border-brand-500 transition-colors">
                <svg className="w-5 h-5 text-brand-500 mr-3 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="hidden md:block w-px bg-slate-200 mx-2 my-2"></div>
              <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-3 md:py-0 border border-transparent focus-within:border-brand-500 transition-colors">
                <svg className="w-5 h-5 text-brand-500 mr-3 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <input 
                  type="text" 
                  placeholder="City, state, or remote" 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 outline-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold transition-colors w-full md:w-auto h-12 md:h-14">
                Search Jobs
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                Filters
                <button className="text-sm text-brand-600 font-medium hover:underline">Clear all</button>
              </h2>
              
              <div className="space-y-6">
                {/* Job Type */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Job Type</h3>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Freelance'].map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                        <span className="text-slate-600 group-hover:text-slate-900">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Category</h3>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none">
                    <option>All Categories</option>
                    <option>Software Development</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Experience Level</h3>
                  <div className="space-y-2">
                    {['Entry Level', 'Mid Level', 'Senior', 'Director', 'Executive'].map(level => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                        <span className="text-slate-600 group-hover:text-slate-900">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Job Listings Main Area */}
          <main className="w-full lg:w-3/4">
            <div className="space-y-4">
              <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500">
                No jobs to display. Jobs will appear here once loaded from the API.
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50">Prev</button>
                <button className="w-10 h-10 rounded-lg bg-brand-600 text-white font-bold">1</button>
                <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium">2</button>
                <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium">3</button>
                <span className="text-slate-400">...</span>
                <button className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">Next</button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
