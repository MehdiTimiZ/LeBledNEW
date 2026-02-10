import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
  recipient?: string;
  initialMessage?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ 
  isOpen, 
  onClose, 
  onSend, 
  recipient = "Seller", 
  initialMessage = "" 
}) => {
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    if (isOpen) {
      setMessage(initialMessage);
    }
  }, [isOpen, initialMessage]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#13151b] border border-[#2a2e37] rounded-2xl shadow-2xl p-6 animate-scale-up">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
               <MessageSquare className="w-5 h-5" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-white">Contact {recipient}</h2>
               <p className="text-xs text-gray-400">Typically replies within 1 hour</p>
             </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            required
            autoFocus
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi, is this still available?`}
            className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 resize-none"
          />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2">
            <Send className="w-5 h-5" />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );
};