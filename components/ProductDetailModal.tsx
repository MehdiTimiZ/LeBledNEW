import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Share2, Flag, MessageCircle, ChevronLeft, ChevronRight, ShieldCheck, BadgeCheck, Star, Clock, ImageOff, Edit3 } from 'lucide-react';
import { MarketplaceItem, Review } from '../types';
import { MOCK_REVIEWS, TRANSLATIONS } from '../constants';
import { ReviewList, WriteReviewModal } from './ReviewSystem';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MarketplaceItem | null;
  onContact?: (recipient: string) => void;
  onBook?: (itemName: string) => void;
  language?: 'FR' | 'EN' | 'AR';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  item, 
  onContact, 
  onBook,
  language = 'FR'
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [itemReviews, setItemReviews] = useState<Review[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const t = TRANSLATIONS[language]?.ui || TRANSLATIONS['FR'].ui;

  useEffect(() => {
    if (item) {
      // Filter reviews for this item
      const relevantReviews = MOCK_REVIEWS.filter(r => r.targetId === item.id && r.targetType === 'item');
      setItemReviews(relevantReviews);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const images = item.images && item.images.length > 0 ? item.images : [item.image];
  const isMedicalService = item.tag === 'Medical Services' || item.tag === 'Services';

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setImgError(false);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setImgError(false);
  };

  const handleShare = () => {
    const shareData = {
      title: item.title,
      text: `Check out this ${item.title} on LeBled!`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleReport = () => {
    alert('Thank you. This listing has been flagged for review.');
  };

  const handleAddReview = (rating: number, comment: string) => {
    const newReview: Review = {
      id: Date.now().toString(),
      authorId: 'current-user',
      authorName: 'You',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      targetId: item.id,
      targetType: 'item'
    };
    setItemReviews([newReview, ...itemReviews]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-[#13151b] border border-[#2a2e37] rounded-3xl shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden animate-scale-up">
        {/* Overlay Controls (Close, Share, Flag) */}
        <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
          <button 
            onClick={handleShare}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-md"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleReport}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-md"
            title="Report"
          >
            <Flag className="w-5 h-5" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-md"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Left Column: Images */}
        <div className="w-full md:w-1/2 bg-[#0f1117] relative flex flex-col">
           {/* Main Image */}
           <div className="flex-1 relative overflow-hidden group flex items-center justify-center">
             {!imgError ? (
               <img 
                 src={images[activeImageIndex]} 
                 alt={item.title} 
                 className="w-full h-full object-cover"
                 onError={() => setImgError(true)}
               />
             ) : (
               <div className="flex flex-col items-center justify-center text-gray-500">
                 <ImageOff className="w-12 h-12 mb-2 opacity-50" />
                 <span className="text-sm">Image unavailable</span>
               </div>
             )}
             
             {/* Navigation Arrows */}
             {images.length > 1 && (
               <>
                 <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <ChevronLeft className="w-6 h-6" />
                 </button>
                 <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <ChevronRight className="w-6 h-6" />
                 </button>
               </>
             )}
             
             {/* Tags Overlay */}
             <div className="absolute top-4 left-4 flex space-x-2">
                <span className={`text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg ${isMedicalService ? 'bg-emerald-600/90' : 'bg-indigo-600/90'}`}>
                   {item.tag}
                </span>
                {item.condition && (
                   <span className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10">
                     {item.condition}
                   </span>
                )}
             </div>
           </div>

           {/* Thumbnails */}
           {images.length > 1 && (
             <div className="h-20 bg-[#181b21] p-2 flex space-x-2 overflow-x-auto no-scrollbar border-t border-[#2a2e37]">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setActiveImageIndex(idx); setImgError(false); }}
                    className={`relative h-full aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                       activeImageIndex === idx ? 'border-indigo-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumb ${idx}`} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = '0.2';
                      }}
                    />
                  </button>
                ))}
             </div>
           )}
        </div>

        {/* Right Column: Details */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-[#13151b]">
           <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Header */}
              <div>
                 <div className="flex justify-between items-start mb-2 pr-24">
                   {/* pr-24 to avoid overlap with absolute buttons if title is long */}
                   <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                     {item.title}
                   </h1>
                 </div>
                 
                 <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {item.location}</span>
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {t.postedOn} {item.date}</span>
                 </div>
                 
                 <div className="text-3xl font-bold text-white font-mono">
                    {item.price}
                 </div>
              </div>

              <div className="h-px bg-[#2a2e37]" />

              {/* Seller Card */}
              <div className="bg-[#181b21] rounded-xl p-4 border border-[#2a2e37] flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
                       {item.seller.avatar ? <img src={item.seller.avatar} alt={item.seller.name} className="w-full h-full rounded-full object-cover" /> : item.seller.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                       <div className="flex items-center">
                          <h3 className="font-bold text-white mr-1.5">{item.seller.name}</h3>
                          {item.seller.verified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                       </div>
                       <div className="flex items-center text-xs text-gray-500 mt-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-current mr-1" />
                          <span className="mr-2">{item.seller.rating || 'New'} Rating</span>
                          <span>• Active 2h ago</span>
                       </div>
                    </div>
                 </div>
                 <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                    {t.viewProfile}
                 </button>
              </div>

              {/* Description */}
              <div>
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{t.description}</h3>
                 <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {item.description || "No description provided for this item."}
                 </p>
              </div>

              {/* Reviews Section */}
              <div className="pt-4 border-t border-[#2a2e37]">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.reviews} ({itemReviews.length})</h3>
                   <button 
                     onClick={() => setIsReviewModalOpen(true)}
                     className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
                   >
                     <Edit3 className="w-3 h-3 mr-1" /> {t.writeReview}
                   </button>
                 </div>
                 
                 {itemReviews.length > 0 ? (
                   <ReviewList reviews={itemReviews} />
                 ) : (
                   <p className="text-sm text-gray-500 italic">No reviews yet. Be the first to review!</p>
                 )}
              </div>

              {/* Safety */}
              <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10">
                 <h3 className="text-sm font-bold text-emerald-400 flex items-center mb-3">
                    <ShieldCheck className="w-4 h-4 mr-2" /> {t.safetyTips}
                 </h3>
                 <ul className="text-xs text-gray-400 space-y-2 list-disc list-inside">
                    <li>Meet in a public place</li>
                    <li>Check the item properly before paying</li>
                    <li>Never pay in advance</li>
                 </ul>
              </div>
           </div>

           {/* Footer Action */}
           <div className="p-6 border-t border-[#2a2e37] bg-[#181b21] flex gap-4">
              <button 
                 onClick={() => onContact && onContact(item.title)}
                 className={`flex-1 bg-[#2a2e37] hover:bg-[#3f4552] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${isMedicalService ? 'w-1/3' : 'w-full'}`}
              >
                 <MessageCircle className="w-5 h-5" />
                 <span>{t.contact}</span>
              </button>
              
              {isMedicalService && onBook && (
                <button 
                   onClick={() => onBook(item.title)}
                   className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                   <Clock className="w-5 h-5" />
                   <span>{t.book}</span>
                </button>
              )}
           </div>
      </div>
      
      {/* Review Modal */}
      <WriteReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleAddReview}
        targetName={item.title}
      />
    </div>
  );
};