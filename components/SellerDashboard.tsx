
import React, { useState } from 'react';
import { Eye, MessageSquare, Package, TrendingUp, Search, Plus, Briefcase, Loader2, ExternalLink } from 'lucide-react';
import { CreateListingModal } from './CreateListingModal';
import { useSellerStats } from '../hooks/useSellerStats';
import { UserProfile } from '../types';

interface SellerDashboardProps {
  onOpenCreate: () => void;
  currentUser?: UserProfile | null;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onOpenCreate, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'sold'>('active');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { stats, listings, loading } = useSellerStats(currentUser?.id);

  const statCards = [
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), change: stats.viewsChange, icon: Eye, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Messages', value: stats.totalMessages.toString(), change: stats.messagesChange, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Items Sold', value: stats.itemsSold.toString(), change: stats.soldChange, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Revenue', value: `${(stats.revenue / 1000).toFixed(0)}k DZD`, change: stats.revenueChange, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const filteredListings = listings
    .filter(l => l.status === activeTab)
    .filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Seller Dashboard</h1>
          <p className="text-gray-400">Manage your business and track performance.</p>
        </div>
        <div className="flex gap-3">
            <button 
              onClick={() => setIsServiceModalOpen(true)}
              className="bg-[#181b21] hover:bg-[#2a2e37] text-white px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 border border-[#2a2e37] transition-all"
            >
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>Offer a Service</span>
            </button>
            <button 
              onClick={onOpenCreate}
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 shadow-lg shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Déposer une annonce</span>
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
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
            <p className="text-2xl font-bold text-white mt-1">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-gray-500" /> : stat.value}
            </p>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Listings Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="divide-y divide-[#2a2e37]">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="p-4 flex items-center gap-4 hover:bg-[#181b21] transition-colors">
                <div className="w-16 h-16 rounded-xl bg-[#0f1117] overflow-hidden flex-shrink-0">
                  {listing.image ? (
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{listing.title}</h4>
                  <p className="text-indigo-400 text-sm font-bold">{listing.price}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Eye className="w-3 h-3" />
                    <span>{listing.views}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(listing.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-[#0f1117] border border-[#2a2e37] flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-gray-600" />
            </div>
                <h3 className="text-lg font-bold text-white mb-2">No {activeTab} listings found</h3>
                <p className="text-gray-400 max-w-sm mx-auto">
                  You don't have any {activeTab} listings yet. Create a new listing to start selling.
                </p>
              </div>
        )}
      </div>

      <CreateListingModal 
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        initialCategory="Services"
      />
    </div>
  );
};
