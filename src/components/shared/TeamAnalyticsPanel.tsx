import React from 'react';
import clsx from 'clsx';
import { useAttendanceStore } from '../../store/attendanceStore';
import { MOCK_USERS, TASKS, FIELD_SUBMISSIONS } from '../../data/mockData';
import type { AttendanceRecord, User } from '../../types';
import AttendanceKPIChart from '../attendance/AttendanceKPIChart';
import ParticipationSummary from '../attendance/ParticipationSummary';

function smallCard(title: string, value: React.ReactNode) {
  return (
    <div className="glass-card rounded-xl p-3 text-center">
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
    </div>
  );
}

export default function TeamAnalyticsPanel({ records, title = 'Team Analytics' }: { records: AttendanceRecord[]; title?: string }) {
  const allUsers = MOCK_USERS as User[];
  const total = records.length;
  const pending = records.filter(r => r.verificationStatus === 'pending').length;
  const verified = records.filter(r => r.verificationStatus === 'verified').length;
  const rejected = records.filter(r => r.verificationStatus === 'rejected').length;

  // inactive: users with no records in last 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const activeUserIds = new Set(records.map(r => r.userId));
  const inactive = allUsers.filter(u => !activeUserIds.has(u.id)).length;

  // reports and tasks counts (approx)
  const reports = FIELD_SUBMISSIONS.length;
  const tasks = TASKS.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</div>
        <div className="text-xs text-gray-500">Updated live</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {smallCard('Total Records', total)}
        {smallCard('Pending', pending)}
        {smallCard('Verified', verified)}
        {smallCard('Rejected', rejected)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AttendanceKPIChart records={records} showDeptBreakdown={false} />
        </div>
        <div className="flex flex-col gap-3">
          <ParticipationSummary records={records} title="Participation" />
          <div className="glass-card rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-2">Operational Indicators</div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>Reports (all)</span>
                <span className="font-semibold">{reports}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Tasks (all)</span>
                <span className="font-semibold">{tasks}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Inactive staff (30d)</span>
                <span className="font-semibold text-red-600">{inactive}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Awaiting verification</span>
                <span className="font-semibold text-amber-600">{pending}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
