import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import apiClient from '../api/client';
import Logo from '../../logo/LOGO no BG.png';

function LoginPage({ onLogin }) {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const resetRegisterFlow = () => {
    setIsOtpStep(false);
    setOtp('');
    setStatusMessage('');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsSubmitting(true);
    setError('');
    try {
      if (!credentialResponse?.credential) {
        setError('Google did not return a credential. Please try again.');
        return;
      }

      const { data } = await apiClient.post('/api/auth/google-login', {
        token: credentialResponse.credential,
      });
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      const backendError = err?.response?.data?.error;
      if (backendError) {
        setError(backendError);
      } else if (err?.code === 'ERR_NETWORK') {
        setError('Cannot reach backend. Check API base URL and backend CORS settings.');
      } else {
        setError(err?.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was unsuccessful. Try again later.');
  };

  const sendSignupOtp = async (trimmedEmail) => {
    const { data } = await apiClient.post('/api/auth/register', {
      email: trimmedEmail,
      password,
      displayName: fullName,
    });

    setIsOtpStep(true);
    setStatusMessage(data?.message || 'OTP sent. Please verify to continue.');
  };

  const handleResendOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    setError('');
    setStatusMessage('');

    if (!trimmedEmail || !password.trim()) {
      setError('Email and password are required to resend OTP.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendSignupOtp(trimmedEmail);
    } catch (err) {
      const backendError = err?.response?.data?.error;
      setError(backendError || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    setError('');
    setStatusMessage('');

    if (authMode === 'register' && isOtpStep) {
      if (!trimmedEmail) {
        setError('Email is required.');
        return;
      }

      if (!/^\d{6}$/.test(otp.trim())) {
        setError('Please enter a valid 6-digit OTP.');
        return;
      }
    } else {
      if (!trimmedEmail || !password.trim()) {
        setError('Email and password are required.');
        return;
      }
    }

    if (authMode === 'register' && !isOtpStep) {
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
      if (authMode === 'register' && !isOtpStep) {
        await sendSignupOtp(trimmedEmail);
        return;
      }

      const endpoint = authMode === 'register' && isOtpStep
        ? '/api/auth/register/verify-otp'
        : '/api/auth/login';
      const payload = authMode === 'register' && isOtpStep
        ? { email: trimmedEmail, otp: otp.trim() }
        : { email: trimmedEmail, password };

      const { data } = await apiClient.post(endpoint, payload);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      const backendError = err?.response?.data?.error;
      if (backendError) {
        setError(backendError);
      } else if (err?.code === 'ERR_NETWORK') {
        setError('Cannot reach backend. Check API base URL and backend CORS settings.');
      } else {
        setError(err?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#060A0F] text-slate-200 relative flex font-['Inter',sans-serif] selection:bg-accent-green/30">
      {/* Premium Dark Gradient Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.1),_transparent_50%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 w-full flex">
        {/* Left Informational Panel (Hidden on mobile) */}
        <section className="hidden lg:flex flex-1 flex-col justify-between p-12 lg:p-16 xl:p-24 border-r border-white/5 relative overflow-hidden backdrop-blur-3xl">
          {/* Subtle glow behind text */}
          <div className="absolute top-1/3 left-1/4 w-[30rem] h-[30rem] bg-accent-green/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-xl relative p-4 pl-0">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-accent-green/20 bg-accent-green/5 text-accent-green text-[11px] font-bold uppercase tracking-widest backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span>v2.0 Authentication</span>
            </div>
            <h1 className="mt-8 text-5xl xl:text-6xl font-['Space_Grotesk'] font-bold leading-[1.05] text-white tracking-tight">
              Unlock your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-cyan">AI Interview</span> potential.
            </h1>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-md font-light">
              Join PrepPilot to practice technical interviews with context-aware AI. Fast, intelligent, and designed to land you the job.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-lg relative z-10">
            {[
              { icon: 'speed', title: 'Real-time analysis', text: 'Instant feedback on your code.' },
              { icon: 'memory', title: 'Context aware', text: 'Tailored to your submitted resume.' },
              { icon: 'history', title: 'Session history', text: 'Review past interviews anytime.' },
              { icon: 'shield_person', title: 'Private & secure', text: 'Your data stays on your device.' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm hover:bg-white/[0.04] transition-colors duration-300">
                <span className="material-symbols-outlined text-accent-cyan/80 mb-3 block text-2xl">{item.icon}</span>
                <h2 className="text-sm font-semibold text-white tracking-wide">{item.title}</h2>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-light">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right Authentication Panel */}
        <section className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-20">
          <div className="w-full max-w-[420px]">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-20 h-20 mb-4 overflow-hidden drop-shadow-2xl">
                <img src={Logo} alt="PrepPilot AI Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-3xl font-['Space_Grotesk'] font-bold text-white tracking-tight mb-2">
                {authMode === 'login' ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-slate-400 text-sm font-light">
                {authMode === 'login' ? 'Sign in to access your interview dashboard' : 'Start your mock interview journey today'}
              </p>
            </div>

            {/* Auth Mode Toggle */}
            <div className="mb-8 p-1 flex rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError('');
                  resetRegisterFlow();
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${authMode === 'login' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setError('');
                  resetRegisterFlow();
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${authMode === 'register' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Sign Up
              </button>
            </div>

            {/* Google Authentication */}
            <div className="mb-6 w-full relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-[#131314] rounded-xl overflow-hidden border border-white/5 shadow-lg">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  shape="rectangular"
                  size="large"
                  text={authMode === 'register' ? 'signup_with' : 'signin_with'}
                  width="420"
                />
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="mx-4 text-[10px] tracking-widest text-slate-500 uppercase font-semibold">Or with email</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px] transition-colors group-focus-within:text-accent-green">mail</span>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-accent-green/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-accent-green/50 transition-all duration-300"
                    required
                    autoComplete="email"
                  />
                </div>

                {authMode === 'register' && !isOtpStep && (
                  <div className="relative group animate-fade-in">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px] transition-colors group-focus-within:text-accent-green">person</span>
                    <input
                      type="text"
                      placeholder="Display name (optional)"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-accent-green/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-accent-green/50 transition-all duration-300"
                      autoComplete="name"
                    />
                  </div>
                )}

                {(authMode !== 'register' || !isOtpStep) && (
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px] transition-colors group-focus-within:text-accent-green">lock</span>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-accent-green/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-accent-green/50 transition-all duration-300"
                      autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                      required
                    />
                  </div>
                )}

                {authMode === 'register' && !isOtpStep && (
                  <div className="relative group animate-fade-in">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px] transition-colors group-focus-within:text-accent-green">verified_user</span>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-accent-green/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-accent-green/50 transition-all duration-300"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                )}

                {authMode === 'register' && isOtpStep && (
                  <div className="animate-fade-in space-y-3">
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px] transition-colors group-focus-within:text-accent-green">dialpad</span>
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-accent-green/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-accent-green/50 transition-all duration-300 text-center tracking-widest text-lg font-mono"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[11px] text-slate-500">Expiring in 5 minutes</p>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSubmitting}
                        className="text-[11px] font-medium text-accent-cyan hover:text-accent-green transition-colors disabled:opacity-50"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {statusMessage && (
                <div className="flex items-center space-x-2 text-[13px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-4 py-3 animate-fade-in">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>{statusMessage}</span>
                </div>
              )}

              {error && (
                <div className="flex items-start space-x-2 text-[13px] text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 animate-fade-in shadow-inner">
                  <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 rounded-xl bg-white text-[#060A0F] font-semibold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#060A0F]/20 border-t-[#060A0F] rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {authMode === 'register'
                        ? (isOtpStep ? 'Verify OTP & Create account' : 'Continue with Email')
                        : 'Sign In'}
                    </span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-[11px] leading-relaxed text-slate-500 text-center px-4">
              By proceeding, you agree to PrepPilot's <a href="#" className="underline decoration-slate-600 hover:text-slate-300 transition-colors">Terms of Service</a> and <a href="#" className="underline decoration-slate-600 hover:text-slate-300 transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
