
import React from 'react';
import { Users, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import type { AttendanceRecord } from '../../types';

interface ParticipationSummaryProps {
  records: AttendanceRecord[];
  title?: string;
}

export default function ParticipationSummary({ records, title = 'Participation Summary' }: ParticipationSummaryProps) {
  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;
  const verified = records.filter(r => r.verificationStatus === 'verified').length;
  const pending = records.filter(r => r.verificationStatus === 'pending').length;
  const rejected = records.filter(r => r.verificationStatus === 'rejected').length;

  const verifiedPresent = records.filter(r => r.verificationStatus === 'verified' && r.status === 'present').length;
  // Participation rate based on verified records only (exclude pending/rejected from trusted analytics)
  const participationDenominator = verified > 0 ? verified : total;
  const participationRate = participationDenominator > 0 ? Math.round((verifiedPresent / participationDenominator) * 100) : 0;

  const stats = [
    { label: 'Total Records', value: total, icon: <Users size={16} />, color: 'text-gray-600 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-800' },
    { label: 'Present', value: present, icon: <CheckCircle size={16} />, color: 'text-forest-700 dark:text-forest-300', bg: 'bg-forest-100 dark:bg-forest-900/40' },
    { label: 'Absent', value: absent, icon: <XCircle size={16} />, color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/40' },
    { label: 'Late', value: late, icon: <Clock size={16} />, color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/40' },
    { label: 'Verified', value: verified, icon: <CheckCircle size={16} />, color: 'text-sky-700 dark:text-sky-300', bg: 'bg-sky-100 dark:bg-sky-900/40' },
    { label: 'Pending', value: pending, icon: <Clock size={16} />, color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' },
    { label: 'Rejected', value: rejected, icon: <AlertCircle size={16} />, color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/40' },
  ];

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Participation Rate</span>
          <span className={clsx(
            'text-lg font-display font-bold',
            participationRate >= 80 ? 'text-forest-600 dark:text-forest-300' :
            participationRate >= 60 ? 'text-amber-600 dark:text-amber-300' :
            'text-red-600 dark:text-red-300'
          )}>
            {participationRate}%
          </span>
        </div>
      </div>

      {/* Rate bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
        <div
          className={clsx(
            'h-2 rounded-full transition-all duration-700',
            participationRate >= 80 ? 'bg-forest-500' :
            participationRate >= 60 ? 'bg-amber-500' :
            'bg-red-500'
          )}
          style={{ width: `${participationRate}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {stats.slice(0, 4).map(s => (
          <div key={s.label} className={clsx('rounded-xl p-3 flex flex-col items-center gap-1', s.bg)}>
            <span className={s.color}>{s.icon}</span>
            <span className={clsx('text-xl font-display font-bold', s.color)}>{s.value}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        {stats.slice(4).map(s => (
          <div key={s.label} className={clsx('rounded-xl p-2.5 flex flex-col items-center gap-1', s.bg)}>
            <span className={s.color}>{s.icon}</span>
            <span className={clsx('text-lg font-display font-bold', s.color)}>{s.value}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
