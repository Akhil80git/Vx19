import React, { useState } from 'react';
import { loginWithEmail, signupWithEmail, DEMO_ADMIN_USER, firebaseConfig } from '../lib/firebase';
import { UserProfile } from '../types';
import { ShieldCheck, LogIn, UserPlus, Database, AlertCircle, Sparkles, CheckCircle2, Lock, Mail } from 'lucide-react';

interface LoginSectionProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginSection: React.FC<LoginSectionProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('admin@softwareplanner.io');
  const [password, setPassword] = useState('Admin@12345');
  const [role, setRole] = useState<UserProfile['role']>('admin');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      let user: UserProfile;
      if (isSignUp) {
        user = await signupWithEmail(email, password, role);
        setSuccessMsg('Account created successfully! Redirecting...');
      } else {
        user = await loginWithEmail(email, password);
        setSuccessMsg('Login successful! Welcome back.');
      }
      setTimeout(() => {
        onLoginSuccess(user);
      }, 400);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMsg('Invalid email or password. You can also use "Direct Admin Access" below!');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(err.message || 'Authentication error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDirectAdminLogin = () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('Logging in as Direct Administrator...');
    setTimeout(() => {
      onLoginSuccess(DEMO_ADMIN_USER);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20 mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            ArchPlan Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Software Architecture, Tech Stack & Project Blueprint Planner
          </p>
        </div>

        {/* Direct Admin Access Button (Instant Access) */}
        <div className="mb-6 p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-emerald-300 block mb-0.5">
                Quick Admin Access
              </span>
              <p className="text-slate-300 mb-2">
                Click below to immediately log in as Admin and start planning projects:
              </p>
              <button
                type="button"
                id="btn-direct-admin"
                onClick={handleDirectAdminLogin}
                disabled={loading}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition shadow-md shadow-emerald-700/30 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Direct Admin Login (1-Click)
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-slate-500 text-xs uppercase tracking-wider font-mono">
            Or Firebase Auth Login
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Login / Sign Up Form */}
        <form id="loginForm" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              >
                <option value="admin">Admin / System Architect</option>
                <option value="architect">Software Architect</option>
                <option value="developer">Lead Developer</option>
              </select>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMsg && (
            <div id="error-msg" className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="btn-login-submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" />
                Sign Up & Launch Dashboard
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login to Dashboard
              </>
            )}
          </button>
        </form>

        {/* Toggle between login & signup */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
                className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2 ml-1"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a new account?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
                className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2 ml-1"
              >
                Create Account
              </button>
            </span>
          )}
        </div>

        {/* Firebase Config Indicator */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Firestore: <code className="text-slate-400 font-mono">{firebaseConfig.projectId}</code>
          </span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Ready
          </span>
        </div>
      </div>
    </div>
  );
};
