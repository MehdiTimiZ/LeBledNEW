import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { Loader2, ShieldAlert, ShieldCheck, User } from 'lucide-react';

interface UserProfile {
    id: string;
    email: string | null;
    role: UserRole;
    created_at: string;
}

export default function AdminUserManagement() {
    const { isSuperAdmin } = useUserRole();
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfiles();
    }, []);

    async function fetchProfiles() {
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
        // Optimistic update
        setProfiles((prev) =>
            prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
        );

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error updating role:', error);
            // Revert on error
            fetchProfiles();
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg text-white">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-indigo-500" />
                            Administrative User Management
                        </h2>
                        <div className="px-3 py-1 border border-indigo-500/20 text-indigo-400 text-sm rounded-full">
                            Only visible to Admins
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="rounded-md border border-gray-800 overflow-hidden">
                        <div className="w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b bg-gray-950">
                                    <tr className="border-gray-800 transition-colors hover:bg-gray-900/50 data-[state=selected]:bg-gray-900">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">User</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Role</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Registered</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {profiles.map((profile) => (
                                        <tr key={profile.id} className="border-b border-gray-800 transition-colors hover:bg-gray-800/50 data-[state=selected]:bg-gray-900">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-gray-800 p-2 rounded-full">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <span className="font-medium">{profile.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${profile.role === 'SUPER_ADMIN'
                                                        ? 'bg-purple-900/50 text-purple-200 border-purple-800'
                                                        : profile.role === 'ADMIN'
                                                            ? 'bg-indigo-900/50 text-indigo-200 border-indigo-800'
                                                            : 'bg-gray-800 text-gray-300 border-gray-700'
                                                    }`}>
                                                    {profile.role}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-gray-400">
                                                {new Date(profile.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <select
                                                    disabled={!isSuperAdmin || profile.role === 'SUPER_ADMIN'}
                                                    value={profile.role}
                                                    onChange={(e) => updateRole(profile.id, e.target.value as UserRole)}
                                                    className="flex h-10 w-[140px] items-center justify-between rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="USER">User</option>
                                                    <option value="ADMIN">Admin</option>
                                                    <option value="SUPER_ADMIN" disabled>Super Admin</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {!isSuperAdmin && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-orange-950/20 border border-orange-900/50 text-orange-200">
                    <ShieldAlert className="w-5 h-5" />
                    <p>You are viewing this as an Admin. Only Super Admins can change user roles.</p>
                </div>
            )}
        </div>
    );
}
