
import React, { useState } from 'react';
import { Truck, Package, Calendar, MessageCircle, Filter, Plus, Search, User, AtSign, Phone, ChevronDown, Users, CheckSquare } from 'lucide-react';
import { DELIVERY_REQUESTS } from '../constants';
import { LocationInput } from './LocationInput';
import { DeliveryRequest } from '../types';

interface DeliveryMovingProps {
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onContact?: (recipient: string, message?: string) => void;
}

export const DeliveryMoving: React.FC<DeliveryMovingProps> = ({ notify, onContact }) => {
  const [role, setRole] = useState<'requester' | 'provider'>('requester');
  const [posts, setPosts] = useState<DeliveryRequest[]>(DELIVERY_REQUESTS);
  
  // Form State
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [vehicle, setVehicle] = useState('Scooter');
  const [budget, setBudget] = useState('');
  const [phone, setPhone] = useState('');
  const [requiresMovers, setRequiresMovers] = useState(false);

  // Generate date options for the next 30 days with "Today" and "Tomorrow" labels
  const dateOptions = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    let label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (i === 0) label = `Today (${label})`;
    if (i === 1) label = `Tomorrow (${label})`;
    return { value: d.toISOString(), label };
  });

  const handlePost = () => {
    if (!pickup || (!dropoff && role === 'requester') || !date || !budget || !phone) {
      notify('Please fill in all required fields.', 'error');
      return;
    }

    const newRequest: DeliveryRequest = {
      id: (posts.length + 1).toString(),
      type: role === 'requester' ? 'Delivery' : 'Moving',
      pickup: pickup,
      dropoff: dropoff || 'N/A',
      date: new Date(date).toLocaleDateString(),
      budget: `${budget} DZD`,
      distance: 'Calculating...',
      vehicle: vehicle,
      status: 'Open',
      requires_movers: requiresMovers
    };

    setPosts([newRequest, ...posts]);
    notify('Request posted successfully! It has been added to the feed.', 'success');
    
    // Reset form
    setPickup('');
    setDropoff('');
    setDate('');
    setBudget('');
    setPhone('');
    setRequiresMovers(false);
  };

  const handleChatClick = (type: string, id: string) => {
    if (onContact) {
      onContact(`Provider #${id}`, `Salam, I am interested in your ${type} post.`);
    } else {
      notify('Opening chat...', 'info');
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 animate-fade-in pb-10">
      {/* Left Panel - Request Form */}
      <div className="w-full xl:w-[450px] flex-shrink-0 space-y-6">
        <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-6 shadow-2xl shadow-amber-500/5">
          <div className="mb-6">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 border border-amber-500/30">
              <Truck className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Delivery & Moving</h1>
            <p className="text-gray-400">Post a request or offer your driving services.</p>
          </div>

          {/* Role Toggle */}
           <div className="bg-[#0f1117] p-1 rounded-xl border border-[#2a2e37] flex mb-6">
            <button 
              onClick={() => setRole('requester')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                role === 'requester' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              I Need a Service
            </button>
            <button 
              onClick={() => setRole('provider')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                role === 'provider' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              I am a Driver
            </button>
          </div>

          <div className="space-y-4">
             <LocationInput 
               label={role === 'requester' ? "Pickup Location" : "Base Location"} 
               placeholder={role === 'requester' ? "e.g. Alger Centre" : "e.g. Garidi, Kouba"}
               value={pickup}
               onChange={setPickup}
             />

             {role === 'requester' && (
                <LocationInput 
                  label="Dropoff Location" 
                  placeholder="e.g. Rouiba"
                  value={dropoff}
                  onChange={setDropoff}
                />
             )}

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Scheduled Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3 pl-10 pr-8 text-white focus:outline-none focus:border-amber-500 appearance-none cursor-pointer text-sm"
                    >
                      <option value="">Select Date</option>
                      {dateOptions.map((opt, i) => (
                        <option key={i} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Vehicle Type</label>
                  <div className="relative">
                    <select 
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                      className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 appearance-none cursor-pointer text-sm"
                    >
                      <option>Scooter</option>
                      <option>Van (Fourgon)</option>
                      <option>Truck (Camion)</option>
                      <option>Car</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
             </div>

             <div className="space-y-1">
               <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                 {role === 'requester' ? "Your Budget (DZD)" : "Rate per Day/Trip (DZD)"}
               </label>
               <div className="relative">
                 <Package className="absolute left-3 top-3 w-4 h-4 text-amber-500" />
                 <input 
                   type="number" 
                   value={budget}
                   onChange={(e) => setBudget(e.target.value)}
                   placeholder="2000" 
                   className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500" 
                 />
               </div>
             </div>

             {/* Professional Movers Checkbox */}
             {role === 'requester' && (
               <div 
                 className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer ${requiresMovers ? 'bg-red-500/10 border-red-500' : 'bg-[#0f1117] border-[#2a2e37] hover:border-gray-500'}`}
                 onClick={() => setRequiresMovers(!requiresMovers)}
               >
                 <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${requiresMovers ? 'bg-red-500 border-red-500' : 'border-gray-500'}`}>
                   {requiresMovers && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                 </div>
                 <div className="flex-1">
                   <p className={`text-sm font-bold ${requiresMovers ? 'text-red-400' : 'text-gray-300'}`}>Request Professional Movers</p>
                   <p className="text-[10px] text-gray-500">Check this for heavy lifting or full house moves</p>
                 </div>
                 <Users className={`w-5 h-5 ${requiresMovers ? 'text-red-500' : 'text-gray-600'}`} />
               </div>
             )}

             {/* Contact Info */}
             <div className="pt-4 border-t border-[#2a2e37] space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase">Contact Information</p>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number (Required)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05 50 12 34 56" 
                      className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Social Handle (Optional)</label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="@instagram_user" className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500" />
                  </div>
                </div>
             </div>
          </div>

          <button 
            onClick={handlePost}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3.5 rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 mt-6"
          >
            <span>{role === 'requester' ? 'Post Request' : 'Post Offer'}</span>
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right Panel - Feed */}
      <div className="flex-1 space-y-6">
         <div className="flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <Search className="w-5 h-5 text-gray-400" />
             <h2 className="text-xl font-bold text-white">Recent Posts</h2>
           </div>
           <button className="p-2 hover:bg-[#2a2e37] rounded-lg text-gray-400">
             <Filter className="w-5 h-5" />
           </button>
         </div>

         <div className="space-y-4">
           {posts.map((request) => (
             <div key={request.id} className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-6 hover:border-amber-500/30 transition-all group animate-fade-in-up">
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 rounded-xl bg-[#0f1117] border border-[#2a2e37] flex items-center justify-center">
                     <Package className="w-5 h-5 text-amber-500" />
                   </div>
                   <div>
                     <div className="flex items-center gap-2">
                       <h3 className="font-bold text-white text-lg">{request.type} Request</h3>
                       {request.requires_movers && (
                         <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-500/30 font-bold uppercase">Movers Needed</span>
                       )}
                     </div>
                     <p className="text-xs text-gray-500 flex items-center">
                        <span className="w-3 h-3 text-gray-600 mr-1">🕒</span> Posted on {request.date}
                     </p>
                   </div>
                 </div>
                 <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-sm font-bold border border-green-500/20">
                   {request.budget}
                 </div>
               </div>

               <div className="relative pl-4 space-y-6 mb-6">
                 {/* Connecting Line */}
                 <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-[#2a2e37]"></div>
                 
                 <div className="relative">
                   <div className="absolute -left-[15px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-[#13151b]"></div>
                   <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">PICKUP</p>
                   <p className="text-white font-medium">{request.pickup}</p>
                 </div>

                 <div className="relative">
                   <div className="absolute -left-[15px] top-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#13151b]"></div>
                   <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">DROPOFF</p>
                   <p className="text-white font-medium">{request.dropoff}</p>
                 </div>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-[#2a2e37]">
                 <div className="text-sm text-gray-400">
                   Vehicle: <span className="text-white font-medium">{request.vehicle}</span>
                 </div>
                 <button 
                   onClick={() => handleChatClick(request.type, request.id)}
                   className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center space-x-2"
                 >
                   <MessageCircle className="w-4 h-4" />
                   <span>Chat</span>
                 </button>
               </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};
