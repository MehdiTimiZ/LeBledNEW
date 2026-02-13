
import React, { useState, useEffect } from 'react';
import { Plane, Building, BookOpen, Users, Handshake, Globe, Clock, ShieldCheck, Phone, FileText, ChevronRight, Star, AlertTriangle, Languages, MapPin, BadgeCheck, MessageCircle, Plus, X, Loader2 } from 'lucide-react';
import { EXPAT_HOUSING_ITEMS, COMMUNITY_POSTS, CURRENCY_RATES } from '../constants';
import { BaseCard, CardMedia, CardBody, CardFooter, CardLabel } from './BaseCard';
import { CommunityPost, MarketplaceItem, UserProfile } from '../types';
import { supabase } from '../supabase/client';

interface ExpatService {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  languages: string[];
  location: string;
  contact_info: string;
  pricing: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  profiles?: { full_name: string; email: string };
}

const SERVICE_CATEGORIES = ['Translation', 'Legal', 'Customs', 'Relocation', 'Real Estate', 'Administrative', 'Tourism', 'Other'] as const;
const LANGUAGE_OPTIONS = ['EN', 'FR', 'AR', 'ES', 'DE', 'IT', 'ZH', 'TR', 'RU'];

interface ExpatsPageProps {
  onContact: (recipient: string, message: string) => void;
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  currentUser?: UserProfile | null;
}

export const ExpatsPage: React.FC<ExpatsPageProps> = ({ onContact, notify, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'housing' | 'community' | 'services'>('guide');
  const [homeTime, setHomeTime] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [services, setServices] = useState<ExpatService[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<string>('Translation');
  const [formLanguages, setFormLanguages] = useState<string[]>(['EN']);
  const [formLocation, setFormLocation] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formPricing, setFormPricing] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Mock User Home Timezone (e.g., London/GMT)
  useEffect(() => {
    const timer = setInterval(() => {
      setHomeTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch services from Supabase
  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
    }
  }, [activeTab]);

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const { data, error } = await supabase
        .from('expat_services')
        .select('*, profiles(full_name, email)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist yet, use fallback mock data
        console.warn('Expat services table not ready:', error.message);
        setServices([]);
      } else {
        setServices(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleCreateService = async () => {
    if (!currentUser || !formTitle.trim() || !formDescription.trim()) {
      notify('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('expat_services').insert({
        user_id: currentUser.id,
        title: formTitle.trim(),
        description: formDescription.trim(),
        category: formCategory,
        languages: formLanguages,
        location: formLocation.trim(),
        contact_info: formContact.trim(),
        pricing: formPricing.trim(),
      });

      if (error) throw error;

      notify('Service created successfully!', 'success');
      setShowCreateModal(false);
      resetForm();
      fetchServices();
    } catch (err: any) {
      notify(err.message || 'Failed to create service.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormCategory('Translation');
    setFormLanguages(['EN']);
    setFormLocation('');
    setFormContact('');
    setFormPricing('');
  };

  const toggleLanguage = (lang: string) => {
    setFormLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const formatTime = (date: Date, offset: number = 0) => {
    const d = new Date(date.getTime() + offset * 3600000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const canCreateService = currentUser && ['SELLER', 'ADMIN', 'SUPER_ADMIN'].includes(currentUser.role);

  // Fallback services if DB is empty
  const fallbackServices = [
    { id: '1', title: 'Karim Fixer', description: 'Paperwork Specialist — all administrative procedures', category: 'Administrative', languages: ['EN', 'FR', 'AR'], rating: 4.9, is_verified: true, profiles: { full_name: 'Karim Fixer', email: '' } },
    { id: '2', title: 'Sarah Translat', description: 'Certified Translator — official documents', category: 'Translation', languages: ['EN', 'AR'], rating: 5.0, is_verified: true, profiles: { full_name: 'Sarah Translat', email: '' } },
    { id: '3', title: 'Algiers Relo', description: 'Full Move Agency — end-to-end relocation', category: 'Relocation', languages: ['EN', 'FR', 'ES'], rating: 4.8, is_verified: true, profiles: { full_name: 'Algiers Relo', email: '' } },
  ];

  const displayServices = services.length > 0 ? services : fallbackServices;

  const navItems = [
    { id: 'guide', label: 'Admin Guide', icon: BookOpen },
    { id: 'housing', label: 'Premium Housing', icon: Building },
    { id: 'community', label: 'Expat Forum', icon: Users },
    { id: 'services', label: 'Relocation Help', icon: Handshake },
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
          <div className="animate-fade-in-up">
            {/* Create Service Button (Seller only) */}
            {canCreateService && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-teal-500/20"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Service</span>
                </button>
              </div>
            )}

            {loadingServices ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayServices.map((service: any) => (
                  <div key={service.id} className="bg-[#13151b] border border-slate-700 rounded-3xl p-6 hover:border-teal-500/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-white">
                          {(service.profiles?.full_name || service.title).substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-white flex items-center">
                            {service.title}
                            {service.is_verified && <BadgeCheck className="w-4 h-4 text-blue-400 ml-1" />}
                          </h4>
                          <p className="text-xs text-teal-400 font-bold uppercase tracking-wider">{service.category}</p>
                        </div>
                      </div>
                      {service.rating && (
                        <div className="flex items-center bg-yellow-500/10 px-2 py-1 rounded-lg text-yellow-400 text-xs font-bold">
                          <Star className="w-3 h-3 mr-1 fill-current" /> {service.rating}
                        </div>
                      )}
                    </div>

                    {service.description && (
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                    )}

                    {service.pricing && (
                      <p className="text-sm text-teal-300 font-mono mb-3">{service.pricing}</p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-6">
                      {(service.languages || []).map((lang: string) => (
                        <span key={lang} className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">{lang}</span>
                      ))}
                    </div>
                    <button 
                      onClick={() => onContact(service.profiles?.full_name || service.title, 'I need your assistance.')}
                      className="w-full bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 border border-teal-500/30 py-3 rounded-xl font-bold transition-all"
                    >
                      Hire Service
                    </button>
                  </div>
                ))}
              </div>
            )}
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

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e2025] border border-[#2a2e37] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#2a2e37] flex justify-between items-center sticky top-0 bg-[#1e2025] rounded-t-3xl z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Create Service</h2>
                <p className="text-sm text-gray-400">Offer your expertise to expats</p>
              </div>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="p-2 hover:bg-[#2a2e37] rounded-lg text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="text-sm font-bold text-gray-300 mb-2 block">Service Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Certified Legal Translation"
                  className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3 px-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-bold text-gray-300 mb-2 block">Category *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors"
                >
                  {SERVICE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-bold text-gray-300 mb-2 block">Description *</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe what you offer, your experience, etc."
                  rows={3}
                  className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3 px-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors resize-none"
                />
              </div>

              {/* Languages */}
              <div>
                <label className="text-sm font-bold text-gray-300 mb-2 block">Languages Spoken</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map(lang => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${formLanguages.includes(lang)
                          ? 'bg-teal-500/20 text-teal-400 border-teal-500/30'
                          : 'bg-[#0f1117] text-gray-400 border-[#2a2e37] hover:border-gray-600'
                        }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-bold text-gray-300 mb-2 block">Location</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Algiers, Oran, Remote"
                  className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3 px-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="text-sm font-bold text-gray-300 mb-2 block">Contact Info</label>
                <input
                  type="text"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  placeholder="Phone, email, or 'Contact via app'"
                  className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3 px-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors"
                />
              </div>

              {/* Pricing */}
              <div>
                <label className="text-sm font-bold text-gray-300 mb-2 block">Pricing</label>
                <input
                  type="text"
                  value={formPricing}
                  onChange={(e) => setFormPricing(e.target.value)}
                  placeholder="e.g. 5,000 DZD/page, Free consultation"
                  className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3 px-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#2a2e37] flex gap-3">
              <button
                onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:text-white bg-[#0f1117] border border-[#2a2e37] hover:border-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateService}
                disabled={submitting || !formTitle.trim() || !formDescription.trim()}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Service'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
