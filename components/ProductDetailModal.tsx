import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Share2, Flag, MessageCircle, ChevronLeft, ChevronRight, ShieldCheck, BadgeCheck, Star, Clock, ImageOff, Edit3, Heart, Maximize2, Link2 } from 'lucide-react';
import { MarketplaceItem, Review } from '../types';
import { MOCK_REVIEWS, TRANSLATIONS } from '../constants';
import { ReviewList, WriteReviewModal } from './ReviewSystem';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MarketplaceItem | null;
  onContact?: (recipient: string) => void;
  onBook?: (itemName: string) => void;
  language?: 'FR' | 'EN';
  onViewProfile?: () => void;
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
    const shareData = {
      title: item.title,
      text: `Découvrez ce ${item.title} sur LeBled !`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien de l\'annonce copié !');
    }
  };

  const handleReport = () => {
    alert('Signalement : Merci de nous aider à maintenir la communauté sûre.');
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
        onViewProfile();
        onClose();
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-6xl bg-[#0f1117] border border-[#2a2e37] rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row max-h-[92vh] overflow-hidden animate-scale-up">
        
        {/* Left Column: Centered Media Section */}
        <div className="w-full lg:w-3/5 bg-black/20 relative flex flex-col h-full border-r border-[#2a2e37]/30">
           <div className="flex-1 relative flex items-center justify-center p-8 lg:p-12">
             <div className="relative w-full h-full flex items-center justify-center group">
               {!imgError ? (
                 <img 
                   src={images[activeImageIndex]} 
                   alt={item.title} 
                   className="max-w-full max-h-full object-contain rounded-[2rem] shadow-2xl transition-transform duration-700"
                   onError={() => setImgError(true)}
                 />
               ) : (
                 <div className="flex flex-col items-center justify-center text-gray-700 bg-[#181b21] w-full h-full rounded-[2rem] border border-dashed border-[#2a2e37]">
                   <ImageOff className="w-16 h-16 mb-4 opacity-30" />
                   <span className="text-xs font-black uppercase tracking-[0.2em] opacity-30">Média indisponible</span>
                 </div>
               )}
               
               {/* Expand Controls */}
               <button className="absolute bottom-6 right-6 p-3 bg-black/40 hover:bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all border border-white/5 backdrop-blur-md">
                 <Maximize2 className="w-5 h-5" />
               </button>

               {/* Navigation */}
               {images.length > 1 && (
                 <>
                   <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all border border-white/5 backdrop-blur-md"
                   >
                     <ChevronLeft className="w-6 h-6" />
                   </button>
                   <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all border border-white/5 backdrop-blur-md"
                   >
                     <ChevronRight className="w-6 h-6" />
                   </button>
                 </>
               )}
             </div>
           </div>

           {/* Centered Horizontal Thumbnails */}
           {images.length > 1 && (
             <div className="h-28 flex items-center justify-center space-x-4 p-5 overflow-x-auto no-scrollbar border-t border-[#2a2e37]/30">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setActiveImageIndex(idx); setImgError(false); }}
                    className={`relative h-16 w-16 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-black/20 ${
                       activeImageIndex === idx ? 'border-indigo-500 scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumb ${idx}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
             </div>
           )}
        </div>

        {/* Right Column: Info & Premium Controls */}
        <div className="w-full lg:w-2/5 flex flex-col h-full bg-[#13151b]">
           {/* Top Control Bar Integrated into Info Column */}
           <div className="p-6 md:p-8 flex items-center justify-between border-b border-[#2a2e37]/30">
              <div className="flex items-center space-x-3">
                 <span className="flex items-center bg-[#181b21] px-3 py-1.5 rounded-full border border-[#2a2e37] text-[10px] font-black tracking-widest text-gray-500 uppercase">
                    <MapPin className="w-3 h-3 mr-2 text-indigo-400" /> {item.location}
                 </span>
                 <span className="flex items-center bg-[#181b21] px-3 py-1.5 rounded-full border border-[#2a2e37] text-[10px] font-black tracking-widest text-gray-500 uppercase">
                    <Calendar className="w-3 h-3 mr-2 text-indigo-400" /> {item.date}
                 </span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2.5 rounded-xl transition-all border border-white/5 ${isLiked ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-[#181b21] text-gray-400 hover:text-white'}`}
                  title="Like"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2.5 bg-[#181b21] hover:bg-[#2a2e37] text-gray-400 hover:text-white rounded-xl transition-all border border-white/5"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleReport}
                  className="p-2.5 bg-[#181b21] hover:bg-[#2a2e37] text-gray-400 hover:text-white rounded-xl transition-all border border-white/5"
                  title="Flag"
                >
                  <Flag className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2.5 bg-[#181b21] hover:bg-[#2a2e37] text-gray-400 hover:text-white rounded-xl transition-all border border-white/5"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="space-y-4">
                 <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                   {item.title}
                 </h1>
                 <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500 tracking-tighter">
                    {item.price}
                 </div>
              </div>

              {/* Seller premium card */}
              <div 
                className="bg-[#181b21] rounded-3xl p-6 border border-[#2a2e37] flex justify-between items-center cursor-pointer hover:border-indigo-500/40 transition-all group"
                onClick={handleViewProfile}
              >
                 <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-2xl border border-indigo-500/20 relative">
                       {item.seller.avatar ? <img src={item.seller.avatar} alt={item.seller.name} className="w-full h-full rounded-2xl object-cover" /> : item.seller.name.substring(0, 2).toUpperCase()}
                       <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#181b21]"></div>
                    </div>
                    <div>
                       <div className="flex items-center">
                          <h3 className="font-black text-white text-lg group-hover:text-indigo-400 transition-colors">{item.seller.name}</h3>
                          {item.seller.verified && <BadgeCheck className="w-5 h-5 text-blue-400 ml-2" />}
                       </div>
                       <div className="flex items-center text-xs text-gray-500 mt-1 font-bold">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-current mr-1.5" />
                          <span className="mr-2">{item.seller.rating || 'New'}</span>
                          <span className="w-1 h-1 bg-gray-700 rounded-full mr-2"></span>
                          <span>Active 2h ago</span>
                       </div>
                    </div>
                 </div>
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                    {t.viewProfile}
                 </span>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">{t.description}</h3>
                 <p className="text-gray-300 leading-relaxed text-sm bg-[#181b21]/30 p-6 rounded-[2rem] border border-[#2a2e37]/20">
                    {item.description || "Aucune description fournie pour cet article."}
                 </p>
              </div>

              {/* Reviews Section */}
              <div className="pt-4 space-y-6">
                 <div className="flex justify-between items-center">
                   <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">AVIS ({itemReviews.length})</h3>
                   <button 
                     onClick={() => setIsReviewModalOpen(true)}
                     className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 flex items-center bg-indigo-500/10 px-4 py-2 rounded-xl transition-all"
                   >
                     <Edit3 className="w-3.5 h-3.5 mr-2" /> {t.writeReview}
                   </button>
                 </div>
                 
                 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {itemReviews.length > 0 ? (
                      <ReviewList reviews={itemReviews} />
                    ) : (
                      <div className="text-center py-10 bg-[#181b21]/20 rounded-[2rem] border border-dashed border-[#2a2e37]">
                        <p className="text-xs text-gray-600 font-bold uppercase tracking-widest italic">Soyez le premier à donner votre avis !</p>
                      </div>
                    )}
                 </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-emerald-500/5 rounded-[2rem] p-6 border border-emerald-500/10">
                 <h3 className="text-[10px] font-black text-emerald-400 flex items-center mb-4 tracking-[0.2em] uppercase ml-1">
                    <ShieldCheck className="w-5 h-5 mr-3" /> {t.safetyTips}
                 </h3>
                 <ul className="text-xs text-gray-400 space-y-3 font-bold">
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-4"></span> Rencontrez-vous dans un lieu public</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-4"></span> Vérifiez l'article avant de payer</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-4"></span> Ne payez jamais à l'avance</li>
                 </ul>
              </div>
           </div>

           {/* Call to Action Footer */}
           <div className="p-8 border-t border-[#2a2e37]/30 bg-[#181b21] flex gap-4 mt-auto">
              <button 
                 onClick={() => onContact && onContact(item.title)}
                 className={`flex-1 bg-[#2a2e37] hover:bg-[#343944] text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 transition-all active:scale-[0.98] ${isMedicalService ? 'w-1/3' : 'w-full'}`}
              >
                 <MessageCircle className="w-5 h-5" />
                 <span>{t.contact}</span>
              </button>
              
              {isMedicalService && onBook && (
                <button 
                   onClick={() => onBook(item.title)}
                   className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 shadow-2xl shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                   <Clock className="w-5 h-5" />
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
    </div>
  );
};