
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, ExternalLink, Loader2 } from 'lucide-react';
import { searchLocation } from '../services/geminiService';
import { ALGERIA_WILAYAS } from '../constants';

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) onChange(val);

    if (val.length > 0) {
      const filtered = ALGERIA_WILAYAS.filter(w => 
        w.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (wilaya: string) => {
    setQuery(wilaya);
    if (onChange) onChange(wilaya);
    setShowSuggestions(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setMapLink(null);
    setShowSuggestions(false);
    
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
    <div className={`space-y-1 ${className}`} ref={wrapperRef}>
      {label && <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>}
      <div className="relative group">
        <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
        <input 
          type="text" 
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
              setShowSuggestions(false);
            }
          }}
          onFocus={() => {
            if(query.length > 0) setShowSuggestions(true);
          }}
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

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#181b21] border border-[#2a2e37] rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => selectSuggestion(suggestion)}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2e37] hover:text-white transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
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
