import React, { useState } from 'react';
import { MARKETPLACE_ITEMS, TRANSLATIONS } from '../constants';
import { MapPin, MessageCircle, BadgeCheck, Star, RotateCcw, ShieldCheck, Info, Eye } from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { MarketplaceItem } from '../types';

interface MarketplaceProps {
  isWidget?: boolean;
  searchQuery?: string;
  category?: string;
  wilaya?: string;
  onContact?: (recipient: string) => void;
  onBook?: () => void;
  viewMode?: 'grid' | 'list';
  language?: 'FR' | 'EN' | 'AR';
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  isWidget = false,
  searchQuery = '',
  category = 'All',
  wilaya = 'All Locations',
  onContact,
  onBook,
  viewMode = 'grid',
  language = 'FR'
}) => {
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  
  const t = TRANSLATIONS[language]?.ui || TRANSLATIONS['FR'].ui;

  // Filter logic
  let filteredItems = MARKETPLACE_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || item.tag === category || (category === 'All' && true); // Fallback logic
    const matchesWilaya = wilaya === 'All Locations' || item.location.includes(wilaya);
    
    return matchesSearch && matchesCategory && matchesWilaya;
  });

  const items = isWidget ? filteredItems.slice(0, 4) : filteredItems;

  const handleCardClick = (id: string) => {
    setFlippedId(flippedId === id ? null : id);
  };

  return (
    <>
      {items.length === 0 ? (
         <div className="text-center py-20 bg-[#13151b] rounded-2xl border border-[#2a2e37]">
           <p className="text-gray-400">No items found matching your criteria.</p>
         </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${isWidget ? 'xl:grid-cols-2' : 'xl:grid-cols-4'} gap-6`
          : 'space-y-4'
        }>
          {items.map((item) => {
            const isFlipped = flippedId === item.id;

            if (viewMode === 'list') {
              return (
                <div 
                  key={item.id} 
                  className="bg-[#13151b] border border-[#2a2e37] rounded-xl p-4 flex gap-4 hover:border-[#3f4552] transition-all cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="w-32 h-32 flex-shrink-0 bg-[#181b21] rounded-lg overflow-hidden relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white text-lg">{item.title}</h3>
                        <div className="text-xl font-bold text-white">{item.price}</div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {item.location}
                        <span className="mx-2">•</span>
                        {item.date}
                      </div>
                      <p className="text-sm text-gray-400 mt-2 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <div className="flex items-center space-x-2">
                         <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] border border-indigo-500/30">
                           {item.seller.name.substring(0, 2).toUpperCase()}
                         </div>
                         <span className="text-xs font-bold text-gray-300">{item.seller.name}</span>
                       </div>
                       <button 
                          onClick={(e) => { e.stopPropagation(); onContact && onContact(item.title); }}
                          className="px-4 py-2 bg-[#2a2e37] hover:bg-[#343944] text-white text-xs font-bold rounded-lg transition-colors"
                       >
                          {t.contactSeller}
                       </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={item.id} 
                className="group relative h-[420px] w-full perspective-1000 cursor-pointer"
                onClick={() => handleCardClick(item.id)}
              >
                <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  
                  {/* FRONT FACE */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-[#13151b] rounded-2xl overflow-hidden border border-[#2a2e37] hover:border-[#3f4552] transition-colors flex flex-col shadow-lg">
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden bg-[#181b21]">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-lg border border-white/10">
                        {item.condition || 'New'}
                      </div>
                      
                      <div className="absolute top-3 left-3 px-3 py-1 bg-[#181b21]/90 backdrop-blur-md text-indigo-400 text-xs font-bold rounded-lg border border-[#2a2e37] uppercase tracking-wider">
                        {item.tag}
                      </div>

                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-3 left-3">
                        <div className="px-4 py-2 bg-[#181b21] rounded-xl border border-[#2a2e37] shadow-lg">
                          <span className="text-lg font-bold text-white tracking-tight">{item.price}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-gray-100 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <div className="text-xs text-gray-500 mb-2 flex items-center">
                          {t.postedOn} {item.date}
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{item.location}</span>
                        </div>
                      </div>

                      {/* Seller Info & Contact */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#2a2e37]">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                            {item.seller.avatar ? <img src={item.seller.avatar} alt={item.seller.name} className="w-full h-full rounded-full object-cover" /> : item.seller.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center">
                                <span className="text-xs font-bold text-white mr-1">{item.seller.name}</span>
                                {item.seller.verified && <BadgeCheck className="w-3 h-3 text-blue-400" />}
                            </div>
                            <div className="flex items-center text-[10px] text-gray-500">
                                <Star className="w-3 h-3 text-amber-400 fill-current mr-0.5" />
                                <span>{item.seller.rating || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-indigo-400 flex items-center">
                          <Info className="w-3 h-3 mr-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#181b21] rounded-2xl overflow-hidden border border-indigo-500/30 shadow-2xl flex flex-col p-6">
                     <div className="flex justify-between items-start mb-4">
                       <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleCardClick(item.id); }}
                         className="p-1 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
                       >
                         <RotateCcw className="w-5 h-5" />
                       </button>
                     </div>
                     
                     <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
                       <div className="bg-[#13151b] p-4 rounded-xl border border-[#2a2e37] h-full">
                          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">{t.description}</h4>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {item.description || "Excellent condition, barely used. Comes with original packaging and receipt."}
                          </p>
                       </div>

                       <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="bg-[#2a2e37]/50 p-2 rounded-lg text-center">
                             <span className="block text-xs text-gray-500">Response Rate</span>
                             <span className="font-bold text-white">98%</span>
                          </div>
                          <div className="bg-[#2a2e37]/50 p-2 rounded-lg text-center">
                             <span className="block text-xs text-gray-500">Active Since</span>
                             <span className="font-bold text-white">2021</span>
                          </div>
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-[#2a2e37]">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                          className="bg-[#2a2e37] hover:bg-[#3f4552] text-white py-3 rounded-xl font-bold flex items-center justify-center transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {t.viewAd}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onContact && onContact(item.title); }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center transition-colors shadow-lg shadow-indigo-500/20"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {t.contact}
                        </button>
                     </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal 
        isOpen={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onContact={onContact}
        onBook={onBook}
        language={language}
      />
    </>
  );
};