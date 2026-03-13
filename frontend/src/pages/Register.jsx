import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [role, setRole] = useState('jobseeker'); // 'jobseeker' or 'employer'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // TODO: Connect to backend registration API
    console.log('Registering as:', role, 'with data:', formData);
    navigate('/login');
  };

  return (
    <>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create an Account</h1>
      <p className="text-slate-500 mb-8">Join Online Job Searching today to kickstart your journey.</p>

      {/* Role Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-3">I want to register as a:</label>
        <div className="grid grid-cols-2 gap-4">
          {/* JobSeeker Option */}
          <div 
            onClick={() => setRole('jobseeker')}
            className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${
              role === 'jobseeker' 
                ? 'border-brand-500 bg-brand-50' 
                : 'border-slate-200 hover:border-brand-300'
            }`}
          >
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
              role === 'jobseeker' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h3 className={`font-bold ${role === 'jobseeker' ? 'text-brand-700' : 'text-slate-700'}`}>Job Seeker</h3>
            <p className="text-xs text-slate-500 mt-1">Find your dream job</p>
          </div>

          {/* Employer Option */}
          <div 
            onClick={() => setRole('employer')}
            className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${
              role === 'employer' 
                ? 'border-brand-500 bg-brand-50' 
                : 'border-slate-200 hover:border-brand-300'
            }`}
          >
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
              role === 'employer' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <h3 className={`font-bold ${role === 'employer' ? 'text-brand-700' : 'text-slate-700'}`}>Employer</h3>
            <p className="text-xs text-slate-500 mt-1">Hire top talent</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-brand-500/30 mt-6"
        >
          Create Account
        </button>
      </form>

      <div className="mt-8 text-center pb-8">
        <p className="text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
