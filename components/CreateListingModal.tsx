import React, { useState, useEffect } from 'react';
import { X, Upload, Wand2, Calendar, Clock, ChevronDown } from 'lucide-react';
import { LocationInput } from './LocationInput';
import { TRANSLATIONS } from '../constants';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  language?: 'FR' | 'EN' | 'AR';
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({ 
  isOpen, 
  onClose, 
  initialCategory = 'Vehicles',
  language = 'FR'
}) => {
  const [category, setCategory] = useState(initialCategory);
  const [availability, setAvailability] = useState({
    days: [] as string[],
    startTime: '09:00',
    endTime: '17:00'
  });

  const t = TRANSLATIONS[language]?.ui || TRANSLATIONS['FR'].ui;

  useEffect(() => {
    if (isOpen) {
      setCategory(initialCategory);
    }
  }, [isOpen, initialCategory]);

  if (!isOpen) return null;

  const handleDayToggle = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderDynamicFields = () => {
    switch (category) {
      case 'Vehicles':
        return (
          <div className="grid grid-cols-2 gap-4 animate-fade-in p-4 bg-[#181b21] rounded-xl border border-[#2a2e37] mb-6">
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.year}</label>
                <input type="number" placeholder="2024" className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm" />
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.fuel}</label>
                <div className="relative">
                  <select className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer">
                     <option>Essence</option>
                     <option>Diesel</option>
                     <option>GPL</option>
                     <option>Hybrid</option>
                     <option>Electric</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.transmission}</label>
                <div className="relative">
                  <select className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer">
                     <option>Manual</option>
                     <option>Automatic</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.kilometers}</label>
                <input type="number" placeholder="0" className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm" />
             </div>
          </div>
        );
      case 'Real Estate':
        return (
          <div className="grid grid-cols-2 gap-4 animate-fade-in p-4 bg-[#181b21] rounded-xl border border-[#2a2e37] mb-6">
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.propertyType}</label>
                <div className="relative">
                  <select className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer">
                     <option>Apartment</option>
                     <option>Villa</option>
                     <option>Studio</option>
                     <option>Land</option>
                     <option>Commercial</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.area} (m²)</label>
                <input type="number" placeholder="100" className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm" />
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.rooms}</label>
                <div className="relative">
                  <select className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer">
                     <option>F1</option>
                     <option>F2</option>
                     <option>F3</option>
                     <option>F4</option>
                     <option>F5+</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.floor}</label>
                <input type="number" placeholder="1" className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm" />
             </div>
          </div>
        );
      case 'Phones':
      case 'Computing':
         return (
          <div className="grid grid-cols-2 gap-4 animate-fade-in p-4 bg-[#181b21] rounded-xl border border-[#2a2e37] mb-6">
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.brand}</label>
                <input type="text" placeholder="e.g. Apple, Samsung" className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm" />
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.condition}</label>
                <div className="relative">
                  <select className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer">
                     <option>New (Sealed)</option>
                     <option>Like New</option>
                     <option>Good</option>
                     <option>Fair</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
             </div>
          </div>
         );
      case 'Medical Services':
         return (
          <div className="bg-[#181b21] border border-emerald-500/30 rounded-xl p-4 space-y-4 mb-6 animate-fade-in">
              <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                <Calendar className="w-5 h-5" />
                <h3 className="font-bold">{t.booking}</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.availableDays}</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        availability.days.includes(day)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#2a2e37] text-gray-400 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t.startTime}</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="time" 
                      value={availability.startTime}
                      onChange={(e) => setAvailability({...availability, startTime: e.target.value})}
                      className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t.endTime}</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="time" 
                      value={availability.endTime}
                      onChange={(e) => setAvailability({...availability, endTime: e.target.value})}
                      className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
          </div>
         );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#13151b] border border-[#2a2e37] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#2a2e37]">
          <h2 className="text-xl font-bold text-white">{t.createListing}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t.title}</label>
            <input 
              type="text" 
              placeholder={category === 'Medical Services' ? "e.g. Cabinet Dr. Amrani" : "e.g. Peugeot 208 GT Line"}
              className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{t.category}</label>
                <div className="relative">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="Vehicles">Vehicles</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Phones">Phones</option>
                    <option value="Medical Services">Medical Services</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home">Home</option>
                    <option value="Computing">Computing</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
             </div>
             <div className="space-y-2">
                <LocationInput label={t.location} value="Alger" />
             </div>
          </div>

          {/* Dynamic Fields based on category */}
          {renderDynamicFields()}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t.price} ({category === 'Medical Services' ? 'Consultation Fee' : 'Item Price'})</label>
            <input 
              type="number" 
              placeholder="0" 
              className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
             <div className="flex justify-between items-center">
               <label className="text-sm font-medium text-gray-300">Image</label>
               <div className="flex space-x-2 text-xs">
                 <button className="bg-indigo-600 text-white px-3 py-1 rounded-md">{t.uploadImage}</button>
                 <button className="bg-[#181b21] text-gray-400 px-3 py-1 rounded-md border border-[#2a2e37]">URL</button>
               </div>
             </div>
             <div className="border-2 border-dashed border-[#2a2e37] rounded-xl p-8 flex flex-col items-center justify-center bg-[#0f1117] hover:border-gray-500 transition-colors cursor-pointer group">
               <div className="w-12 h-12 rounded-full bg-[#181b21] flex items-center justify-center mb-3 group-hover:bg-[#2a2e37]">
                 <Upload className="w-6 h-6 text-gray-400" />
               </div>
               <p className="text-sm text-gray-400">Click or drag to upload image</p>
               <p className="text-[10px] text-gray-600 mt-2">Max 5MB per file • 5 pictures limit</p>
             </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">{t.description}</label>
              <div className="flex items-center space-x-2 text-xs text-indigo-400 cursor-pointer hover:text-indigo-300">
                <Wand2 className="w-3 h-3" />
                <span>Use AI Assistant</span>
              </div>
            </div>
            <textarea 
              placeholder="Describe your service or item..."
              rows={4}
              className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2a2e37] flex justify-end">
           <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all">
             {t.publish}
           </button>
        </div>
      </div>
    </div>
  );
};