import React, { useState, useEffect } from 'react';

const EmployeeProfile = () => {
  const [profile, setProfile] = useState({
    Email: '',
    FullName: '',
    Phone: '',
    Address: '',
    AvatarUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/employee/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          Email: data.Email || '',
          FullName: data.FullName || '',
          Phone: data.Phone || '',
          Address: data.Address || '',
          AvatarUrl: data.AvatarUrl || ''
        });
      } else {
        const err = await res.json();
        setMsg(err.message || 'Lỗi khi tải thông tin');
      }
    } catch (error) {
      console.error(error);
      setMsg('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/employee/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          Phone: profile.Phone,
          Address: profile.Address,
          AvatarUrl: profile.AvatarUrl
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Cập nhật thông tin thành công!');
      } else {
        setMsg(data.message || 'Cập nhật thất bại.');
      }
    } catch (error) {
      console.error(error);
      setMsg('Lỗi kết nối máy chủ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Đang tải thông tin...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Thông Tin Cá Nhân (Employee)</h2>
          <p className="text-slate-500 mt-1">Xem và cập nhật thông tin liên lạc của bạn.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          {msg && (
            <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${msg.includes('thành công') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Read Only Fields */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Họ và Tên</label>
                <input 
                  type="text" 
                  value={profile.FullName} 
                  readOnly 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed focus:outline-none"
                />
                <p className="text-xs text-slate-400">Không thể thay đổi họ tên</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input 
                  type="email" 
                  value={profile.Email} 
                  readOnly 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed focus:outline-none"
                />
                <p className="text-xs text-slate-400">Tài khoản đăng nhập không thể thay đổi</p>
              </div>

              {/* Editable Fields */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Số Điện Thoại</label>
                <input 
                  type="text" 
                  value={profile.Phone}
                  onChange={(e) => setProfile({...profile, Phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">URL Ảnh Đại Diện</label>
                <input 
                  type="text" 
                  value={profile.AvatarUrl}
                  onChange={(e) => setProfile({...profile, AvatarUrl: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Địa Chỉ</label>
                <input 
                  type="text" 
                  value={profile.Address}
                  onChange={(e) => setProfile({...profile, Address: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
                  placeholder="Nhập địa chỉ của bạn"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
              >
                {saving ? (
                  <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span> Đang lưu...</>
                ) : 'Cập Nhật Thông Tin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
