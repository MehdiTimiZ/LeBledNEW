
import React, { useState } from 'react';
import { supabase } from '@/supabase/client';
import { X, Facebook, Phone, ShieldCheck, Mail, Smartphone, Lock, User as UserIcon, Store, ArrowRight, CheckCircle } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registerType, setRegisterType] = useState<'user' | 'seller'>('user');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const SUPER_ADMIN_EMAIL = 'admin@lebled.dz';

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setStep('form');
    // Reset fields optional
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone
          }
        }
      });

      if (error) throw error;

      // If successful, maybe show verify step or just login
      // For email signup, usually need email verification.
      // For now, let's assume auto-login if configured, or tell user to check email.
      if (data.session) {
        const userProfile: UserProfile = {
          id: data.user!.id,
          email: data.user!.email!,
          role: 'user', // Default, logic will fetch real role
          name: name,
          isVerified: false
        };
        onLogin(userProfile);
      } else {
    // Verification required
        setStep('verify'); 
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Fetch real role for correct redirection/toast
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const userProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email!,
          role: (profile?.role || 'user').toLowerCase() as UserRole,
          name: '', // Placeholder
          isVerified: true
        };
        onLogin(userProfile);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if modal can be closed (only if user is already logged in externally)
  const canClose = false; // Auth modal should not be dismissible when shown

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#13151b] border border-[#2a2e37] rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Close button removed - auth is mandatory */}

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {mode === 'login' ? 'Welcome Back' : (registerType === 'seller' ? 'Become a Seller' : 'Join Community')}
            </h2>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm font-bold">
                {error}
              </div>
            )}
            <p className="text-gray-400 text-sm">
              {mode === 'login' 
                ? 'Login to access your account' 
                : (registerType === 'seller' ? 'Start selling to thousands of customers' : 'Buy, chat, and connect with locals')}
            </p>
          </div>

          {/* Mode Switcher */}
          {step === 'form' && (
            <div className="flex bg-[#0f1117] p-1 rounded-xl border border-[#2a2e37] mb-6">
              <button 
                onClick={() => handleModeSwitch('login')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-[#2a2e37] text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'}`}
              >
                Login
              </button>
              <button 
                onClick={() => handleModeSwitch('register')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-[#2a2e37] text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'}`}
              >
                Register
              </button>
            </div>
          )}

          {mode === 'register' && step === 'form' && (
             <div className="mb-6 flex justify-center space-x-4">
                <button 
                  onClick={() => setRegisterType('user')}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all w-28 ${registerType === 'user' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-[#0f1117] border-[#2a2e37] text-gray-500 hover:border-gray-600'}`}
                >
                   <UserIcon className="w-6 h-6 mb-1" />
                   <span className="text-xs font-bold">User</span>
                </button>
                <button 
                  onClick={() => setRegisterType('seller')}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all w-28 ${registerType === 'seller' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[#0f1117] border-[#2a2e37] text-gray-500 hover:border-gray-600'}`}
                >
                   <Store className="w-6 h-6 mb-1" />
                   <span className="text-xs font-bold">Seller</span>
                </button>
             </div>
          )}

          {/* Verification Step */}
          {step === 'verify' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <Mail className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Check your email</h3>
                <p className="text-gray-400 text-sm mb-1">
                  We sent a confirmation link to
                </p>
                <p className="text-indigo-400 font-mono font-bold text-lg">
                  {email}
                </p>
                <p className="text-gray-500 text-xs mt-3">
                  Click the link in the email to activate your account, then come back here and log in.
                </p>
              </div>

              <button 
                onClick={handleResendEmail}
                disabled={loading}
                className="w-full bg-[#2a2e37] hover:bg-[#343944] text-white py-3 rounded-xl font-bold transition-all border border-[#3f4552] disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Resend Confirmation Email'}
              </button>
              <button
                onClick={() => { setStep('form'); setMode('login'); }}
                className="w-full text-indigo-400 hover:text-indigo-300 py-2 text-sm font-bold transition-all"
              >
                ← Back to Login
              </button>
            </div>
          ) : (
            /* Login / Register Forms */
            <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Amine Khelifi"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {mode === 'register' && registerType === 'seller' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phone Number (SMS Auth)</label>
                  <div className="flex">
                    <div className="bg-[#0f1117] border border-[#2a2e37] border-r-0 rounded-l-xl px-3 py-3 flex items-center justify-center">
                      <span className="text-xl mr-2">🇩🇿</span>
                      <span className="text-gray-400 font-mono text-sm border-l border-gray-700 pl-2">+213</span>
                    </div>
                    <input 
                      type="tel" 
                      placeholder="550 12 34 56" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 bg-[#0f1117] border border-[#2a2e37] rounded-r-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                  disabled={loading}
                  className="w-full bg-[#2a2e37] hover:bg-[#343944] text-white py-3.5 rounded-xl font-bold transition-all border border-[#3f4552] flex items-center justify-center space-x-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {loading ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                        <span>{mode === 'login' ? 'Login' : (registerType === 'seller' ? 'Send Verification Code' : 'Create Account')}</span>
                        {mode === 'register' && <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
              </button>
            </form>
          )}

          {/* Security Footer */}
          <div className="pt-4 mt-4 border-t border-[#2a2e37]">
            <p className="text-[10px] text-center text-gray-600">
              🔒 Your data is secured with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
