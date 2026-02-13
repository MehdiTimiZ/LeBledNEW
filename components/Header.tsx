
import React, { useState, useRef, useEffect } from 'react';
import { Plus, MessageCircle, Globe, User, ChevronDown, LayoutDashboard, CreditCard, LogOut, Settings, LogIn, ShieldAlert, Menu, Moon, Sun, Search, X } from 'lucide-react';
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
  theme?: 'dark' | 'light';
  setTheme?: (theme: 'dark' | 'light') => void;
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
  onToggleSidebar,
  theme = 'dark',
  setTheme
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [status, setStatus] = useState<'online' | 'invisible'>('online');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        searchInputRef.current?.blur();
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNav = (view: AppView) => {
    if (onChangeView) onChangeView(view);
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 h-16 shrink-0 w-full transition-colors duration-300">
      <div className="px-4 md:px-6 h-full flex items-center justify-between gap-4">
        {/* Left Section: Hamburger + Brand */}
        <div className="flex items-center space-x-4 shrink-0">
          <button 
            data-sidebar-toggle="true"
            onClick={onToggleSidebar}
            className="p-2 -ml-2 hover:bg-surface rounded-lg transition-colors text-muted hover:text-mainText"
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
            <span className="text-xl font-bold text-mainText tracking-tight hidden sm:block">LeBled</span>

            {currentUser?.role === 'admin' && (
               <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase hidden md:inline-block">
                 Admin
               </span>
            )}
          </div>
        </div>

        {/* Center Section: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-auto">
          <div className={`relative w-full group transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${isSearchFocused ? 'text-indigo-400' : 'text-muted'}`} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search listings, sellers, services..."
              className={`w-full bg-surface border rounded-xl pl-10 pr-20 py-2 text-sm text-mainText placeholder:text-muted/60 outline-none transition-all duration-300 ${isSearchFocused
                  ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10 bg-surfaceAlt'
                  : 'border-border hover:border-border/80'
                }`}
            />
            {searchQuery ? (
              <button
                onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-mainText transition-colors p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <kbd className="text-[10px] text-muted/50 bg-background border border-border px-1.5 py-0.5 rounded font-mono">Ctrl</kbd>
                <kbd className="text-[10px] text-muted/50 bg-background border border-border px-1.5 py-0.5 rounded font-mono">K</kbd>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
          <button 
            onClick={onOpenCreate}
            className="hidden md:flex items-center space-x-2 bg-surface hover:bg-surfaceAlt text-mainText px-4 py-2 rounded-full text-sm font-medium transition-colors border border-border"
          >
            <Plus className="w-4 h-4" />
            <span>Poster une annonce</span>
          </button>
          
          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme?.(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-surface rounded-full transition-colors text-muted hover:text-mainText"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language Toggle */}
          <div className="hidden md:flex bg-surface rounded-xl p-1 border border-border">
            <button 
              onClick={() => setLanguage?.('FR')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${language === 'FR' ? 'bg-background text-mainText shadow-sm' : 'text-muted hover:text-mainText'}`}
            >
              FR
            </button>
            <button 
              onClick={() => setLanguage?.('EN')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${language === 'EN' ? 'bg-background text-mainText shadow-sm' : 'text-muted hover:text-mainText'}`}
            >
              EN
            </button>
          </div>
          
          <div 
            className="relative cursor-pointer hover:bg-surface p-2 rounded-full transition-colors"
            onClick={() => handleNav(AppView.CHAT)}
          >
            <MessageCircle className="w-5 h-5 text-muted" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-background animate-bounce">
                {unreadCount}
              </span>
            )}
          </div>
          
          {currentUser ? (
            /* Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 md:space-x-2 hover:bg-surface p-1 rounded-full transition-colors"
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
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${
                    status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  }`}></span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-surface border border-border rounded-xl shadow-2xl py-2 z-50 animate-fade-in-up">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex justify-between items-center">
                       <p className="text-sm font-medium text-mainText truncate max-w-[140px]">{currentUser.name}</p>
                       <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase ${
                         currentUser.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                         currentUser.role === 'seller' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                         'bg-gray-700/10 text-muted border-border'
                       }`}>
                         {currentUser.role}
                       </span>
                    </div>
                    <div className="flex items-center mt-2 bg-background rounded-lg p-1 border border-border">
                      <button 
                        onClick={() => setStatus('online')}
                        className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                          status === 'online' ? 'bg-green-500/20 text-green-400' : 'text-muted hover:text-mainText'
                        }`}
                      >
                        Online
                      </button>
                      <button 
                        onClick={() => setStatus('invisible')}
                        className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                          status === 'invisible' ? 'bg-gray-700/50 text-gray-300' : 'text-muted hover:text-mainText'
                        }`}
                      >
                        Invisible
                      </button>
                    </div>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'admin' && (
                      <button onClick={() => handleNav(AppView.ADMIN_PANEL)} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-surfaceAlt flex items-center space-x-2 font-medium">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </button>
                    )}
                    {['admin', 'seller'].includes(currentUser.role) && (
                      <button onClick={() => handleNav(AppView.SELLER_DASHBOARD)} className="w-full text-left px-4 py-2.5 text-sm text-muted hover:bg-surfaceAlt hover:text-mainText flex items-center space-x-2">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Seller Dashboard</span>
                      </button>
                    )}
                    <button onClick={() => handleNav(AppView.CHAT)} className="w-full text-left px-4 py-2.5 text-sm text-muted hover:bg-surfaceAlt hover:text-mainText flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Messages</span>
                    </button>
                    <button onClick={() => handleNav(AppView.SUBSCRIPTION)} className="w-full text-left px-4 py-2.5 text-sm text-muted hover:bg-surfaceAlt hover:text-mainText flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Subscription</span>
                    </button>
                    <button onClick={() => handleNav(AppView.PROFILE)} className="w-full text-left px-4 py-2.5 text-sm text-muted hover:bg-surfaceAlt hover:text-mainText flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-border py-1">
                    <button 
                      onClick={() => {
                        if (onLogout) onLogout();
                        setIsProfileOpen(false);
                      }} 
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-surfaceAlt flex items-center space-x-2"
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
