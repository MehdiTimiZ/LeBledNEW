import React from 'react';
import { LayoutDashboard, MessageCircle, Home, Car, Users, Heart, Stethoscope, Truck, Smartphone, ShieldAlert, LogOut, Settings, Sun, X } from 'lucide-react';
import { AppView, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  currentUser: UserProfile | null;
  onLogout?: () => void;
  language?: 'FR' | 'EN';
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, currentUser, onLogout, language = 'FR', isOpen, onClose }) => {
  const t = TRANSLATIONS[language]?.menu || TRANSLATIONS['FR'].menu;

  const navItems = [
    { id: AppView.HOME, label: t.HOME, icon: Home },
    { id: AppView.VEHICLES, label: t.VEHICLES, icon: Car },
    { id: AppView.COMMUNITY, label: t.COMMUNITY, icon: Users },
    { id: AppView.CHARITY, label: t.CHARITY, icon: Heart },
    { id: AppView.SERVICES, label: t.SERVICES, icon: Stethoscope },
    { id: AppView.DELIVERY, label: t.DELIVERY, icon: Truck },
    { id: AppView.FLEXY, label: t.FLEXY, icon: Smartphone },
    { id: AppView.CHAT, label: t.CHAT, icon: MessageCircle },
  ];

  const handleItemClick = (view: AppView) => {
    onChangeView(view);
    if (window.innerWidth < 1024) onClose?.();
  };

  return (
    <>
      {/* Backdrop (Mobile only) */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div className={`h-screen bg-[#0f1117] border-r border-[#2a2e37] flex flex-col fixed left-0 top-0 z-[100] transition-all duration-500 shadow-2xl overflow-hidden
        ${isOpen ? 'w-72' : 'w-0 md:w-20'}
      `}>
        {/* Brand Section */}
        <div className={`p-5 flex items-center border-b border-[#2a2e37] h-16 shrink-0 ${isOpen ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sun className="text-white w-5 h-5" />
            </div>
            {isOpen && (
              <div className="animate-fade-in whitespace-nowrap overflow-hidden">
                <span className="text-lg font-bold text-white tracking-tight block leading-none">LeBled</span>
              </div>
            )}
          </div>
          {isOpen && (
            <button onClick={onClose} className="text-gray-500 hover:text-white md:hidden">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Unified Navigation List */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                title={!isOpen ? item.label : undefined}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                  ${isOpen ? 'space-x-3' : 'justify-center'}
                  ${isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                    : 'text-gray-400 hover:bg-[#181b21] hover:text-white'
                  }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
                {isOpen && <span className="font-medium animate-fade-in whitespace-nowrap overflow-hidden">{item.label}</span>}
                {!isOpen && isActive && <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full" />}
              </button>
            );
          })}

          {/* Role Based & Settings Fused */}
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => handleItemClick(AppView.ADMIN_PANEL)}
              title={!isOpen ? t.ADMIN_PANEL : undefined}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden
                ${isOpen ? 'space-x-3' : 'justify-center'}
                ${currentView === AppView.ADMIN_PANEL
                  ? 'bg-red-900/30 text-red-400 border border-red-500/30'
                  : 'text-gray-400 hover:bg-[#181b21] hover:text-red-400'
                }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0" />
              {isOpen && <span className="font-medium animate-fade-in whitespace-nowrap overflow-hidden">{t.ADMIN_PANEL}</span>}
            </button>
          )}

          {currentUser && ['admin', 'seller'].includes(currentUser.role) && (
            <button
              onClick={() => handleItemClick(AppView.SELLER_DASHBOARD)}
              title={!isOpen ? t.SELLER_DASHBOARD : undefined}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden
                ${isOpen ? 'space-x-3' : 'justify-center'}
                ${currentView === AppView.SELLER_DASHBOARD
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-[#181b21] hover:text-white'
                }`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {isOpen && <span className="font-medium animate-fade-in whitespace-nowrap overflow-hidden">{t.SELLER_DASHBOARD}</span>}
            </button>
          )}

          <button 
             onClick={() => handleItemClick(AppView.PROFILE)}
             title={!isOpen ? t.PROFILE : undefined}
             className={`w-full flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-[#181b21] rounded-xl transition-colors
               ${isOpen ? 'space-x-3' : 'justify-center'}
               ${currentView === AppView.PROFILE ? 'bg-[#181b21] text-white' : ''}`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {isOpen && <span className="font-medium animate-fade-in whitespace-nowrap overflow-hidden">{t.PROFILE}</span>}
          </button>
          
          {currentUser && (
            <button 
              onClick={onLogout}
              title={!isOpen ? t.LOGOUT : undefined}
              className={`w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-900/10 rounded-xl transition-colors
                ${isOpen ? 'space-x-3' : 'justify-center'}`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isOpen && <span className="font-medium animate-fade-in whitespace-nowrap overflow-hidden">{t.LOGOUT}</span>}
            </button>
          )}
        </nav>
      </div>
    </>
  );
};
