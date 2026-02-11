
import React, { useState } from 'react';
import { Search, ExternalLink, Calendar, Filter, ChevronDown, ChevronRight, MapPin, X, LayoutGrid, List, Clock, Moon } from 'lucide-react';
import { Marketplace } from './Marketplace';
import { CURRENCY_RATES, TRANSLATIONS } from '../constants';

interface HomeProps {
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onContact: (recipient: string) => void;
  language: 'FR' | 'EN';
}

export const Home: React.FC<HomeProps> = ({ notify, onContact, language }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('All Locations');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const t = TRANSLATIONS[language]?.ui || TRANSLATIONS['FR'].ui;

  const categories = [
    'All', 'Vehicles', 'Real Estate', 'Phones', 'Computing', 'Home', 
    'Clothing', 'Travel', 'Services', 'Charity', 'Medical Services', 'International'
  ];

  const events = [
    { title: "Salon de l'Automobile (SAFEX)", date: "20-25 Oct" },
    { title: "Exposition Artistique - Bastion 23", date: "22 Oct" },
    { title: "Concert Andalouse - Opéra", date: "28 Oct" }
  ];

  const prayerTimes = [
    { name: 'Fajr', time: '05:42' },
    { name: 'Dhuhr', time: '12:45' },
    { name: 'Asr', time: '16:02' },
    { name: 'Maghreb', time: '18:55' },
    { name: 'Isha', time: '20:15' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center pt-8 pb-6 text-center space-y-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-mainText tracking-tight mb-4">
            {t.heroTitle} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{t.heroTitleHighlight}</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl relative group z-10">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl transition-all opacity-50"></div>
          <div className="relative flex items-center bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl focus-within:border-indigo-500 transition-colors">
            <div className="pl-6">
              <Search className="w-6 h-6 text-muted" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent border-none py-4 px-4 text-lg text-mainText placeholder-muted focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="mr-4 text-muted hover:text-mainText">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Widgets */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Prayer Times Widget */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-lg p-5">
             <div className="flex items-center space-x-2 mb-4 text-emerald-400">
               <Moon className="w-4 h-4" />
               <h3 className="font-bold text-xs uppercase tracking-wider">Horaires de Prière (Alger)</h3>
             </div>
             <div className="space-y-2">
               {prayerTimes.map((pt, idx) => (
                 <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-border last:border-0">
                   <span className="text-muted">{pt.name}</span>
                   <span className="font-mono font-bold text-mainText">{pt.time}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Currency Widget */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-border flex justify-between items-center bg-surfaceAlt/50">
              <div className="flex items-center space-x-2">
                <span className="text-indigo-400 font-bold">↗</span>
                <span className="font-bold text-mainText text-sm">{t.currencyTitle}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted" />
            </div>
            <div className="p-0">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted uppercase">
                    <th className="text-left p-3 font-medium">Devise</th>
                    <th className="text-right p-3 font-medium text-green-500">Achat</th>
                    <th className="text-right p-3 font-medium text-red-500">Vente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {CURRENCY_RATES.map((rate, idx) => (
                    <tr key={idx} className="hover:bg-surfaceAlt transition-colors">
                      <td className="p-3 font-medium text-mainText">{rate.currency}</td>
                      <td className="p-3 text-right text-green-400 font-mono">{rate.buy}</td>
                      <td className="p-3 text-right text-red-400 font-mono">{rate.sell}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Events Widget */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-lg">
             <div className="flex items-center space-x-2 mb-4">
               <Calendar className="w-4 h-4 text-indigo-400" />
               <h3 className="font-bold text-xs text-muted uppercase tracking-wider">{t.eventsTitle}</h3>
             </div>
             <div className="relative pl-2 space-y-6">
                {/* Timeline Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border"></div>
                
                {events.map((event, i) => (
                   <div key={i} className="relative pl-6 group cursor-pointer" onClick={() => notify(`Event: ${event.title}`, 'info')}>
                      <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-surface border-2 border-indigo-500 group-hover:bg-indigo-500 transition-colors z-10"></div>
                      <p className="text-sm font-medium text-mainText/80 group-hover:text-mainText transition-colors leading-tight mb-1">
                        {event.title}
                      </p>
                      <span className="text-xs text-muted">{event.date}</span>
                   </div>
                ))}
             </div>
             <button onClick={() => notify('Calendar view coming soon', 'info')} className="w-full mt-6 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center">
                View All Events <ChevronRight className="w-3 h-3 ml-1" />
             </button>
          </div>

          {/* Filters Widget */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-lg">
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
               <div className="flex items-center space-x-2">
                 <Filter className="w-5 h-5 text-indigo-400" />
                 <h3 className="font-bold text-lg text-mainText">{t.filtersTitle}</h3>
               </div>
               <button 
                 onClick={() => {
                   setActiveCategory('All');
                   setSelectedWilaya('All Locations');
                   setSearchQuery('');
                 }} 
                 className="text-xs text-muted hover:text-mainText transition-colors"
               >
                 {t.clearAll}
               </button>
             </div>

             <div className="space-y-6">
                {/* Category Section */}
                <div>
                   <button className="flex items-center justify-between w-full text-xs font-bold text-muted uppercase mb-3 hover:text-mainText">
                      <span>{t.category}</span>
                      <ChevronDown className="w-3 h-3" />
                   </button>
                   <div className="space-y-1">
                      {categories.slice(0, 6).map(cat => (
                         <button 
                           key={cat} 
                           onClick={() => setActiveCategory(cat)}
                           className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${
                             activeCategory === cat 
                               ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
                               : 'text-muted hover:bg-surfaceAlt hover:text-mainText'
                           }`}
                         >
                           <span>{cat}</span>
                           {activeCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                         </button>
                      ))}
                   </div>
                </div>

                {/* Common Filters Section */}
                <div>
                   <button className="flex items-center justify-between w-full text-xs font-bold text-muted uppercase mb-4 hover:text-mainText">
                      <span>{t.commonFilters}</span>
                      <ChevronDown className="w-3 h-3" />
                   </button>
                   
                   <div className="space-y-4">
                      {/* Wilaya */}
                      <div className="space-y-1.5">
                         <label className="text-sm font-medium text-mainText">Wilaya</label>
                         <div className="relative">
                            <select 
                              value={selectedWilaya}
                              onChange={(e) => setSelectedWilaya(e.target.value)}
                              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-mainText focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                            >
                               <option>All Locations</option>
                               <option>Alger</option>
                               <option>Oran</option>
                               <option>Constantine</option>
                               <option>Setif</option>
                               <option>Blida</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted pointer-events-none" />
                         </div>
                      </div>

                      {/* Price */}
                      <div className="space-y-1.5">
                         <label className="text-sm font-medium text-mainText">{t.price} (DA)</label>
                         <div className="flex gap-2">
                            <input type="text" placeholder="Min" className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-mainText focus:outline-none focus:border-indigo-500" />
                            <span className="self-center text-muted">-</span>
                            <input type="text" placeholder="Max" className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-mainText focus:outline-none focus:border-indigo-500" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6 bg-surface p-4 rounded-2xl border border-border">
            <div className="flex items-center space-x-3">
               <h2 className="text-lg font-bold text-mainText">{t.resultsFound}</h2>
               <div className="h-4 w-[1px] bg-border"></div>
            </div>
            <div className="flex items-center space-x-3">
               <span className="text-xs text-muted">View:</span>
               <div className="flex bg-background rounded-lg p-1 border border-border">
                 <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-surface text-mainText shadow-sm' : 'text-muted hover:text-mainText'}`}
                    title={t.viewGrid}
                 >
                    <LayoutGrid className="w-4 h-4" />
                 </button>
                 <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-surface text-mainText shadow-sm' : 'text-muted hover:text-mainText'}`}
                    title={t.viewList}
                 >
                    <List className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </div>
          <Marketplace 
            isWidget={true} 
            searchQuery={searchQuery}
            category={activeCategory}
            wilaya={selectedWilaya}
            onContact={onContact}
            viewMode={viewMode}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};
