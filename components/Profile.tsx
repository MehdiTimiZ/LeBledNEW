import React, { useState } from 'react';
import { MapPin, Calendar, Star, Package, MessageCircle, Share2, Settings, ShieldCheck, Grid, List, CheckCircle, Smartphone, BadgeCheck, X, Edit3 } from 'lucide-react';
import { MARKETPLACE_ITEMS, MOCK_REVIEWS } from '../constants';
import { UserProfile, Review } from '../types';
import { ReviewStats, ReviewList, WriteReviewModal } from './ReviewSystem';

interface ProfileProps {
  onContact?: (recipient: string) => void;
  onEdit?: () => void;
  currentUser?: UserProfile | null;
  onClose?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onContact, onEdit, currentUser, onClose }) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'about'>('listings');
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Mock data for the profile listings
  const listings = [
    {
      id: 'p1',
      title: 'iPhone 13 Pro Max - Pacific Blue',
      price: '120,000 DZD',
      image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=800',
      condition: 'Like New',
      location: 'Algiers, Hydra',
      date: '2 days ago'
    },
    {
      id: 'p2',
      title: 'Sony PlayStation 5 Digital Edition',
      price: '85,000 DZD',
      image: '', // No image case
      condition: 'New',
      location: 'Algiers, Hydra',
      date: '1 week ago'
    },
    {
      id: 'p3',
      title: 'MacBook Air M1 2020',
      price: '145,000 DZD',
      image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
      condition: 'Used - Good',
      location: 'Algiers, Hydra',
      date: '3 weeks ago'
    }
  ];

  const profileName = currentUser?.name || "Guest User";
  const profileRole = currentUser?.role === 'admin' ? "Super Admin" : currentUser?.role === 'seller' ? "Verified Seller" : "Community Member";
  const isVerified = currentUser?.isVerified;

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  const handleAddReview = (rating: number, comment: string) => {
    const newReview: Review = {
      id: Date.now().toString(),
      authorId: 'current-user',
      authorName: 'You', // In a real app, this would be the logged-in user's name
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0
    };
    setReviews([newReview, ...reviews]);
  };

  return (
    <div className="animate-fade-in space-y-6 relative">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[60] p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors border border-white/20 shadow-lg"
          aria-label="Close Profile"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Profile Header Card */}
      <div className="bg-[#13151b] border border-[#2a2e37] rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full relative">
          {currentUser?.cover ? (
             <img 
               src={currentUser.cover} 
               alt="Cover" 
               className="w-full h-full object-cover opacity-80"
             />
          ) : (
             <div className="w-full h-full bg-[#181b21] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-[#13151b] opacity-60"></div>
                {/* Abstract Pattern */}
                <svg className="absolute w-full h-full opacity-10" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
             </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#13151b] via-transparent to-transparent"></div>
        </div>

        <div className="px-6 md:px-10 pb-8 relative">
          {/* Avatar & Main Info */}
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-12 mb-6 gap-6">
            <div className="relative">
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full p-1 bg-[#13151b] ring-4 ring-[#2a2e37]">
                {currentUser?.avatar ? (
                   <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl font-bold text-white ${
                    currentUser?.role === 'admin' ? 'bg-gradient-to-tr from-red-600 to-orange-600' :
                    currentUser?.role === 'seller' ? 'bg-gradient-to-tr from-emerald-500 to-teal-600' :
                    'bg-gradient-to-tr from-indigo-500 to-purple-600'
                  }`}>
                    {profileName.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              {isVerified && (
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-[#13151b] text-white">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="flex-1 pt-2 md:mb-4">
              <h1 className="text-3xl font-bold text-white mb-1 flex items-center">
                {profileName}
                {isVerified && <BadgeCheck className="w-6 h-6 text-blue-400 ml-2" />}
              </h1>
              <p className={`font-medium text-sm mb-2 ${
                 currentUser?.role === 'admin' ? 'text-red-400' :
                 currentUser?.role === 'seller' ? 'text-emerald-400' : 'text-gray-400'
              }`}>
                {profileRole}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-gray-500" /> Algiers, Hydra
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-gray-500" /> Joined March 2024
                </span>
              </div>
            </div>

            <div className="flex space-x-3 mb-4 w-full md:w-auto">
              {onEdit ? (
                <button 
                  onClick={onEdit}
                  className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-900/20"
                >
                  <Settings className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button 
                  onClick={() => onContact && onContact(profileName)}
                  className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-900/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Message</span>
                </button>
              )}
              <button className="p-2.5 bg-[#181b21] border border-[#2a2e37] rounded-xl text-gray-400 hover:text-white hover:bg-[#2a2e37] transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2.5 bg-[#181b21] border border-[#2a2e37] rounded-xl text-gray-400 hover:text-white hover:bg-[#2a2e37] transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats & Bio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#181b21] border border-[#2a2e37] p-4 rounded-2xl text-center">
                   <Package className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                   <div className="text-2xl font-bold text-white">45</div>
                   <div className="text-xs text-gray-500 font-medium">Items Sold</div>
                 </div>
                 <div className="bg-[#181b21] border border-[#2a2e37] p-4 rounded-2xl text-center">
                   <Star className="w-6 h-6 text-amber-400 mx-auto mb-2 fill-current" />
                   <div className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</div>
                   <div className="text-xs text-gray-500 font-medium">{reviews.length} Reviews</div>
                 </div>
               </div>
               
               <div className="bg-[#181b21]/50 rounded-2xl p-6 border border-[#2a2e37]">
                 <p className="text-gray-300 leading-relaxed text-sm">
                   Passionate about vintage electronics and gaming gear. Always selling high-quality items in excellent condition. 
                   Feel free to contact me for bundles! 🎮 📸
                 </p>
               </div>
            </div>

            {/* Verification Card */}
            <div className="bg-[#1e2330] rounded-2xl p-6 border border-indigo-500/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-16 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
               <div className="relative z-10 flex flex-col h-full justify-center items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">GSM Verified</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Identity verified via GSM network authentication.</p>
                  </div>
                  <div className="pt-2">
                     <ShieldCheck className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 md:px-10 border-t border-[#2a2e37] bg-[#181b21]/50">
          <div className="flex space-x-8 overflow-x-auto no-scrollbar">
            {['Listings', 'Reviews', 'About'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase() as any)}
                className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.toLowerCase()
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {activeTab === tab.toLowerCase() && <span className="mr-2 text-emerald-500">●</span>}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content based on Active Tab */}
      
      {/* 1. Listings Grid */}
      {activeTab === 'listings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {listings.map((item) => (
            <div key={item.id} className="bg-[#13151b] border border-[#2a2e37] rounded-2xl overflow-hidden group hover:border-[#3f4552] transition-all cursor-pointer">
              <div className="aspect-[4/3] bg-[#181b21] relative overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700">No Image</p>
                  </div>
                )}
                
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-xs font-medium text-white">
                    {item.condition}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex space-x-2 mb-2">
                    <div className="w-4 h-2 bg-indigo-500/20 rounded-full"></div>
                </div>
                <h3 className="font-bold text-white text-lg mb-1 truncate">{item.title}</h3>
                <div className="inline-block bg-[#181b21] rounded-lg px-2 py-1 border border-[#2a2e37] mb-3">
                  <span className="text-xl font-bold text-white">{item.price}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {item.location}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Placeholder (If owner) */}
          {onEdit && (
            <div className="border-2 border-dashed border-[#2a2e37] rounded-2xl flex flex-col items-center justify-center p-8 text-gray-500 hover:border-gray-500 hover:bg-[#181b21] transition-all cursor-pointer aspect-[4/3] md:aspect-auto">
                <div className="w-12 h-12 rounded-full bg-[#181b21] flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6" />
                </div>
                <p className="font-medium">Add New Listing</p>
            </div>
          )}
        </div>
      )}

      {/* 2. Reviews Section */}
      {activeTab === 'reviews' && (
         <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Reviews & Ratings</h2>
              {!onEdit && (
                <button 
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-[#2a2e37] hover:bg-[#343944] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Write Review
                </button>
              )}
            </div>
            
            <ReviewStats reviews={reviews} overallRating={avgRating} />
            
            {reviews.length > 0 ? (
               <ReviewList reviews={reviews} />
            ) : (
               <div className="text-center py-12 bg-[#13151b] border border-[#2a2e37] rounded-2xl">
                 <div className="w-16 h-16 bg-[#181b21] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gray-600" />
                 </div>
                 <h3 className="text-lg font-bold text-white">No reviews yet</h3>
                 <p className="text-gray-400 text-sm">Be the first to rate {profileName}!</p>
               </div>
            )}
         </div>
      )}

      {/* 3. About Section (Placeholder) */}
      {activeTab === 'about' && (
         <div className="max-w-4xl mx-auto animate-fade-in-up bg-[#13151b] border border-[#2a2e37] rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">About {profileName}</h3>
            <div className="space-y-4 text-gray-300 leading-relaxed">
               <p>
                 Member since 2024. Active in Algiers and surrounding areas.
                 Specializes in electronics and computing equipment.
               </p>
               <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-[#181b21] rounded-lg border border-[#2a2e37] text-xs font-bold text-gray-400">Trusted Seller</span>
                  <span className="px-3 py-1 bg-[#181b21] rounded-lg border border-[#2a2e37] text-xs font-bold text-gray-400">Fast Responder</span>
                  <span className="px-3 py-1 bg-[#181b21] rounded-lg border border-[#2a2e37] text-xs font-bold text-gray-400">Verified ID</span>
               </div>
            </div>
         </div>
      )}

      {/* Write Review Modal */}
      <WriteReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleAddReview}
        targetName={profileName}
      />
    </div>
  );
};