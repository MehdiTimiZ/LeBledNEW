
import React, { useState } from 'react';
import { MARKETPLACE_ITEMS, TRANSLATIONS } from '../constants';
import { MapPin, MessageCircle, BadgeCheck, Star, RotateCcw, Info, Eye } from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { MarketplaceItem } from '../types';
import { BaseCard, CardMedia, CardBody, CardFooter, CardLabel } from './BaseCard';

interface MarketplaceProps {
  isWidget?: boolean;
  searchQuery?: string;
  category?: string;
  wilaya?: string;
  onContact?: (recipient: string) => void;
  onBook?: () => void;
  viewMode?: 'grid' | 'list';
  // Fix: language should only be 'FR' | 'EN' to match TRANSLATIONS and ProductDetailModalProps
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
        : 'space-y-4'
      }>
        {items.map((item) => (
          <div key={item.id} className={`${viewMode === 'list' ? 'h-64 w-full' : 'h-[440px]'}`}>
            <BaseCard
              variant={viewMode}
              className="h-full"
              isFlipped={flippedId === item.id}
              onClick={() => setFlippedId(flippedId === item.id ? null : item.id)}
              backContent={
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-white leading-tight">{item.title}</h3>
                    <button className="p-1 hover:bg-white/10 rounded-full text-gray-400 transition-colors">
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar mb-4">
                    <div className="bg-[#13151b] p-4 rounded-2xl border border-[#2a2e37]/30 h-full">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">{t.description}</h4>
                      <p className="text-sm text-gray-300 leading-relaxed line-clamp-6">
                        {item.description || "Excellent état, disponible pour visite immédiate."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                      className="bg-[#2a2e37] hover:bg-[#3f4552] text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center transition-all"
                    >
                      <Eye className="w-4 h-4 mr-2" /> {t.viewAd}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onContact && onContact(item.title); }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" /> {t.contact}
                    </button>
                  </div>
                </div>
              }
            >
              <CardMedia src={item.image} alt={item.title} variant={viewMode}>
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  <CardLabel color={item.tag === 'Medical Services' ? 'emerald' : 'indigo'}>
                    {item.tag}
                  </CardLabel>
                  {item.condition && (
                    <CardLabel color="amber">
                      {item.condition}
                    </CardLabel>
                  )}
                </div>
              </CardMedia>
              
              <CardBody>
                <div className="mb-4">
                  <h3 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors leading-tight line-clamp-1">{item.title}</h3>
                  <div className="flex items-center space-x-3 mt-2 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-indigo-500" /> {item.location}</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="text-2xl font-black text-white tracking-tighter mb-4">
                  {item.price}
                </div>

                <CardFooter>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-[10px] border border-indigo-500/20">
                      {item.seller.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white flex items-center">
                        {item.seller.name} {item.seller.verified && <BadgeCheck className="w-3 h-3 text-blue-400 ml-1" />}
                      </span>
                      <div className="flex items-center text-[10px] text-gray-500 font-bold">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-current mr-1" />
                        {item.seller.rating || 'New'}
                      </div>
                    </div>
                  </div>
                  <Info className="w-4 h-4 text-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                </CardFooter>
              </CardBody>
            </BaseCard>
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
