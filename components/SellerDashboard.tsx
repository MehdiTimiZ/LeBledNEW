import React, { useState } from 'react';
import { Eye, MessageSquare, Package, TrendingUp, Search, Plus } from 'lucide-react';

export const SellerDashboard: React.FC<{ onOpenCreate: () => void }> = ({ onOpenCreate }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'sold'>('active');

  const stats = [
    { label: 'Total Views', value: '1245', change: '+12%', icon: Eye, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Messages', value: '48', change: '+5%', icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Items Sold', value: '12', change: '+2%', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Revenue', value: '45k DZD', change: '+18%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Seller Dashboard</h1>
          <p className="text-gray-400">Manage your business and track performance.</p>
        </div>
        <button 
          onClick={onOpenCreate}
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 shadow-lg shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Déposer une annonce</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-6 hover:border-[#3f4552] transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Listings Section */}
      <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
        {/* Controls */}
        <div className="p-6 border-b border-[#2a2e37] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex bg-[#0f1117] p-1 rounded-xl border border-[#2a2e37]">
             {['Active', 'Pending', 'Sold'].map((tab) => (
               <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase() as any)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-[#6366f1] text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
               >
                 {tab}
               </button>
             ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search listings..." 
              className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 rounded-full bg-[#0f1117] border border-[#2a2e37] flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No active listings found</h3>
          <p className="text-gray-400 max-w-sm mx-auto">
            You don't have any {activeTab} listings yet. Create a new listing to start selling.
          </p>
        </div>
      </div>
    </div>
  );
};