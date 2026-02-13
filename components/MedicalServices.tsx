
import React, { useState } from 'react';
import { Search, MapPin, Star, Filter, RotateCcw, Activity, Phone, ChevronDown, ChevronUp, Plus, ImageOff, MessageCircle, Navigation, Loader2, Globe, Building2 } from 'lucide-react';
import { MEDICAL_SERVICES } from '../constants';
import { LocationInput } from './LocationInput';
import { useNearbyServices, NearbyPlace } from '../hooks/useNearbyServices';

interface MedicalServicesProps {
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onBook: (serviceName?: string) => void;
  onOpenCreate: () => void;
  language?: 'FR' | 'EN';
  onContact?: (recipient: string, message: string) => void;
}

export const MedicalServices: React.FC<MedicalServicesProps> = ({ notify, onBook, onOpenCreate, language = 'FR', onContact }) => {
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Any');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [nearbyRadius, setNearbyRadius] = useState(10);
  const { places, loading: nearbyLoading, error: nearbyError, searchNearby } = useNearbyServices();

  const filteredServices = MEDICAL_SERVICES.filter(service => {
    const matchesLocation = !location || service.location.toLowerCase().includes(location.toLowerCase());
    const matchesType = type === 'Any' || service.type === type;
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase()) || 
                          service.specialty?.toLowerCase().includes(search.toLowerCase());
    return matchesLocation && matchesType && matchesSearch;
  });

  const toggleDetails = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleWhatsApp = (number: string | undefined, name: string) => {
    if (number) {
        const url = `https://wa.me/${number.replace(/\D/g,'')}?text=Salam, inquiry about ${name}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
        notify('No WhatsApp number available', 'error');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in pb-10">
      {/* Sidebar Filters */}
      <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
        <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-4 sticky top-20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Filtres</h3>
             <Filter className="w-4 h-4 text-green-500" />
           </div>
           
           <div className="space-y-4">
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase mb-2 block ml-1">Lieu</label>
               <LocationInput 
                  value={location} 
                  onChange={setLocation} 
                  placeholder="e.g. Hydra, Alger"
               />
             </div>

             <div>
               <label className="text-xs font-bold text-gray-500 uppercase mb-2 block ml-1">Type de Service</label>
               <div className="relative">
                 <select 
                   value={type}
                   onChange={(e) => setType(e.target.value)}
                   className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
                 >
                   <option>Any</option>
                   <option>Doctor</option>
                   <option>Nurse</option>
                   <option>Clinic</option>
                   <option>Equipment</option>
                 </select>
                 <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
               </div>
             </div>
           </div>
           
           <button 
             onClick={() => { setLocation(''); setType('Any'); setSearch(''); }}
             className="w-full mt-6 bg-[#181b21] hover:bg-[#2a2e37] border border-[#2a2e37] text-gray-300 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2"
           >
             <RotateCcw className="w-4 h-4" />
             <span>Réinitialiser</span>
           </button>

          {/* Find Nearby Section */}
          <div className="mt-6 pt-6 border-t border-[#2a2e37]">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-green-500" />
              Find Nearby
            </h3>
            <div className="space-y-3">
              <select
                value={nearbyRadius}
                onChange={(e) => setNearbyRadius(Number(e.target.value))}
                className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
              >
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={20}>Within 20 km</option>
                <option value={50}>Within 50 km</option>
              </select>
              <button
                onClick={() => searchNearby(nearbyRadius)}
                disabled={nearbyLoading}
                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-green-500/20"
              >
                {nearbyLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Searching...</span></>
                ) : (
                  <><Navigation className="w-4 h-4" /><span>Find Near Me</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#0f172a] border border-green-800/30 p-8 md:p-12 flex flex-col justify-center min-h-[300px] shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Health & Care</h1>
            <p className="text-lg text-green-100/70 mb-8 leading-relaxed">
              Find qualified doctors, nurses, and medical equipment rentals near you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                 </div>
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="block w-full pl-11 pr-4 py-4 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 backdrop-blur-xl transition-all"
                   placeholder="Search specialists, clinics..."
                 />
              </div>
              <button 
                onClick={onOpenCreate}
                className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-green-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-5 h-5" />
                <span>Create Listing</span>
              </button>
            </div>
          </div>
          {/* Decorative Background Element */}
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 pointer-events-none">
            <Activity className="w-[500px] h-[500px] text-green-400" />
          </div>
        </div>

        {/* Nearby Results */}
        {(places.length > 0 || nearbyError) && (
          <div className="bg-[#13151b] border border-green-500/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Nearby Health Services</h2>
                  <p className="text-xs text-gray-500">
                    {places.length} found within {nearbyRadius}km • Powered by OpenStreetMap
                  </p>
                </div>
              </div>
            </div>

            {nearbyError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm mb-4">
                {nearbyError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {places.map((place) => (
                <div key={place.id} className="bg-[#0f1117] border border-[#2a2e37] rounded-2xl p-5 hover:border-green-500/40 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${place.type === 'hospital' ? 'bg-red-500/20 text-red-400' :
                          place.type === 'pharmacy' ? 'bg-green-500/20 text-green-400' :
                            place.type === 'dentist' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-indigo-500/20 text-indigo-400'
                        }`}>
                        {place.type === 'hospital' ? <Building2 className="w-5 h-5" /> :
                          place.type === 'pharmacy' ? <Plus className="w-5 h-5" /> :
                            <Activity className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-green-400 transition-colors">{place.name}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{place.type}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg shrink-0">
                      {place.distance} km
                    </span>
                  </div>

                  {place.address && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 shrink-0" /> {place.address}
                    </p>
                  )}
                  {place.phone && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                      <Phone className="w-3 h-3 shrink-0" /> {place.phone}
                    </p>
                  )}
                  {place.openingHours && (
                    <p className="text-[10px] text-gray-500 mb-3">🕐 {place.openingHours}</p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=17/${place.lat}/${place.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-[#181b21] hover:bg-[#2a2e37] text-white py-2 rounded-xl text-xs font-bold border border-[#2a2e37] transition-all"
                    >
                      View Map
                    </a>
                    {place.phone && (
                      <a
                        href={`tel:${place.phone}`}
                        className="flex-1 text-center bg-green-600/20 hover:bg-green-600/30 text-green-400 py-2 rounded-xl text-xs font-bold border border-green-500/30 transition-all"
                      >
                        Call
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
             <div className="flex items-center space-x-4">
               <h2 className="text-2xl font-bold text-white">Available Services</h2>
               <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                 {filteredServices.length} found
               </span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const isExpanded = expandedId === service.id;
              
              return (
                <div key={service.id} className="group bg-[#13151b] rounded-3xl overflow-hidden border border-[#2a2e37] hover:border-green-500/40 transition-all flex flex-col shadow-lg hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.1)] perspective-1000">
                   <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-gray-600 bg-[#0f1117]">
                      <ImageOff className="w-10 h-10 mb-2 opacity-30" />
                      <span className="text-xs uppercase font-bold tracking-widest opacity-30">Image non disponible</span>
                    </div>

                    {/* Badge Overlays */}
                    <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
                      <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-green-400 text-[10px] font-bold rounded-xl border border-green-500/20 flex items-center uppercase tracking-widest shadow-lg">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Available
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/80 backdrop-blur-xl text-white text-base font-black rounded-2xl border border-white/10 shadow-2xl">
                      {service.price}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors leading-tight">{service.name}</h3>
                        <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-tighter">{service.specialty} • {service.type}</p>
                      </div>
                      <div className="flex items-center text-green-400 text-xs font-black bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20">
                        <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
                        {service.rating}
                      </div>
                    </div>

                    <div className={`mt-4 space-y-3 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="h-px bg-[#2a2e37] w-full my-4" />
                      <div className="flex items-center text-sm text-gray-300 bg-[#0f1117] p-3 rounded-2xl border border-[#2a2e37]">
                        <MapPin className="w-4 h-4 mr-3 text-green-500 shrink-0" />
                        <span className="font-medium truncate">{service.location}</span>
                      </div>
                       <div className="flex items-center text-sm text-gray-300 bg-[#0f1117] p-3 rounded-2xl border border-[#2a2e37]">
                        <Phone className="w-4 h-4 mr-3 text-green-500 shrink-0" />
                        <span className="font-medium">{service.contactNumber || "Contacter pour info"}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button 
                          onClick={() => onContact && onContact(service.name, `Hi, I am interested in ${service.name} services.`)}
                          className="flex-1 bg-[#181b21] hover:bg-[#2a2e37] text-white py-3 rounded-xl text-xs font-bold border border-[#2a2e37] transition-all"
                        >
                          Chat
                        </button>
                        <button 
                          onClick={() => handleWhatsApp(service.contactNumber, service.name)}
                          className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl text-xs font-bold transition-all"
                        >
                          WhatsApp
                        </button>
                      </div>
                      <button 
                          onClick={() => {
                          onBook(service.name);
                              if(onContact) onContact(service.name, `Booking Request for: ${service.name}`);
                          }}
                          className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-green-500/20 transition-all"
                        >
                          Book Appointment
                        </button>
                    </div>

                    {!isExpanded && (
                       <p className="mt-2 text-xs text-gray-500 italic">Click to view details and contact</p>
                    )}

                    <div className="mt-auto pt-6">
                      <button 
                        onClick={() => toggleDetails(service.id)}
                        className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl text-xs font-bold transition-all border ${
                           isExpanded 
                             ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                             : 'bg-[#181b21] hover:bg-[#2a2e37] border-[#2a2e37] text-white'
                        }`}
                      >
                         <span className="uppercase tracking-widest">{isExpanded ? 'Close' : 'View Details'}</span>
                         {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
