
import { create } from 'zustand';
import type { User, UserRole, Notification } from '../types';
import { MOCK_USERS, CREDENTIALS } from '../data/mockData';

const DEFAULT_NOTIFICATIONS = Object.fromEntries(MOCK_USERS.map(u => [u.id, [] as Notification[]]));

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  darkMode: boolean;
  notificationsByUser: Record<string, Notification[]>;
  login: (email: string, password: string, role: UserRole, isDemoMode?: boolean) => { success: boolean; error?: string };
  logout: () => void;
  toggleDarkMode: () => void;
  addNotificationForUser: (userId: string, notification: Notification) => void;
  markNotificationRead: (userId: string, notificationId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isDemoMode: false,
  darkMode: false,
  notificationsByUser: DEFAULT_NOTIFICATIONS,

  login: (email: string, password: string, role: UserRole, isDemoMode = false) => {
    const expectedPassword = CREDENTIALS[email];
    if (!expectedPassword || expectedPassword !== password) {
      return { success: false, error: 'Invalid email or password.' };
    }
    const user = MOCK_USERS.find(u => u.email === email && u.role === role);
    if (!user) {
      return { success: false, error: 'Role does not match this account. Please select the correct role.' };
    }
    set({ user, isAuthenticated: true, isDemoMode });
    return { success: true };
  },

  logout: () => set({ user: null, isAuthenticated: false, isDemoMode: false }),

  toggleDarkMode: () => {
    const next = !get().darkMode;
    set({ darkMode: next });
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  addNotificationForUser: (userId: string, notification: Notification) => {
    set(state => ({
      notificationsByUser: {
        ...state.notificationsByUser,
        [userId]: [
          ...(state.notificationsByUser[userId] ?? []),
          notification,
        ],
      },
    }));
  },

  markNotificationRead: (userId: string, notificationId: string) => {
    set(state => ({
      notificationsByUser: {
        ...state.notificationsByUser,
        [userId]: (state.notificationsByUser[userId] ?? []).map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      },
    }));
  },
}));
