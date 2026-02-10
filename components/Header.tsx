import React, { useState, useRef, useEffect } from 'react';
import { Plus, MessageCircle, Globe, User, ChevronDown, LayoutDashboard, CreditCard, LogOut, Settings, LogIn, ShieldAlert, Menu } from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface HeaderProps {
  onChangeView?: (view: AppView) => void;
  onOpenCreate?: () => void;
  currentUser: UserProfile | null;
  onLogin?: () => void;
  onLogout?: () => void;
  unreadCount?: number;
  language?: 'FR' | 'EN';
  setLanguage?: (lang: 'FR' | 'EN') => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onChangeView, 
  onOpenCreate, 
  currentUser, 
  onLogin, 
  onLogout, 
  unreadCount = 3,
  language = 'FR',
  setLanguage,
  onToggleSidebar
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [status, setStatus] = useState<'online' | 'invisible'>('online');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (view: AppView) => {
    if (onChangeView) onChangeView(view);
    setIsProfileOpen(false);
  };

  const toggleLanguage = () => {
    if (setLanguage) {
      if (language === 'FR') setLanguage('EN');
      else setLanguage('FR');
    }
  };

  return (
    <header className="bg-[#0f1117] border-b border-[#2a2e37] sticky top-0 z-50 h-16 shrink-0 w-full">
      <div className="px-4 md:px-6 h-full flex items-center justify-between">
        {/* Left Section: Hamburger + Brand */}
        <div className="flex items-center space-x-4">
          <button 
            data-sidebar-toggle="true"
            onClick={onToggleSidebar}
            className="p-2 -ml-2 hover:bg-[#181b21] rounded-lg transition-colors text-gray-400 hover:text-white"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div 
            className="flex items-center space-x-2 cursor-pointer group" 
            onClick={() => handleNav(AppView.HOME)}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg shadow-indigo-500/10">
              <img src="https://lucide.dev/logo.light.svg" className="w-5 h-5 opacity-90" alt="Logo" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:block">LeBled</span>

            {currentUser?.role === 'admin' && (
               <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase hidden md:inline-block">
                 Admin
               </span>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={onOpenCreate}
            className="hidden md:flex items-center space-x-2 bg-[#2a2e37] hover:bg-[#343944] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors border border-[#3f4552]"
          >
            <Plus className="w-4 h-4" />
            <span>Poster une annonce</span>
          </button>
          
          {/* Language Toggle */}
          <div className="hidden md:flex bg-[#181b21] rounded-xl p-1 border border-[#2a2e37]">
            <button 
              onClick={() => setLanguage?.('FR')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${language === 'FR' ? 'bg-[#2a2e37] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              FR
            </button>
            <button 
              onClick={() => setLanguage?.('EN')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${language === 'EN' ? 'bg-[#2a2e37] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              EN
            </button>
          </div>
          
          <div 
            className="relative cursor-pointer hover:bg-[#181b21] p-2 rounded-full transition-colors"
            onClick={() => handleNav(AppView.CHAT)}
          >
            <MessageCircle className="w-5 h-5 text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-[#0f1117] animate-bounce">
                {unreadCount}
              </span>
            )}
          </div>
          
          {currentUser ? (
            /* Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 md:space-x-2 hover:bg-[#181b21] p-1 rounded-full transition-colors"
              >
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${
                    currentUser.role === 'admin' 
                      ? 'bg-gradient-to-tr from-red-600 to-orange-600' 
                      : currentUser.role === 'seller' 
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-600'
                        : 'bg-gradient-to-tr from-indigo-500 to-purple-600'
                  }`}>
                    {currentUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0f1117] ${
                    status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  }`}></span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#181b21] border border-[#2a2e37] rounded-xl shadow-2xl py-2 z-50 animate-fade-in-up">
                  <div className="px-4 py-3 border-b border-[#2a2e37]">
                    <div className="flex justify-between items-center">
                       <p className="text-sm font-medium text-white truncate max-w-[140px]">{currentUser.name}</p>
                       <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase ${
                         currentUser.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                         currentUser.role === 'seller' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                         'bg-gray-700 text-gray-300 border-gray-600'
                       }`}>
                         {currentUser.role}
                       </span>
                    </div>
                    <div className="flex items-center mt-2 bg-[#0f1117] rounded-lg p-1 border border-[#2a2e37]">
                      <button 
                        onClick={() => setStatus('online')}
                        className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                          status === 'online' ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        Online
                      </button>
                      <button 
                        onClick={() => setStatus('invisible')}
                        className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                          status === 'invisible' ? 'bg-gray-700/50 text-gray-300' : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        Invisible
                      </button>
                    </div>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'admin' && (
                      <button onClick={() => handleNav(AppView.ADMIN_PANEL)} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#2a2e37] flex items-center space-x-2 font-medium">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </button>
                    )}
                    {['admin', 'seller'].includes(currentUser.role) && (
                      <button onClick={() => handleNav(AppView.SELLER_DASHBOARD)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2a2e37] hover:text-white flex items-center space-x-2">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Seller Dashboard</span>
                      </button>
                    )}
                    <button onClick={() => handleNav(AppView.CHAT)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2a2e37] hover:text-white flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Messages</span>
                    </button>
                    <button onClick={() => handleNav(AppView.SUBSCRIPTION)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2a2e37] hover:text-white flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Subscription</span>
                    </button>
                    <button onClick={() => handleNav(AppView.PROFILE)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2a2e37] hover:text-white flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-[#2a2e37] py-1">
                    <button 
                      onClick={() => {
                        if (onLogout) onLogout();
                        setIsProfileOpen(false);
                      }} 
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#2a2e37] flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Se connecter</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};