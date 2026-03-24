import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const CompanyProfile = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    CompanyName: '',
    TaxCode: '',
    Address: '',
    Industry: '',
    Size: '',
    Website: '',
    Description: '',
    LogoUrl: ''
  });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/employer/company', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setIsNew(false);
        setFormData({
          CompanyName: data.CompanyName || '',
          TaxCode: data.TaxCode || '',
          Address: data.Address || '',
          Industry: data.Industry || '',
          Size: data.Size || '',
          Website: data.Website || '',
          Description: data.Description || '',
          LogoUrl: data.LogoUrl || ''
        });
      } else if (res.status === 404) {
        setIsNew(true);
      }
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview('');
    setFormData(prev => ({ ...prev, LogoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadLogoToServer = async () => {
    const data = new FormData();
    data.append('logo', logoFile);
    const res = await fetch('http://localhost:3000/api/employer/company/upload-logo', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Upload ảnh thất bại');
    }
    const result = await res.json();
    return result.logoUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let finalLogoUrl = formData.LogoUrl;

      if (logoFile) {
        finalLogoUrl = await uploadLogoToServer();
      }

      const payload = { ...formData, LogoUrl: finalLogoUrl };

      const res = await fetch('http://localhost:3000/api/employer/company', {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update company profile');
      }

      setFormData(prev => ({ ...prev, LogoUrl: finalLogoUrl }));
      setLogoFile(null);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoPreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      setIsNew(false);
      setMessage({
        type: 'success',
        text: isNew ? 'Tạo công ty thành công! Bạn có thể đăng tin tuyển dụng.' : 'Cập nhật hồ sơ công ty thành công!'
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const currentLogoSrc = logoPreview || formData.LogoUrl;

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Company Profile</h2>
        <p className="text-slate-500 mt-1">Manage your company information to attract the best candidates.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">

          {/* Logo & Basic Info */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-32 flex flex-col items-center gap-3">

              {/* Logo Preview Box */}
              <div className="relative group w-32 h-32">
                <div
                  className="w-32 h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  title="Nhấn để chọn ảnh logo"
                >
                  {currentLogoSrc ? (
                    <img src={currentLogoSrc} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  )}
                  {/* Camera hover overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                </div>

                {/* Remove button */}
                {currentLogoSrc && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    title="Xóa ảnh"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleLogoChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-1.5 text-xs font-medium text-brand-600 border border-brand-300 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
              >
                {currentLogoSrc ? 'Đổi ảnh' : 'Chọn ảnh logo'}
              </button>
              <p className="text-[10px] text-slate-400 text-center">JPG, PNG, WebP · Tối đa 5MB</p>
            </div>

            <div className="flex-1 space-y-5 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    name="CompanyName"
                    required
                    value={formData.CompanyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tax Code</label>
                  <input
                    type="text"
                    name="TaxCode"
                    value={formData.TaxCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Headquarters Address</label>
                <input
                  type="text"
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  placeholder="e.g. 123 Tech Street, District 1, HCMC"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Industry</label>
              <select
                name="Industry"
                value={formData.Industry}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              >
                <option value="">Select Industry...</option>
                <option value="IT - Software">IT - Software</option>
                <option value="IT - Hardware">IT - Hardware</option>
                <option value="Marketing / PR">Marketing / PR</option>
                <option value="Finance / Banking">Finance / Banking</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Company Size</label>
              <select
                name="Size"
                value={formData.Size}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              >
                <option value="">Select Size...</option>
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="500+">500+ Employees</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Website URL</label>
            <input
              type="url"
              name="Website"
              value={formData.Website}
              onChange={handleChange}
              placeholder="https://www.example.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Company Description</label>
            <p className="text-xs text-slate-500 mb-2">Write a brief description about what your company does, its culture, and mission.</p>
            <textarea
              name="Description"
              rows={5}
              value={formData.Description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-y"
            ></textarea>
          </div>

        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {logoFile ? 'Đang upload ảnh...' : 'Đang lưu...'}
              </>
            ) : (
              isNew ? 'Tạo Công Ty' : 'Lưu Thay Đổi'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;
