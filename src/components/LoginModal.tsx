
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ChevronDown, X, AlertCircle } from 'lucide-react';
import logo from '../assets/accrcc-logo.jpg';
import clsx from 'clsx';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'senior_leader', label: 'Senior Climate & Mental Health Leader' },
  { value: 'mental_health', label: 'Mental Health & Resilience Lead' },
  { value: 'climate_advocacy', label: 'Climate Advocacy Staff' },
  { value: 'employee', label: 'Employee / Programs Officer' },
  { value: 'field_officer', label: 'Technical Field Officer' },
  { value: 'volunteer', label: 'Volunteer' },
];

const DEMO_ACCOUNTS: { email: string; role: UserRole; label: string }[] = [
  { email: 'amara.osei@accrcc.org', role: 'senior_leader', label: 'Senior Leader' },
  { email: 'kwame.asante@accrcc.org', role: 'mental_health', label: 'Mental Health Lead' },
  { email: 'fatima.alrashid@accrcc.org', role: 'climate_advocacy', label: 'Climate Advocacy' },
  { email: 'abena.mensah@accrcc.org', role: 'field_officer', label: 'Field Officer' },
  { email: 'kofi.darko@accrcc.org', role: 'volunteer', label: 'Volunteer' },
];

const DEMO_CREDENTIALS: { role: string; email: string; password: string }[] = [
  { role: 'Senior Leader', email: 'amara.osei@accrcc.org', password: 'password123' },
  { role: 'Mental Health Lead', email: 'kwame.asante@accrcc.org', password: 'password123' },
  { role: 'Climate Advocacy', email: 'fatima.alrashid@accrcc.org', password: 'password123' },
  { role: 'Programs Officer', email: 'emmanuel.boateng@accrcc.org', password: 'password123' },
  { role: 'Field Officer', email: 'abena.mensah@accrcc.org', password: 'password123' },
  { role: 'Volunteer', email: 'kofi.darko@accrcc.org', password: 'password123' },
];

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { login } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [isDemoLogin, setIsDemoLogin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(email.trim(), password, role, isDemoLogin);
      if (!result.success) {
        setError(result.error ?? 'Login failed.');
      }
      setLoading(false);
    }, 600);
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword('password123');
    setRole(acc.role);
    setFullName('');
    setError('');
    setIsDemoLogin(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass-card rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-teal-600 flex items-center justify-center">
                <img src={logo} alt="ACCRCC logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="text-base font-display font-bold text-gray-900 dark:text-white">Staff Portal</div>
              <div className="text-xs text-gray-500">ACCRCC ResilienceIQ</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Close">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Demo accounts */}
        <div className="mb-5">
          <div className="text-xs font-semibold text-gray-500 mb-2">Quick Demo Access</div>
          <div className="flex flex-wrap gap-1.5">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => fillDemo(acc)}
                className="text-xs px-2.5 py-1 rounded-lg bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-300 border border-forest-100 dark:border-forest-800 hover:bg-forest-100 dark:hover:bg-forest-900/40 transition-colors font-medium"
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full name */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400 transition-all"
                placeholder="Your full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">ACCRCC Email <span className="text-red-400">*</span></label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400 transition-all"
                placeholder="you@accrcc.org"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setIsDemoLogin(false);
                }}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Password <span className="text-red-400">*</span></label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full text-sm pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setIsDemoLogin(false);
                }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Your Role <span className="text-red-400">*</span></label>
            <div className="relative">
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400 appearance-none transition-all"
                value={role}
                onChange={e => {
                  setRole(e.target.value as UserRole);
                  setIsDemoLogin(false);
                }}
                required
              >
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fade-in">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <span className="text-xs text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={clsx('btn-primary w-full justify-center py-3 text-sm mt-1', loading && 'opacity-70 cursor-not-allowed')}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <>
                <Lock size={14} /> Secure Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-400">
          Demo password for all accounts: <span className="font-mono font-semibold text-gray-600 dark:text-gray-300">password123</span>
        </div>

        {/* Demo Credentials Panel */}
        <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Demo Credentials</span>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {/* Column headers */}
            <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-slate-100/60 dark:bg-slate-800/60">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Role</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Username</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Password</span>
            </div>
            {DEMO_CREDENTIALS.map(cred => (
              <div key={cred.email} className="grid grid-cols-3 gap-2 px-4 py-2.5 items-center hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-tight">{cred.role}</span>
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 break-all leading-tight">{cred.email}</span>
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 leading-tight">{cred.password}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
  