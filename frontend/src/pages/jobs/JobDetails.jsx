import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const JobDetails = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/jobs" className="hover:text-brand-600">Find Jobs</Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                <span className="ml-1 md:ml-2">Technology</span>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                <span className="ml-1 md:ml-2 text-slate-700 font-medium truncate">Senior Software Engineer</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-brand-900 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-brand-900/60 mix-blend-multiply"></div>
          </div>

          <div className="px-6 md:px-10 pb-10">
            {/* Upper Content (Logo, Title, Actions) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-12 mb-8 gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center relative z-10 overflow-hidden">
                  <span className="text-4xl font-black text-slate-300">T</span>
                </div>
                <div className="mt-2 sm:mt-0">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">Senior Software Engineer</h1>
                  <p className="text-lg text-brand-600 font-semibold mt-1">TechNova Solutions</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center justify-center p-3 sm:px-6 rounded-xl border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-colors font-bold group bg-white shadow-sm">
                  <svg className="w-5 h-5 sm:mr-2 group-hover:fill-brand-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  <span className="hidden sm:inline">Save</span>
                </button>
                <button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/30">
                  Apply Now
                </button>
              </div>
            </div>

            {/* Job Metadata Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-10">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm text-brand-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Location</p>
                  <p className="font-semibold text-slate-900">San Francisco, CA</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm text-brand-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Job Type</p>
                  <p className="font-semibold text-slate-900">Full-time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm text-brand-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Salary</p>
                  <p className="font-semibold text-slate-900">$120k - $150k / year</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm text-brand-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Experience Level</p>
                  <p className="font-semibold text-slate-900">Senior (5+ yrs)</p>
                </div>
              </div>
            </div>

            {/* Job Description Sections */}
            <div className="space-y-8 text-slate-600 prose prose-brand max-w-none">
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">About the Role</h3>
                <p>We are looking for an experienced Senior Software Engineer to join our growing core infrastructure team. You will be responsible for building scalable microservices and mentoring junior developers. You’ll have the opportunity to work on bleeding-edge technologies and help shape the architectural direction of the company.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Key Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Design, develop, test, deploy, maintain and improve software architectures.</li>
                  <li>Manage individual project priorities, deadlines and deliverables.</li>
                  <li>Collaborate tightly with a cross-functional team of engineers, PMs, and designers.</li>
                  <li>Mentor junior engineers and lead code review processes to maintain code quality.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Requirements</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>5+ years of professional software development experience.</li>
                  <li>Deep knowledge of JavaScript/TypeScript, React, and Node.js.</li>
                  <li>Experience with AWS infrastructure and Docker/Kubernetes containerization.</li>
                  <li>Strong communication skills and ability to work in a fast-paced environment.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Apply to TechNova Solutions</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <form className="p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Application Submitted!'); setIsModalOpen(false); }}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select CV to Send</label>
                <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow bg-slate-50 focus:bg-white">
                  <option value="">Select a CV...</option>
                  <option value="1">Frontend_Dev_Resume.pdf (Default)</option>
                  <option value="2">Fullstack_General.pdf</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">Make sure your CV outlines the skills requested in the job description.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Cover Letter <span className="text-slate-400 font-normal">(Optional)</span></label>
                <textarea 
                  rows="4" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow bg-slate-50 focus:bg-white resize-none"
                  placeholder="Introduce yourself to the hiring manager..."
                ></textarea>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-brand-500/30"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
