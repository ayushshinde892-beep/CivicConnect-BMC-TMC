import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, LogIn, AlertCircle, Sparkles, User, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'ROLE_ADMIN' || res.user.role === 'ROLE_OFFICER') {
        navigate('/admin/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    } else {
      setError(res.message);
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Sign in to CivicConnect</h2>
          <p className="text-xs text-slate-500">Access citizen services or municipal officer dashboard</p>
        </div>

        {/* Demo Quick Fill Box */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>College Demo Quick Fill Credentials:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('citizen@civicconnect.com', 'citizen123')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-slate-700 hover:bg-blue-100/50 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <User className="w-3 h-3 text-blue-600" /> Citizen Login
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@civicconnect.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-indigo-200 text-slate-700 hover:bg-indigo-100/50 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Shield className="w-3 h-3 text-indigo-600" /> Admin / Officer
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@civicconnect.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 underline">
            Register as a Citizen
          </Link>
        </div>
      </div>
    </div>
  );
}
