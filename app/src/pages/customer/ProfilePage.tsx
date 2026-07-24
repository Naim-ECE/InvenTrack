import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Lock, Bell, Package, Heart, Star, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Bell },
];

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    line1: user?.address?.line1 || '',
    line2: user?.address?.line2 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || 'USA',
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || '',
      phone: user?.phone || '',
      avatar: user?.avatar || '',
      line1: user?.address?.line1 || '',
      line2: user?.address?.line2 || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zip: user?.address?.zip || '',
      country: user?.address?.country || 'USA',
    });
  }, [user]);

  const setField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const uploadAvatar = async (file: File) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      toast.error('Cloudinary upload is not configured');
      return;
    }

    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', uploadPreset);
    body.append('folder', 'inventory-app/profiles');

    try {
      setIsUploading(true);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body,
      });
      if (!response.ok) throw new Error('Avatar upload failed');
      const data = await response.json();
      setField('avatar', data.secure_url);
      toast.success('Avatar uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Avatar upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        avatar: form.avatar,
        address: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
      });
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Profile update failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#0F172A] font-[Poppins] mb-6">My Profile</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${activeTab === tab.id ? 'bg-[#22C55E] text-white' : 'text-[#64748B] hover:bg-[#F8FAFC]'}`}>
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  {form.avatar ? (
                    <img src={form.avatar} alt={user?.name || 'Profile'} className="w-20 h-20 rounded-full object-cover border border-[#E2E8F0]" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#22C55E] flex items-center justify-center text-white text-2xl font-bold">{user?.name?.charAt(0) || 'U'}</div>
                  )}
                  <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center cursor-pointer hover:bg-[#1E293B] transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void uploadAvatar(file);
                      }}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A]">{user?.name}</h3>
                  <p className="text-sm text-[#64748B]">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-[rgba(34,197,94,0.1)] text-[#22C55E] text-xs font-medium rounded-full capitalize">{user?.role}</span>
                  {isUploading && <p className="text-xs text-[#64748B] mt-1">Uploading avatar...</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[{ icon: Package, label: 'Orders', value: '12' }, { icon: Heart, label: 'Wishlist', value: '8' }, { icon: Star, label: 'Reviews', value: '5' }].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-4 text-center">
                      <Icon className="w-6 h-6 text-[#22C55E] mx-auto mb-2" />
                      <p className="text-xl font-bold text-[#0F172A] font-[Montserrat]">{stat.value}</p>
                      <p className="text-xs text-[#64748B]">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
                <h4 className="text-sm font-semibold text-[#0F172A] mb-4">Edit Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#64748B] mb-1.5">Full Name</label>
                    <input type="text" value={form.name} onChange={(event) => setField('name', event.target.value)} className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:border-[#22C55E] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#64748B] mb-1.5">Email</label>
                    <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-sm text-[#64748B] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#64748B] mb-1.5">Phone</label>
                    <input type="tel" value={form.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="+1 555-0123" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:border-[#22C55E] outline-none" />
                  </div>
                </div>
                <button onClick={handleSave} disabled={isLoading || isUploading} className="mt-4 px-6 py-2.5 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A] transition-colors disabled:opacity-50">Save Changes</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'addresses' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-[#0F172A]">Saved Addresses</h4>
                <button className="px-4 py-2 bg-[#22C55E] text-white text-xs font-medium rounded-lg hover:bg-[#16A34A] transition-colors">Add New</button>
              </div>
              <div className="space-y-3">
                <div className="border border-[#22C55E] rounded-xl p-4 relative">
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-[rgba(34,197,94,0.1)] text-[#22C55E] text-[10px] font-medium rounded-full">Default</span>
                  <p className="text-sm font-medium text-[#0F172A]">{user?.name || 'Primary Address'}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <input value={form.line1} onChange={(event) => setField('line1', event.target.value)} placeholder="Address line 1" className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm outline-none" />
                    <input value={form.line2} onChange={(event) => setField('line2', event.target.value)} placeholder="Address line 2" className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm outline-none" />
                    <input value={form.city} onChange={(event) => setField('city', event.target.value)} placeholder="City" className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm outline-none" />
                    <input value={form.state} onChange={(event) => setField('state', event.target.value)} placeholder="State" className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm outline-none" />
                    <input value={form.zip} onChange={(event) => setField('zip', event.target.value)} placeholder="ZIP" className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm outline-none" />
                    <input value={form.country} onChange={(event) => setField('country', event.target.value)} placeholder="Country" className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm outline-none" />
                  </div>
                  <button onClick={handleSave} disabled={isLoading} className="mt-4 px-4 py-2 bg-[#22C55E] text-white text-xs font-medium rounded-lg hover:bg-[#16A34A] transition-colors disabled:opacity-50">Save Address</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
              <h4 className="text-sm font-semibold text-[#0F172A] mb-4">Change Password</h4>
              <input type="password" placeholder="Current Password" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:border-[#22C55E] outline-none" />
              <input type="password" placeholder="New Password" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:border-[#22C55E] outline-none" />
              <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:border-[#22C55E] outline-none" />
              <button className="px-6 py-2.5 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A] transition-colors">Update Password</button>
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
              <h4 className="text-sm font-semibold text-[#0F172A] mb-4">Notification Preferences</h4>
              {[{ label: 'Email notifications for orders', checked: true }, { label: 'SMS notifications', checked: false }, { label: 'Marketing emails', checked: true }, { label: 'Product recommendations', checked: true }].map((pref, i) => (
                <label key={i} className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-0">
                  <span className="text-sm text-[#0F172A]">{pref.label}</span>
                  <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${pref.checked ? 'bg-[#22C55E]' : 'bg-[#E2E8F0]'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${pref.checked ? 'left-[22px]' : 'left-0.5'}`} />
                  </div>
                </label>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
