import React, { useState } from 'react';

const JobManager = () => {
  const [activeTab, setActiveTab] = useState('published'); // published, pending, closed

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Job Management</h2>
          <p className="text-slate-500 mt-1">Create, edit, and monitor your job postings.</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Post a New Job
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-100 px-6 pt-4 flex gap-6 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('published')}
            className={`pb-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'published' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Published
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`pb-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'pending' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Pending Approval
          </button>
          <button 
            onClick={() => setActiveTab('closed')}
            className={`pb-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'closed' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Closed / Expired
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Search by job title..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <select className="px-4 py-2 rounded-lg border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-700">
            <option>All Types</option>
            <option>Full-time</option>
            <option>Part-time</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Job Title</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Date / Expiry</th>
                <th className="p-4 font-bold">Applicants</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td colSpan="5" className="p-10 text-center text-slate-500">
                  No jobs to display. Jobs will appear here once loaded from the API.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder - hidden until API provides data */}
        <div className="p-4 border-t border-slate-100 text-center text-sm text-slate-400">
          No pagination to display.
        </div>
      </div>
    </div>
  );
};

export default JobManager;
