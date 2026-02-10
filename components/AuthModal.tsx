import React, { useState } from 'react';
import { X, Facebook, Phone, ShieldCheck, Mail, Smartphone, Lock, User as UserIcon, Store } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'method' | 'otp'>('method');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerify = () => {
    onLogin('user'); // Default to user for standard flow
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
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Bienvenue sur LeBled</h2>
            <p className="text-gray-400 text-sm">
              Connectez-vous pour vendre et acheter en toute confiance au sein de la communauté.
            </p>
          </div>

          {step === 'method' ? (
            <div className="space-y-4">
              <button 
                onClick={() => onLogin('user')} // Mock social login
                className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center relative group"
              >
                <Facebook className="w-5 h-5 absolute left-4" />
                <span>Continuer avec Facebook</span>
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2a2e37]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#13151b] px-2 text-gray-500">Ou connectez-vous</span>
                </div>
              </div>
              
              <div className="flex bg-[#0f1117] p-1 rounded-xl border border-[#2a2e37] mb-4">
                 <button 
                   onClick={() => setMethod('phone')}
                   className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${method === 'phone' ? 'bg-[#2a2e37] text-white shadow-sm' : 'text-gray-400'}`}
                 >
                   <Phone className="w-4 h-4" />
                   <span>Téléphone</span>
                 </button>
                 <button 
                   onClick={() => setMethod('email')}
                   className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${method === 'email' ? 'bg-[#2a2e37] text-white shadow-sm' : 'text-gray-400'}`}
                 >
                   <Mail className="w-4 h-4" />
                   <span>Email</span>
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {method === 'phone' ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Numéro de téléphone</label>
                    <div className="flex">
                      <div className="bg-[#0f1117] border border-[#2a2e37] border-r-0 rounded-l-xl px-3 py-3 flex items-center justify-center">
                        <span className="text-2xl mr-2">🇩🇿</span>
                        <span className="text-gray-400 font-mono text-sm border-l border-gray-700 pl-2">+213</span>
                      </div>
                      <input 
                        type="tel" 
                        placeholder="550 12 34 56" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 bg-[#0f1117] border border-[#2a2e37] rounded-r-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Adresse Email</label>
                    <input 
                      type="email" 
                      placeholder="vous@exemple.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                )}
                <button 
                  type="submit"
                  className="w-full bg-[#2a2e37] hover:bg-[#343944] text-white py-3.5 rounded-xl font-bold transition-all border border-[#3f4552]"
                >
                  Continuer
                </button>
              </form>

              {/* Developer Login Tools */}
              <div className="pt-6 mt-6 border-t border-[#2a2e37]">
                <p className="text-xs text-center text-gray-500 mb-3 uppercase font-bold tracking-wider">Developer Access</p>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => { onLogin('admin'); onClose(); }}
                    className="flex flex-col items-center justify-center bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-500/20 py-2 rounded-xl text-[10px] font-bold transition-all"
                  >
                    <Lock className="w-4 h-4 mb-1" />
                    <span>Admin</span>
                  </button>
                  <button 
                    onClick={() => { onLogin('seller'); onClose(); }}
                    className="flex flex-col items-center justify-center bg-emerald-900/20 hover:bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 py-2 rounded-xl text-[10px] font-bold transition-all"
                  >
                    <Store className="w-4 h-4 mb-1" />
                    <span>Seller</span>
                  </button>
                  <button 
                    onClick={() => { onLogin('user'); onClose(); }}
                    className="flex flex-col items-center justify-center bg-indigo-900/20 hover:bg-indigo-900/30 text-indigo-400 border border-indigo-500/20 py-2 rounded-xl text-[10px] font-bold transition-all"
                  >
                    <UserIcon className="w-4 h-4 mb-1" />
                    <span>User</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <p className="text-white text-sm mb-1">
                  Nous avons envoyé un code {method === 'phone' ? 'au' : 'à'}
                </p>
                <p className="text-indigo-400 font-mono font-bold text-lg">
                  {method === 'phone' ? `+213 ${phone}` : email}
                </p>
                <button onClick={() => setStep('method')} className="text-xs text-gray-500 hover:text-white mt-2 underline">Modifier</button>
              </div>

              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input 
                    key={i}
                    type="text" 
                    maxLength={1}
                    className="w-12 h-14 bg-[#0f1117] border border-[#2a2e37] rounded-xl text-center text-xl font-bold text-white focus:border-indigo-500 focus:outline-none"
                  />
                ))}
              </div>

              <button 
                onClick={handleVerify}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
              >
                Vérifier
              </button>

              <p className="text-center text-xs text-gray-500">
                Code non reçu ? <button className="text-indigo-400 hover:text-indigo-300 font-medium">Renvoyer</button> (30s)
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#2a2e37] text-center">
            <p className="text-xs text-gray-500">
              En continuant, vous acceptez nos <a href="#" className="text-gray-400 hover:text-white">Conditions d'utilisation</a> et notre <a href="#" className="text-gray-400 hover:text-white">Politique de confidentialité</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};