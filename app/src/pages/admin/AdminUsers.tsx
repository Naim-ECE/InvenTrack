import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Pencil, Ban } from 'lucide-react';
import { authApi } from '@/lib/apis/authApi';
import type { User } from '@/types';

type AdminUser = User & {
  isActive?: boolean;
};

const roleColors: Record<string, string> = {
  customer: 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]',
  vendor: 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]',
  inventory_manager: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]',
  admin: 'bg-[rgba(139,92,246,0.15)] text-[#8B5CF6]',
};

const statusColors: Record<string, string> = {
  active: 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]',
  suspended: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
  pending: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]',
};

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const liveUsers = await authApi.getUsers({ role: roleFilter === 'all' ? undefined : roleFilter as 'customer' | 'vendor' | 'inventory_manager' | 'admin' });
        if (active) {
          setUsers(liveUsers);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load users');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      active = false;
    };
  }, [roleFilter]);

  const filtered = useMemo(
    () => users.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
    [search, users]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Users</h2>
        <p className="text-sm text-[#9CA3AF]">{filtered.length} users</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 bg-[#111827] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#22C55E] outline-none" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2.5 bg-[#111827] border border-[#2D3748] rounded-lg text-sm text-[#9CA3AF] outline-none">
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="inventory_manager">Inventory Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-[#111827] border border-[#2D3748] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading && <div className="px-4 py-6 text-sm text-[#9CA3AF]">Loading live users from MongoDB...</div>}
          {error && !isLoading && <div className="px-4 py-6 text-sm text-[#EF4444]">{error}</div>}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#9CA3AF] text-xs uppercase tracking-wider border-b border-[#1F2937]">
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && !error && filtered.map((u, i) => (
                <motion.tr key={u._id || u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-[#1F2937] hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-white text-xs font-semibold">{u.name[0]}</div>
                      <div>
                        <p className="text-[#F9FAFB] font-medium">{u.name}</p>
                        <p className="text-xs text-[#9CA3AF]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role]}`}>{u.role.replace('_', ' ')}</span></td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[u.isActive === false ? 'suspended' : 'active']}`}>{u.isActive === false ? 'suspended' : 'active'}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 text-[#9CA3AF] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)] rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-[#9CA3AF] hover:text-[#22C55E] hover:bg-[rgba(34,197,94,0.1)] rounded-lg"><Pencil className="w-4 h-4" /></button>
                      <button className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] rounded-lg"><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
