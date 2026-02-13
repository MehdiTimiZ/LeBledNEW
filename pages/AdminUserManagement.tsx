import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { useUserRole } from '../hooks/useUserRole';
import { Loader2, ShieldAlert, ShieldCheck, User, Search, Filter, Ban, CheckCircle, ArrowUpCircle, Crown, RefreshCw } from 'lucide-react';

type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'SELLER';

interface UserProfile {
    id: string;
    email: string | null;
    full_name: string | null;
    role: UserRole;
    is_active?: boolean;
    created_at: string;
    phone?: string;
}

export default function AdminUserManagement() {
    const { isSuperAdmin } = useUserRole();
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    async function fetchProfiles() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProfiles(data || []);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoading(false);
        }
    }

    async function updateRole(userId: string, newRole: UserRole) {
        setActionLoading(userId);
        setProfiles((prev) =>
            prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
        );
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);
            if (error) throw error;
        } catch (error) {
            console.error('Error updating role:', error);
            fetchProfiles();
        } finally {
            setActionLoading(null);
        }
    }

    async function toggleActive(userId: string, currentlyActive: boolean) {
        setActionLoading(userId);
        setProfiles(prev => prev.map(p => p.id === userId ? { ...p, is_active: !currentlyActive } : p));
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: !currentlyActive })
                .eq('id', userId);
            if (error) throw error;
        } catch (error) {
            console.error('Error toggling active:', error);
            fetchProfiles();
        } finally {
            setActionLoading(null);
        }
    }

    const filteredProfiles = profiles.filter(p => {
        const matchesSearch = (p.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || p.role?.toLowerCase() === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const stats = {
        total: profiles.length,
        admins: profiles.filter(p => ['ADMIN', 'SUPER_ADMIN'].includes(p.role)).length,
        sellers: profiles.filter(p => p.role === 'SELLER').length,
        inactive: profiles.filter(p => p.is_active === false).length,
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'bg-purple-900/50 text-purple-200 border-purple-800';
            case 'ADMIN': return 'bg-red-900/50 text-red-200 border-red-800';
            case 'SELLER': return 'bg-emerald-900/50 text-emerald-200 border-emerald-800';
            default: return 'bg-gray-800 text-gray-300 border-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-indigo-500" />
                        User Management
                    </h1>
                    <p className="text-gray-400">Manage users, roles, and permissions.</p>
                </div>
                <button
                    onClick={fetchProfiles}
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#13151b] border border-[#2a2e37] text-gray-300 px-4 py-2.5 rounded-xl hover:bg-[#1a1d25] transition-colors text-sm font-medium"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-5">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 w-fit mb-3"><User className="w-5 h-5" /></div>
                    <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Users</h3>
                    <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
                </div>
                <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-5">
                    <div className="p-2.5 bg-red-500/10 rounded-xl text-red-400 w-fit mb-3"><Crown className="w-5 h-5" /></div>
                    <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Admins</h3>
                    <p className="text-2xl font-bold text-white mt-1">{stats.admins}</p>
                </div>
                <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-5">
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 w-fit mb-3"><ArrowUpCircle className="w-5 h-5" /></div>
                    <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Sellers</h3>
                    <p className="text-2xl font-bold text-white mt-1">{stats.sellers}</p>
                </div>
                <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl p-5">
                    <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 w-fit mb-3"><Ban className="w-5 h-5" /></div>
                    <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Inactive</h3>
                    <p className="text-2xl font-bold text-white mt-1">{stats.inactive}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#13151b] border border-[#2a2e37] rounded-2xl overflow-hidden">
                {/* Filters */}
                <div className="p-5 border-b border-[#2a2e37] flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Filter className="w-4 h-4 text-gray-500 shrink-0" />
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
                            className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                        />
                    </div>
                </div>

                {/* Table content */}
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
                            {filteredProfiles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : filteredProfiles.map((profile) => {
                                const isActive = profile.is_active !== false;
                                return (
                                    <tr key={profile.id} className="hover:bg-[#181b21]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-800 p-2 rounded-full shrink-0">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-white truncate">{profile.full_name || 'No name'}</div>
                                                    <div className="text-xs truncate">{profile.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getRoleBadge(profile.role)}`}>
                                                {profile.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1.5 ${isActive ? 'text-green-400' : 'text-red-400'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                                {isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {new Date(profile.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-1.5">
                                                {actionLoading === profile.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                                ) : (
                                                    <>
                                                        {/* Activate / Deactivate */}
                                                        <button
                                                            onClick={() => toggleActive(profile.id, isActive)}
                                                            className={`p-1.5 rounded text-xs ${isActive
                                                                ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                                                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                                }`}
                                                            title={isActive ? 'Deactivate' : 'Activate'}
                                                        >
                                                            {isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                        </button>

                                                        {/* Upgrade to Seller */}
                                                        {profile.role === 'USER' && (
                                                            <button
                                                                onClick={() => updateRole(profile.id, 'SELLER')}
                                                                className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                                                title="Upgrade to Seller"
                                                            >
                                                                <ArrowUpCircle className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* Promote to Admin (SuperAdmin only) */}
                                                        {isSuperAdmin && !['ADMIN', 'SUPER_ADMIN'].includes(profile.role) && (
                                                            <button
                                                                onClick={() => updateRole(profile.id, 'ADMIN')}
                                                                className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                                                title="Promote to Admin"
                                                            >
                                                                <Crown className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* Role dropdown (SuperAdmin only) */}
                                                        {isSuperAdmin && profile.role !== 'SUPER_ADMIN' && (
                                                            <select
                                                                    value={profile.role}
                                                                    onChange={(e) => updateRole(profile.id, e.target.value as UserRole)}
                                                                    className="h-8 bg-[#0f1117] border border-[#2a2e37] rounded-lg px-2 text-xs text-gray-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                                                                >
                                                                    <option value="USER">User</option>
                                                                    <option value="SELLER">Seller</option>
                                                                    <option value="ADMIN">Admin</option>
                                                                </select>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {!isSuperAdmin && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-orange-950/20 border border-orange-900/50 text-orange-200">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <p className="text-sm">You are viewing this as an Admin. Only Super Admins can change user roles.</p>
                </div>
            )}
        </div>
    );
}
