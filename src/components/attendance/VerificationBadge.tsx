
import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';
import type { AttendanceVerificationStatus } from '../../types';

interface VerificationBadgeProps {
  status: AttendanceVerificationStatus;
  verifiedBy?: string | null;
  compact?: boolean;
}

export default function VerificationBadge({ status, verifiedBy, compact = false }: VerificationBadgeProps) {
  if (status === 'verified') {
    return (
      <span className={clsx(
        'inline-flex items-center gap-1 font-semibold rounded-full',
        compact ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
        'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
      )}>
        <CheckCircle size={compact ? 10 : 12} />
        {compact ? 'Verified' : `Verified${verifiedBy ? ` by ${verifiedBy}` : ''}`}
      </span>
    );
  }
  if (status === 'rejected') {
    return (
      <span className={clsx(
        'inline-flex items-center gap-1 font-semibold rounded-full',
        compact ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
      )}>
        <XCircle size={compact ? 10 : 12} />
        Rejected
      </span>
    );
  }
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 font-semibold rounded-full',
      compact ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
      'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
    )}>
      <Clock size={compact ? 10 : 12} />
      Pending
    </span>
  );
}
