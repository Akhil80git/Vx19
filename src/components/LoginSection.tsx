import React, { useState } from 'react';
import { loginWithEmail, firebaseConfig } from '../lib/firebase';
import { UserProfile } from '../types';
import { ShieldCheck, LogIn, Database, AlertCircle, Lock, Mail } from 'lucide-react';

interface LoginSectionProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginSection: React.FC<LoginSectionProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Kripya apna Email aur Password dono dalein.');
      return;
    }

    setLoading(true);

    try {
      const user = await loginWithEmail(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password'
      ) {
        setErrorMsg('Email ya Password galat hai. Kripya wahi credentials dalein jo aapne Firebase Console me add kiye hain.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('Email ka format sahi nahi hai.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('Bahut zyada koshish ki gayi hai. Kripya thodi der baad dobara koshish karein.');
      } else {
        setErrorMsg(err.message || 'Login karne me error aayi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Subtle Background Lighting */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20 mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Software Planner Login
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in with your Firebase account credentials
          </p>
        </div>

        {/* Pure Login Form (No registration, no bypass) */}
        <form id="loginForm" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Firebase Account Email
            </label>
            <input
              type="email"
              id="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="apna@gmail.com"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          {/* Feedback Error Message */}
          {errorMsg && (
            <div id="error-msg" className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl flex items-start gap-2 text-xs text-red-300 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="btn-login-submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login Karein
              </>
            )}
          </button>
        </form>

        {/* Live Firebase Connection Badge */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Firebase: <code className="text-slate-300 font-mono">{firebaseConfig.projectId}</code>
          </span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Direct Client Sync
          </span>
        </div>

      </div>
    </div>
  );
};
