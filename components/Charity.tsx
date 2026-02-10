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
      setEvents(events.map(ev => 
        ev.id === id ? { ...ev, joined: ev.joined - 1 } : ev
      ));
      notify('You have left the event.', 'info');
    } else {
      setJoinedEvents([...joinedEvents, id]);
      setEvents(events.map(ev => 
        ev.id === id ? { ...ev, joined: ev.joined + 1 } : ev
      ));
      notify('You have successfully joined the event!', 'success');
    }
  };

  const handleLikeToggle = (id: string) => {
    if (likedEvents.includes(id)) {
      setLikedEvents(likedEvents.filter(eventId => eventId !== id));
    } else {
      setLikedEvents([...likedEvents, id]);
      notify('Event added to favorites', 'success');
    }
  };

  const handleWebSync = () => {
    setIsScraping(true);
    notify('Scanning local networks for events...', 'info');
    
    // Simulate web scraping delay
    setTimeout(() => {
      setIsScraping(false);
      notify('Sync complete! Found 2 new events nearby.', 'success');
      // In a real app, this would append data from the scraper service
    }, 2000);
  };

  const handleCreateEvent = (data: NewEventData) => {
    const newEvent: CharityEvent = {
      id: Date.now().toString(),
      title: data.title,
      location: data.location || 'TBD',
      joined: 1,
      goal: data.maxParticipants || 50,
      progress: 0,
      category: 'Community', // Default category
      description: data.description,
      date: data.date
    };
    
    setEvents([newEvent, ...events]);
    notify('Event published successfully to the feed!', 'success');
    setIsCreateModalOpen(false);
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Today';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Today';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1a2e05] to-[#0f1a03] border border-[#2f400f] min-h-[300px] flex flex-col md:flex-row items-center p-8 md:p-12 gap-8">
        <div className="relative z-10 flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-green-100 mb-4">Civil Mob</h1>
          <h2 className="text-2xl font-semibold text-green-200/80 mb-4">Civic Action & Volunteering</h2>
          <p className="text-lg text-green-200/70 mb-8 leading-relaxed max-w-xl">
            Join the movement. From cleaning up neighborhoods to planting trees. We scrape social media to find the latest active campaigns so you can join in.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-white text-green-900 px-6 py-3 rounded-full font-bold flex items-center space-x-2 hover:bg-green-50 transition-colors shadow-lg shadow-green-900/20"
            >
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </button>
            <button 
              onClick={handleWebSync}
              disabled={isScraping}
              className="bg-green-950/50 border border-green-800/50 text-green-200 px-6 py-3 rounded-full font-medium flex items-center space-x-2 hover:bg-green-900/50 transition-colors backdrop-blur-sm"
            >
              {isScraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              <span>{isScraping ? 'Syncing...' : 'Live Data from Web'}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter - Right Side of Banner */}
        <div className="relative z-10 w-full md:w-80 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-4">
           <div className="relative">
             <Search className="absolute left-3 top-3 w-4 h-4 text-green-200/50" />
             <input 
               type="text" 
               placeholder="Search events..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-black/20 border border-green-500/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-green-200/30 focus:outline-none focus:border-green-500/50 transition-colors text-sm"
             />
           </div>
           
           <div className="flex space-x-2">
             <button className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/20 rounded-xl py-2 text-xs font-bold text-green-100 flex items-center justify-center transition-colors">
               <Filter className="w-3 h-3 mr-1.5" /> Filter
             </button>
             <button className="flex-1 bg-black/20 hover:bg-black/30 border border-white/10 rounded-xl py-2 text-xs font-bold text-green-200/70 transition-colors">
               Nearby
             </button>
           </div>
           
           <div className="text-xs text-green-200/40 text-center">
              Showing events within 20km
           </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4 opacity-10 text-green-500 pointer-events-none">
          <Sprout className="w-96 h-96 fill-current" />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const isJoined = joinedEvents.includes(event.id);
          const isLiked = likedEvents.includes(event.id);
          const progress = Math.min(100, Math.round((event.joined / event.goal) * 100));
          
          return (
            <div key={event.id} className="relative bg-[#13151b] border border-[#2a2e37] rounded-2xl p-6 hover:border-[#3f4552] transition-all group">
              {/* Like Button (Absolute Top Left) */}
              <button 
                onClick={() => handleLikeToggle(event.id)}
                className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>

              <div className="flex justify-end items-start mb-6">
                <div className="flex space-x-2">
                   <span className="px-3 py-1 bg-[#181b21] border border-[#2a2e37] rounded-lg text-xs font-medium text-gray-300 flex items-center">
                    {formatDate(event.date)}
                   </span>
                   <span className="px-3 py-1 bg-[#181b21] border border-[#2a2e37] rounded-lg text-xs font-medium text-gray-300 flex items-center">
                    <Globe className="w-3 h-3 mr-1" /> Web
                   </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#131e08] border border-green-900/30 flex items-center justify-center mb-4">
                  {event.category === 'Environment' ? (
                    <Sprout className="w-6 h-6 text-green-500" />
                  ) : (
                    <Gift className="w-6 h-6 text-pink-500" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{event.title}</h3>
                <p className="text-sm text-gray-400">{event.category}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="flex items-center"><UserPlus className="w-3 h-3 mr-1"/> {event.joined} joined</span>
                  <span>Goal: {event.goal}</span>
                </div>
                <div className="h-2 bg-[#181b21] rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-right text-xs text-gray-500">{progress}% complete</div>
              </div>

              <div className="flex items-center text-sm text-gray-400 mb-6">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleJoinToggle(event.id)}
                  className={`py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center ${
                    isJoined 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel Join
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Join
                    </>
                  )}
                </button>
                <button 
                  onClick={() => onContact(`Organizer of ${event.title}`, `Hi, I'm interested in the ${event.title} event.`)}
                  className="bg-transparent border border-[#2a2e37] hover:border-gray-500 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </button>
              </div>
            </div>
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