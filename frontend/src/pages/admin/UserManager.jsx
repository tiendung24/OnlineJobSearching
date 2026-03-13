import React, { useState } from 'react';

const UserManager = () => {
  const [activeTab, setActiveTab] = useState('jobseekers');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500 mt-1">Manage all JobSeeker and Employer accounts.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs & Search */}
        <div className="border-b border-slate-100 px-6 pt-4 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div className="flex gap-6 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('jobseekers')}
              className={`pb-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'jobseekers' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              JobSeekers
            </button>
            <button 
              onClick={() => setActiveTab('employers')}
              className={`pb-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'employers' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Employers / Companies
            </button>
             <button 
              onClick={() => setActiveTab('banned')}
              className={`pb-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'banned' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Banned Users
            </button>
          </div>
          
          <div className="pb-3 relative sm:max-w-xs w-full">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-[calc(50%+6px)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder={`Search ${activeTab}...`} className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">User Information</th>
                <th className="p-4 font-bold">Joined Date</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Activity Log</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* User 1 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-600">JD</div>
                    <div>
                      <div className="font-bold text-slate-900">John Doe</div>
                      <div className="text-xs text-slate-500 hover:text-brand-600 cursor-pointer">john.doe@email.com</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">Oct 12, 2023</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Active
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600">
                  Last login: 2 hours ago
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50">Reset Pwd</button>
                    <button className="px-3 py-1.5 border border-red-200 bg-red-50 rounded text-xs font-bold text-red-600 hover:bg-red-100">Ban User</button>
                  </div>
                </td>
              </tr>

              {/* User 2 (Employer) */}
               <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center font-bold text-xl text-brand-600 shadow-sm">T</div>
                    <div>
                      <div className="font-bold text-slate-900">TechNova Manager</div>
                      <div className="text-xs text-slate-500">hr@technovacorp.com</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">Jan 05, 2022</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Active
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600">
                  Posted 45 jobs
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50">View Details</button>
                    <button className="px-3 py-1.5 border border-red-200 bg-red-50 rounded text-xs font-bold text-red-600 hover:bg-red-100">Ban User</button>
                  </div>
                </td>
              </tr>
              
              {/* User 3 (Banned) */}
               <tr className="hover:bg-slate-50/50 transition-colors opacity-70">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-600 grayscale">SP</div>
                    <div>
                      <div className="font-bold text-slate-900 line-through">Spammer Bot</div>
                      <div className="text-xs text-slate-500">bot@spam.com</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">Oct 24, 2023</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-red-50 text-red-700 border border-red-100">
                    Banned
                  </span>
                </td>
                <td className="p-4 text-sm text-red-600 font-medium whitespace-break-spaces max-w-xs">
                  Reason: Violating Terms (Spamming applications)
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1.5 border border-brand-200 bg-brand-50 rounded text-xs font-bold text-brand-700 hover:bg-brand-100">Unban</button>
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

export default UserManager;
