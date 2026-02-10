import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Activity } from 'lucide-react';
import { StatCardProps } from '../types';

const data = [
  { name: 'Lun', visits: 4000, orders: 2400 },
  { name: 'Mar', visits: 3000, orders: 1398 },
  { name: 'Mer', visits: 2000, orders: 9800 },
  { name: 'Jeu', visits: 2780, orders: 3908 },
  { name: 'Ven', visits: 1890, orders: 4800 },
  { name: 'Sam', visits: 2390, orders: 3800 },
  { name: 'Dim', visits: 3490, orders: 4300 },
];

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon }) => (
  <div className="glass-card p-6 rounded-2xl shadow-lg hover:bg-white/5 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${isPositive ? 'bg-primary-500/20' : 'bg-red-500/20'}`}>
        {icon}
      </div>
      <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
        isPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
      }`}>
        {change}
      </span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Marhba, Mehdi</h1>
          <p className="text-slate-400">Voici ce qui se passe dans votre communauté aujourd'hui.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/20 border border-primary-500/50">
          Nouvelle Publication
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Membres" 
          value="12,345" 
          change="+12%" 
          isPositive={true} 
          icon={<Users className="w-6 h-6 text-primary-400" />} 
        />
        <StatCard 
          title="Annonces Actives" 
          value="843" 
          change="+5%" 
          isPositive={true} 
          icon={<ShoppingCart className="w-6 h-6 text-primary-400" />} 
        />
        <StatCard 
          title="Engagement" 
          value="2.4k" 
          change="-2%" 
          isPositive={false} 
          icon={<Activity className="w-6 h-6 text-primary-400" />} 
        />
        <StatCard 
          title="Revenus Souq" 
          value="45,200 DA" 
          change="+18%" 
          isPositive={true} 
          icon={<TrendingUp className="w-6 h-6 text-primary-400" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6">Aperçu de l'Activité</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dx={-10} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    border: '1px solid #334155', 
                    color: '#fff',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVisits)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6">Activité Récente</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <img 
                  src={`https://picsum.photos/40/40?random=${i + 10}`} 
                  alt="User" 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 shadow-sm"
                />
                <div>
                  <p className="text-sm font-medium text-white">Nouvelle annonce ajoutée</p>
                  <p className="text-xs text-slate-400 mt-0.5">Karim a ajouté "Service à Thé Vintage"</p>
                  <span className="text-xs text-slate-500 block mt-1">il y a 2 min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};