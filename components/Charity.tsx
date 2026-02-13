
import React, { useState } from 'react';
import { Plus, Globe, Heart, MapPin, MessageCircle, UserPlus, Sprout, Check, X, Gift, Search, Filter, Loader2, Megaphone, AlertTriangle, ExternalLink } from 'lucide-react';
import { CreateEventModal, NewEventData } from './CreateEventModal';
import { CharityEvent } from '../types';
import { BaseCard, CardMedia, CardBody, CardFooter, CardLabel } from './BaseCard';
import { findCharityEvents } from '../services/geminiService';

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

  const handleCreateEvent = (data: NewEventData) => {
    const newEvent: CharityEvent = {
      id: `campaign-${Date.now()}`,
      title: data.title,
      location: data.location,
      joined: 0,
      goal: data.maxParticipants,
      progress: 0,
      category: data.category,
      description: data.description,
    };
    setEvents(prev => [newEvent, ...prev]);
    setIsCreateModalOpen(false);
    notify('Campaign launched successfully! 🚀', 'success');
  };

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

  const handleLiveSync = async () => {
    setIsScraping(true);
    notify('Syncing live events from web...', 'info');
    
    try {
        const externalEvents = await findCharityEvents("Algeria");
        if (externalEvents.length > 0) {
            const mappedEvents: CharityEvent[] = externalEvents.map((ev, index) => ({
                id: `ext-${Date.now()}-${index}`,
                title: ev.title,
                location: ev.location,
                joined: 0,
                goal: 100, // Default goal
                progress: 0,
                category: ev.category || 'Charity',
                description: ev.description,
                isExternal: true,
                sourceUrl: ev.link || '#' // Assuming source link might be available
            }));
            
            // Avoid duplicates based on title
            const newEvents = mappedEvents.filter(ne => !events.some(e => e.title === ne.title));
            
            setEvents([...newEvents, ...events]);
            notify(`Found ${newEvents.length} new events!`, 'success');
        } else {
            notify('No new events found at this time.', 'info');
        }
    } catch (e) {
        console.error(e);
        notify('Failed to sync events.', 'error');
    } finally {
        setIsScraping(false);
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-[#450a0a] to-[#1a0505] border border-red-900/50 min-h-[350px] flex flex-col md:flex-row items-center p-12 gap-12 shadow-[0_0_50px_-10px_rgba(239,68,68,0.3)]">
        <div className="relative z-10 flex-1">
          <CardLabel color="red" className="mb-4 inline-block bg-red-500/20 text-red-300 border-red-500/30">Civil Alert</CardLabel>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter flex items-center gap-3">
             <AlertTriangle className="w-12 h-12 text-red-500" />
             Civic Action Hub
          </h1>
          <p className="text-xl text-red-200/70 mb-8 max-w-xl">Urgent community needs. Join campaigns or launch a solidarity movement now.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-red-900/40">
              <Megaphone className="w-5 h-5" /> Launch Campaign
            </button>
            <button 
                onClick={handleLiveSync} 
                disabled={isScraping}
                className="bg-red-950/50 border border-red-800/50 text-red-200 px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md transition-all hover:bg-red-900/50"
            >
              {isScraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />} 
              {isScraping ? "Syncing..." : "Dir el Khir Live"}
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
            <BaseCard key={event.id} className="border border-red-900/30 hover:border-red-500/50">
              <CardMedia className="flex items-center justify-center bg-gradient-to-b from-[#2a0a0a] to-[#13151b]">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl border ${event.category === 'Environment' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-500'}`}>
                  {event.category === 'Environment' ? <Sprout className="w-10 h-10" /> : <Gift className="w-10 h-10" />}
                </div>
                <div className="absolute top-4 right-4">
                  <button onClick={() => setJoinedEvents(prev => prev.includes(event.id) ? prev : [...prev, event.id])} className={`p-2 rounded-xl backdrop-blur-md border border-white/5 transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}>
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
                {event.isExternal && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Web Result
                    </div>
                )}
                <CardLabel color="red" className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border-red-500/30 text-red-400">
                  {event.category}
                </CardLabel>
              </CardMedia>

              <CardBody>
                <h3 className="text-xl font-black text-white mb-2 group-hover:text-red-400 transition-colors leading-tight">{event.title}</h3>
                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
                  <MapPin className="w-3 h-3 mr-1 text-red-500" /> {event.location}
                </div>
                
                {event.description && (
                    <p className="text-sm text-gray-400 mb-6 line-clamp-3">{event.description}</p>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span className="text-red-300">{event.joined} Volunteers</span>
                    <span>Goal: {event.goal}</span>
                  </div>
                  <div className="h-2 bg-[#0f1117] rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-red-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(220,38,38,0.5)]" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <CardFooter>
                  {event.isExternal ? (
                      <button 
                        onClick={() => window.open(event.sourceUrl, '_blank')}
                        className="flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white"
                      >
                        <ExternalLink className="w-3 h-3" /> View Source
                      </button>
                  ) : (
                      <button 
                        onClick={() => handleJoinToggle(event.id)}
                        className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isJoined ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-red-600 text-white shadow-xl shadow-red-900/30 hover:bg-red-500'}`}
                      >
                        {isJoined ? <X className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />} {isJoined ? 'Leave' : 'Join Now'}
                      </button>
                  )}
                  <button 
                    onClick={() => onContact(`Org: ${event.title}`, `I want to help with ${event.title}`)}
                    className="p-3 bg-[#181b21] border border-[#2a2e37] rounded-2xl text-gray-400 hover:text-white transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </CardFooter>
              </CardBody>
            </BaseCard>
          );
        })}
      </div>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
};
