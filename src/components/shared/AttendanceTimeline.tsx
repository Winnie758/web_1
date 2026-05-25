import React from 'react';
import type { AttendanceRecord } from '../../types';
import clsx from 'clsx';

export default function AttendanceTimeline({ records }: { records: AttendanceRecord[] }) {
  if (!records || records.length === 0) return null;

  const sorted = [...records].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Attendance Timeline</div>
      <div className="flex flex-col gap-3">
        {sorted.slice(0, 10).map(r => (
          <div key={r.id} className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-2" style={{ background: r.status === 'present' ? '#2e7d32' : r.status === 'absent' ? '#c62828' : '#f57c00' }} />
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-800 dark:text-gray-100">{r.name} — {r.activity}</div>
                <div className="text-gray-400">{new Date(r.submittedAt).toLocaleString()}</div>
              </div>
              <div className="text-xs text-gray-500">Status: {r.status} · Verification: {r.verificationStatus}{r.verificationComment ? ` · Note: ${r.verificationComment}` : ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
