import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Dashboard</h2>
          <p className="text-slate-500 mt-1">Platform overview and key performance metrics.</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-brand-500">
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-brand-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
            <h3 className="text-2xl font-extrabold text-slate-900">12,450</h3>
            <p className="text-xs text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              +14% this month
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-brand-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Jobs</p>
            <h3 className="text-2xl font-extrabold text-slate-900">3,210</h3>
            <p className="text-xs text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              +5% this month
            </p>
          </div>
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-brand-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Applications</p>
            <h3 className="text-2xl font-extrabold text-slate-900">45k+</h3>
            <p className="text-xs text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              +22% this month
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-brand-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Successful Hires</p>
            <h3 className="text-2xl font-extrabold text-slate-900">1,842</h3>
            <p className="text-xs text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              +8% this month
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
        </div>
      </div>

      { /* Action Required Section */ }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Jobs Pending Approval
            </h3>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">14 Pending</span>
          </div>
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-50">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Frontend Engineer - Remote</h4>
                  <p className="text-xs text-slate-500 mt-0.5">By: TechCorp Inc. • 2 hours ago</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs font-bold px-3 py-1.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100">Approve</button>
                  <button className="text-xs font-bold px-3 py-1.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200">Review</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100 text-center">
            <button className="text-sm font-bold text-brand-600 hover:text-brand-800">View Moderation Queue &rarr;</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Reported Users / Jobs
            </h3>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full">3 Reports</span>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="p-4 flex flex-col hover:bg-slate-50 gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Suspicious Job Posting</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Reported by 5 users • Target: "Data Entry Work from Home"</p>
                </div>
                <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">High Priority</span>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">"Asking for an upfront fee to guarantee an interview."</p>
               <div className="flex gap-2 mt-1">
                  <button className="text-xs font-bold px-3 py-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100">Take Down Job</button>
                  <button className="text-xs font-bold px-3 py-1.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200">Investigate</button>
                </div>
            </div>
            {/* More reports could follow */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
