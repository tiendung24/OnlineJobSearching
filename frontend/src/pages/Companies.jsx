import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const companies = [];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Discover Top Workplaces</h1>
          <p className="text-lg text-slate-600 mb-8">
            Explore company cultures, benefits, and open roles to find the perfect fit for your next career move.
          </p>
          
          <div className="bg-white p-2 md:p-3 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-lg border border-slate-100">
            <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-3 sm:py-0 border border-transparent focus-within:border-brand-500 transition-colors">
              <svg className="w-5 h-5 text-brand-500 mr-3 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Search by company name or industry..." 
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto h-12 sm:h-14">
              Find Companies
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {['All Industries', 'Technology', 'Finance', 'Healthcare', 'Marketing'].map((filter, index) => (
              <button 
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${index === 0 ? 'bg-brand-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600'}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-500 shadow-sm cursor-pointer">
            <option>Sort by: Most Open Jobs</option>
            <option>Sort by: A-Z</option>
            <option>Sort by: Highest Rated</option>
          </select>
        </div>

        {/* Company Grid or Empty State */}
        {companies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
            No companies to display yet. Data will appear here once loaded from the API.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all group p-6 flex flex-col h-full">
                {/* card content from API */}
              </div>
            ))}
          </div>
        )}

        {/* Load More - disabled until API */}
        <div className="mt-12 text-center">
          <button disabled className="bg-white border-2 border-slate-200 text-slate-400 px-8 py-3 rounded-xl font-bold transition-all shadow-sm cursor-not-allowed">
            Load More Companies
          </button>
        </div>

      </div>
    </div>
  );
};

export default Companies;
