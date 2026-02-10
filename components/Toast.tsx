import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const bgColors = {
    success: 'bg-[#13151b] border-green-500/30',
    error: 'bg-[#13151b] border-red-500/30',
    info: 'bg-[#13151b] border-blue-500/30'
  };

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[200] flex items-center space-x-3 px-6 py-4 rounded-xl border shadow-2xl animate-fade-in-up ${bgColors[type]}`}>
      {icons[type]}
      <p className="text-white font-medium">{message}</p>
      <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors ml-4">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};