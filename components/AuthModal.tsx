
import React, { useState } from 'react';
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

  if (!isOpen) return null;

  const SUPER_ADMIN_EMAIL = 'admin@lebled.dz';

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setStep('form');
    // Reset fields optional
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verify');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Login
    const role = email === SUPER_ADMIN_EMAIL ? 'super_admin' : 'user';
    const user: UserProfile = {
        id: 'u-' + Date.now(),
        name: name || 'Returned User',
        email: email,
        role: role,
        isVerified: true
    };
    onLogin(user);
    onClose();
  };

  const handleVerificationComplete = () => {
    // Simulate Verification Success
    let role: UserRole = 'user';
    if (registerType === 'seller') role = 'seller';
    if (email === SUPER_ADMIN_EMAIL) role = 'super_admin';

    const newUser: UserProfile = {
      id: 'new-' + Date.now(),
      name: name,
      email: email,
      role: role,
      phone: registerType === 'seller' ? phone : undefined,
      phone_verified: registerType === 'seller',
      isVerified: true,
      createdAt: new Date().toISOString()
    };

    onLogin(newUser);
    onClose();
  };

  // Developer Quick Access Helper
  const devLogin = (role: UserRole) => {
    const mockUser: UserProfile = {
      id: 'dev-' + role,
      name: role === 'super_admin' ? 'Super Admin' : (role === 'seller' ? 'Seller Pro' : 'Regular User'),
      email: role === 'super_admin' ? SUPER_ADMIN_EMAIL : `test-${role}@lebled.dz`,
      role: role,
      phone: role === 'seller' ? '0550000000' : undefined,
      phone_verified: role === 'seller',
      isVerified: true
    };
    onLogin(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#13151b] border border-[#2a2e37] rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {mode === 'login' ? 'Welcome Back' : (registerType === 'seller' ? 'Become a Seller' : 'Join Community')}
            </h2>
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
                <p className="text-white text-sm mb-1">
                  We sent a code to your {registerType === 'seller' ? 'Phone' : 'Email'}
                </p>
                <p className="text-indigo-400 font-mono font-bold text-lg">
                  {registerType === 'seller' ? `+213 ${phone}` : email}
                </p>
                <button onClick={() => setStep('form')} className="text-xs text-gray-500 hover:text-white mt-2 underline">Change</button>
              </div>

              <div className="flex justify-between gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input 
                    key={i}
                    type="text" 
                    maxLength={1}
                    className="w-12 h-14 bg-[#0f1117] border border-[#2a2e37] rounded-xl text-center text-xl font-bold text-white focus:border-indigo-500 focus:outline-none"
                  />
                ))}
              </div>

              <button 
                onClick={handleVerificationComplete}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Verify & Create Account</span>
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
                className="w-full bg-[#2a2e37] hover:bg-[#343944] text-white py-3.5 rounded-xl font-bold transition-all border border-[#3f4552] flex items-center justify-center space-x-2 mt-4"
              >
                <span>{mode === 'login' ? 'Login' : (registerType === 'seller' ? 'Send Verification Code' : 'Create Account')}</span>
                {mode === 'register' && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* Developer Login Tools */}
          <div className="pt-6 mt-6 border-t border-[#2a2e37]">
            <p className="text-xs text-center text-gray-500 mb-3 uppercase font-bold tracking-wider">Dev Access (Quick Login)</p>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => devLogin('super_admin')}
                className="flex flex-col items-center justify-center bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-500/20 py-2 rounded-xl text-[10px] font-bold transition-all"
              >
                <Lock className="w-4 h-4 mb-1" />
                <span>Super Admin</span>
              </button>
              <button 
                onClick={() => devLogin('seller')}
                className="flex flex-col items-center justify-center bg-emerald-900/20 hover:bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 py-2 rounded-xl text-[10px] font-bold transition-all"
              >
                <Store className="w-4 h-4 mb-1" />
                <span>Seller</span>
              </button>
              <button 
                onClick={() => devLogin('user')}
                className="flex flex-col items-center justify-center bg-indigo-900/20 hover:bg-indigo-900/30 text-indigo-400 border border-indigo-500/20 py-2 rounded-xl text-[10px] font-bold transition-all"
              >
                <UserIcon className="w-4 h-4 mb-1" />
                <span>User</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
