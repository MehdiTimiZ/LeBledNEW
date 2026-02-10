import React, { useState } from 'react';
import { MapPin, Search, ExternalLink, Loader2 } from 'lucide-react';
import { searchLocation } from '../services/geminiService';

interface LocationInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  className?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({ 
  label, placeholder, value = '', onChange, className 
}) => {
  const [query, setQuery] = useState(value);
  const [loading, setLoading] = useState(false);
  const [mapLink, setMapLink] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setMapLink(null);
    
    const result = await searchLocation(query);
    
    if (result.text) {
      setQuery(result.text);
      if (onChange) onChange(result.text);
    }
    
    if (result.mapLink) {
      setMapLink(result.mapLink);
    }
    
    setLoading(false);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>}
      <div className="relative group">
        <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
             setQuery(e.target.value);
             if(onChange) onChange(e.target.value);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder || "Search location..."} 
          className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button 
          onClick={() => handleSearch()}
          disabled={loading}
          className="absolute right-2 top-2 p-1.5 bg-[#181b21] hover:bg-[#2a2e37] text-gray-400 hover:text-white rounded-lg border border-[#2a2e37] transition-colors"
          title="Search with Google Maps"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </div>
      {mapLink && (
        <a 
          href={mapLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-indigo-400 hover:text-indigo-300 mt-1 ml-1"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          View on Google Maps
        </a>
      )}
    </div>
  );
};