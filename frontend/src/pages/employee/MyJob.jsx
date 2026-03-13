import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';

// Since the Employee role is just a JobSeeker who got hired,
// they might share the same layout but have an extra "My Job" tab.
// For simplicity in this demo, we'll give them their own layout/view.

const EmployeeLayout = () => {
  const employeeLinks = [
    {
      name: 'My Current Job',
      path: '/employee/my-job',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
    },
    {
      name: 'JobSeeker Portal',
      path: '/jobseeker/profile',
      icon: <svg className="w-5 h-5 border rounded" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
    }
  ];

  return <DashboardLayout role="Employee" links={employeeLinks} />;
};

const MyJob = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Employment Record</h2>
          <p className="text-slate-500 mt-1">View your current active employment status.</p>
        </div>
        <button className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
          Request Resignation
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-brand-900 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-brand-900/80 mix-blend-multiply"></div>
        </div>
        
        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-10 mb-6">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-md border-4 border-white flex items-center justify-center text-3xl font-black text-brand-600 z-10">
              T
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active Employee
            </span>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-1">Senior React Developer</h3>
          <p className="text-lg text-slate-600 font-medium mb-8">TechNova Solutions</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Date Hired</p>
              <p className="font-bold text-slate-900">August 12, 2023</p>
              <p className="text-xs text-slate-500 mt-1">2 months, 14 days tenure</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Employment Type</p>
              <p className="font-bold text-slate-900">Full-time • San Francisco (Hybrid)</p>
            </div>
            <div className="md:col-span-2 pt-4 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-500 mb-2">Notice</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                This official employment record is maintained by your employer. If you choose to leave this position, you can request a "Resigned" status update via the button above, which will prompt your employer to confirm the state change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { EmployeeLayout, MyJob };
