import React from 'react';

const SavedJobs = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Saved Jobs</h2>
          <p className="text-slate-500 mt-1">Jobs you've liked. Apply before they expire!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Saved Job Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow relative">
          <button className="absolute top-6 right-6 text-brand-500 hover:text-brand-600 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </button>
          
          <div className="flex gap-6 items-center w-full md:w-auto pr-10 md:pr-0">
            <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 flex-shrink-0">
              <span className="text-zinc-800 font-black text-xl">U</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Lead UX Researcher</h3>
              <div className="flex flex-wrap gap-4 mt-2 text-slate-500 text-sm">
                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg> Uber</span>
                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> New York</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-xl font-bold transition-colors w-full md:w-auto">Apply Now</button>
          </div>
        </div>

        {/* Expired Job Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-60 relative">
          <div className="absolute top-6 right-6 text-slate-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </div>
          <div className="flex gap-6 items-center w-full md:w-auto pr-10 md:pr-0">
            <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 flex-shrink-0 grayscale">
              <span className="text-zinc-800 font-black text-xl">S</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-slate-900 line-through">Senior Product Designer</h3>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">Expired</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-slate-500 text-sm">
                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg> Stripe</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-slate-200 text-slate-500 px-6 py-2 rounded-xl font-bold cursor-not-allowed w-full md:w-auto" disabled>Closed</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;
