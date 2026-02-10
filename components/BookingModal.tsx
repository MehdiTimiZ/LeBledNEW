import React, { useState } from 'react';
import { X, Calendar, Clock, Check } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time) {
      onConfirm();
      onClose();
    }
  };

  const timeSlots = [
    "09:00", "10:00", "11:00", 
    "13:00", "14:00", "15:00", 
    "16:00", "17:00"
  ];

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#13151b] border border-[#2a2e37] rounded-2xl shadow-2xl p-6 animate-scale-up">
        <div className="flex justify-between items-center mb-6">
          <div>
             <h2 className="text-xl font-bold text-white">Book Appointment</h2>
             {itemName && <p className="text-sm text-gray-400 mt-1">For: <span className="text-emerald-400 font-medium">{itemName}</span></p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Select Date</label>
            <div className="relative" onClick={() => (document.getElementById('date-input') as HTMLInputElement)?.showPicker()}>
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-500 pointer-events-none" />
              <input 
                id="date-input"
                type="date" 
                required
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Select Time</label>
            <div className="grid grid-cols-4 gap-2">
               {timeSlots.map(slot => (
                 <button
                   key={slot}
                   type="button"
                   onClick={() => setTime(slot)}
                   className={`py-2 rounded-lg text-sm font-medium transition-all ${
                     time === slot 
                       ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                       : 'bg-[#0f1117] border border-[#2a2e37] text-gray-400 hover:text-white hover:border-gray-500'
                   }`}
                 >
                   {slot}
                 </button>
               ))}
            </div>
            {!time && <p className="text-xs text-red-400 mt-1 pl-1">Please select a time slot</p>}
          </div>

          <button 
            type="submit" 
            disabled={!date || !time}
            className={`w-full py-3.5 rounded-xl font-bold mt-4 flex items-center justify-center space-x-2 transition-all ${
              date && time 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                : 'bg-[#2a2e37] text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5" />
            <span>Confirm Booking</span>
          </button>
        </form>
      </div>
    </div>
  );
};