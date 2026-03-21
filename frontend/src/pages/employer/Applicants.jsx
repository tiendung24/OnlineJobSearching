import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:3000/api/employer';

const STATUS_LABELS = {
  'Sent/Pending': 'New',
  Viewed: 'Reviewing',
  Interviewing: 'Interviewing',
  Rejected: 'Rejected',
  'Hired/Approved': 'Hired / Approved',
};

const STATUS_STYLES = {
  'Sent/Pending': 'bg-blue-50 text-blue-700 border-blue-200',
  Viewed: 'bg-amber-50 text-amber-700 border-amber-200',
  Interviewing: 'bg-violet-50 text-violet-700 border-violet-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  'Hired/Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const formatDate = (value, includeTime = false) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return includeTime
    ? date.toLocaleString()
    : date.toLocaleDateString();
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '--';
};

const StatusBadge = ({ status, small = false }) => {
  const classes = STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center rounded-full border font-bold uppercase tracking-wider ${small ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1 text-[11px]'} ${classes}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
};

const Applicants = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedJobId = Number(searchParams.get('jobId')) || null;

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [pipelineLoading, setPipelineLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [pageError, setPageError] = useState('');
  const [detailError, setDetailError] = useState('');

  const [statusFilter, setStatusFilter] = useState('All');
  const [pipeline, setPipeline] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [applicationDetail, setApplicationDetail] = useState(null);

  const updateJobSearchParam = (jobId) => {
    const params = new URLSearchParams(searchParams);
    if (jobId) {
      params.set('jobId', String(jobId));
    } else {
      params.delete('jobId');
    }
    setSearchParams(params, { replace: true });
  };

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      setPageError('');

      const response = await fetch(`${API}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load jobs.');
      }

      setJobs(data);
    } catch (error) {
      setPageError(error.message || 'Failed to load jobs.');
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchPipeline = async (jobId, filterValue, keepCurrentSelection = true) => {
    if (!jobId) {
      setPipeline(null);
      setSelectedApplicationId(null);
      setApplicationDetail(null);
      return;
    }

    try {
      setPipelineLoading(true);
      setPageError('');

      const response = await fetch(`${API}/jobs/${jobId}/applications?status=${encodeURIComponent(filterValue)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load applicants.');
      }

      setPipeline(data);

      const stillExists = keepCurrentSelection
        ? data.applicants.some((applicant) => applicant.ApplicationID === selectedApplicationId)
        : false;
      const nextApplicationId = stillExists
        ? selectedApplicationId
        : (data.applicants[0]?.ApplicationID || null);

      setSelectedApplicationId(nextApplicationId);

      if (!nextApplicationId) {
        setApplicationDetail(null);
      }
    } catch (error) {
      setPipeline(null);
      setSelectedApplicationId(null);
      setApplicationDetail(null);
      setPageError(error.message || 'Failed to load applicants.');
    } finally {
      setPipelineLoading(false);
    }
  };

  const fetchApplicationDetail = async (applicationId) => {
    if (!applicationId) {
      setApplicationDetail(null);
      return;
    }

    try {
      setDetailLoading(true);
      setDetailError('');

      const selectedApplicant = pipeline?.applicants.find((applicant) => applicant.ApplicationID === applicationId);
      const shouldRefreshPipeline = selectedApplicant?.Status === 'Sent/Pending';

      const response = await fetch(`${API}/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load application details.');
      }

      setApplicationDetail(data.application);

      if (shouldRefreshPipeline && selectedJobId) {
        fetchPipeline(selectedJobId, statusFilter, true);
      }
    } catch (error) {
      setDetailError(error.message || 'Failed to load application details.');
      setApplicationDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusUpdate = async (nextStatus) => {
    if (!applicationDetail) return;

    try {
      setStatusUpdating(true);
      setDetailError('');

      const response = await fetch(`${API}/applications/${applicationDetail.ApplicationID}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: nextStatus,
          employerNote: applicationDetail.EmployerNote || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update application status.');
      }

      setApplicationDetail(data.application);
      await fetchPipeline(selectedJobId, statusFilter, true);
    } catch (error) {
      setDetailError(error.message || 'Failed to update application status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token]);

  useEffect(() => {
    if (jobsLoading) return;

    if (jobs.length === 0) {
      setPipeline(null);
      setSelectedApplicationId(null);
      setApplicationDetail(null);
      return;
    }

    const hasSelectedJob = selectedJobId && jobs.some((job) => job.JobID === selectedJobId);
    if (hasSelectedJob) {
      return;
    }

    const preferredJob = jobs.find((job) => (job.ApplicationCount || 0) > 0) || jobs[0];
    if (preferredJob) {
      updateJobSearchParam(preferredJob.JobID);
    }
  }, [jobs, jobsLoading, selectedJobId]);

  useEffect(() => {
    if (!token || !selectedJobId) return;
    fetchPipeline(selectedJobId, statusFilter, true);
  }, [token, selectedJobId, statusFilter]);

  useEffect(() => {
    if (!token || !selectedApplicationId) return;
    fetchApplicationDetail(selectedApplicationId);
  }, [token, selectedApplicationId]);

  const selectedJob = jobs.find((job) => job.JobID === selectedJobId) || pipeline?.job || null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
              <li>
                <Link to="/employer/jobs" className="hover:text-brand-600">Jobs</Link>
              </li>
              <li>
                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </li>
              <li aria-current="page" className="text-slate-700 font-medium">
                {selectedJob?.Title || 'Applicant Review'}
              </li>
            </ol>
          </nav>
          <h2 className="text-2xl font-bold text-slate-900">Applicant Review</h2>
          <p className="text-slate-500 mt-1">Review candidates and manage the hiring pipeline.</p>
        </div>

        <div className="w-full lg:w-96">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Job Posting</label>
          <select
            value={selectedJobId || ''}
            onChange={(event) => updateJobSearchParam(Number(event.target.value))}
            disabled={jobsLoading || jobs.length === 0}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
          >
            {jobs.length === 0 ? (
              <option value="">No jobs available</option>
            ) : (
              jobs.map((job) => (
                <option key={job.JobID} value={job.JobID}>
                  {job.Title} ({job.ApplicationCount || 0} applicants)
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {pageError && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium">
          {pageError}
        </div>
      )}

      {!jobsLoading && jobs.length === 0 && !pageError && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2">No jobs available</h3>
          <p className="text-slate-500 mb-4">Create a job posting first, then applicant data will appear here.</p>
          <Link to="/employer/jobs" className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 text-white font-bold text-sm">
            Go to Job Manager
          </Link>
        </div>
      )}

      {jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 border border-slate-200 bg-white rounded-2xl shadow-sm h-[80vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 space-y-3">
              <div>
                <h3 className="font-bold text-slate-900">Candidates</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {(pipeline?.job?.ApplicationCount || selectedJob?.ApplicationCount || 0)} total applicants
                </p>
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
              >
                {(pipeline?.availableStatuses || [{ value: 'All', label: 'All Statuses' }]).map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                    {typeof status.count === 'number' ? ` (${status.count})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {pipelineLoading ? (
                <div className="p-10 text-center text-slate-500">Loading candidates...</div>
              ) : pipeline?.applicants?.length ? (
                pipeline.applicants.map((applicant) => {
                  const isSelected = applicant.ApplicationID === selectedApplicationId;
                  return (
                    <button
                      key={applicant.ApplicationID}
                      type="button"
                      onClick={() => setSelectedApplicationId(applicant.ApplicationID)}
                      className={`w-full text-left p-4 transition-colors ${isSelected ? 'bg-brand-50' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {getInitials(applicant.FullName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 text-sm truncate">{applicant.FullName}</h4>
                              <p className="text-xs text-slate-500 truncate">{applicant.Email}</p>
                            </div>
                            <StatusBadge status={applicant.Status} small />
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                            <span>{formatDate(applicant.AppliedAt)}</span>
                            <span>{applicant.CVName || 'No CV'}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-10 text-center text-slate-500">
                  No candidates to display for this filter.
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-3 border border-slate-200 bg-white rounded-2xl shadow-sm h-[80vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                  {applicationDetail ? getInitials(applicationDetail.FullName) : '-'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 truncate">
                    {applicationDetail?.FullName || 'No candidate selected'}
                  </h3>
                  <div className="text-sm text-slate-500 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                    <span>{applicationDetail?.Email || '-'}</span>
                    <span>{applicationDetail?.Phone || '-'}</span>
                    <span>{applicationDetail?.JobTitle || selectedJob?.Title || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {applicationDetail?.Status && <StatusBadge status={applicationDetail.Status} />}
                <button
                  type="button"
                  disabled={!applicationDetail || statusUpdating || applicationDetail.Status === 'Hired/Approved'}
                  onClick={() => handleStatusUpdate('Hired/Approved')}
                  className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Hire / Approve
                </button>
                <button
                  type="button"
                  disabled={!applicationDetail || statusUpdating || applicationDetail.Status === 'Rejected'}
                  onClick={() => handleStatusUpdate('Rejected')}
                  className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Reject
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
              {detailError && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium">
                  {detailError}
                </div>
              )}

              {detailLoading ? (
                <div className="bg-white p-10 rounded-xl border border-slate-200 text-center text-slate-500 shadow-sm">
                  Loading application details...
                </div>
              ) : !applicationDetail ? (
                <div className="bg-white p-10 rounded-xl border border-slate-200 text-center text-slate-500 shadow-sm">
                  Select a candidate to review their CV and cover letter.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">Applied At</p>
                      <p className="font-semibold text-slate-900">{formatDate(applicationDetail.AppliedAt, true)}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">Location</p>
                      <p className="font-semibold text-slate-900">{applicationDetail.JobLocation || 'Not specified'}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">Level / Type</p>
                      <p className="font-semibold text-slate-900">
                        {[applicationDetail.JobLevel, applicationDetail.JobType].filter(Boolean).join(' / ') || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Cover Letter</h4>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                      {applicationDetail.CoverLetter || 'No cover letter to display.'}
                    </p>
                  </div>

                  {applicationDetail.EmployerNote && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Employer Note</h4>
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                        {applicationDetail.EmployerNote}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Resume / CV Document</h4>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                        <div>
                          <p className="font-bold text-slate-900">{applicationDetail.CVName || 'Untitled CV'}</p>
                          <p className="text-sm text-slate-500 mt-1 break-all">{applicationDetail.FilePath || 'No file path available.'}</p>
                          <p className="text-xs text-slate-400 mt-2">
                            Uploaded: {formatDate(applicationDetail.CVCreatedAt, true)}
                          </p>
                        </div>

                        {applicationDetail.FilePath ? (
                          <a
                            href={applicationDetail.FilePath}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-lg font-bold text-sm"
                          >
                            Download PDF
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center justify-center text-slate-400 bg-slate-100 px-4 py-2 rounded-lg font-bold text-sm cursor-not-allowed"
                          >
                            No PDF
                          </button>
                        )}
                      </div>

                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 aspect-[1/1.2] w-full flex flex-col items-center justify-center text-slate-400 px-6 text-center">
                        <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p className="font-medium text-slate-500">PDF preview is not implemented yet in this project.</p>
                        <p className="text-sm mt-2">Use the download button above to open the CV file.</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
