import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const INDUSTRIES = ['All', 'IT - Software', 'IT - Hardware', 'Marketing / PR', 'Finance / Banking', 'Education', 'Healthcare', 'Other'];

const CompanyCard = ({ company }) => {
  const initials = company.CompanyName
    ? company.CompanyName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all group p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-brand-50 border border-slate-100 flex items-center justify-center">
          {company.LogoUrl ? (
            <img src={company.LogoUrl} alt={company.CompanyName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-extrabold text-brand-600">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-base truncate group-hover:text-brand-600 transition-colors">
            {company.CompanyName}
          </h3>
          {company.Industry && (
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">
              {company.Industry}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {company.Description && (
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
          {company.Description}
        </p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mb-4">
        {company.Address && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {company.Address}
          </span>
        )}
        {company.Size && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {company.Size} employees
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        <span className={`text-sm font-bold ${company.OpenJobCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
          {company.OpenJobCount > 0 ? `${company.OpenJobCount} open job${company.OpenJobCount > 1 ? 's' : ''}` : 'No open jobs'}
        </span>
        {company.Website && (
          <a
            href={company.Website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-600 hover:underline font-medium"
            onClick={e => e.stopPropagation()}
          >
            Visit website ↗
          </a>
        )}
      </div>
    </div>
  );
};

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [activeIndustry, setActiveIndustry] = useState('All');

  const fetchCompanies = async (search = '', industry = 'All') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (industry !== 'All') params.append('industry', industry);
      const res = await fetch(`http://localhost:3000/api/companies?${params.toString()}`);
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(searchTerm, activeIndustry);
  }, [searchTerm, activeIndustry]);

  const handleSearch = () => {
    setSearchTerm(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

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
              <svg className="w-5 h-5 text-brand-500 mr-3 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by company name or industry..."
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 outline-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto h-12 sm:h-14"
            >
              Find Companies
            </button>
          </div>
        </div>

        {/* Industry Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveIndustry(ind)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeIndustry === ind
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Result count */}
        {!loading && (
          <p className="text-sm text-slate-500 mb-6">
            {companies.length === 0 ? 'No companies found.' : `${companies.length} compan${companies.length > 1 ? 'ies' : 'y'} found`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <svg className="w-14 h-14 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-slate-400 font-medium">Chưa có công ty nào.</p>
            <p className="text-slate-400 text-sm mt-1">Hãy thử tìm kiếm khác hoặc quay lại sau.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard key={company.CompanyID} company={company} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Companies;
