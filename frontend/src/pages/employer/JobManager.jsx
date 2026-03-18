import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const JobManager = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [errorHeader, setErrorHeader] = useState('');

  // New Job Form State
  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    SalaryRange: '',
    Location: '',
    Level: '',
    JobType: '',
    Industry: '',
    ExpiredAt: ''
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/employer/jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      } else {
        const data = await res.json();
         if (res.status === 400 && data.message.includes('complete your company profile')) {
            setErrorHeader('You must complete your Company Profile before posting and managing jobs.');
         }
      }
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await fetch('http://localhost:3000/api/employer/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Error posting job');
        return;
      }

      // Success
      setShowModal(false);
      setFormData({
        Title: '', Description: '', SalaryRange: '', Location: '', 
        Level: '', JobType: '', Industry: '', ExpiredAt: ''
      });
      fetchJobs(); // Refresh the list
    } catch (error) {
       console.error(error);
       alert('An error occurred while posting the job.');
    } finally {
      setPosting(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const s = status || 'Draft';
    let color = 'bg-slate-100 text-slate-600';
    if (s === 'Published') color = 'bg-emerald-100 text-emerald-700';
    if (s === 'Pending Approval') color = 'bg-amber-100 text-amber-700';
    if (s === 'Closed/Expired') color = 'bg-red-100 text-red-700';

    return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${color}`}>{s}</span>;
  };

  if (loading) {
     return (
        <div className="flex justify-center items-center h-64">
           <svg className="animate-spin w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
         </div>
     );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Job Manager</h2>
          <p className="text-slate-500 mt-1">Manage your job postings and applicants.</p>
        </div>
        {!errorHeader && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Post New Job
          </button>
        )}
      </div>

       {errorHeader && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium">
             <p>{errorHeader}</p>
          </div>
       )}

      {!errorHeader && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {jobs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Jobs Posted Yet</h3>
              <p className="text-sm">Create your first job posting to start finding candidates.</p>
              <button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm">Create Job</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Job Details</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Applications</th>
                    <th className="px-6 py-4">Posted / Expires</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {jobs.map((job) => (
                    <tr key={job.JobID} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-base">{job.Title}</div>
                        <div className="flex gap-2 items-center mt-1 text-xs text-slate-500">
                           <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> {job.Location || 'Anywhere'}</span>
                           <span>•</span>
                           <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {job.SalaryRange || 'Negotiable'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={job.Status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{job.ApplicationCount || 0}</span>
                          <span className="text-xs text-slate-400">candidates</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="text-slate-900">{new Date(job.CreatedAt).toLocaleDateString()}</div>
                        <div className="text-red-500 font-medium">exp: {new Date(job.ExpiredAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/employer/applicants?jobId=${job.JobID}`}
                          className="text-brand-600 hover:text-brand-900 font-bold text-sm bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded transition-colors hidden group-hover:inline-block"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CREATE JOB MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 border border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
              <div>
                 <h3 className="text-xl font-bold text-slate-900">Create New Job Posting</h3>
                 <p className="text-xs text-slate-500 mt-1">Jobs will be reviewed by an administrator before appearing publicly.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
               >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6">
              <form id="jobForm" onSubmit={handleCreateJob} className="space-y-6">
                
                {/* Basic Info */}
                <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Job Title *</label>
                     <input type="text" name="Title" required value={formData.Title} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" placeholder="e.g. Senior React Developer" />
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                        <input type="text" name="Location" value={formData.Location} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" placeholder="e.g. Ho Chi Minh City" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Salary Range</label>
                        <input type="text" name="SalaryRange" value={formData.SalaryRange} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" placeholder="e.g. $1000 - $2000" />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Level</label>
                        <select name="Level" value={formData.Level} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm">
                           <option value="">Select Level</option>
                           <option value="Intern">Intern</option>
                           <option value="Fresher">Fresher</option>
                           <option value="Junior">Junior</option>
                           <option value="Mid-level">Mid-level</option>
                           <option value="Senior">Senior</option>
                           <option value="Manager">Manager</option>
                        </select>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                        <select name="JobType" value={formData.JobType} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm">
                           <option value="">Select Type</option>
                           <option value="Full-time">Full-time</option>
                           <option value="Part-time">Part-time</option>
                           <option value="Freelance">Freelance</option>
                           <option value="Remote">Remote</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Industry</label>
                        <select name="Industry" value={formData.Industry} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm">
                          <option value="">Select Industry...</option>
                          <option value="IT - Software">IT - Software</option>
                          <option value="Marketing / PR">Marketing / PR</option>
                          <option value="Finance / Banking">Finance / Banking</option>
                          <option value="Education">Education</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                   </div>
                </div>

                {/* Description */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Job Description & Requirements *</label>
                   <textarea rows={8} name="Description" required value={formData.Description} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-y text-sm" placeholder="List responsibilities, requirements, and benefits here..."></textarea>
                </div>

                {/* Deadline */}
                <div className="w-full sm:w-1/2">
                   <label className="block text-sm font-bold text-slate-700 mb-1">Application Deadline *</label>
                   <input type="date" name="ExpiredAt" required value={formData.ExpiredAt} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                </div>

              </form>
            </div>

            <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl sticky bottom-0 z-10">
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors border border-transparent"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="jobForm"
                disabled={posting}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {posting ? 'Submitting...' : 'Submit Job for Review'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobManager;
