import React from 'react';
import { Home, Car, MessageCircle, Users, Stethoscope } from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface BottomNavProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  currentUser: UserProfile | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView, currentUser }) => {
  const navItems = [
    { id: AppView.HOME, label: 'Home', icon: Home },
    { id: AppView.VEHICLES, label: 'Vehicles', icon: Car },
    { id: AppView.SERVICES, label: 'Health', icon: Stethoscope, color: 'text-green-500' },
    { id: AppView.CHAT, label: 'Chat', icon: MessageCircle },
    { id: AppView.COMMUNITY, label: 'Community', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all min-w-[56px] ${isActive
                  ? 'text-indigo-400'
                  : 'text-muted hover:text-mainText'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? (item.color || 'text-indigo-400') : ''}`} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
                )}
              </div>
              <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-indigo-400' : 'text-muted'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};