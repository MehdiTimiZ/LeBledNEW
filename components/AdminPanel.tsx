import React, { useState } from 'react';
import { Users, ShieldAlert, Activity, Search, MoreVertical, Ban, CheckCircle, Trash2 } from 'lucide-react';

interface MockUser {
  id: number;
  name: string;
  email: string;
  role: 'User' | 'Seller' | 'Admin';
  status: 'Active' | 'Banned' | 'Pending';
  joined: string;
  reports: number;
}

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<MockUser[]>([
    { id: 1, name: 'Amine Khelifi', email: 'amine@example.com', role: 'Seller', status: 'Active', joined: 'Oct 2023', reports: 0 },
    { id: 2, name: 'Bad Guy', email: 'scammer@example.com', role: 'User', status: 'Active', joined: 'Feb 2024', reports: 12 },
    { id: 3, name: 'Sarah Benali', email: 'sarah@example.com', role: 'User', status: 'Pending', joined: 'Jan 2024', reports: 0 },
    { id: 4, name: 'Yacine Tech', email: 'yacine@tech.dz', role: 'Seller', status: 'Banned', joined: 'Nov 2023', reports: 5 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleAction = (id: number, action: 'ban' | 'verify' | 'delete') => {
    setUsers(users.map((u): MockUser => {
      if (u.id !== id) return u;
      if (action === 'ban') return { ...u, status: 'Banned' };
      if (action === 'verify') return { ...u, status: 'Active' };
      return u;
    }).filter(u => action !== 'delete' || u.id !== id));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <ShieldAlert className="w-8 h-8 mr-3 text-red-500" />
            Super User Panel
          </h1>
          <p className="text-gray-400">Manage users, review reports, and oversee platform security.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
               <Users className="w-6 h-6" />
             </div>
             <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-lg">+24 today</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
          <p className="text-2xl font-bold text-white mt-1">12,403</p>
        </div>
        <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
               <ShieldAlert className="w-6 h-6" />
             </div>
             <span className="text-xs font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded-lg">High Priority</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Pending Reports</h3>
          <p className="text-2xl font-bold text-white mt-1">18</p>
        </div>
        <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
               <Activity className="w-6 h-6" />
             </div>
             <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg">Healthy</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">System Status</h3>
          <p className="text-2xl font-bold text-white mt-1">99.9% Uptime</p>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#2a2e37] flex flex-col md:flex-row justify-between items-center gap-4">
           <h2 className="text-xl font-bold text-white">User Management</h2>
           <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
             <input 
               type="text" 
               placeholder="Search users..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50"
             />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#181b21] uppercase font-bold text-xs text-gray-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Reports</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e37]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#181b21]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold text-white">{user.name}</div>
                      <div className="text-xs">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      user.role === 'Admin' ? 'bg-red-500/10 text-red-400' : 'bg-[#2a2e37] text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center space-x-1.5 ${
                      user.status === 'Active' ? 'text-green-400' : 
                      user.status === 'Banned' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.status === 'Active' ? 'bg-green-400' : 
                        user.status === 'Banned' ? 'bg-red-400' : 'bg-amber-400'
                      }`}></span>
                      <span>{user.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.joined}</td>
                  <td className="px-6 py-4">
                    {user.reports > 0 && (
                      <span className="text-red-400 font-bold flex items-center">
                        <ShieldAlert className="w-3 h-3 mr-1" />
                        {user.reports}
                      </span>
                    )}
                    {user.reports === 0 && <span className="text-gray-600">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end space-x-2">
                       {user.status !== 'Active' && (
                         <button onClick={() => handleAction(user.id, 'verify')} className="p-1.5 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20" title="Verify/Unban">
                           <CheckCircle className="w-4 h-4" />
                         </button>
                       )}
                       {user.status !== 'Banned' && (
                         <button onClick={() => handleAction(user.id, 'ban')} className="p-1.5 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" title="Ban User">
                           <Ban className="w-4 h-4" />
                         </button>
                       )}
                       <button onClick={() => handleAction(user.id, 'delete')} className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20" title="Delete Data">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};