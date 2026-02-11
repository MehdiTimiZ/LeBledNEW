
import React from 'react';

interface BaseCardProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  isFlipped?: boolean;
  backContent?: React.ReactNode;
  variant?: 'grid' | 'list';
}

/**
 * Universal Card Component
 * Provides consistent rounded corners, borders, and hover effects.
 * Supports 3D flip animation if backContent is provided.
 */
export const BaseCard: React.FC<BaseCardProps> = ({ 
  children, 
  onClick, 
  className = '', 
  isFlipped = false, 
  backContent,
  variant = 'grid'
}) => {
  const containerClasses = `
    relative overflow-hidden transition-all duration-500 ease-out
    bg-[#13151b] border border-[#2a2e37] rounded-[2rem]
    hover:border-[#3f4552] shadow-lg hover:shadow-2xl
    ${variant === 'list' ? 'flex flex-row' : 'flex flex-col'}
    ${className}
  `;

  // If backContent is provided, wrap in 3D perspective container
  if (backContent) {
    return (
      <div 
        className={`relative perspective-1000 cursor-pointer w-full h-full`}
        onClick={onClick}
      >
        <div className={`
          relative w-full h-full transition-all duration-700 transform-style-3d 
          ${isFlipped ? 'rotate-y-180' : ''}
        `}>
          {/* Front Face */}
          <div className={`absolute inset-0 w-full h-full backface-hidden ${containerClasses}`}>
            {children}
          </div>

          {/* Back Face */}
          <div className={`
            absolute inset-0 w-full h-full backface-hidden rotate-y-180 
            bg-[#181b21] border border-indigo-500/30 rounded-[2rem] p-6 flex flex-col shadow-2xl
          `}>
            {backContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClasses} cursor-pointer`} onClick={onClick}>
      {children}
    </div>
  );
};

export const CardMedia: React.FC<{ 
  src?: string; 
  alt?: string; 
  children?: React.ReactNode; 
  className?: string;
  variant?: 'grid' | 'list';
}> = ({ src, alt, children, className = '', variant = 'grid' }) => (
  <div className={`
    relative overflow-hidden bg-black/40 shrink-0
    ${variant === 'list' ? 'w-32 md:w-48 h-full' : 'h-48'}
    ${className}
  `}>
    {src && (
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
      />
    )}
    {children}
  </div>
);

export const CardBody: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`p-5 flex-1 flex flex-col ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`mt-auto pt-4 border-t border-[#2a2e37]/50 flex items-center justify-between gap-3 ${className}`}>
    {children}
  </div>
);

export const CardLabel: React.FC<{ 
  children: React.ReactNode; 
  color?: 'indigo' | 'emerald' | 'amber' | 'red' | 'gray';
  className?: string;
}> = ({ children, color = 'indigo', className = '' }) => {
  const variants = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    gray: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <span className={`
      px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-l-4
      ${variants[color]} ${className}
    `}>
      {children}
    </span>
  );
};
