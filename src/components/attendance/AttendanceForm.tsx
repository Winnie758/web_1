
import React, { useState } from 'react';
import { CheckCircle, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import clsx from 'clsx';
import type { AttendanceActivity, AttendanceRecord, AttendanceRole } from '../../types';

interface AttendanceFormProps {
  activities: AttendanceActivity[];
  existingRecords: AttendanceRecord[];
  currentUserId: string;
  currentUserName: string;
  currentUserRole: AttendanceRole;
  currentUserDept: string;
  isDemoMode: boolean;
  onMarkAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
}

const ACTIVITY_TYPE_PILL: Record<string, string> = {
  meeting: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  training: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  workshop: 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300',
  field_activity: 'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300',
  community_event: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

export default function AttendanceForm({
  activities,
  existingRecords,
  currentUserId,
  currentUserName,
  currentUserRole,
  currentUserDept,
  isDemoMode,
  onMarkAttendance,
}: AttendanceFormProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');

  const today = new Date().toISOString().slice(0, 10);

  function isAlreadyMarked(activityId: string): boolean {
    const act = activities.find(a => a.id === activityId);
    if (!act) return false;
    return existingRecords.some(
      r => r.userId === currentUserId && r.activity === act.name && r.date === act.date
    );
  }

  function handleMark(activity: AttendanceActivity, status: 'present' | 'absent' | 'late') {
    if (isDemoMode || isAlreadyMarked(activity.id)) return;
    setSubmitting(`${activity.id}-${status}`);

    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);

    const newRecord: Omit<AttendanceRecord, 'id'> = {
      userId: currentUserId,
      name: currentUserName,
      role: currentUserRole,
      department: currentUserDept,
      activity: activity.name,
      activityType: activity.type,
      date: activity.date,
      time: timeStr,
      status,
      verificationStatus: 'pending',
      submittedAt: now.toISOString(),
      submissionNotes: notes || null,
      verifiedBy: null,
      verifiedAt: null,
      verificationComment: null,
    };

    setTimeout(() => {
      onMarkAttendance(newRecord);
      setSubmitting(null);
      setToast('Attendance marked successfully. Awaiting verification.');
      setTimeout(() => setToast(null), 4000);
    }, 600);
  }

  const assignedActivities = activities.filter(
    a => a.assignedUserIds.includes(currentUserId) || a.assignedRoles.includes(currentUserRole)
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-forest-50 border border-forest-200 dark:bg-forest-900/30 dark:border-forest-700 text-forest-700 dark:text-forest-300 text-sm font-medium animate-fade-in">
          <CheckCircle size={16} className="shrink-0" />
          {toast}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span>{assignedActivities.length} assigned {assignedActivities.length === 1 ? 'activity' : 'activities'} found for your role</span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Evidence / Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="w-full text-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-forest-400 transition-all"
            placeholder="Add any details or evidence about this attendance submission"
          />
        </div>

        {assignedActivities.length === 0 && (
          <div className="text-center py-10 text-gray-400 dark:text-gray-600 text-sm">
            No activities assigned to your role at this time.
          </div>
        )}

        {assignedActivities.map(activity => {
          const existingRecord = existingRecords.find(
            r => r.userId === currentUserId && r.activity === activity.name && r.date === activity.date
          );
          const marked = Boolean(existingRecord);
          const isSubmitting = submitting?.startsWith(activity.id) ?? false;
          const disabled = isSubmitting || isDemoMode;

          return (
            <div
              key={activity.id}
              className={clsx(
                'glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3',
                marked ? 'border-l-4 border-amber-400' : 'border border-transparent',
                marked && 'opacity-90'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{activity.name}</span>
                  <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', ACTIVITY_TYPE_PILL[activity.type])}>
                    {activity.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={11} />{activity.date}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{activity.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} />{activity.department}</span>
                  <span className="flex items-center gap-1"><Tag size={11} />{activity.type.replace('_', ' ')}</span>
                </div>
              </div>

              {marked && existingRecord ? (
                <div className="flex flex-col gap-2 shrink-0 min-w-[260px] text-xs text-gray-600 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    Pending · submitted at {new Date(existingRecord.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-300">
                    {existingRecord.submissionNotes || 'No evidence note provided.'}
                  </span>
                  <span className="text-[11px] uppercase tracking-[.18em] text-gray-500 dark:text-gray-400">
                    Awaiting Verification from {existingRecord.assignedSupervisorName ?? 'Supervisor'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
                  <button
                    onClick={() => handleMark(activity, 'present')}
                    disabled={disabled}
                    className={clsx(
                      'inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                      isDemoMode
                        ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                        : 'bg-forest-600 hover:bg-forest-700 text-white shadow-sm',
                      disabled && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    {isSubmitting === `${activity.id}-present` ? 'Saving…' : 'Present'}
                  </button>
                  <button
                    onClick={() => handleMark(activity, 'absent')}
                    disabled={disabled}
                    className={clsx(
                      'inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                      isDemoMode
                        ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
                      disabled && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    {isSubmitting === `${activity.id}-absent` ? 'Saving…' : 'Absent'}
                  </button>
                  <button
                    onClick={() => handleMark(activity, 'late')}
                    disabled={disabled}
                    className={clsx(
                      'inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                      isDemoMode
                        ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm',
                      disabled && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    {isSubmitting === `${activity.id}-late` ? 'Saving…' : 'Late'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
