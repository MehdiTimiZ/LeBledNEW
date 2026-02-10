import React, { useState } from 'react';
import { Plus, Globe, Heart, MapPin, MessageCircle, UserPlus, Sprout, Check, X, Gift, Search, Filter, Loader2 } from 'lucide-react';
import { CreateEventModal, NewEventData } from './CreateEventModal';
import { CharityEvent } from '../types';

interface CharityProps {
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onContact: (recipient: string, message?: string) => void;
  events: CharityEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CharityEvent[]>>;
}

export const Charity: React.FC<CharityProps> = ({ notify, onContact, events, setEvents }) => {
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleJoinToggle = (id: string) => {
    const isJoined = joinedEvents.includes(id);
    if (isJoined) {
      setJoinedEvents(joinedEvents.filter(eventId => eventId !== id));
      setEvents(events.map(ev => ev.id === id ? { ...ev, joined: ev.joined - 1 } : ev));
      notify('Vous avez quitté l\'événement.', 'info');
    } else {
      setJoinedEvents([...joinedEvents, id]);
      setEvents(events.map(ev => ev.id === id ? { ...ev, joined: ev.joined + 1 } : ev));
      notify('Inscription réussie !', 'success');
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-[#1a2e05] to-[#0f1a03] border border-[#2f400f] min-h-[350px] flex flex-col md:flex-row items-center p-12 gap-12 shadow-2xl">
        <div className="relative z-10 flex-1">
          <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/20 uppercase tracking-widest mb-4 inline-block">Civil Mob</span>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Civic Action Hub</h1>
          <p className="text-xl text-green-200/70 mb-8 max-w-xl">Rejoignez des campagnes de quartier ou lancez votre propre mouvement solidaire.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-white text-green-900 px-8 py-4 rounded-3xl font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-green-900/40">
              <Plus className="w-5 h-5" /> Créer un Événement
            </button>
            <button onClick={() => setIsScraping(!isScraping)} className="bg-green-950/50 border border-green-800/50 text-green-200 px-8 py-4 rounded-3xl font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md transition-all">
              {isScraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />} Live Sync
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => {
          const isJoined = joinedEvents.includes(event.id);
          const isLiked = likedEvents.includes(event.id);
          const progress = Math.min(100, Math.round((event.joined / event.goal) * 100));
          
          return (
            <div key={event.id} className="bg-[#13151b] border border-[#2a2e37] rounded-3xl overflow-hidden group hover:border-[#3f4552] transition-all flex flex-col shadow-lg hover:shadow-2xl">
              <div className="h-48 flex items-center justify-center bg-gradient-to-b from-[#181b21] to-[#13151b] relative">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl border ${event.category === 'Environment' ? 'bg-green-500/20 border-green-500/30 text-green-500' : 'bg-pink-500/20 border-pink-500/30 text-pink-500'}`}>
                  {event.category === 'Environment' ? <Sprout className="w-10 h-10" /> : <Gift className="w-10 h-10" />}
                </div>
                <div className="absolute top-4 right-4">
                  <button onClick={() => setLikedEvents(prev => prev.includes(event.id) ? prev.filter(id => id !== event.id) : [...prev, event.id])} className={`p-2 rounded-xl backdrop-blur-md border border-white/5 transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}>
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-gray-300 text-[10px] font-bold px-3 py-1 rounded-xl uppercase tracking-widest">{event.category}</span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors leading-tight">{event.title}</h3>
                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">
                  <MapPin className="w-3 h-3 mr-1 text-green-500" /> {event.location}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>{event.joined} Membres</span>
                    <span>Objectif : {event.goal}</span>
                  </div>
                  <div className="h-2 bg-[#0f1117] rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(34,197,94,0.4)]" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-[#2a2e37]/50 flex items-center justify-between gap-3">
                  <button 
                    onClick={() => handleJoinToggle(event.id)}
                    className={`flex-1 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isJoined ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-green-600 text-white shadow-xl shadow-green-900/20'}`}
                  >
                    {isJoined ? <X className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />} {isJoined ? 'Annuler' : 'Rejoindre'}
                  </button>
                  <button 
                    onClick={() => onContact(`Org: ${event.title}`)}
                    className="p-3 bg-[#181b21] border border-[#2a2e37] rounded-2xl text-gray-400 hover:text-white transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <CreateEventModal 
         isOpen={isCreateModalOpen}
         onClose={() => setIsCreateModalOpen(false)}
         onSubmit={(data) => {
            const newEvent: CharityEvent = {
              id: `event-${Date.now()}`,
              title: data.title,
              location: data.location,
              joined: 1,
              goal: data.maxParticipants,
              progress: Math.round((1/data.maxParticipants)*100),
              category: 'Environment'
            };
            setEvents(prev => [newEvent, ...prev]);
            setJoinedEvents(prev => [...prev, newEvent.id]);
            setIsCreateModalOpen(false);
            notify('Event created successfully!', 'success');
         }}
      />

    </div>
  );
};
