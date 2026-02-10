import React, { useState } from 'react';
import { Search, MapPin, Star, Filter, RotateCcw, Activity, Phone, ChevronDown, ChevronUp, Plus, ImageOff } from 'lucide-react';
import { MEDICAL_SERVICES } from '../constants';
import { LocationInput } from './LocationInput';

interface MedicalServicesProps {
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onBook: (serviceName?: string) => void;
  onOpenCreate: () => void;
}

export const MedicalServices: React.FC<MedicalServicesProps> = ({ notify, onBook, onOpenCreate }) => {
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Any');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
      {/* Sidebar Filters */}
      <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
        <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-4">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-bold text-gray-400 uppercase">Common Filters</h3>
             <Filter className="w-4 h-4 text-gray-500" />
           </div>
           
           <div className="space-y-4">
             <div>
               <label className="text-sm font-medium text-white mb-2 block">Location</label>
               <LocationInput 
                  value={location} 
                  onChange={setLocation} 
                  placeholder="e.g. Hydra, Alger"
               />
             </div>

             <div>
               <label className="text-sm font-medium text-white mb-2 block">Service Type</label>
               <select 
                 value={type}
                 onChange={(e) => setType(e.target.value)}
                 className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
               >
                 <option>Any</option>
                 <option>Doctor</option>
                 <option>Nurse</option>
                 <option>Clinic</option>
                 <option>Equipment</option>
               </select>
             </div>
           </div>
           
           <button 
             onClick={() => { setLocation(''); setType('Any'); setSearch(''); }}
             className="w-full mt-6 bg-[#181b21] hover:bg-[#2a2e37] border border-[#2a2e37] text-gray-300 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-2"
           >
             <RotateCcw className="w-4 h-4" />
             <span>Réinitialiser</span>
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 to-teal-900 border border-emerald-800/30 p-10 flex flex-col justify-center min-h-[250px]">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Santé & Soins à Domicile</h1>
            <p className="text-lg text-emerald-100/80 mb-8">
              Find qualified nurses, ambulance services, and medical equipment rentals near you immediately.
            </p>
            
            <div className="flex gap-4">
              <div className="relative flex-1">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Search className="h-5 w-5 text-gray-400" />
                 </div>
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="block w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm"
                   placeholder="Search doctors, clinics..."
                 />
              </div>
              <button 
                onClick={onOpenCreate}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3.5 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-emerald-900/20 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline">Create Ad</span>
              </button>
            </div>
          </div>
          {/* Decorative Icon */}
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
            <Activity className="w-96 h-96 text-emerald-400" />
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-white flex items-center">
               <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-sm mr-3 border border-emerald-500/20">
                 {filteredServices.length} Results
               </span>
               in Medical Services
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const isExpanded = expandedId === service.id;
              
              return (
                <div key={service.id} className="group bg-[#13151b] rounded-2xl overflow-hidden border border-[#2a2e37] hover:border-[#3f4552] transition-all flex flex-col">
                  <div className="relative aspect-video overflow-hidden bg-[#181b21]">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback for broken images */}
                    <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                      <ImageOff className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-xs">Image unavailable</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 flex items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                      Available
                    </div>
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-[#181b21]/90 backdrop-blur-md text-white text-sm font-bold rounded-lg border border-[#2a2e37]">
                      {service.price}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{service.name}</h3>
                        <p className="text-sm text-gray-400">{service.specialty} • {service.type}</p>
                      </div>
                      <div className="flex items-center text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {service.rating}
                      </div>
                    </div>

                    {/* Hidden details by default (Minimalist) */}
                    {isExpanded ? (
                      <div className="mt-4 p-4 bg-[#181b21] rounded-xl space-y-3 animate-fade-in border border-[#2a2e37]">
                        <div className="flex items-center text-sm text-gray-300">
                          <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                          {service.location}
                        </div>
                         <div className="flex items-center text-sm text-gray-300">
                          <Phone className="w-4 h-4 mr-2 text-emerald-500" />
                          {service.contactNumber || "Contact for info"}
                        </div>
                        <button 
                          onClick={() => onBook(service.name)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-bold mt-2"
                        >
                          Book Now
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-gray-500 italic">
                        Click details to view location & contact
                      </div>
                    )}

                    <div className="mt-auto pt-4">
                      <button 
                        onClick={() => toggleDetails(service.id)}
                        className="w-full flex items-center justify-center space-x-2 bg-[#181b21] hover:bg-[#2a2e37] border border-[#2a2e37] text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                      >
                         <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
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