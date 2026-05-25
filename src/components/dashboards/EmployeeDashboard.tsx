
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileText, CheckSquare, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import KPICard from '../shared/KPICard';
import TeamAnalyticsPanel from '../shared/TeamAnalyticsPanel';
import { useAuthStore } from '../../store/authStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import { toAttendanceRole, canMonitor, isDirectSupervisee } from '../../utils/roleUtils';
import MeetingsModule from '../shared/MeetingsModule';
import { TASKS, PROJECTS, MONTHLY_ACTIVITY, NOTIFICATIONS } from '../../data/mockData';
import type { KPI } from '../../types';

const DEPT_KPIS: KPI[] = [
  { id: 'dk1', label: 'Dept Projects', value: 3, unit: '', change: 1, changeDir: 'up', icon: 'FolderOpen', color: 'forest' },
  { id: 'dk2', label: 'My Tasks', value: 8, unit: '', change: 2, changeDir: 'up', icon: 'FileText', color: 'sky' },
  { id: 'dk3', label: 'Reports Filed', value: 11, unit: '', change: 3, changeDir: 'up', icon: 'UserCheck', color: 'teal' },
  { id: 'dk4', label: 'Attendance', value: 84, unit: '%', change: 1, changeDir: 'up', icon: 'TrendingUp', color: 'earth' },
];

export default function EmployeeDashboard({ isClimateAdvocacy = false }: { isClimateAdvocacy?: boolean }) {
  const auth = useAuthStore();
  const user = auth.user;
  const records = useAttendanceStore(s => s.records);
  const visibleRecords = user ? records.filter(r => r.userId === user.id || canMonitor(toAttendanceRole(user.role), r.role) || r.assignedSupervisorId === user.id || isDirectSupervisee(user.id, r.userId)) : [];
  const [activeSection, setActiveSection] = useState('overview');
  const assigneeName = isClimateAdvocacy ? 'Fatima Al-Rashid' : 'Emmanuel Boateng';
  const myTasks = TASKS.filter(t => t.assignee === assigneeName);
  const myProjects = PROJECTS.filter(p => p.lead === assigneeName || p.department === (isClimateAdvocacy ? 'Climate Advocacy' : 'Programs'));

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'My Projects' },
    { id: 'tasks', label: 'My Tasks' },
    { id: 'reports', label: 'Reports' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'notifications', label: 'Notifications' },
  ];

  const NOTIF_STYLE: Record<string, string> = {
    info: 'border-l-sky-400',
    warning: 'border-l-earth-400',
    success: 'border-l-forest-400',
    alert: 'border-l-red-400',
  };

  return (
    <>
      <div className="flex gap-1 flex-wrap mb-6">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeSection === s.id ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DEPT_KPIS.map((kpi, i) => <KPICard key={kpi.id} kpi={kpi} delay={i * 80} />)}
          </div>
          <TeamAnalyticsPanel records={visibleRecords} title="Department & Team Analytics" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-sky-500" /> Department Activity
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={MONTHLY_ACTIVITY.slice(-5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                  <Legend />
                  <Bar dataKey="reports" fill="#1565c0" radius={[4, 4, 0, 0]} name="Reports" />
                  <Bar dataKey="activities" fill="#00897b" radius={[4, 4, 0, 0]} name="Activities" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <MeetingsModule compact />
          </div>
        </div>
      )}

      {activeSection === 'projects' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">My Department Projects</div>
          <div className="flex flex-col gap-3">
            {myProjects.map(p => (
              <div key={p.id} className="p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{p.name}</span>
                  <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full',
                    p.status === 'active' ? 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300' :
                    p.status === 'at_risk' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  )}>{p.status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-2 bg-sky-500 rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-300">{p.progress}%</span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Lead: {p.lead}</span>
                  <span>Deadline: {p.deadline}</span>
                  <span>Budget: ${p.budget.toLocaleString()}</span>
                </div>
              </div>
            ))}
            {myProjects.length === 0 && <div className="text-sm text-gray-400 text-center py-4">No projects assigned to your department.</div>}
          </div>
        </div>
      )}

      {activeSection === 'tasks' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <CheckSquare size={14} className="text-sky-500" /> My Tasks
          </div>
          <div className="flex flex-col gap-2">
            {myTasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10">
                <div className={clsx('w-2 h-2 rounded-full shrink-0',
                  t.status === 'done' ? 'bg-forest-500' : t.status === 'in_progress' ? 'bg-earth-400' : 'bg-gray-300'
                )} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{t.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t.project} · Due {t.dueDate}</div>
                </div>
                <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full',
                  t.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                  t.priority === 'medium' ? 'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                )}>{t.priority}</span>
              </div>
            ))}
            {myTasks.length === 0 && <div className="text-sm text-gray-400 text-center py-4">No tasks assigned.</div>}
          </div>
        </div>
      )}

      {activeSection === 'reports' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <FileText size={14} className="text-sky-500" /> My Reports
          </div>
          <div className="flex flex-col gap-2">
            {[
              { title: 'June 2025 Department Activity Report', date: '2025-07-01', status: 'approved' },
              { title: 'Q2 Program Progress Summary', date: '2025-06-30', status: 'reviewed' },
              { title: 'May 2025 Department Activity Report', date: '2025-06-01', status: 'approved' },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10">
                <FileText size={14} className="text-sky-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{r.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{r.date}</div>
                </div>
                <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full',
                  r.status === 'approved' ? 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300' :
                  'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300'
                )}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'meetings' && <MeetingsModule />}

      {activeSection === 'notifications' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Notifications</div>
          <div className="flex flex-col gap-2">
            {NOTIFICATIONS.slice(0, 4).map(n => (
              <div key={n.id} className={clsx('p-3 rounded-xl border-l-4 bg-white/40 dark:bg-white/5', NOTIF_STYLE[n.type])}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{n.title}</span>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{n.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
