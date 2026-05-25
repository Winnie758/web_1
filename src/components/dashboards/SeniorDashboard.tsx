
import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { Users, ChevronRight, AlertTriangle, CheckCircle, Clock, MapPin, Activity } from 'lucide-react';
import clsx from 'clsx';
import KPICard from '../shared/KPICard';
import TeamAnalyticsPanel from '../shared/TeamAnalyticsPanel';
import { useAttendanceStore } from '../../store/attendanceStore';
import GISMap from '../shared/GISMap';
import MeetingsModule from '../shared/MeetingsModule';
import { ORG_KPIS, PROJECTS, TASKS, STAFF_MEMBERS, MONTHLY_ACTIVITY, DEPT_PERFORMANCE, NOTIFICATIONS } from '../../data/mockData';
import type { StaffMember } from '../../types';

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300',
  completed: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  at_risk: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  planned: 'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300',
};

const PRIORITY_STYLE: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  medium: 'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300',
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const NOTIF_STYLE: Record<string, string> = {
  info: 'border-l-sky-400',
  warning: 'border-l-earth-400',
  success: 'border-l-forest-400',
  alert: 'border-l-red-400',
};

function StaffProfileModal({ staff, onClose }: { staff: StaffMember; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto scrollbar-thin animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4 mb-4">
          <div className={clsx('w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold', staff.avatarColor)}>
            {staff.avatarInitials}
          </div>
          <div>
            <div className="text-lg font-display font-bold text-gray-900 dark:text-white">{staff.fullName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{staff.roleLabel}</div>
            <div className="text-xs text-gray-400">{staff.department} · {staff.location}</div>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold">×</button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Performance', value: `${staff.performanceScore}%`, color: 'text-forest-600 dark:text-forest-300' },
            { label: 'Attendance', value: `${staff.attendanceRate}%`, color: 'text-sky-600 dark:text-sky-300' },
            { label: 'Tasks Done', value: `${staff.tasksCompleted}/${staff.tasksTotal}`, color: 'text-teal-600 dark:text-teal-300' },
            { label: 'Reports', value: staff.reportsSubmitted, color: 'text-earth-600 dark:text-earth-300' },
          ].map(m => (
            <div key={m.label} className="glass-card rounded-xl p-3 text-center">
              <div className={clsx('text-xl font-bold font-display', m.color)}>{m.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Supervisor</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">{staff.supervisor || '—'}</div>
        </div>

        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Contact</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">{staff.email} · {staff.phone}</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Recent Activity</div>
          <div className="flex flex-col gap-1.5">
            {staff.activityLog.map(log => (
              <div key={log.id} className="flex items-start gap-2 text-xs">
                <span className="text-gray-400 shrink-0 mt-0.5">{log.date}</span>
                <span className="text-gray-700 dark:text-gray-300">{log.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeniorDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const sections: { id: string; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Org Analytics' },
    { id: 'projects', label: 'Programs' },
    { id: 'staff', label: 'Staff' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'gis', label: 'GIS Map' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <>
      {selectedStaff && <StaffProfileModal staff={selectedStaff} onClose={() => setSelectedStaff(null)} />}

      {/* Sub-nav */}
      <div className="flex gap-1 flex-wrap mb-6">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeSection === s.id
                ? 'bg-forest-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'dashboard' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {ORG_KPIS.map((kpi, i) => <KPICard key={kpi.id} kpi={kpi} delay={i * 80} />)}
          </div>

          {/* Organization-wide analytics panel */}
          <TeamAnalyticsPanel records={useAttendanceStore(s => s.records)} title="Organization Intelligence" />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Activity size={14} className="text-forest-500" /> Monthly Activity Trends
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={MONTHLY_ACTIVITY}>
                  <defs>
                    <linearGradient id="gReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gActivities" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00897b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00897b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Area type="monotone" dataKey="reports" stroke="#2e7d32" fill="url(#gReports)" strokeWidth={2} name="Reports" />
                  <Area type="monotone" dataKey="activities" stroke="#00897b" fill="url(#gActivities)" strokeWidth={2} name="Activities" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Department Performance</div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={DEPT_PERFORMANCE}>
                  <PolarGrid stroke="rgba(0,0,0,0.08)" />
                  <PolarAngleAxis dataKey="dept" tick={{ fontSize: 11 }} />
                  <Radar name="KPI" dataKey="kpi" stroke="#2e7d32" fill="#2e7d32" fillOpacity={0.25} />
                  <Radar name="Tasks" dataKey="tasks" stroke="#00897b" fill="#00897b" fillOpacity={0.2} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <GISMap />
            </div>
            <MeetingsModule compact />
          </div>
        </div>
      )}

      {activeSection === 'analytics' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Monthly Reports vs Activities</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={MONTHLY_ACTIVITY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                  <Legend />
                  <Bar dataKey="reports" fill="#2e7d32" radius={[4, 4, 0, 0]} name="Reports" />
                  <Bar dataKey="activities" fill="#00897b" radius={[4, 4, 0, 0]} name="Activities" />
                  <Bar dataKey="meetings" fill="#1565c0" radius={[4, 4, 0, 0]} name="Meetings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Department KPI Comparison</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={DEPT_PERFORMANCE} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="dept" type="category" tick={{ fontSize: 11 }} width={70} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                  <Legend />
                  <Bar dataKey="kpi" fill="#2e7d32" radius={[0, 4, 4, 0]} name="KPI Score" />
                  <Bar dataKey="attendance" fill="#00897b" radius={[0, 4, 4, 0]} name="Attendance" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {ORG_KPIS.map((kpi, i) => <KPICard key={kpi.id} kpi={kpi} delay={i * 80} />)}
          </div>
        </div>
      )}

      {activeSection === 'projects' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">All Programs & Projects</div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Department</th>
                  <th>Lead</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Budget</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map(p => (
                  <tr key={p.id}>
                    <td className="font-medium text-gray-800 dark:text-gray-100">{p.name}</td>
                    <td>{p.department}</td>
                    <td>{p.lead}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full min-w-[60px]">
                          <div className="h-1.5 bg-forest-500 rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="text-xs font-mono">{p.progress}%</span>
                      </div>
                    </td>
                    <td><span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_STYLE[p.status])}>{p.status.replace('_', ' ')}</span></td>
                    <td className="text-xs">{p.deadline}</td>
                    <td className="text-xs font-mono">${p.budget.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'staff' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Users size={14} className="text-forest-500" /> Staff Directory — Click any member for full profile
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {STAFF_MEMBERS.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStaff(s)}
                className="glass-card rounded-xl p-3 text-left hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm', s.avatarColor)}>
                    {s.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{s.fullName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.roleLabel}</div>
                  </div>
                  <ChevronRight size={14} className="text-gray-400 ml-auto shrink-0" />
                </div>
                <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>Perf: <span className="font-semibold text-forest-600 dark:text-forest-300">{s.performanceScore}%</span></span>
                  <span>Attend: <span className="font-semibold text-sky-600 dark:text-sky-300">{s.attendanceRate}%</span></span>
                  <span className="flex items-center gap-0.5"><MapPin size={9} />{s.location.split(',')[0]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'tasks' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">All Tasks</div>
          <div className="flex flex-col gap-2">
            {TASKS.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10">
                <div className={clsx('w-2 h-2 rounded-full shrink-0',
                  t.status === 'done' ? 'bg-forest-500' : t.status === 'in_progress' ? 'bg-earth-400' : 'bg-gray-300'
                )} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{t.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t.assignee} · {t.project}</div>
                </div>
                <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full shrink-0', PRIORITY_STYLE[t.priority])}>{t.priority}</span>
                <span className="text-xs text-gray-400 shrink-0">{t.dueDate}</span>
                <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full shrink-0',
                  t.status === 'done' ? 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300' :
                  t.status === 'in_progress' ? 'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                )}>{t.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'meetings' && <MeetingsModule />}

      {activeSection === 'gis' && <GISMap />}

      {activeSection === 'notifications' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Notifications</div>
          <div className="flex flex-col gap-2">
            {NOTIFICATIONS.map(n => (
              <div key={n.id} className={clsx('p-3 rounded-xl border-l-4 bg-white/40 dark:bg-white/5', NOTIF_STYLE[n.type], !n.read && 'ring-1 ring-forest-200 dark:ring-forest-800')}>
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
