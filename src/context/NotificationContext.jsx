import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [lastPush, setLastPush] = useState(null);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setUnread(0);
      setLastPush(null);
      return;
    }

    api.get('/notifications', { params: { limit: 20 } }).then((res) => setItems(res.data.items));
    api.get('/notifications/unread-count').then((res) => setUnread(res.data.count));

    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token: localStorage.getItem('token') }
    });

    socket.on('notification:new', (notification) => {
      setItems((prev) => [notification, ...prev]);
      setUnread((prev) => prev + 1);
      setLastPush(notification);
      toast(notification.message);
    });

    return () => socket.disconnect();
  }, [user]);

  async function markRead(id) {
    await api.patch(`/notifications/${id}/read`);
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    setUnread((prev) => Math.max(prev - 1, 0));
  }

  async function markAllRead() {
    await api.patch('/notifications/read-all');
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  }

  return (
    <NotificationContext.Provider value={{ items, unread, lastPush, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
