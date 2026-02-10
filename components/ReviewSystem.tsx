import React, { useState } from 'react';
import { Star, ThumbsUp, X } from 'lucide-react';
import { Review } from '../types';

// --- Review Summary Component ---
interface ReviewStatsProps {
  reviews: Review[];
  overallRating: number;
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({ reviews, overallRating }) => {
  const totalReviews = reviews.length;
  
  // Calculate distribution
  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="bg-[#181b21] border border-[#2a2e37] rounded-2xl p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center min-w-[150px]">
          <h3 className="text-5xl font-bold text-white mb-2">{overallRating.toFixed(1)}</h3>
          <div className="flex space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
               <Star 
                 key={star} 
                 className={`w-5 h-5 ${star <= Math.round(overallRating) ? 'text-amber-400 fill-current' : 'text-gray-600'}`} 
               />
            ))}
          </div>
          <p className="text-sm text-gray-400">{totalReviews} Reviews</p>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 w-full space-y-2">
           {distribution.map((dist) => (
             <div key={dist.stars} className="flex items-center text-xs">
                <span className="w-8 text-gray-400 font-bold flex items-center">
                  {dist.stars} <Star className="w-3 h-3 ml-1" />
                </span>
                <div className="flex-1 mx-3 h-2 bg-[#0f1117] rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-amber-400 rounded-full" 
                     style={{ width: `${dist.percentage}%` }}
                   />
                </div>
                <span className="w-8 text-right text-gray-500">{dist.count}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- Review List Component ---
interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-[#181b21] border border-[#2a2e37] rounded-2xl p-6 transition-all hover:border-[#3f4552]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                 {review.authorAvatar ? (
                   <img src={review.authorAvatar} alt={review.authorName} className="w-full h-full rounded-full object-cover" />
                 ) : (
                   review.authorName.substring(0, 2).toUpperCase()
                 )}
               </div>
               <div>
                 <h4 className="font-bold text-white text-sm">{review.authorName}</h4>
                 <div className="flex items-center text-xs text-gray-500 mt-0.5">
                   <span className="mr-2">{review.date}</span>
                 </div>
               </div>
            </div>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-700'}`} 
                />
              ))}
            </div>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {review.comment}
          </p>

          <div className="flex items-center space-x-4 text-xs text-gray-500">
             <button className="flex items-center space-x-1 hover:text-white transition-colors">
               <ThumbsUp className="w-3.5 h-3.5" />
               <span>Helpful ({review.helpfulCount})</span>
             </button>
             <button className="hover:text-white transition-colors">Report</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Write Review Modal ---
interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  targetName: string;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({ isOpen, onClose, onSubmit, targetName }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#13151b] border border-[#2a2e37] rounded-2xl shadow-2xl p-6 animate-scale-up">
         <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white">
           <X className="w-6 h-6" />
         </button>

         <h2 className="text-xl font-bold text-white mb-2">Review {targetName}</h2>
         <p className="text-sm text-gray-400 mb-6">Share your experience with the community.</p>

         <div className="flex justify-center mb-6 space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star 
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating) 
                      ? 'text-amber-400 fill-current' 
                      : 'text-gray-700'
                  }`} 
                />
              </button>
            ))}
         </div>
         <p className="text-center text-sm font-bold text-amber-400 mb-6 h-5">
           {hoverRating === 1 ? 'Poor' : 
            hoverRating === 2 ? 'Fair' : 
            hoverRating === 3 ? 'Good' : 
            hoverRating === 4 ? 'Very Good' : 
            hoverRating === 5 ? 'Excellent' : 
            rating > 0 ? (rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : 'Rated') : ''}
         </p>

         <div className="space-y-2 mb-6">
           <label className="text-xs font-bold text-gray-500 uppercase">Your Review</label>
           <textarea 
             rows={4}
             value={comment}
             onChange={(e) => setComment(e.target.value)}
             placeholder="Tell us more about your experience..."
             className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 resize-none text-sm"
           />
         </div>

         <button 
           onClick={handleSubmit}
           disabled={rating === 0}
           className={`w-full py-3 rounded-xl font-bold transition-all ${
             rating > 0 
               ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
               : 'bg-[#2a2e37] text-gray-500 cursor-not-allowed'
           }`}
         >
           Submit Review
         </button>
      </div>
    </div>
  );
};
