import React from 'react';
import { Check, Zap, Star, Briefcase } from 'lucide-react';

export const SubscriptionView: React.FC = () => {
  return (
    <div className="space-y-12 py-10 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
        <p className="text-gray-400 text-lg">
          Unlock premium features to sell faster and reach more customers on LeBled.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {/* Free Plan */}
        <div className="glass-card bg-[#181b21]/50 border border-[#2a2e37] rounded-3xl p-8 hover:bg-[#181b21] transition-all">
          <div className="w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center mb-6 text-gray-400">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Free</h3>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold text-white">0</span>
            <span className="text-gray-400 ml-2">DZD/mo</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-green-500 mr-3" /> 3 Active Listings
            </li>
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-green-500 mr-3" /> Basic Support
            </li>
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-green-500 mr-3" /> Standard Visibility
            </li>
          </ul>
          <button className="w-full py-3 rounded-xl border border-[#2a2e37] text-white hover:bg-[#2a2e37] transition-colors font-medium">
            Current Plan
          </button>
        </div>

        {/* Pro Seller (Recommended) */}
        <div className="relative glass-card bg-[#181b21]/80 border border-indigo-500/50 rounded-3xl p-8 shadow-2xl shadow-indigo-500/20 transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            Recommended
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Pro Seller</h3>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold text-white">1,200</span>
            <span className="text-gray-400 ml-2">DZD/mo</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-indigo-400 mr-3" /> 30 Active Listings
            </li>
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-indigo-400 mr-3" /> Priority Support
            </li>
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-indigo-400 mr-3" /> Weekly Category Spotlight
            </li>
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-indigo-400 mr-3" /> Analytics Dashboard
            </li>
          </ul>
          <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors font-bold shadow-lg shadow-indigo-500/25">
            Upgrade to Pro
          </button>
        </div>

        {/* Business */}
        <div className="glass-card bg-[#181b21]/50 border border-[#2a2e37] rounded-3xl p-8 hover:bg-[#181b21] transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Business</h3>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold text-white">4,000</span>
            <span className="text-gray-400 ml-2">DZD/mo</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-purple-400 mr-3" /> Unlimited Listings
            </li>
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-purple-400 mr-3" /> Verified Shop Badge
            </li>
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-purple-400 mr-3" /> Dedicated Manager
            </li>
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-purple-400 mr-3" /> API Access
            </li>
          </ul>
          <button className="w-full py-3 rounded-xl border border-[#2a2e37] text-white hover:bg-[#2a2e37] transition-colors font-medium">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};