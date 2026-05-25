
import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { Brain, Shield, Users, BookOpen, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import KPICard from '../shared/KPICard';
import MeetingsModule from '../shared/MeetingsModule';
import TeamAnalyticsPanel from '../shared/TeamAnalyticsPanel';
import { useAuthStore } from '../../store/authStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import { toAttendanceRole, canMonitor, isDirectSupervisee } from '../../utils/roleUtils';
import { MH_KPIS, TRAUMA_CASES, RESILIENCE_DATA, GENDER_DATA, TASKS } from '../../data/mockData';

const VULN_COLOR: Record<string, string> = {
  low: 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300',
  medium: 'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export default function MentalHealthDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const auth = useAuthStore();
  const user = auth.user;
  const records = useAttendanceStore(s => s.records);
  const visibleRecords = user ? records.filter(r => r.userId === user.id || canMonitor(toAttendanceRole(user.role), r.role) || r.assignedSupervisorId === user.id || isDirectSupervisee(user.id, r.userId)) : [];

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'trauma', label: 'Trauma Response' },
    { id: 'resilience', label: 'Resilience Monitoring' },
    { id: 'gender', label: 'Gender Inclusion' },
    { id: 'training', label: 'Training Reports' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'tasks', label: 'Tasks' },
  ];

  const myTasks = TASKS.filter(t => t.assignee === 'Kwame Asante');

  return (
    <>
      <div className="flex gap-1 flex-wrap mb-6">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeSection === s.id ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MH_KPIS.map((kpi, i) => <KPICard key={kpi.id} kpi={kpi} delay={i * 80} />)}
          </div>

          <TeamAnalyticsPanel records={visibleRecords} title="Department & Team Analytics" />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Brain size={14} className="text-teal-500" /> Trauma Case Trends
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={TRAUMA_CASES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                  <Legend />
                  <Line type="monotone" dataKey="cases" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Total Cases" />
                  <Line type="monotone" dataKey="resolved" stroke="#2e7d32" strokeWidth={2} dot={{ r: 3 }} name="Resolved" />
                  <Line type="monotone" dataKey="referred" stroke="#1565c0" strokeWidth={2} dot={{ r: 3 }} name="Referred" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Shield size={14} className="text-forest-500" /> Community Resilience Scores
              </div>
              <div className="flex flex-col gap-2">
                {RESILIENCE_DATA.map(d => (
                  <div key={d.community} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 dark:text-gray-300 w-28 shrink-0">{d.community}</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className={clsx('h-2 rounded-full transition-all duration-700',
                          d.score >= 75 ? 'bg-forest-500' : d.score >= 60 ? 'bg-earth-400' : 'bg-red-400'
                        )}
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-300 w-8 text-right">{d.score}</span>
                    <span className={clsx('text-xs font-semibold px-1.5 py-0.5 rounded-full', VULN_COLOR[d.vulnerability])}>
                      {d.vulnerability}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'trauma' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Monthly Trauma Case Volume</div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={TRAUMA_CASES}>
                  <defs>
                    <linearGradient id="gCases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                  <Legend />
                  <Area type="monotone" dataKey="cases" stroke="#ef4444" fill="url(#gCases)" strokeWidth={2} name="Cases" />
                  <Area type="monotone" dataKey="resolved" stroke="#2e7d32" fill="url(#gResolved)" strokeWidth={2} name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Vulnerability Indicators by Community</div>
              <div className="flex flex-col gap-3">
                {RESILIENCE_DATA.map(d => (
                  <div key={d.community} className="glass-card rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{d.community}</span>
                      <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', VULN_COLOR[d.vulnerability])}>{d.vulnerability}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Population: {d.population.toLocaleString()} · Resilience: {d.score}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'resilience' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Shield size={14} className="text-forest-500" /> Resilience Heatmap — Community Scores
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {RESILIENCE_DATA.map(d => (
              <div key={d.community} className={clsx('rounded-xl p-4 border',
                d.score >= 75 ? 'bg-forest-50 border-forest-200 dark:bg-forest-900/20 dark:border-forest-800' :
                d.score >= 60 ? 'bg-earth-50 border-earth-200 dark:bg-earth-900/20 dark:border-earth-800' :
                'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              )}>
                <div className="text-base font-bold font-display text-gray-900 dark:text-white mb-1">{d.community}</div>
                <div className="text-3xl font-display font-bold mb-2" style={{ color: d.score >= 75 ? '#2e7d32' : d.score >= 60 ? '#d4882e' : '#ef4444' }}>
                  {d.score}%
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                  <div className="h-2 rounded-full" style={{ width: `${d.score}%`, background: d.score >= 75 ? '#2e7d32' : d.score >= 60 ? '#d4882e' : '#ef4444' }} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Pop: {d.population.toLocaleString()}</span>
                  <span className={clsx('font-semibold px-2 py-0.5 rounded-full', VULN_COLOR[d.vulnerability])}>{d.vulnerability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'gender' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Users size={14} className="text-teal-500" /> Gender Inclusion Analytics
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={GENDER_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} formatter={(v: number) => `${v}%`} />
              <Legend />
              <Bar dataKey="female" fill="#00897b" radius={[4, 4, 0, 0]} name="Female %" />
              <Bar dataKey="male" fill="#1565c0" radius={[4, 4, 0, 0]} name="Male %" />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {GENDER_DATA.map(g => (
              <div key={g.category} className="glass-card rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{g.category}</div>
                <div className="text-lg font-bold text-teal-600 dark:text-teal-300">{g.female}%</div>
                <div className="text-xs text-gray-400">female participation</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'training' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <BookOpen size={14} className="text-sky-500" /> Training Participation Reports
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Sessions Conducted', value: '89', sub: 'Jan–Jul 2025', color: 'text-sky-600 dark:text-sky-300' },
              { label: 'Total Participants', value: '1,247', sub: 'Across all programs', color: 'text-forest-600 dark:text-forest-300' },
              { label: 'Completion Rate', value: '84%', sub: 'Average across sessions', color: 'text-teal-600 dark:text-teal-300' },
            ].map(m => (
              <div key={m.label} className="glass-card rounded-xl p-4 text-center">
                <div className={clsx('text-3xl font-display font-bold mb-1', m.color)}>{m.value}</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{m.label}</div>
                <div className="text-xs text-gray-400">{m.sub}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {[
              { name: 'Trauma-Informed Care Basics', participants: 145, completion: 91, date: '2025-06-15' },
              { name: 'Community Resilience Building', participants: 98, completion: 87, date: '2025-06-28' },
              { name: 'Climate Anxiety Management', participants: 112, completion: 79, date: '2025-07-05' },
              { name: 'Gender-Sensitive Counseling', participants: 67, completion: 95, date: '2025-07-10' },
            ].map(t => (
              <div key={t.name} className="flex items-center gap-4 p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{t.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t.participants} participants · {t.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-1.5 bg-teal-500 rounded-full" style={{ width: `${t.completion}%` }} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-teal-600 dark:text-teal-300">{t.completion}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'meetings' && <MeetingsModule />}

      {activeSection === 'tasks' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">My Tasks</div>
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
    </>
  );
}
