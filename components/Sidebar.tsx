import React from 'react';
import { LayoutDashboard, MessageCircle, Home, Car, Users, Heart, Stethoscope, Truck, Smartphone, ShieldAlert, LogOut, Settings, Sun } from 'lucide-react';
import { AppView, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  currentUser: UserProfile | null;
  onLogout?: () => void;
  language?: 'FR' | 'EN' | 'AR';
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, currentUser, onLogout, language = 'FR' }) => {
  const t = TRANSLATIONS[language]?.menu || TRANSLATIONS['FR'].menu;

  const mainNavItems = [
    { id: AppView.HOME, label: t.HOME, icon: Home },
    { id: AppView.VEHICLES, label: t.VEHICLES, icon: Car },
    { id: AppView.COMMUNITY, label: t.COMMUNITY, icon: Users },
    { id: AppView.CHARITY, label: t.CHARITY, icon: Heart },
    { id: AppView.SERVICES, label: t.SERVICES, icon: Stethoscope },
    { id: AppView.DELIVERY, label: t.DELIVERY, icon: Truck },
    { id: AppView.FLEXY, label: t.FLEXY, icon: Smartphone },
    { id: AppView.CHAT, label: t.CHAT, icon: MessageCircle },
  ];

  return (
    <div className="h-screen w-72 bg-[#0f1117] border-r border-[#2a2e37] flex-col fixed left-0 top-0 z-50 hidden md:flex">
      {/* Brand */}
      <div className="p-6 flex items-center space-x-3 border-b border-[#2a2e37]">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sun className="text-white w-6 h-6" />
        </div>
        <div>
          <span className="text-xl font-bold text-white tracking-tight block">LeBled</span>
          <span className="text-xs text-gray-500 font-medium">Super App Algérienne</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
        <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Menu Principal</p>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                  : 'text-gray-400 hover:bg-[#181b21] hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}

        {/* Role Based Section */}
        {currentUser && (
          <div className="mt-8">
            <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gestion</p>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => onChangeView(AppView.ADMIN_PANEL)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  currentView === AppView.ADMIN_PANEL
                    ? 'bg-red-900/30 text-red-400 border border-red-500/30'
                    : 'text-gray-400 hover:bg-[#181b21] hover:text-red-400'
                }`}
              >
                <ShieldAlert className="w-5 h-5" />
                <span className="font-medium">{t.ADMIN_PANEL}</span>
              </button>
            )}
            {['admin', 'seller'].includes(currentUser.role) && (
              <button
                onClick={() => onChangeView(AppView.SELLER_DASHBOARD)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  currentView === AppView.SELLER_DASHBOARD
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:bg-[#181b21] hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">{t.SELLER_DASHBOARD}</span>
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2a2e37] bg-[#0f1117]">
        <button 
           onClick={() => onChangeView(AppView.PROFILE)}
           className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#181b21] rounded-xl transition-colors mb-1"
        >
          <Settings className="w-5 h-5" />
          <span>{t.PROFILE}</span>
        </button>
        {currentUser && (
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-900/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{t.LOGOUT}</span>
          </button>
        )}
      </div>
    </div>
  );
};