
import React, { useState, useEffect } from 'react';
import { Plane, Building, BookOpen, Users, Handshake, Globe, Clock, ShieldCheck, Phone, FileText, ChevronRight, Star, AlertTriangle, Languages, MapPin, BadgeCheck, MessageCircle } from 'lucide-react';
import { EXPAT_HOUSING_ITEMS, COMMUNITY_POSTS, CURRENCY_RATES } from '../constants';
import { BaseCard, CardMedia, CardBody, CardFooter, CardLabel } from './BaseCard';
import { CommunityPost, MarketplaceItem } from '../types';

interface ExpatsPageProps {
  onContact: (recipient: string, message: string) => void;
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ExpatsPage: React.FC<ExpatsPageProps> = ({ onContact, notify }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'housing' | 'community' | 'services'>('guide');
  const [homeTime, setHomeTime] = useState(new Date());
  
  // Mock User Home Timezone (e.g., London/GMT)
  useEffect(() => {
    const timer = setInterval(() => {
      setHomeTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, offset: number = 0) => {
    const d = new Date(date.getTime() + offset * 3600000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const navItems = [
    { id: 'guide', label: 'Admin Guide', icon: BookOpen },
    { id: 'housing', label: 'Premium Housing', icon: Building },
    { id: 'community', label: 'Expat Forum', icon: Users },
    { id: 'services', label: 'Relocation Help', icon: Handshake },
  ];

  const services = [
    { id: 1, name: 'Karim Fixer', role: 'Paperwork Specialist', languages: ['EN', 'FR', 'AR'], rating: 4.9, verified: true },
    { id: 2, name: 'Sarah Translat', role: 'Certified Translator', languages: ['EN', 'AR'], rating: 5.0, verified: true },
    { id: 3, name: 'Algiers Relo', role: 'Full Move Agency', languages: ['EN', 'FR', 'ES'], rating: 4.8, verified: true },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Context */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 border border-teal-500/30 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 to-slate-900 z-0"></div>
        <div className="absolute top-0 right-0 p-32 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs font-black uppercase tracking-widest border border-teal-500/30">
                Soft Landing Hub
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome to Algeria 🇩🇿</h1>
            <p className="text-slate-400 max-w-lg">Your essential guide to settling in. Visa help, premium housing, and a supportive community.</p>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            {/* Clocks Widget */}
            <div className="glass-card bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex-1 lg:flex-none min-w-[140px]">
              <div className="flex items-center space-x-2 text-teal-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Algiers</span>
              </div>
              <p className="text-2xl font-mono text-white">{formatTime(homeTime)}</p>
            </div>
            <div className="glass-card bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex-1 lg:flex-none min-w-[140px]">
              <div className="flex items-center space-x-2 text-yellow-400 mb-1">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Home (GMT)</span>
              </div>
              <p className="text-2xl font-mono text-white opacity-80">{formatTime(homeTime, -1)}</p>
            </div>
          </div>
        </div>

        {/* Currency Strip */}
        <div className="mt-8 pt-6 border-t border-slate-700/50 flex flex-wrap gap-6">
           <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                 <span className="font-black">€</span>
              </div>
              <div>
                 <p className="text-[10px] text-slate-400 uppercase font-bold">Euro (Square)</p>
                 <p className="text-white font-mono font-bold">{CURRENCY_RATES[0].sell} DZD</p>
              </div>
           </div>
           <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                 <span className="font-black">$</span>
              </div>
              <div>
                 <p className="text-[10px] text-slate-400 uppercase font-bold">USD (Square)</p>
                 <p className="text-white font-mono font-bold">{CURRENCY_RATES[1].sell} DZD</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all min-w-[160px] ${
              activeTab === item.id 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/30' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-teal-500'}`} />
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {/* GUIDE TAB */}
        {activeTab === 'guide' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
             <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 hover:border-teal-500/50 transition-colors cursor-pointer group">
               <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                 <FileText className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Residency Card</h3>
               <p className="text-slate-400 text-sm mb-4">Step-by-step checklist for the "Carte de Séjour". Includes required forms and office locations.</p>
               <div className="flex items-center text-teal-400 text-sm font-bold">
                 Start Checklist <ChevronRight className="w-4 h-4 ml-1" />
               </div>
             </div>

             <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 hover:border-teal-500/50 transition-colors cursor-pointer group">
               <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                 <Globe className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Work Permit</h3>
               <p className="text-slate-400 text-sm mb-4">For corporate employees and oil & gas contractors. Understanding the sponsorship system.</p>
               <div className="flex items-center text-blue-400 text-sm font-bold">
                 Read Guide <ChevronRight className="w-4 h-4 ml-1" />
               </div>
             </div>

             <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 hover:border-teal-500/50 transition-colors cursor-pointer group">
               <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
                 <Plane className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Customs & Imports</h3>
               <p className="text-slate-400 text-sm mb-4">What you can bring into Algeria. Duty-free allowances for electronics and furniture.</p>
               <div className="flex items-center text-yellow-400 text-sm font-bold">
                 View Regulations <ChevronRight className="w-4 h-4 ml-1" />
               </div>
             </div>
          </div>
        )}

        {/* HOUSING TAB */}
        {activeTab === 'housing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {EXPAT_HOUSING_ITEMS.map((item) => (
              <BaseCard key={item.id} className={`border ${item.isPremium ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/10' : 'border-slate-700'}`}>
                <CardMedia src={item.image} alt={item.title} className="h-56">
                   {item.isPremium && (
                     <div className="absolute top-4 right-4 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center shadow-lg">
                       <Star className="w-3 h-3 mr-1 fill-black" />
                       Verified
                     </div>
                   )}
                   <CardLabel color="emerald" className="absolute top-4 left-4">Furnished</CardLabel>
                </CardMedia>
                <CardBody>
                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-xs flex items-center mb-3">
                    <MapPin className="w-3 h-3 mr-1" /> {item.location}
                  </p>
                  <p className="text-2xl font-bold text-yellow-400 mb-4">{item.price}</p>
                  <p className="text-sm text-slate-300 line-clamp-2 mb-4">{item.description}</p>
                  <CardFooter>
                    <button 
                      onClick={() => onContact(item.seller.name, `I am interested in the listing: ${item.title}`)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-all border border-slate-600 flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contact Agent</span>
                    </button>
                  </CardFooter>
                </CardBody>
              </BaseCard>
            ))}
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === 'community' && (
          <div className="space-y-4 animate-fade-in-up max-w-3xl mx-auto">
             <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Expat Forum</h3>
                <p className="text-slate-400 mb-4">Connect with others, ask questions, and share experiences.</p>
                <button className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-xl font-bold transition-colors">Start Discussion</button>
             </div>
             
             {COMMUNITY_POSTS.filter(p => p.category === 'expat').map((post) => (
                <div key={post.id} className="bg-[#13151b] border border-slate-800 rounded-2xl p-6 hover:border-teal-500/30 transition-all">
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                        {post.user.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white">{post.user}</h4>
                            <span className="text-xs text-slate-500">{post.timestamp}</span>
                         </div>
                         <p className="text-slate-300 mt-2 mb-3">{post.content}</p>
                         <div className="flex gap-4">
                            <button className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1">
                               <Languages className="w-3 h-3" /> Translate
                            </button>
                            <button className="text-xs font-bold text-slate-500 hover:text-white">Reply ({post.comments})</button>
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
             {services.map((service) => (
               <div key={service.id} className="bg-[#13151b] border border-slate-700 rounded-3xl p-6 hover:border-teal-500/50 transition-all">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-white">
                           {service.name.substring(0, 2)}
                        </div>
                        <div>
                           <h4 className="font-bold text-white flex items-center">
                             {service.name}
                             {service.verified && <BadgeCheck className="w-4 h-4 text-blue-400 ml-1" />}
                           </h4>
                           <p className="text-xs text-teal-400 font-bold uppercase tracking-wider">{service.role}</p>
                        </div>
                     </div>
                     <div className="flex items-center bg-yellow-500/10 px-2 py-1 rounded-lg text-yellow-400 text-xs font-bold">
                        <Star className="w-3 h-3 mr-1 fill-current" /> {service.rating}
                     </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                     {service.languages.map(lang => (
                        <span key={lang} className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">{lang}</span>
                     ))}
                  </div>
                  <button 
                    onClick={() => onContact(service.name, 'I need your assistance.')}
                    className="w-full bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 border border-teal-500/30 py-3 rounded-xl font-bold transition-all"
                  >
                    Hire Service
                  </button>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* Emergency Floating Row */}
      <div className="fixed bottom-24 right-4 md:right-8 z-40 flex flex-col gap-3">
         <button 
           onClick={() => notify("Connecting to emergency services...", "info")}
           className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-900/40 transition-transform hover:scale-110 tooltip-trigger"
           title="Emergency"
         >
            <AlertTriangle className="w-6 h-6" />
         </button>
         <button 
           className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/40 transition-transform hover:scale-110"
           title="Embassy List"
         >
            <Building className="w-6 h-6" />
         </button>
         <button 
           className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-900/40 transition-transform hover:scale-110"
           title="Translator"
         >
            <Languages className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
};
