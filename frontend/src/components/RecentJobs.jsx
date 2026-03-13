import React from 'react';

const RecentJobs = () => {
  return (
    <section className="py-20 bg-slate-50" data-purpose="job-listings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Recent Job Openings</h2>
            <p className="text-slate-600">The latest opportunities from companies looking for talent like you.</p>
          </div>
          <a className="text-brand-600 font-bold flex items-center hover:gap-2 transition-all" href="#">
            Browse All Jobs <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </a>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500">
            No recent jobs to display. Jobs will appear here once loaded from the API.
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentJobs;
