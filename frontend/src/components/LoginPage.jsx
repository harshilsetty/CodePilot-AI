import React, { useState } from 'react';
import apiClient from '../api/client';

function LoginPage({ onLogin }) {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    setError('');

    if (!trimmedEmail || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    if (authMode === 'register') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = authMode === 'register'
        ? { email: trimmedEmail, password, displayName: fullName }
        : { email: trimmedEmail, password };

      const { data } = await apiClient.post(endpoint, payload);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      const backendError = err?.response?.data?.error;
      setError(backendError || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.10),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_32%),linear-gradient(135deg,_#0B0F14_0%,_#111827_45%,_#0B0F14_100%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.18] bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative z-10 h-full grid lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden lg:flex flex-col justify-between p-12 xl:p-16 border-r border-text-secondary/10">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-3 px-3 py-2 rounded-full border border-accent-green/30 bg-accent-green/10 text-accent-green text-xs font-bold uppercase tracking-[0.24em]">
              <span className="w-2 h-2 rounded-full bg-accent-green" />
              Email Authentication
            </div>
            <h1 className="mt-8 text-5xl xl:text-6xl font-['Space_Grotesk'] font-bold leading-[0.95] text-text-primary tracking-tight">
              Sign in with your email and jump straight into interview practice.
            </h1>
            <p className="mt-6 max-w-lg text-base xl:text-lg text-text-secondary leading-7">
              A focused login screen for CodePilot AI with a cleaner first step, quick session persistence, and a polished visual hierarchy.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
            {[
              { title: 'Fast access', text: 'Continue with just your email.' },
              { title: 'Saved session', text: 'Pick up where you left off.' },
              { title: 'Interview ready', text: 'Jump into mock or practice mode.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-text-secondary/20 glass-effect-sm p-4">
                <h2 className="text-sm font-bold text-text-primary">{item.title}</h2>
                <p className="mt-2 text-xs leading-5 text-text-secondary">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-lg rounded-2xl border border-text-secondary/20 glass-effect shadow-soft p-8 sm:p-10">
            <div className="flex justify-between items-start gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-soft-green flex items-center justify-center shadow-soft shadow-accent-green/20">
                  <span className="material-symbols-outlined text-3xl text-bg-primary" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
                </div>
                <div>
                  <h1 className="text-3xl font-['Space_Grotesk'] font-bold text-text-primary tracking-tight">CodePilot AI</h1>
                  <p className="text-text-secondary text-sm mt-1">Email sign-in for interview coaching</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full border border-accent-green/30 bg-accent-green/10 text-accent-green text-[10px] font-bold uppercase tracking-[0.2em]">
                Password auth enabled
              </span>
            </div>

            <div className="mb-8 rounded-2xl border border-text-secondary/20 glass-effect-sm p-4 sm:p-5">
              <p className="text-xs uppercase tracking-[0.22em] font-bold text-text-secondary">What happens next</p>
              <div className="mt-4 grid gap-3">
                {[
                  'Your password is securely hashed before saving.',
                  'Use Sign up once, then Sign in on next visits.',
                  'Your session remains saved after authentication.',
                ].map((line) => (
                  <div key={line} className="flex items-start space-x-3 text-sm text-text-secondary">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-accent-green shrink-0" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5 flex rounded-xl border border-text-secondary/20 p-1 bg-bg-secondary">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError('');
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-smooth ${authMode === 'login' ? 'bg-bg-primary text-text-primary shadow-soft' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setError('');
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-smooth ${authMode === 'register' ? 'bg-bg-primary text-text-primary shadow-soft' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-[0.22em] mb-2">Email address</label>
                <input 
                  type="email" 
                  placeholder="you@university.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-bg-secondary border border-text-secondary/20 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 transition-smooth"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-[0.22em] mb-2">Display name</label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-bg-secondary border border-text-secondary/20 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 transition-smooth"
                    autoComplete="name"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-[0.22em] mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-bg-secondary border border-text-secondary/20 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 transition-smooth"
                  autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                  required
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-[0.22em] mb-2">Confirm password</label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-bg-secondary border border-text-secondary/20 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 transition-smooth"
                    autoComplete="new-password"
                    required
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-green to-accent-cyan text-bg-primary font-semibold transition-smooth shadow-soft shadow-accent-green/30 active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait flex items-center justify-center space-x-2 hover:shadow-glow-green"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    <span>{authMode === 'register' ? 'Creating account...' : 'Signing you in...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    <span>{authMode === 'register' ? 'Create account' : 'Sign in'}</span>
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-xs leading-5 text-slate-500 text-center">
              By continuing, you agree to store your session locally on this device for login persistence.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
