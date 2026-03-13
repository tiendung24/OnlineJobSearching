import React, { useState } from 'react';

const Applicants = () => {
  const [filter, setFilter] = useState('All');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
              <li><a href="#" className="hover:text-brand-600">Jobs</a></li>
              <li><svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></li>
              <li aria-current="page"><span className="text-slate-700 font-medium">Senior React Developer</span></li>
            </ol>
          </nav>
          <h2 className="text-2xl font-bold text-slate-900">Applicant Review</h2>
          <p className="text-slate-500 mt-1">Review candidates and manage the hiring pipeline.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Column: List/Pipeline */}
        <div className="md:col-span-1 border border-slate-200 bg-white rounded-2xl shadow-sm h-[80vh] flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">Candidates</h3>
            <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none">
              <option>All Statuses</option>
              <option>New</option>
              <option>Reviewing</option>
              <option>Interviewing</option>
            </select>
          </div>
          
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            <div className="p-10 text-center text-slate-500">
              No candidates to display. Data will appear here once loaded from the API.
            </div>
          </div>
        </div>

        {/* Right Column: CV Viewer & Actions */}
        <div className="md:col-span-3 border border-slate-200 bg-white rounded-2xl shadow-sm h-[80vh] flex flex-col overflow-hidden">
          {/* Header/Actions */}
          <div className="p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center font-bold text-lg">
                -
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No candidate selected</h3>
                <div className="text-sm text-slate-500 flex gap-3">
                  <span>—</span>
                  <span>•</span>
                  <span>—</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Hire / Approve
              </button>
              <button className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                Reject
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            {/* Cover Letter Section (If provided) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Cover Letter</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                No cover letter to display.
              </p>
            </div>

            {/* PDF Viewer Mockup */}
            <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Resume / CV Document</h4>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm aspect-[1/1.4] w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-slate-400">
              <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <p className="font-medium text-slate-500">PDF Viewer Component Placeholder</p>
              <button className="mt-4 text-brand-600 bg-brand-50 px-4 py-2 rounded-lg font-bold text-sm">Download PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
