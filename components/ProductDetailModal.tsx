
import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Share2, Flag, MessageCircle, ChevronLeft, ChevronRight, ShieldCheck, BadgeCheck, Star, Clock, ImageOff, Edit3, Heart, Maximize2, Phone, AlertTriangle, User } from 'lucide-react';
import { MarketplaceItem, Review } from '../types';
import { MOCK_REVIEWS, TRANSLATIONS } from '../constants';
import { ReviewList, WriteReviewModal } from './ReviewSystem';
import { ReportModal } from './ReportModal';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MarketplaceItem | null;
  onContact?: (recipient: string, message?: string) => void;
  onBook?: (itemName: string) => void;
  language?: 'FR' | 'EN';
  onViewProfile?: (name: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  item, 
  onContact, 
  onBook,
  language = 'FR',
  onViewProfile
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [itemReviews, setItemReviews] = useState<Review[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const t = TRANSLATIONS[language]?.ui || TRANSLATIONS['FR'].ui;

  useEffect(() => {
    if (item) {
      const relevantReviews = MOCK_REVIEWS.filter(r => r.targetId === item.id && r.targetType === 'item');
      setItemReviews(relevantReviews);
      setIsLiked(false);
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
    const text = `Check out this ${item.title} on LeBled! ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppContact = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (item.seller.phone) {
      const text = `Salam, I am interested in your listing: ${item.title}. Is it still available?`;
      const url = `https://wa.me/${item.seller.phone.replace(/\D/g,'')}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    } else {
      alert("Seller phone number not available.");
    }
  };

  const handleInternalChat = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onContact) {
      onContact(item.seller.name, `Hi, I am interested in ${item.title}.`);
      onClose();
    }
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

  const handleViewProfile = (e: React.MouseEvent) => {
      e.stopPropagation();
      if(onViewProfile) {
        onViewProfile(item.seller.name);
        onClose();
      }
  };

  const handleReportSubmit = (reason: string) => {
    console.log(`Reported ${item.title} for ${reason}`);
    onClose(); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content - Set fixed height to enable internal scrolling */}
      <div className="relative w-full max-w-6xl bg-background border border-border rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row h-[90vh] lg:h-[85vh] overflow-hidden animate-scale-up">
        
        {/* Left Column: Media Section */}
        <div className="w-full h-[40%] lg:h-full lg:w-3/5 bg-black/20 relative flex flex-col border-b lg:border-b-0 lg:border-r border-border/30 overflow-hidden shrink-0">
           <div className="flex-1 relative flex items-center justify-center p-4 lg:p-12">
             <div className="relative w-full h-full flex items-center justify-center group">
               {!imgError ? (
                 <img 
                   src={images[activeImageIndex]} 
                   alt={item.title} 
                   className="max-w-full max-h-full object-contain rounded-[2rem] shadow-2xl transition-transform duration-700"
                   onError={() => setImgError(true)}
                 />
               ) : (
                 <div className="flex flex-col items-center justify-center text-muted bg-surfaceAlt w-full h-full rounded-[2rem] border border-dashed border-border">
                   <ImageOff className="w-12 h-12 mb-4 opacity-30" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Média indisponible</span>
                 </div>
               )}
               
               <button className="absolute bottom-6 right-6 p-3 bg-black/40 hover:bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all border border-white/5 backdrop-blur-md">
                 <Maximize2 className="w-5 h-5" />
               </button>

               {images.length > 1 && (
                 <>
                   <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 lg:p-4 bg-black/40 hover:bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all border border-white/5 backdrop-blur-md"
                   >
                     <ChevronLeft className="w-6 h-6" />
                   </button>
                   <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 lg:p-4 bg-black/40 hover:bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all border border-white/5 backdrop-blur-md"
                   >
                     <ChevronRight className="w-6 h-6" />
                   </button>
                 </>
               )}
             </div>
           </div>

           {images.length > 1 && (
             <div className="h-20 lg:h-28 flex items-center justify-center space-x-4 p-4 lg:p-5 overflow-x-auto no-scrollbar border-t border-border/30 shrink-0">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setActiveImageIndex(idx); setImgError(false); }}
                    className={`relative h-12 w-12 lg:h-16 lg:w-16 rounded-xl lg:rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-black/20 ${
                       activeImageIndex === idx ? 'border-indigo-500 scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
             </div>
           )}
        </div>

        {/* Right Column: Info & Premium Controls */}
        <div className="w-full h-[60%] lg:h-full lg:w-2/5 flex flex-col bg-surface overflow-hidden">
           {/* Top Control Bar */}
           <div className="p-4 lg:p-6 flex items-center justify-between border-b border-border/30 shrink-0">
              <div className="flex items-center space-x-2">
                 <span className="flex items-center bg-surfaceAlt px-2.5 py-1 rounded-full border border-border text-[9px] font-black tracking-widest text-muted uppercase">
                    <MapPin className="w-2.5 h-2.5 mr-1.5 text-indigo-400" /> {item.location}
                 </span>
                 <span className="flex items-center bg-surfaceAlt px-2.5 py-1 rounded-full border border-border text-[9px] font-black tracking-widest text-muted uppercase">
                    <Calendar className="w-2.5 h-2.5 mr-1.5 text-indigo-400" /> {item.date}
                 </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-xl transition-all border border-border/50 ${isLiked ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-surfaceAlt text-muted hover:text-mainText'}`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 bg-surfaceAlt hover:bg-surface border border-border/50 text-muted hover:text-green-400 rounded-xl transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsReportModalOpen(true)}
                  className="p-2 bg-surfaceAlt hover:bg-surface border border-border/50 text-muted hover:text-red-400 rounded-xl transition-all"
                >
                  <Flag className="w-4 h-4" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 bg-surfaceAlt hover:bg-surface border border-border/50 text-muted hover:text-mainText rounded-xl transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
           </div>

           {/* MAIN SCROLLABLE CONTENT AREA */}
           <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 custom-scrollbar min-h-0">
              <div className="space-y-4">
                 <h1 className="text-2xl lg:text-3xl font-black text-mainText leading-tight">
                   {item.title}
                 </h1>
                 <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-mainText via-mainText to-muted tracking-tighter">
                    {item.price}
                 </div>
              </div>

              {/* Seller premium card */}
              <div 
                className="bg-surfaceAlt rounded-3xl p-5 border border-border flex justify-between items-center cursor-pointer hover:border-indigo-500/40 transition-all group"
                onClick={handleViewProfile}
              >
                 <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-xl border border-indigo-500/20 relative">
                       {item.seller.avatar ? <img src={item.seller.avatar} alt={item.seller.name} className="w-full h-full rounded-2xl object-cover" /> : item.seller.name.substring(0, 2).toUpperCase()}
                       <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-surfaceAlt"></div>
                    </div>
                    <div>
                       <div className="flex items-center">
                          <h3 className="font-black text-mainText text-sm group-hover:text-indigo-400 transition-colors">{item.seller.name}</h3>
                          {item.seller.verified && <BadgeCheck className="w-4 h-4 text-blue-400 ml-1.5" />}
                       </div>
                       <div className="flex items-center text-[10px] text-muted mt-0.5 font-bold">
                          <Star className="w-3 h-3 text-amber-400 fill-current mr-1" />
                          <span className="mr-1.5">{item.seller.rating || 'New'}</span>
                          <span className="w-1 h-1 bg-muted rounded-full mr-1.5"></span>
                          <span>Active 2h ago</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                       {t.viewProfile}
                    </span>
                    <button 
                      onClick={handleInternalChat}
                      className="p-1.5 bg-surface hover:bg-indigo-600 text-muted hover:text-white rounded-lg transition-all border border-border"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                 </div>
              </div>

              {/* Specifications Section */}
              {item.specifications && (
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">{t.specifications || "SPECIFICATIONS"}</h3>
                   <div className="grid grid-cols-2 gap-3">
                      {Object.entries(item.specifications).map(([key, value]) => (
                        <div key={key} className="bg-surfaceAlt p-4 rounded-2xl border border-border flex flex-col">
                           <span className="text-[9px] font-bold text-muted uppercase mb-1">{key}</span>
                           <span className="text-xs font-bold text-mainText truncate">{value}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Description Section */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">{t.description}</h3>
                 <p className="text-mainText leading-relaxed text-sm bg-surfaceAlt/30 p-5 lg:p-6 rounded-[2rem] border border-border/20 whitespace-pre-wrap">
                    {item.description || "Aucune description fournie pour cet article."}
                 </p>
              </div>

              {/* Reviews Section */}
              <div className="pt-4 space-y-6">
                 <div className="flex justify-between items-center">
                   <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1">{t.reviewCount || "REVIEWS"} ({itemReviews.length})</h3>
                   <button 
                     onClick={() => setIsReviewModalOpen(true)}
                     className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 flex items-center bg-indigo-500/10 px-3 py-1.5 rounded-xl transition-all uppercase tracking-widest"
                   >
                     <Edit3 className="w-3 h-3 mr-1.5" /> {t.writeReview}
                   </button>
                 </div>
                 
                 <div className="space-y-4">
                    {itemReviews.length > 0 ? (
                      <ReviewList reviews={itemReviews} />
                    ) : (
                      <div className="text-center py-8 bg-surfaceAlt rounded-[2rem] border border-dashed border-border">
                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest italic">{t.beFirst || "Be the first!"}</p>
                      </div>
                    )}
                 </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-emerald-500/5 rounded-[2rem] p-6 border border-emerald-500/10">
                 <h3 className="text-[10px] font-black text-emerald-400 flex items-center mb-4 tracking-[0.2em] uppercase ml-1">
                    <ShieldCheck className="w-4 h-4 mr-2.5" /> {t.safetyTips}
                 </h3>
                 <ul className="text-xs text-muted space-y-3 font-bold">
                    <li className="flex items-center"><span className="w-1 h-1 bg-emerald-500 rounded-full mr-3"></span> Rencontrez-vous dans un lieu public</li>
                    <li className="flex items-center"><span className="w-1 h-1 bg-emerald-500 rounded-full mr-3"></span> Vérifiez l'article avant de payer</li>
                    <li className="flex items-center"><span className="w-1 h-1 bg-emerald-500 rounded-full mr-3"></span> Ne payez jamais à l'avance</li>
                 </ul>
              </div>
           </div>

           {/* Unified Call to Action Footer (Sticky) */}
           <div className="p-4 lg:p-8 border-t border-border/30 bg-surface flex flex-col sm:flex-row gap-3 lg:gap-4 mt-auto shrink-0 z-10">
              <button 
                 onClick={handleInternalChat}
                 className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 lg:py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20"
              >
                 <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                 <span>Chat in App</span>
              </button>
              
              <button 
                 onClick={handleWhatsAppContact}
                 className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 lg:py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg shadow-green-500/20"
              >
                 <Phone className="w-4 h-4 lg:w-5 lg:h-5" />
                 <span>WhatsApp</span>
              </button>

              {isMedicalService && onBook && (
                <button 
                   onClick={() => onBook(item.title)}
                   className="flex-1 bg-surfaceAlt hover:bg-border text-mainText py-3 lg:py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 transition-all border border-border"
                >
                   <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
                   <span>{t.book}</span>
                </button>
              )}
           </div>
        </div>
      </div>
      
      <WriteReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleAddReview}
        targetName={item.title}
      />

      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        targetName={item.title}
      />
    </div>
  );
};
