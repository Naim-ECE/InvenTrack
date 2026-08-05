import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Sun, Moon, User, LogOut, Settings, Package, X } from 'lucide-react';
import type { RootState } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { toggleTheme } from '@/store/slices/themeSlice';
import { useDispatch } from 'react-redux';
import { getRoleHomePath } from '@/lib/roles';
import api from '@/lib/api';
import { notificationApi, type NotificationItem } from '@/lib/apis/notificationApi';
import { io, type Socket } from 'socket.io-client';

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

export default function TopBar({ title, onMenuClick }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const { user, logout } = useAuth();
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let active = true;
    let socket: Socket | null = null;

    const loadNotifications = async () => {
      setLoadingNotifications(true);
      setNotificationError(null);

      try {
        const response = await notificationApi.getNotifications();
        if (!active) return;
        setNotifications(response.notifications);
        setUnreadCount(response.unreadCount);
      } catch (error) {
        if (!active) return;
        setNotificationError(error instanceof Error ? error.message : 'Failed to load notifications');
      } finally {
        if (active) {
          setLoadingNotifications(false);
        }
      }
    };

    void loadNotifications();

    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('accessToken');

    if (token) {
      socket = io(socketUrl, {
        auth: { token },
        transports: ['websocket'],
      });

      socket.on('notification:new', (notification: NotificationItem) => {
        if (!active) return;
        setNotifications((current) => {
          if (current.some((item) => item._id === notification._id)) return current;
          return [notification, ...current].slice(0, 100);
        });
        if (!notification.read) {
          setUnreadCount((current) => current + 1);
        }
      });

      socket.on('connect_error', () => {
        if (active) {
          void loadNotifications();
        }
      });
    }

    const refreshTimer = window.setInterval(() => {
      void loadNotifications();
    }, 15000);

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      socket?.disconnect();
    };
  }, [user]);

  const handleMarkAllRead = async () => {
    if (!unreadCount) return;

    try {
      await notificationApi.markAllAsRead();
      setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (error) {
      setNotificationError(error instanceof Error ? error.message : 'Failed to update notifications');
    }
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (notification.read) return;

    try {
      await notificationApi.markAsRead(notification._id);
      setNotifications((current) => current.map((item) => (item._id === notification._id ? { ...item, read: true } : item)));
      setUnreadCount((current) => Math.max(current - 1, 0));
    } catch (error) {
      setNotificationError(error instanceof Error ? error.message : 'Failed to update notification');
    }
  };

  const handleDeleteNotification = async (notification: NotificationItem) => {
    try {
      await api.delete(`/api/notifications/${notification._id}`);
      setNotifications((current) => current.filter((item) => item._id !== notification._id));
      if (!notification.read) {
        setUnreadCount((current) => Math.max(current - 1, 0));
      }
    } catch (error) {
      setNotificationError(error instanceof Error ? error.message : 'Failed to delete notification');
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'customer' ? '/profile' : getRoleHomePath(user.role);
  };

  return (
    <header className="h-16 bg-[#0B1220] border-b border-[#1F2937] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-[#F9FAFB] font-[Poppins]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center bg-[#111827] border border-[#2D3748] rounded-xl px-4 py-2 gap-2 w-64 focus-within:border-[#22C55E] transition-colors">
          <Search className="w-4 h-4 text-[#6B7280]" />
          <input type="text" placeholder="Search..." className="bg-transparent text-sm text-[#F9FAFB] placeholder-[#6B7280] outline-none w-full" />
        </div>

        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-12 w-80 bg-[#1F2937] rounded-xl shadow-2xl border border-[#2D3748] z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D3748]">
                  <h3 className="text-sm font-semibold text-[#F9FAFB]">Notifications</h3>
                  <button onClick={handleMarkAllRead} className="text-xs text-[#22C55E] hover:underline" disabled={!unreadCount}>Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {loadingNotifications && <div className="px-4 py-4 text-sm text-[#9CA3AF]">Loading notifications...</div>}
                  {notificationError && !loadingNotifications && <div className="px-4 py-4 text-sm text-[#EF4444]">{notificationError}</div>}
                  {!loadingNotifications && !notificationError && notifications.length === 0 && (
                    <div className="px-4 py-4 text-sm text-[#9CA3AF]">No notifications yet.</div>
                  )}
                  {!loadingNotifications && !notificationError && notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`relative w-full text-left px-4 py-3 border-b border-[#2D3748] hover:bg-[rgba(255,255,255,0.05)] ${!notification.read ? 'border-l-[3px] border-l-[#22C55E]' : ''}`}
                    >
                      <button
                        type="button"
                        onClick={() => { void handleNotificationClick(notification); }}
                        className="w-full text-left pr-8"
                      >
                        <p className="text-sm text-[#F9FAFB] font-medium">{notification.title}</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">{notification.message}</p>
                        <p className="text-[10px] text-[#6B7280] mt-1">{new Date(notification.createdAt).toLocaleDateString()}</p>
                      </button>
                      <button
                        type="button"
                        aria-label="Delete notification"
                        onClick={() => { void handleDeleteNotification(notification); }}
                        className="absolute right-3 top-3 p-1 rounded-md text-[#6B7280] hover:text-[#F9FAFB] hover:bg-[rgba(255,255,255,0.08)]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#1F2937] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </button>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-12 w-56 bg-[#1F2937] rounded-xl shadow-2xl border border-[#2D3748] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#2D3748]">
                  <p className="text-sm font-medium text-[#F9FAFB]">{user?.name}</p>
                  <p className="text-xs text-[#9CA3AF]">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-[rgba(34,197,94,0.15)] text-[#22C55E] text-[10px] font-medium rounded-full uppercase">{user?.role}</span>
                </div>
                <button onClick={() => { setProfileOpen(false); navigate(getDashboardLink()); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#9CA3AF] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#F9FAFB]">
                  <Package className="w-4 h-4" /> Dashboard
                </button>
                <button onClick={() => { setProfileOpen(false); navigate('/profile'); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#9CA3AF] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#F9FAFB]">
                  <User className="w-4 h-4" /> Profile
                </button>
                <button onClick={() => { setProfileOpen(false); navigate('/vendor/settings'); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#9CA3AF] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#F9FAFB]">
                  <Settings className="w-4 h-4" /> Settings
                </button>
                <div className="border-t border-[#2D3748] mt-1">
                  <button onClick={() => { logout(); setProfileOpen(false); navigate('/'); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[rgba(255,255,255,0.05)]">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
