
import React, { useState } from 'react';
import { MapPin, Upload, CheckSquare, Bell, Camera, FileText, Navigation, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import MeetingsModule from '../shared/MeetingsModule';
import GISMap from '../shared/GISMap';
import { TASKS, FIELD_SUBMISSIONS, NOTIFICATIONS } from '../../data/mockData';
import type { KPI, FieldSubmission } from '../../types';
import KPICard from '../shared/KPICard';
import TeamAnalyticsPanel from '../shared/TeamAnalyticsPanel';
import { useAuthStore } from '../../store/authStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import { toAttendanceRole, canMonitor, isDirectSupervisee } from '../../utils/roleUtils';

const FIELD_KPIS: KPI[] = [
  { id: 'fk1', label: 'Tasks Assigned', value: 5, unit: '', change: 1, changeDir: 'up', icon: 'FileText', color: 'forest' },
  { id: 'fk2', label: 'Submissions', value: 22, unit: '', change: 4, changeDir: 'up', icon: 'UserCheck', color: 'teal' },
  { id: 'fk3', label: 'Attendance', value: 95, unit: '%', change: 2, changeDir: 'up', icon: 'TrendingUp', color: 'sky' },
  { id: 'fk4', label: 'KPI Score', value: 91, unit: '%', change: 3, changeDir: 'up', icon: 'Heart', color: 'earth' },
];

const VOL_KPIS: KPI[] = [
  { id: 'vk1', label: 'Tasks Assigned', value: 3, unit: '', change: 0, changeDir: 'up', icon: 'FileText', color: 'forest' },
  { id: 'vk2', label: 'Submissions', value: 8, unit: '', change: 2, changeDir: 'up', icon: 'UserCheck', color: 'teal' },
  { id: 'vk3', label: 'Attendance', value: 80, unit: '%', change: 1, changeDir: 'up', icon: 'TrendingUp', color: 'sky' },
  { id: 'vk4', label: 'KPI Score', value: 76, unit: '%', change: 1, changeDir: 'up', icon: 'Heart', color: 'earth' },
];

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300',
  reviewed: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  approved: 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300',
};

const NOTIF_STYLE: Record<string, string> = {
  info: 'border-l-sky-400',
  warning: 'border-l-earth-400',
  success: 'border-l-forest-400',
  alert: 'border-l-red-400',
};

export default function FieldOfficerDashboard({ isVolunteer = false }: { isVolunteer?: boolean }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [submissions, setSubmissions] = useState<FieldSubmission[]>(FIELD_SUBMISSIONS);
  const [submitTitle, setSubmitTitle] = useState('');
  const [submitDesc, setSubmitDesc] = useState('');
  const [submitType, setSubmitType] = useState<'activity' | 'report' | 'gis'>('activity');
  const [submitLocation, setSubmitLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const assigneeName = isVolunteer ? 'Kofi Darko' : 'Abena Mensah';
  const myTasks = TASKS.filter(t => t.assignee === assigneeName);
  const kpis = isVolunteer ? VOL_KPIS : FIELD_KPIS;

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'My Tasks' },
    { id: 'submit', label: 'Submit Activity' },
    { id: 'submissions', label: 'My Submissions' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'gis', label: 'Field Map' },
    { id: 'notifications', label: 'Notifications' },
  ];

  const handleSubmit = () => {
    if (!submitTitle.trim() || !submitLocation.trim()) return;
    const newSub: FieldSubmission = {
      id: `fs${Date.now()}`,
      submittedBy: assigneeName,
      date: new Date().toISOString().split('T')[0],
      type: submitType,
      title: submitTitle.trim(),
      location: submitLocation.trim(),
      status: 'pending',
      description: submitDesc.trim(),
      ...(selectedFile ? { description: `${submitDesc.trim()}\n\nAttached: ${selectedFile.name}` } : {}),
    };
    setSubmissions(prev => [newSub, ...prev]);
    setSubmitTitle('');
    setSubmitDesc('');
    setSubmitLocation('');
    setSelectedFile(null);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <div className="flex gap-1 flex-wrap mb-6">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeSection === s.id
                ? (isVolunteer ? 'bg-earth-500 text-white shadow-sm' : 'bg-teal-600 text-white shadow-sm')
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => <KPICard key={kpi.id} kpi={kpi} delay={i * 80} />)}
          </div>
          {/* Team analytics filtered by downward hierarchy */}
          {(() => {
            const auth = useAuthStore();
            const user = auth.user;
            const records = useAttendanceStore(s => s.records);
            const visibleRecords = user ? records.filter(r => r.userId === user.id || canMonitor(toAttendanceRole(user.role), r.role) || r.assignedSupervisorId === user.id || isDirectSupervisee(user.id, r.userId)) : [];
            return <TeamAnalyticsPanel records={visibleRecords} title="Field Team Analytics" />;
          })()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <CheckSquare size={14} className="text-teal-500" /> Pending Tasks
              </div>
              <div className="flex flex-col gap-2">
                {myTasks.filter(t => t.status !== 'done').map(t => (
                  <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10">
                    <div className={clsx('w-2 h-2 rounded-full shrink-0', t.status === 'in_progress' ? 'bg-earth-400' : 'bg-gray-300')} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{t.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Due {t.dueDate}</div>
                    </div>
                    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full',
                      t.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                      'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300'
                    )}>{t.priority}</span>
                  </div>
                ))}
                {myTasks.filter(t => t.status !== 'done').length === 0 && (
                  <div className="text-sm text-gray-400 text-center py-3">All tasks completed!</div>
                )}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Upload size={14} className="text-forest-500" /> Recent Submissions
              </div>
              <div className="flex flex-col gap-2">
                {submissions.filter(s => s.submittedBy === assigneeName).slice(0, 3).map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{s.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin size={9} />{s.location} · {s.date}</div>
                    </div>
                    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_STYLE[s.status])}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'tasks' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <CheckSquare size={14} className="text-teal-500" /> My Assigned Tasks
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
                  t.status === 'done' ? 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300' :
                  t.status === 'in_progress' ? 'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                )}>{t.status.replace('_', ' ')}</span>
              </div>
            ))}
            {myTasks.length === 0 && <div className="text-sm text-gray-400 text-center py-4">No tasks assigned.</div>}
          </div>
        </div>
      )}

      {activeSection === 'submit' && (
        <div className="glass-card rounded-2xl p-6 max-w-xl">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Upload size={14} className="text-forest-500" /> Submit Field Activity
          </div>

          {submitted && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-800 mb-4 animate-fade-in">
              <CheckCircle size={16} className="text-forest-500" />
              <span className="text-sm font-medium text-forest-700 dark:text-forest-300">Submission received! Under review.</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Submission Type</label>
              <select
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400"
                value={submitType}
                onChange={e => setSubmitType(e.target.value as 'activity' | 'report' | 'gis')}
              >
                <option value="activity">Field Activity</option>
                <option value="report">Progress Report</option>
                <option value="gis">GPS/GIS Data</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Title</label>
              <input
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400"
                placeholder="e.g. Community Outreach — Takoradi Ward 5"
                value={submitTitle}
                onChange={e => setSubmitTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Location</label>
              <div className="relative">
                <Navigation size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full text-sm pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400"
                  placeholder="e.g. Cape Coast, Ghana"
                  value={submitLocation}
                  onChange={e => setSubmitLocation(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Description</label>
              <textarea
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none"
                rows={4}
                placeholder="Describe the activity, findings, or data collected..."
                value={submitDesc}
                onChange={e => setSubmitDesc(e.target.value)}
              />
            </div>
            <div>
              <input
                id="field-upload-input"
                type="file"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                className="hidden"
                onChange={e => setSelectedFile(e.target.files?.[0] ?? null)}
              />
              <label
                htmlFor="field-upload-input"
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Camera size={16} className="text-gray-400" />
                <div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Photo / document upload</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Click to select a file from your device</div>
                  {selectedFile && (
                    <div className="text-xs text-forest-700 dark:text-forest-300 mt-1 truncate max-w-full">Selected: {selectedFile.name}</div>
                  )}
                </div>
              </label>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full justify-center">
              <Upload size={14} /> Submit Field Data
            </button>
          </div>
        </div>
      )}

      {activeSection === 'submissions' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <FileText size={14} className="text-forest-500" /> My Submissions
          </div>
          <div className="flex flex-col gap-2">
            {submissions.filter(s => s.submittedBy === assigneeName).map(s => (
              <div key={s.id} className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{s.title}</span>
                  <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_STYLE[s.status])}>{s.status}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3 mb-1">
                  <span className="flex items-center gap-1"><MapPin size={9} />{s.location}</span>
                  <span>{s.date}</span>
                  <span className="capitalize">{s.type}</span>
                </div>
                {s.description && <div className="text-xs text-gray-600 dark:text-gray-300">{s.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'meetings' && <MeetingsModule />}

      {activeSection === 'gis' && <GISMap />}

      {activeSection === 'notifications' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Bell size={14} className="text-forest-500" /> Notifications
          </div>
          <div className="flex flex-col gap-2">
            {NOTIFICATIONS.map(n => (
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
