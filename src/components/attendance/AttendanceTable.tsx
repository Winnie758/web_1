
import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import VerificationBadge from './VerificationBadge';
import type { AttendanceRecord } from '../../types';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  showVerification?: boolean;
}

type SortKey = keyof Pick<AttendanceRecord, 'name' | 'role' | 'department' | 'activity' | 'date' | 'time' | 'status' | 'verificationStatus'>;

const STATUS_PILL: Record<string, string> = {
  present: 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300',
  absent: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  late: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

const ACTIVITY_TYPE_PILL: Record<string, string> = {
  meeting: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  training: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  workshop: 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300',
  field_activity: 'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300',
  community_event: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

const ROLE_LABEL: Record<string, string> = {
  program_lead: 'Program Lead',
  dept_leadership: 'Dept. Leadership',
  coordinator: 'Coordinator',
  field_officer: 'Field Officer',
  volunteer: 'Volunteer',
};

export default function AttendanceTable({ records, showVerification = true }: AttendanceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = [...records].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp size={12} className="text-gray-300 dark:text-gray-600" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-forest-500" />
      : <ChevronDown size={12} className="text-forest-500" />;
  }

  function Th({ col, label }: { col: SortKey; label: string }) {
    return (
      <th
        className="cursor-pointer select-none hover:text-forest-600 dark:hover:text-forest-300 transition-colors"
        onClick={() => handleSort(col)}
      >
        <span className="inline-flex items-center gap-1">
          {label} <SortIcon col={col} />
        </span>
      </th>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 dark:text-gray-600 text-sm">
        No attendance records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <Th col="name" label="Name" />
            <Th col="role" label="Role" />
            <Th col="department" label="Department" />
            <Th col="activity" label="Activity" />
            <Th col="date" label="Date" />
            <Th col="time" label="Time" />
            <Th col="status" label="Status" />
            {showVerification && <Th col="verificationStatus" label="Verification" />}
          </tr>
        </thead>
        <tbody>
          {sorted.map(r => (
            <tr
              key={r.id}
              className={clsx(
                r.verificationStatus === 'verified' && 'bg-sky-50/40 dark:bg-sky-900/10'
              )}
            >
              <td className="font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{r.name}</td>
              <td className="whitespace-nowrap">
                <span className="text-xs text-gray-500 dark:text-gray-400">{ROLE_LABEL[r.role] ?? r.role}</span>
              </td>
              <td className="whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">{r.department}</td>
              <td>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-100">{r.activity}</span>
                  <span className={clsx('text-xs font-semibold px-1.5 py-0.5 rounded-full w-fit', ACTIVITY_TYPE_PILL[r.activityType])}>
                    {r.activityType.replace('_', ' ')}
                  </span>
                </div>
              </td>
              <td className="text-xs whitespace-nowrap">{r.date}</td>
              <td className="text-xs whitespace-nowrap font-mono">{r.time}</td>
              <td>
                <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full capitalize', STATUS_PILL[r.status])}>
                  {r.status}
                </span>
                <div className="text-[11px] text-gray-400 mt-1">{r.verificationStatus === 'pending' ? `Submitted ${new Date(r.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : r.verificationStatus === 'verified' ? `Verified ${r.verifiedAt ? new Date(r.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}` : r.verificationStatus === 'rejected' ? `Rejected ${r.verifiedAt ? new Date(r.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}` : ''}</div>
              </td>
              {showVerification && (
                <td>
                  <VerificationBadge status={r.verificationStatus} verifiedBy={r.verifiedBy} compact />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
