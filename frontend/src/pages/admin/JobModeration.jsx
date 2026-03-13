import React, { useState } from 'react';

const JobModeration = () => {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Job Moderation</h2>
          <p className="text-slate-500 mt-1">Review pending jobs and manage reported listings.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs & Filters */}
        <div className="border-b border-slate-100 px-6 pt-4 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div className="flex gap-6 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`pb-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'pending' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Pending Approval (14)
            </button>
            <button 
              onClick={() => setActiveTab('reported')}
              className={`pb-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'reported' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Reported Jobs (3)
            </button>
             <button 
              onClick={() => setActiveTab('all')}
              className={`pb-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'all' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              All Active Jobs
            </button>
          </div>
          
          <div className="pb-3 flex gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="Search jobs or companies..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
            </div>
            <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors hidden sm:block">
              Filter
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Job Details</th>
                <th className="p-4 font-bold">Employer</th>
                <th className="p-4 font-bold">Submitted</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Pending Job 1 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900">Frontend Engineer - Remote</div>
                  <div className="text-xs text-slate-500 mt-1 flex gap-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">Full-time</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">$90k-$120k</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-[10px]">TC</div>
                    <span className="text-sm font-medium text-slate-700">TechCorp Inc.</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">2 hours ago</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-amber-50 text-amber-700 border border-amber-100">
                    Pending
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors shadow-sm">Approve</button>
                    <button className="px-3 py-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-bold transition-colors">Reject</button>
                    <button className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs font-bold transition-colors">View Info</button>
                  </div>
                </td>
              </tr>

               {/* Pending Job 2 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900">Marketing Director</div>
                  <div className="text-xs text-slate-500 mt-1 flex gap-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">Full-time</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">New York, NY</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[10px]">G</div>
                    <span className="text-sm font-medium text-slate-700">GrowthStudio</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">5 hours ago</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-amber-50 text-amber-700 border border-amber-100">
                    Pending
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors shadow-sm">Approve</button>
                    <button className="px-3 py-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-bold transition-colors">Reject</button>
                    <button className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs font-bold transition-colors">View Info</button>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobModeration;
