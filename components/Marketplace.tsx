import React, { useState } from 'react';
import { MARKETPLACE_ITEMS, TRANSLATIONS } from '../constants';
import { MapPin, MessageCircle, BadgeCheck, Star, RotateCcw, Info, Eye } from 'lucide-react';
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
  language?: 'FR' | 'EN';
  onViewProfile?: (name: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  isWidget = false,
  searchQuery = '',
  category = 'All',
  wilaya = 'All Locations',
  onContact,
  onBook,
  viewMode = 'grid',
  language = 'FR',
  onViewProfile
}) => {
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  
  const t = TRANSLATIONS[language]?.ui || TRANSLATIONS['FR'].ui;

  let filteredItems = MARKETPLACE_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || item.tag === category;
    const matchesWilaya = wilaya === 'All Locations' || item.location.includes(wilaya);
    
    return matchesSearch && matchesCategory && matchesWilaya;
  });

  const items = isWidget ? filteredItems.slice(0, 4) : filteredItems;

  return (
    <>
      <div className={viewMode === 'grid' 
        ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${isWidget ? 'xl:grid-cols-2' : 'xl:grid-cols-4'} gap-6`
        : 'flex flex-col space-y-4'
      }>
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`relative perspective-1000 cursor-pointer ${viewMode === 'list' ? 'h-52 w-full' : 'h-[440px]'}`}
            onClick={() => setFlippedId(flippedId === item.id ? null : item.id)}
          >
            <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${flippedId === item.id ? 'rotate-y-180' : ''}`}>
              {/* Front Side */}
              <div className={`absolute inset-0 w-full h-full backface-hidden bg-[#13151b] border border-[#2a2e37] rounded-3xl overflow-hidden group hover:border-[#3f4552] transition-all flex shadow-lg ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}>
                <div className={`relative overflow-hidden bg-black/40 shrink-0 ${viewMode === 'list' ? 'w-64 h-full' : 'h-48 w-full'}`}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    <span className={`text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest backdrop-blur-md border-l-4 ${item.tag === 'Medical Services' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-indigo-500/20 border-indigo-500'}`}>
                      {item.tag}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2">
                    <h3 className={`font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight line-clamp-1 ${viewMode === 'list' ? 'text-xl' : 'text-lg'}`}>
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-3 mt-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                      <span className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-indigo-500" /> {item.location}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <div className={`${viewMode === 'list' ? 'text-3xl' : 'text-2xl'} font-black text-white tracking-tighter mb-2`}>
                    {item.price}
                  </div>

                  <div className="mt-auto pt-4 border-t border-[#2a2e37]/50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-[10px] border border-indigo-500/20">
                        {item.seller.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white flex items-center">
                          {item.seller.name} {item.seller.verified && <BadgeCheck className="w-3 h-3 text-blue-400 ml-1" />}
                        </span>
                        <div className="flex items-center text-[10px] text-gray-500">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-current mr-1" />
                          {item.seller.rating || 'Nouveau'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.condition && (
                        <span className="hidden sm:inline-block bg-amber-500/10 text-amber-400 text-[10px] font-black px-2 py-1 rounded border border-amber-500/20 uppercase tracking-widest">
                          {item.condition}
                        </span>
                      )}
                      <Info className="w-4 h-4 text-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#181b21] border border-indigo-500/30 rounded-3xl p-6 flex flex-col shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white leading-tight line-clamp-1">{item.title}</h3>
                  <button className="p-1 hover:bg-white/10 rounded-full text-gray-400 transition-colors">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar mb-4">
                  <div className="bg-[#13151b] p-4 rounded-2xl border border-[#2a2e37]/30 h-full">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{t.description}</h4>
                    <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">
                      {item.description || "Excellent état, disponible pour visite immédiate. Premier arrivé, premier servi."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                    className="bg-[#2a2e37] hover:bg-[#3f4552] text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center transition-all"
                  >
                    <Eye className="w-4 h-4 mr-2" /> {t.viewAd}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onContact && onContact(item.title); }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> {t.contact}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductDetailModal 
        isOpen={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onContact={onContact}
        onBook={onBook}
        language={language}
        onViewProfile={onViewProfile ? () => onViewProfile(selectedItem?.seller.name || '') : undefined}
      />
    </>
  );
};
