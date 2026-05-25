
import React, { useState } from 'react';
import {
  LayoutDashboard, BarChart2, FolderOpen, Users, FileText, Calendar, CheckSquare,
  Map, Settings, Bell, Sun, Moon, LogOut, Menu, X, ChevronRight, Activity, ClipboardList
} from 'lucide-react';
import clsx from 'clsx';
import logo from '../assets/accrcc-logo.jpg';
import { useAuthStore } from '../store/authStore';
import SeniorDashboard from './dashboards/SeniorDashboard';
import MentalHealthDashboard from './dashboards/MentalHealthDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import FieldOfficerDashboard from './dashboards/FieldOfficerDashboard';
import SuperviseePanel from './shared/SuperviseePanel';
import LiveActivityFeed from './shared/LiveActivityFeed';
import type { User } from '../types';
import AttendanceModule from './attendance/AttendanceModule';
import type { UserRole } from '../types';

const ROLE_LABELS: Record<UserRole, string> = {
  senior_leader: 'Senior Leader',
  mental_health: 'Mental Health Lead',
  climate_advocacy: 'Climate Advocacy',
  employee: 'Programs Officer',
  field_officer: 'Field Officer',
  volunteer: 'Volunteer',
};

const ROLE_COLORS: Record<UserRole, string> = {
  senior_leader: 'bg-forest-600',
  mental_health: 'bg-teal-600',
  climate_advocacy: 'bg-sky-600',
  employee: 'bg-earth-500',
  field_officer: 'bg-forest-400',
  volunteer: 'bg-teal-400',
};

const ROLE_ACCENT: Record<UserRole, string> = {
  senior_leader: 'from-forest-600 to-teal-600',
  mental_health: 'from-teal-600 to-sky-600',
  climate_advocacy: 'from-sky-600 to-forest-600',
  employee: 'from-earth-500 to-forest-500',
  field_officer: 'from-forest-400 to-teal-500',
  volunteer: 'from-teal-400 to-forest-400',
};

type ActiveView = 'dashboard' | 'attendance';

function DashboardContent({ role, user }: { role: UserRole; user: User }) {
  let main = null;
  if (role === 'senior_leader') main = <SeniorDashboard />;
  if (role === 'mental_health') main = <MentalHealthDashboard />;
  if (role === 'climate_advocacy') main = <EmployeeDashboard isClimateAdvocacy />;
  if (role === 'employee') main = <EmployeeDashboard />;
  if (role === 'field_officer') main = <FieldOfficerDashboard />;
  if (role === 'volunteer') main = <FieldOfficerDashboard isVolunteer />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">{main}</div>
      <div className="lg:col-span-1">
        <SuperviseePanel user={user} />
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { user, logout, darkMode, toggleDarkMode, isDemoMode, notificationsByUser, markNotificationRead } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [attendanceInitialTab, setAttendanceInitialTab] = useState<'dashboard' | 'mark' | 'verify'>('dashboard');

  if (!user) return null;

  const role = user.role;
  const accentGradient = ROLE_ACCENT[role];
  const notifications = notificationsByUser[user.id] ?? [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems: { icon: React.ReactNode; label: string; view?: ActiveView }[] = [
    { icon: <LayoutDashboard size={16} />, label: 'Dashboard', view: 'dashboard' },
    { icon: <BarChart2 size={16} />, label: 'Analytics' },
    { icon: <FolderOpen size={16} />, label: 'Programs' },
    { icon: <Users size={16} />, label: 'Staff' },
    { icon: <FileText size={16} />, label: 'Reports' },
    { icon: <Calendar size={16} />, label: 'Meetings' },
    { icon: <CheckSquare size={16} />, label: 'Tasks' },
    { icon: <Map size={16} />, label: 'GIS Map' },
    { icon: <ClipboardList size={16} />, label: 'Attendance', view: 'attendance' },
  ];

  return (
    <div className={clsx('min-h-screen flex', darkMode ? 'dark' : '')}>
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed top-0 left-0 h-full z-50 w-64 flex flex-col transition-transform duration-300',
        'bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className={clsx('flex items-center gap-3 px-5 py-4 bg-gradient-to-r', accentGradient)}>
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center">
            <img src={logo} alt="ACCRCC logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-white font-display font-bold text-sm leading-tight">ResilienceIQ</div>
            <div className="text-white/70 text-xs">ACCRCC Platform</div>
          </div>
          <button className="ml-auto lg:hidden text-white/80 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold', ROLE_COLORS[role])}>
              {user.avatarInitials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user.fullName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{ROLE_LABELS[role]}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin">
          <div className="section-title">Navigation</div>
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => {
                if (item.view) {
                  setActiveView(item.view);
                  setSidebarOpen(false);
                }
              }}
              className={clsx(
                'sidebar-link w-full text-left',
                item.view && activeView === item.view && 'bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-300 font-semibold'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
              <ChevronRight size={12} className="ml-auto text-gray-300 dark:text-gray-600" />
            </button>
          ))}

          <div className="section-title mt-4">System</div>
          <div className="sidebar-link">
            <Settings size={16} />
            <span>Settings</span>
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-1">
          <button onClick={toggleDarkMode} className="sidebar-link w-full">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button onClick={logout} className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-forest-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} className="text-gray-600 dark:text-gray-400" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-display font-bold text-gray-900 dark:text-white">
              {activeView === 'attendance' ? 'Attendance Management' : `${ROLE_LABELS[role]} Dashboard`}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              {user.department} · {user.location}
            </div>
            {isDemoMode && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
                Demo preview mode · verification disabled
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveView('attendance');
                setAttendanceInitialTab('mark');
              }}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-forest-600 text-white text-xs font-semibold hover:bg-forest-700 transition-all"
            >
              <ClipboardList size={14} /> Mark Attendance
            </button>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-50 dark:bg-forest-900/20 border border-forest-100 dark:border-forest-800">
              <div className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse-slow" />
              <span className="text-xs font-semibold text-forest-700 dark:text-forest-300">Live Data</span>
            </div>

            <LiveActivityFeed />

            <div className="relative">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} className="text-gray-600 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 glass-card rounded-2xl p-3 z-50 animate-fade-in shadow-xl">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    <span>Recent Notifications</span>
                    <span>{unreadCount} unread</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="text-center text-xs text-gray-400 py-6">No notifications yet.</div>
                  ) : (
                    notifications.slice(-6).reverse().map(n => (
                      <button
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(user.id, n.id);
                        }}
                        className="w-full text-left flex items-start gap-2 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-xl px-2 transition-all"
                      >
                        <div className={clsx('w-2 h-2 rounded-full mt-1 shrink-0', n.read ? 'bg-slate-300' : 'bg-forest-500')} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-800 dark:text-gray-100">{n.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{n.message}</div>
                        </div>
                        <span className="text-[11px] text-gray-400 shrink-0">{n.time}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle dark mode">
              {darkMode ? <Sun size={18} className="text-gray-400" /> : <Moon size={18} className="text-gray-600" />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-6 py-6">
          {activeView === 'attendance' ? (
            <AttendanceModule
              userRole={role}
              userId={user.id}
              userName={user.fullName}
              userDept={user.department}
              initialTab={attendanceInitialTab}
            />
          ) : (
            <DashboardContent role={role} user={user} />
          )}
        </main>
      </div>
    </div>
  );
}
