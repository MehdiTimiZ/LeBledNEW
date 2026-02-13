import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert, Activity, Search, Ban, CheckCircle, Trash2, ArrowUpCircle, Crown, Filter, RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from '../supabase/client';
import { UserProfile, UserRole } from '../types';

interface SupabaseUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  phone?: string;
}

interface AdminPanelProps {
  currentUser: UserProfile | null;
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, notify }) => {
  const [users, setUsers] = useState<SupabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, is_active, created_at, phone')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      notify('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId: string, currentlyActive: boolean) => {
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentlyActive })
        .eq('id', userId);

      if (error) throw error;
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentlyActive } : u));
      notify(`User ${!currentlyActive ? 'activated' : 'deactivated'}`, 'success');
    } catch (err: any) {
      notify('Action failed: ' + err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpgradeToSeller = async (userId: string) => {
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'SELLER' })
        .eq('id', userId);

      if (error) throw error;
      setUsers(users.map(u => u.id === userId ? { ...u, role: 'SELLER' } : u));
      notify('User upgraded to Seller!', 'success');
    } catch (err: any) {
      notify('Upgrade failed: ' + err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssignAdmin = async (userId: string) => {
    if (!isSuperAdmin) return;
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'ADMIN' })
        .eq('id', userId);

      if (error) throw error;
      setUsers(users.map(u => u.id === userId ? { ...u, role: 'ADMIN' } : u));
      notify('User promoted to Admin!', 'success');
    } catch (err: any) {
      notify('Promotion failed: ' + err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => ['ADMIN', 'SUPER_ADMIN'].includes(u.role)).length,
    sellers: users.filter(u => u.role === 'SELLER').length,
    inactive: users.filter(u => !u.is_active).length,
  };

  const getRoleBadge = (role: string) => {
    const r = role?.toUpperCase();
    if (r === 'SUPER_ADMIN') return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if (r === 'ADMIN') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (r === 'SELLER') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    return 'bg-gray-700/20 text-gray-400 border-gray-700/30';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <ShieldAlert className="w-8 h-8 mr-3 text-red-500" />
            User Management
          </h1>
          <p className="text-gray-400">Manage users, roles, and permissions.</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 bg-[#13151b] border border-[#2a2e37] text-gray-300 px-4 py-2 rounded-xl hover:bg-[#1a1d25] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.total, icon: Users, color: 'blue' },
          { label: 'Admins', value: stats.admins, icon: Crown, color: 'red' },
          { label: 'Sellers', value: stats.sellers, icon: Activity, color: 'emerald' },
          { label: 'Inactive', value: stats.inactive, icon: Ban, color: 'amber' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-5">
            <div className={`p-2.5 bg-${stat.color}-500/10 rounded-xl text-${stat.color}-400 w-fit mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wide">{stat.label}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[#2a2e37] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex bg-[#0f1117] rounded-xl p-1 border border-[#2a2e37]">
              {['all', 'user', 'seller', 'admin'].map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${roleFilter === role
                      ? 'bg-[#1e2028] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
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

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          </div>
        ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#181b21] uppercase font-bold text-xs text-gray-500">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2e37]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#181b21]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                        <div className="font-bold text-white">{user.full_name || 'No name'}</div>
                        <div className="text-xs">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${getRoleBadge(user.role)}`}>
                        {user.role || 'USER'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 ${user.is_active !== false ? 'text-green-400' : 'text-red-400'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.is_active !== false ? 'bg-green-400' : 'bg-red-400'
                          }`}></span>
                        {user.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        {actionLoading === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <>
                            {/* Toggle active/inactive */}
                            <button
                              onClick={() => handleToggleActive(user.id, user.is_active !== false)}
                              className={`p-1.5 rounded text-xs ${user.is_active !== false
                                  ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                  : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                }`}
                              title={user.is_active !== false ? 'Deactivate' : 'Activate'}
                            >
                              {user.is_active !== false ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </button>

                            {/* Upgrade to Seller */}
                            {user.role?.toUpperCase() === 'USER' && (
                              <button
                                onClick={() => handleUpgradeToSeller(user.id)}
                                className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                title="Upgrade to Seller"
                              >
                                <ArrowUpCircle className="w-4 h-4" />
                              </button>
                            )}

                              {/* Assign Admin - SuperAdmin only */}
                              {isSuperAdmin && !['ADMIN', 'SUPER_ADMIN'].includes(user.role?.toUpperCase()) && (
                                <button
                                  onClick={() => handleAssignAdmin(user.id)}
                                  className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                  title="Promote to Admin"
                                >
                                  <Crown className="w-4 h-4" />
                                </button>
                              )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
    </div>
  );
};