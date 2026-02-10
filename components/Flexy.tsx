import React, { useState } from 'react';
import { Smartphone, Zap, History, ChevronRight } from 'lucide-react';

interface FlexyProps {
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const Flexy: React.FC<FlexyProps> = ({ notify }) => {
  const [selectedOperator, setSelectedOperator] = useState<string>('djezzy');
  const [amount, setAmount] = useState<number>(100);
  const [balance, setBalance] = useState<number>(1450);
  const [phoneNumber, setPhoneNumber] = useState('');

  const operators = [
    { id: 'djezzy', name: 'Djezzy', color: 'bg-red-600', hover: 'hover:bg-red-700', border: 'border-red-500/30' },
    { id: 'mobilis', name: 'Mobilis', color: 'bg-green-600', hover: 'hover:bg-green-700', border: 'border-green-500/30' },
    { id: 'ooredoo', name: 'Ooredoo', color: 'bg-yellow-600', hover: 'hover:bg-yellow-700', border: 'border-yellow-500/30' }
  ];

  const handleRecharge = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      notify('Please enter a valid phone number', 'error');
      return;
    }
    if (balance < amount) {
      notify('Insufficient balance!', 'error');
      return;
    }

    setBalance(prev => prev - amount);
    notify(`Successfully recharged ${amount} DA to ${phoneNumber}`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
       <div className="text-center space-y-2">
         <h1 className="text-3xl font-bold text-white">Flexy & Recharge</h1>
         <p className="text-gray-400">Instant mobile top-up for all Algerian networks.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Main Action Card */}
         <div className="bg-[#13151b] border border-[#2a2e37] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>
           
           <div className="space-y-6 relative z-10">
             <div>
               <label className="text-sm font-bold text-gray-400 uppercase mb-3 block">Select Operator</label>
               <div className="grid grid-cols-3 gap-3">
                 {operators.map((op) => (
                   <button
                     key={op.id}
                     onClick={() => setSelectedOperator(op.id)}
                     className={`py-3 rounded-xl font-bold text-white text-sm transition-all border ${
                       selectedOperator === op.id 
                         ? `${op.color} ${op.border} shadow-lg scale-105` 
                         : 'bg-[#181b21] border-[#2a2e37] text-gray-400 hover:text-white'
                     }`}
                   >
                     {op.name}
                   </button>
                 ))}
               </div>
             </div>

             <div>
               <label className="text-sm font-bold text-gray-400 uppercase mb-3 block">Phone Number</label>
               <div className="relative">
                 <Smartphone className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                 <input 
                   type="text"
                   value={phoneNumber}
                   onChange={(e) => setPhoneNumber(e.target.value)} 
                   placeholder="07 70 XX XX XX" 
                   className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-3.5 pl-12 pr-4 text-white text-lg tracking-wider focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-600 font-mono"
                 />
               </div>
             </div>

             <div>
               <div className="flex justify-between items-center mb-3">
                 <label className="text-sm font-bold text-gray-400 uppercase">Amount (DA)</label>
                 <span className="text-indigo-400 font-bold">{amount} DA</span>
               </div>
               <input 
                 type="range" 
                 min="100" 
                 max="5000" 
                 step="100" 
                 value={amount}
                 onChange={(e) => setAmount(Number(e.target.value))}
                 className="w-full h-2 bg-[#2a2e37] rounded-lg appearance-none cursor-pointer accent-indigo-500"
               />
               <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                 <span>100</span>
                 <span>1000</span>
                 <span>2000</span>
                 <span>5000</span>
               </div>
             </div>

             <button 
               onClick={handleRecharge}
               className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-white/10 mt-4"
             >
               <Zap className="w-5 h-5 fill-current" />
               <span>Recharge Now</span>
             </button>
           </div>
         </div>

         {/* Right Side: History & Balance */}
         <div className="space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl transition-all duration-300">
             <div className="flex justify-between items-start mb-8">
               <div>
                 <p className="text-indigo-200 text-sm font-medium mb-1">Current Balance</p>
                 <h2 className="text-4xl font-bold">{balance.toLocaleString()} DA</h2>
               </div>
               <div className="bg-white/20 p-2 rounded-lg">
                 <Smartphone className="w-6 h-6 text-white" />
               </div>
             </div>
             <div className="flex items-center text-sm text-indigo-100 bg-black/20 rounded-lg p-3">
               <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
               Wallet Active
             </div>
           </div>

           <div className="bg-[#13151b] border border-[#2a2e37] rounded-3xl p-6">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-white flex items-center">
                 <History className="w-4 h-4 mr-2 text-gray-400" />
                 Recent Transactions
               </h3>
               <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
             </div>
             
             <div className="space-y-3">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center justify-between p-3 hover:bg-[#181b21] rounded-xl transition-colors cursor-pointer group">
                   <div className="flex items-center space-x-3">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${i === 1 ? 'bg-red-500/20 text-red-500' : i === 2 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                       {i === 1 ? 'Dj' : i === 2 ? 'Oo' : 'Mo'}
                     </div>
                     <div>
                       <p className="text-white text-sm font-medium">05 50 12 34 56</p>
                       <p className="text-xs text-gray-500">Today, 10:30 AM</p>
                     </div>
                   </div>
                   <div className="flex items-center space-x-2">
                     <span className="text-white font-mono font-bold">200 DA</span>
                     <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};