import React from 'react';
import { Home, ShoppingBag, Users, MessageCircle, User } from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface BottomNavProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  currentUser: UserProfile | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView, currentUser }) => {
  const items = [
    { id: AppView.HOME, label: 'Home', icon: Home },
    { id: AppView.VEHICLES, label: 'Market', icon: ShoppingBag }, // Market shortcut
    { id: AppView.COMMUNITY, label: 'Club', icon: Users },
    { id: AppView.CHAT, label: 'Chat', icon: MessageCircle },
    { id: AppView.PROFILE, label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#13151b] border-t border-[#2a2e37] pb-safe z-50">
      <div className="flex justify-around items-center px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 w-full ${
                isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl mb-1 transition-all ${isActive ? 'bg-indigo-500/10' : 'bg-transparent'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};