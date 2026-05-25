
import React, { useState } from 'react';
import { CheckCircle, XCircle, Filter } from 'lucide-react';
import clsx from 'clsx';
import VerificationBadge from './VerificationBadge';
import type { AttendanceRecord, AttendanceVerificationStatus } from '../../types';

interface VerificationPanelProps {
  records: AttendanceRecord[];
  verifierName: string;
  onVerify: (id: string, status: 'verified' | 'rejected', verifierName: string, comment?: string | null) => void;
  canActOnRecord: (record: AttendanceRecord) => boolean;
  isDemoMode?: boolean;
}

const STATUS_PILL: Record<string, string> = {
  present: 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300',
  absent: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  late: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

const ROLE_LABEL: Record<string, string> = {
  program_lead: 'Program Lead',
  dept_leadership: 'Dept. Leadership',
  coordinator: 'Coordinator',
  field_officer: 'Field Officer',
  volunteer: 'Volunteer',
};

type FilterState = AttendanceVerificationStatus | 'all';

export default function VerificationPanel({ records, verifierName, onVerify, canActOnRecord, isDemoMode = false }: VerificationPanelProps) {
  const [filter, setFilter] = useState<FilterState>(isDemoMode ? 'all' : 'pending');
  const [confirming, setConfirming] = useState<{ id: string; action: 'verified' | 'rejected' } | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});

  const filtered = records.filter(r => {
    if (isDemoMode && filter === 'all') {
      return r.verificationStatus !== 'pending';
    }
    return filter === 'all' ? true : r.verificationStatus === filter;
  });

  const pendingCount = records.filter(r => r.verificationStatus === 'pending').length;

  function handleAction(id: string, action: 'verified' | 'rejected', comment?: string | null) {
    setConfirming({ id, action });
    setTimeout(() => {
      onVerify(id, action, verifierName, comment);
      setConfirming(null);
    }, 500);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-gray-400" />
        {((isDemoMode ? ['all', 'verified', 'rejected'] : ['all', 'pending', 'verified', 'rejected']) as FilterState[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-3 py-1 rounded-lg text-xs font-semibold transition-all capitalize',
              filter === f
                ? 'bg-forest-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            {f === 'all' ? 'All' : f}
            {f === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 bg-amber-400 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-gray-400 dark:text-gray-600 text-sm">
          No records match the selected filter.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {filtered.map(r => {
          const isActing = confirming?.id === r.id;
          return (
            <div
              key={r.id}
              className={clsx(
                'glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-all',
                r.verificationStatus === 'verified' && 'border-l-4 border-sky-400',
                r.verificationStatus === 'rejected' && 'border-l-4 border-red-400',
                r.verificationStatus === 'pending' && 'border-l-4 border-amber-400'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{r.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{ROLE_LABEL[r.role] ?? r.role}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{r.department}</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mb-1.5">
                  <span className="font-medium">{r.activity}</span>
                  <span className="text-gray-400 mx-1">·</span>
                  {r.date} at {r.time}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full capitalize', STATUS_PILL[r.status])}>
                    {r.status}
                  </span>
                  <VerificationBadge status={r.verificationStatus} verifiedBy={r.verifiedBy} compact />
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0 min-w-[260px]">
                <div className="text-xs text-gray-500 dark:text-gray-400">Submitted: {new Date(r.submittedAt).toLocaleString()}</div>
                {r.submissionNotes && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 rounded-2xl px-3 py-2">
                    Evidence: {r.submissionNotes}
                  </div>
                )}
                {r.verificationStatus === 'pending' ? (
                  isDemoMode ? (
                    <span className="text-xs text-gray-500 dark:text-gray-400">Demo preview mode — verification actions are disabled.</span>
                  ) : canActOnRecord(r) ? (
                    <>
                      <textarea
                        value={comments[r.id] ?? ''}
                        onChange={e => setComments(prev => ({ ...prev, [r.id]: e.target.value }))}
                        className="w-full text-xs rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest-400"
                        placeholder="Supervisor remarks (optional)"
                        rows={3}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleAction(r.id, 'verified', comments[r.id] ?? null)}
                          disabled={isActing}
                          className={clsx(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                            'bg-forest-600 hover:bg-forest-700 text-white shadow-sm dark:bg-forest-500 dark:hover:bg-forest-400',
                            isActing && 'opacity-60 cursor-not-allowed'
                          )}
                        >
                          <CheckCircle size={12} />
                          {isActing && confirming?.action === 'verified' ? 'Verifying…' : 'Verify'}
                        </button>
                        <button
                          onClick={() => handleAction(r.id, 'rejected', comments[r.id] ?? null)}
                          disabled={isActing}
                          className={clsx(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                            'bg-red-600 hover:bg-red-700 text-white shadow-sm dark:bg-red-500 dark:hover:bg-red-400',
                            isActing && 'opacity-60 cursor-not-allowed'
                          )}
                        >
                          <XCircle size={12} />
                          {isActing && confirming?.action === 'rejected' ? 'Rejecting…' : 'Reject'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-gray-500 dark:text-gray-400">Read-only for this record. Only your lower staff can be verified.</span>
                  )
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
