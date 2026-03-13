import React from 'react';

const CompanyProfile = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Company Profile</h2>
          <p className="text-slate-500 mt-1">Complete your company profile to start posting jobs.</p>
        </div>
        <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          Incomplete
        </span>
      </div>
      
      <div className="p-6 md:p-8">
        <form className="max-w-4xl space-y-8">
          {/* Logo Section */}
          <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
            <div className="w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 group cursor-pointer hover:border-brand-500 hover:text-brand-500 transition-colors">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span className="text-xs font-medium">Upload Logo</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Company Logo</h3>
              <p className="text-sm text-slate-500 mt-1 mb-3">This will be displayed on all your job postings.</p>
              <div className="text-xs text-slate-400 font-medium">Recommended: 400x400px (JPG/PNG). Max 2MB.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Company Name <span className="text-red-500">*</span></label>
              <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="e.g. Acme Corporation" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tax ID (Mã số thuế) <span className="text-red-500">*</span></label>
              <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="010XXXXXXXX" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Company Size <span className="text-red-500">*</span></label>
              <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none transition-all bg-white">
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Headquarters Address <span className="text-red-500">*</span></label>
              <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="Street layout, City, Province" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Website URL</label>
              <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500 transition-all">
                <span className="bg-slate-50 px-4 py-3 text-slate-500 border-r border-slate-200 font-medium whitespace-nowrap">https://</span>
                <input type="text" className="w-full px-4 py-3 outline-none" placeholder="www.example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Industry <span className="text-red-500">*</span></label>
              <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none transition-all bg-white">
                <option value="">Select industry</option>
                <option value="it">Information Technology</option>
                <option value="finance">Finance & Banking</option>
                <option value="healthcare">Healthcare</option>
                <option value="retail">Retail & E-commerce</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Company Description <span className="text-red-500">*</span></label>
              <textarea 
                required
                rows="6" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none" 
                placeholder="Tell candidates about your company's mission, culture, and what makes it a great place to work..."
              ></textarea>
              <p className="text-xs text-slate-500 mt-2 text-right">0 / 2000 characters</p>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-100">
            <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-brand-500/20">
              Save Profile & Unlock Job Posting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
