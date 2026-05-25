
import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle, XCircle, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import type { Meeting } from '../../types';
import { MEETINGS } from '../../data/mockData';

const STATUS_STYLE: Record<string, string> = {
  scheduled: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  completed: 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export default function MeetingsModule({ compact = false }: { compact?: boolean }) {
  const [meetings, setMeetings] = useState<Meeting[]>(MEETINGS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const markAttendance = (meetingId: string, participant: string, status: 'attended' | 'absent') => {
    setMeetings(prev => prev.map(m => {
      if (m.id !== meetingId) return m;
      return { ...m, attendance: { ...m.attendance, [participant]: status } };
    }));
  };

  const addMeeting = () => {
    if (!newTitle.trim() || !newDate || !newTime) return;
    const m: Meeting = {
      id: `m${Date.now()}`,
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      duration: 60,
      participants: ['Dr. Amara Osei-Bonsu'],
      status: 'scheduled',
      attendance: { 'Dr. Amara Osei-Bonsu': 'pending' },
    };
    setMeetings(prev => [m, ...prev]);
    setNewTitle('');
    setNewDate('');
    setNewTime('');
    setShowForm(false);
  };

  const displayMeetings = compact ? meetings.slice(0, 3) : meetings;

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-forest-500" />
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Meetings</span>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1 text-xs font-semibold text-forest-600 dark:text-forest-300 hover:underline"
        >
          <Plus size={12} /> Schedule
        </button>
      </div>

      {showForm && (
        <div className="bg-forest-50 dark:bg-forest-900/20 rounded-xl p-3 flex flex-col gap-2 animate-fade-in">
          <input
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400"
            placeholder="Meeting title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              type="date"
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
            />
            <input
              type="time"
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={addMeeting} className="btn-primary text-xs py-1.5 px-3">Add Meeting</button>
            <button onClick={() => setShowForm(false)} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {displayMeetings.map(meeting => (
          <div key={meeting.id} className="rounded-xl border border-white/30 dark:border-white/10 bg-white/40 dark:bg-white/5 overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-3 text-left hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
              onClick={() => setExpanded(expanded === meeting.id ? null : meeting.id)}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{meeting.title}</span>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={10} />{meeting.date}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{meeting.time} ({meeting.duration}min)</span>
                  <span className="flex items-center gap-1"><Users size={10} />{meeting.participants.length}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2 shrink-0">
                <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_STYLE[meeting.status])}>
                  {meeting.status}
                </span>
                {expanded === meeting.id ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
              </div>
            </button>

            {expanded === meeting.id && (
              <div className="px-3 pb-3 flex flex-col gap-2 animate-fade-in">
                {meeting.decisions && (
                  <div className="text-xs text-gray-600 dark:text-gray-300 bg-forest-50 dark:bg-forest-900/20 rounded-lg p-2">
                    <span className="font-semibold">Decisions: </span>{meeting.decisions}
                  </div>
                )}
                {meeting.followUp && (
                  <div className="text-xs text-gray-600 dark:text-gray-300 bg-sky-50 dark:bg-sky-900/20 rounded-lg p-2">
                    <span className="font-semibold">Follow-up: </span>{meeting.followUp}
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Attendance</div>
                  <div className="flex flex-col gap-1">
                    {meeting.participants.map(p => (
                      <div key={p} className="flex items-center justify-between">
                        <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{p}</span>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => markAttendance(meeting.id, p, 'attended')}
                            className={clsx('flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full transition-colors',
                              meeting.attendance[p] === 'attended'
                                ? 'bg-forest-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-forest-100 dark:hover:bg-forest-900/30'
                            )}
                          >
                            <CheckCircle size={10} /> Attended
                          </button>
                          <button
                            onClick={() => markAttendance(meeting.id, p, 'absent')}
                            className={clsx('flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full transition-colors',
                              meeting.attendance[p] === 'absent'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-red-100 dark:hover:bg-red-900/30'
                            )}
                          >
                            <XCircle size={10} /> Absent
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
