import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Type, ChevronDown, Tag } from 'lucide-react';
import { LocationInput } from './LocationInput';

export interface NewEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  category: string;
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewEventData) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [category, setCategory] = useState('');

  if (!isOpen) return null;

  const dateOptions = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    let label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (i === 0) label = `Today (${label})`;
    if (i === 1) label = `Tomorrow (${label})`;
    return { value: d.toISOString(), label };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      date,
      location,
      maxParticipants: parseInt(maxParticipants) || 50,
      category: category || 'Charity'
    });
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setMaxParticipants('');
    setCategory('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#13151b] border border-[#2a2e37] rounded-2xl shadow-2xl p-6 animate-scale-up max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Launch a Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Campaign Title</label>
            <div className="relative">
              <Type className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Beach Cleanup Drive"
                className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-500 pointer-events-none" />
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl pl-10 pr-10 py-3 text-white focus:outline-none focus:border-red-500 appearance-none cursor-pointer"
              >
                <option value="">Select category</option>
                <option value="Charity">Charity Event</option>
                <option value="Awareness">Awareness Campaign</option>
                <option value="Civil Action">Civil Action</option>
                <option value="Environment">Environment</option>
                <option value="Health">Health Campaign</option>
                <option value="Education">Education</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea 
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the campaign..."
              className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-500 pointer-events-none" />
              <select
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl pl-10 pr-10 py-3 text-white focus:outline-none focus:border-red-500 appearance-none cursor-pointer"
              >
                <option value="">Select a date</option>
                {dateOptions.map((option, idx) => (
                  <option key={idx} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Location</label>
            <LocationInput 
              placeholder="Select location" 
              value={location}
              onChange={setLocation}
            />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-300">Max Participants</label>
             <div className="relative">
                <Users className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input 
                  type="number"
                  placeholder="50"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-red-500"
                />
             </div>
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-xl font-bold mt-4 transition-all shadow-lg shadow-red-500/20">
            🚀 Launch Campaign
          </button>
        </form>
      </div>
    </div>
  );
};