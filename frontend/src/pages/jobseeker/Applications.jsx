import React from 'react';

const Applications = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Application History</h2>
          <p className="text-slate-500 mt-1">Track the status of your submitted applications.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Job Title / Company</th>
                <th className="p-4 font-medium">Applied Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Application 1 (Sent/Pending) */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-900">Frontend React Developer</p>
                  <p className="text-sm text-slate-500">TechCorp Inc.</p>
                </td>
                <td className="p-4 text-slate-600">Oct 24, 2023</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Sent
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline">Withdraw</button>
                </td>
              </tr>

              {/* Application 2 (Viewed) */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-900">UI/UX Designer</p>
                  <p className="text-sm text-slate-500">Creative Studio</p>
                </td>
                <td className="p-4 text-slate-600">Oct 20, 2023</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Viewed
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-sm font-medium text-slate-400 cursor-not-allowed" disabled title="Cannot withdraw after CV is viewed">Cannot Withdraw</button>
                </td>
              </tr>

              {/* Application 3 (Interviewing) */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-900">Senior Fullstack Engineer</p>
                  <p className="text-sm text-slate-500">Global FinTech</p>
                </td>
                <td className="p-4 text-slate-600">Oct 15, 2023</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Interviewing
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline">View Messages</button>
                </td>
              </tr>

              {/* Application 4 (Rejected) */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-900">Backend Node Developer</p>
                  <p className="text-sm text-slate-500">StartupX</p>
                </td>
                <td className="p-4 text-slate-600">Oct 10, 2023</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Rejected
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm text-slate-400">Archived</span>
                </td>
              </tr>

              {/* Application 5 (Hired) */}
              <tr className="hover:bg-slate-50/50 transition-colors bg-brand-50/30">
                <td className="p-4">
                  <p className="font-bold text-slate-900">Lead React Developer</p>
                  <p className="text-sm text-slate-500">MegaCorp</p>
                </td>
                <td className="p-4 text-slate-600">Sep 01, 2023</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-700 border border-brand-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Hired
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm font-bold text-brand-600">Congratulations! 🎉</span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applications;
