import React, { useState, useRef } from 'react';
import { X, User, Upload, Globe, Facebook, Instagram, Save, Music } from 'lucide-react';
import { LocationInput } from './LocationInput';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#13151b] border border-[#2a2e37] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
        <div className="flex justify-between items-center p-6 border-b border-[#2a2e37]">
          <div className="flex items-center space-x-3">
             <User className="w-5 h-5 text-indigo-400" />
             <h2 className="text-xl font-bold text-white">Modifier le Profil</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Avatar Section */}
          <div className="space-y-2">
             <div className="flex justify-between items-center">
               <label className="text-sm font-medium text-gray-300 flex items-center"><span className="w-4 h-4 mr-2 inline-block">🖼️</span> Profile Picture</label>
               <div className="flex space-x-2 text-xs">
                 <button 
                   onClick={handleUploadClick}
                   className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-500 transition-colors"
                 >
                   UPLOAD
                 </button>
                 <button className="bg-[#181b21] text-gray-400 px-3 py-1 rounded-md border border-[#2a2e37]">URL</button>
               </div>
             </div>
             
             {/* Hidden File Input */}
             <input 
               type="file" 
               ref={fileInputRef}
               className="hidden" 
               accept="image/png, image/jpeg"
               onChange={handleFileChange}
             />

             <div className="flex items-center space-x-6">
                <div className="relative group cursor-pointer" onClick={handleUploadClick}>
                   <div className="w-20 h-20 rounded-full bg-black border-2 border-[#2a2e37] flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                     {previewUrl ? (
                       <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                       "US"
                     )}
                   </div>
                   <button className="absolute bottom-0 right-0 bg-indigo-600 p-1.5 rounded-full border-2 border-[#13151b] text-white group-hover:scale-110 transition-transform">
                      <Upload className="w-3 h-3" />
                   </button>
                </div>
                <div 
                  onClick={handleUploadClick}
                  className="flex-1 border-2 border-dashed border-[#2a2e37] rounded-xl h-20 flex flex-col items-center justify-center text-gray-500 text-sm cursor-pointer hover:border-gray-500 hover:bg-[#181b21] transition-all"
                >
                   <p>Click to upload new picture</p>
                   <p className="text-[10px] text-gray-600 mt-1">JPG, PNG • Max 5MB</p>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Basic Information</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-sm text-gray-300 flex items-center"><User className="w-3 h-3 mr-1.5" /> Nom complet</label>
                   <input type="text" defaultValue="User" className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm text-gray-300 flex items-center"><span className="w-3 h-3 mr-1.5">📞</span> Numéro de téléphone</label>
                   <input type="text" defaultValue="0550..." className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-sm text-gray-300 flex items-center"><span className="w-3 h-3 mr-1.5">📍</span> Adresse</label>
                <LocationInput placeholder="e.g. Sidi Yahia, Alger" />
             </div>
             <div className="space-y-2">
                <label className="text-sm text-gray-300 flex items-center"><span className="w-3 h-3 mr-1.5">📄</span> Biographie</label>
                <textarea placeholder="Tell us about yourself or your store..." rows={3} className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 resize-none" />
             </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#2a2e37]">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Liens Sociaux</h3>
             <div className="space-y-2">
                <label className="text-sm text-gray-300 flex items-center"><Globe className="w-3 h-3 mr-1.5" /> Site Web</label>
                <input type="text" placeholder="https://mysite.com" className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
             </div>
             <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                   <label className="text-sm text-gray-300 flex items-center"><Facebook className="w-3 h-3 mr-1.5" /> Facebook</label>
                   <input type="text" placeholder="Username" className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm text-gray-300 flex items-center"><Instagram className="w-3 h-3 mr-1.5" /> Instagram</label>
                   <input type="text" placeholder="Username" className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm text-gray-300 flex items-center"><Music className="w-3 h-3 mr-1.5" /> TikTok</label>
                   <input type="text" placeholder="Username" className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
             </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#2a2e37] flex justify-between items-center bg-[#181b21]">
          <button onClick={onClose} className="text-gray-400 hover:text-white font-medium">Cancel</button>
          <button 
            onClick={onSave}
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center space-x-2"
          >
             <Save className="w-4 h-4" />
             <span>Enregistrer les modifications</span>
          </button>
        </div>
      </div>
    </div>
  );
};