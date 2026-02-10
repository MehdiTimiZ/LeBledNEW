import React from 'react';
import { AppView } from '../types';
import { Home, Car, Users, Heart, Stethoscope, Truck, Smartphone } from 'lucide-react';

interface CategoryNavProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ currentView, onChangeView }) => {
  const items = [
    { id: AppView.HOME, label: 'Home', icon: Home },
    { id: AppView.VEHICLES, label: 'Véhicules', icon: Car },
    { id: AppView.COMMUNITY, label: 'Communauté', icon: Users },
    { id: AppView.CHARITY, label: 'Civil Mob', icon: Heart },
    { id: AppView.SERVICES, label: 'Santé', icon: Stethoscope },
    { id: AppView.DELIVERY, label: 'Livraison', icon: Truck },
    { id: AppView.FLEXY, label: 'Flexy', icon: Smartphone },
  ];

  return (
    <div className="py-4 overflow-x-auto no-scrollbar md:hidden">
      <div className="flex space-x-3 min-w-max px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-900/30'
                  : 'bg-[#181b21] text-gray-400 border-[#2a2e37] hover:bg-[#20242c] hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};