import React, { useState } from 'react';
import { Smartphone, Zap, History, ChevronRight, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useFlexy } from '../hooks/useFlexy';
import { UserProfile } from '../types';

interface FlexyProps {
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  currentUser?: UserProfile | null;
}

export const Flexy: React.FC<FlexyProps> = ({ notify, currentUser }) => {
  const [selectedOperator, setSelectedOperator] = useState<string>('djezzy');
  const [amount, setAmount] = useState<number>(100);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { transactions, loading, recharge } = useFlexy(currentUser?.id);

  const operators = [
    { id: 'djezzy', name: 'Djezzy', color: 'bg-red-600', hover: 'hover:bg-red-700', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-500' },
    { id: 'mobilis', name: 'Mobilis', color: 'bg-green-600', hover: 'hover:bg-green-700', border: 'border-green-500/30', badge: 'bg-green-500/20 text-green-500' },
    { id: 'ooredoo', name: 'Ooredoo', color: 'bg-yellow-600', hover: 'hover:bg-yellow-700', border: 'border-yellow-500/30', badge: 'bg-yellow-500/20 text-yellow-500' }
  ];

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleRecharge = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      notify('Please enter a valid phone number', 'error');
      return;
    }

    const success = await recharge(selectedOperator, phoneNumber, amount);
    if (success) {
      notify(`Successfully recharged ${amount} DA to ${phoneNumber} via ${selectedOperator.charAt(0).toUpperCase() + selectedOperator.slice(1)}`, 'success');
      setPhoneNumber('');
      setAmount(100);
    } else {
      notify('Recharge failed. Please try again.', 'error');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const getOperatorInfo = (op: string) => {
    return operators.find(o => o.id === op) || operators[0];
  };

  // Total spent from real transactions
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

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
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {quickAmounts.map((qa) => (
                  <button
                    key={qa}
                    onClick={() => setAmount(qa)}
                    className={`py-2 rounded-lg text-sm font-bold transition-all border ${amount === qa
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                        : 'bg-[#0f1117] text-gray-400 border-[#2a2e37] hover:border-gray-600'
                      }`}
                  >
                    {qa.toLocaleString()}
                  </button>
                ))}
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
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-white/10 mt-4"
             >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /><span>Processing...</span></>
              ) : (
                <><Zap className="w-5 h-5 fill-current" /><span>Recharge Now</span></>
              )}
             </button>
           </div>
         </div>

        {/* Right Side: Stats & History */}
         <div className="space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl transition-all duration-300">
             <div className="flex justify-between items-start mb-8">
               <div>
                <p className="text-indigo-200 text-sm font-medium mb-1">Total Recharged</p>
                <h2 className="text-4xl font-bold">{totalSpent.toLocaleString()} DA</h2>
               </div>
               <div className="bg-white/20 p-2 rounded-lg">
                 <Smartphone className="w-6 h-6 text-white" />
               </div>
             </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-indigo-100 bg-black/20 rounded-lg p-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                {transactions.length} Transactions
              </div>
              <span className="text-xs text-indigo-200">
                {currentUser ? 'Synced with Supabase' : 'Sign in to save'}
              </span>
             </div>
           </div>

           <div className="bg-[#13151b] border border-[#2a2e37] rounded-3xl p-6">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-white flex items-center">
                 <History className="w-4 h-4 mr-2 text-gray-400" />
                 Recent Transactions
               </h3>
              <span className="text-xs text-gray-500">{transactions.length} total</span>
             </div>
             
             <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Zap className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No transactions yet</p>
                  <p className="text-xs text-gray-600 mt-1">Your recharge history will appear here</p>
                </div>
              ) : (
                transactions.slice(0, 5).map((tx) => {
                  const opInfo = getOperatorInfo(tx.operator);
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-[#181b21] rounded-xl transition-colors group">
                      <div className="flex items-center space-x-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${opInfo.badge}`}>
                           {tx.operator.substring(0, 2).toUpperCase()}
                         </div>
                         <div>
                           <p className="text-white text-sm font-medium">{tx.phone_number}</p>
                           <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
                         </div>
                       </div>
                       <div className="flex items-center space-x-2">
                         {tx.status === 'completed' ? (
                           <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                         ) : (
                           <XCircle className="w-3.5 h-3.5 text-red-500" />
                         )}
                         <span className="text-white font-mono font-bold">{tx.amount} DA</span>
                         <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                       </div>
                     </div>
                   );
                 })
              )}
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};