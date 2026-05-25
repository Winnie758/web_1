
import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import clsx from 'clsx';
import type { AttendanceRecord } from '../../types';

interface AttendanceKPIChartProps {
  records: AttendanceRecord[];
  showDeptBreakdown?: boolean;
}

const COLORS = ['#2e7d32', '#00897b', '#1565c0', '#e65100', '#6a1b9a'];

export default function AttendanceKPIChart({ records, showDeptBreakdown = false }: AttendanceKPIChartProps) {
  const [activeChart, setActiveChart] = useState<'trend' | 'type' | 'dept'>('trend');

  // Only verified records for KPI
  const verified = records.filter(r => r.verificationStatus === 'verified');

  // Trend: group by date
  const dateMap: Record<string, { date: string; present: number; absent: number; late: number }> = {};
  verified.forEach(r => {
    if (!dateMap[r.date]) dateMap[r.date] = { date: r.date, present: 0, absent: 0, late: 0 };
    if (r.status === 'present') dateMap[r.date].present++;
    else if (r.status === 'absent') dateMap[r.date].absent++;
    else if (r.status === 'late') dateMap[r.date].late++;
  });
  const trendData = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

  // By activity type
  const typeMap: Record<string, number> = {};
  verified.filter(r => r.status === 'present').forEach(r => {
    const label = r.activityType.replace('_', ' ');
    typeMap[label] = (typeMap[label] ?? 0) + 1;
  });
  const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

  // By department
  const deptMap: Record<string, { dept: string; present: number; absent: number; late: number }> = {};
  verified.forEach(r => {
    if (!deptMap[r.department]) deptMap[r.department] = { dept: r.department, present: 0, absent: 0, late: 0 };
    if (r.status === 'present') deptMap[r.department].present++;
    else if (r.status === 'absent') deptMap[r.department].absent++;
    else if (r.status === 'late') deptMap[r.department].late++;
  });
  const deptData = Object.values(deptMap);

  const charts = [
    { id: 'trend' as const, label: 'Attendance Trend' },
    { id: 'type' as const, label: 'By Activity Type' },
    ...(showDeptBreakdown ? [{ id: 'dept' as const, label: 'By Department' }] : []),
  ];

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">Attendance KPI Analytics</div>
        <div className="flex gap-1">
          {charts.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveChart(c.id)}
              className={clsx(
                'px-3 py-1 rounded-lg text-xs font-semibold transition-all',
                activeChart === c.id
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        Based on <span className="font-semibold text-forest-600 dark:text-forest-400">{verified.length}</span> verified records only
      </div>

      {activeChart === 'trend' && (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} label={{ value: 'Date', position: 'insideBottom', offset: -2, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Line type="monotone" dataKey="present" stroke="#2e7d32" strokeWidth={2} dot={{ r: 4 }} name="Present" />
            <Line type="monotone" dataKey="absent" stroke="#c62828" strokeWidth={2} dot={{ r: 4 }} name="Absent" />
            <Line type="monotone" dataKey="late" stroke="#f57c00" strokeWidth={2} dot={{ r: 4 }} name="Late" />
          </LineChart>
        </ResponsiveContainer>
      )}

      {activeChart === 'type' && (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }: { name: string; percent: number }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {typeData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeChart === 'dept' && showDeptBreakdown && (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={deptData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
            <Legend />
            <Bar dataKey="present" fill="#2e7d32" radius={[4, 4, 0, 0]} name="Present" />
            <Bar dataKey="absent" fill="#c62828" radius={[4, 4, 0, 0]} name="Absent" />
            <Bar dataKey="late" fill="#f57c00" radius={[4, 4, 0, 0]} name="Late" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
