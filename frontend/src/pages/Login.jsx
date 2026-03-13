import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Connect to backend authentication API
    console.log('Logging in with:', { email, password });
    // Mock successful login redirection for now
    navigate('/');
  };

  return (
    <>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
      <p className="text-slate-500 mb-8">Please log in to your account to continue.</p>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">Password</label>
            <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700">Forgot password?</a>
          </div>
          <input
            id="password"
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-brand-500/30"
        >
          Sign In
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
