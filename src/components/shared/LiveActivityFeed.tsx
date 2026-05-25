import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAttendanceStore } from '../../store/attendanceStore';
import type { AttendanceRecord } from '../../types';

export default function LiveActivityFeed({ compact = true }: { compact?: boolean }) {
  const records = useAttendanceStore(s => s.records);
  const [events, setEvents] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // keep last 6 records as live events, newest first
    setEvents(records.slice(0, 6));
  }, [records]);

  if (events.length === 0) return null;

  return (
    <div className={clsx('relative')}> 
      <div className={clsx('hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/60 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800')}> 
        <div className="text-xs text-gray-500">Live</div>
        <div className="flex items-center gap-2">
          {events.slice(0, 3).map(e => (
            <div key={e.id} className="text-xs text-gray-600 dark:text-gray-300 bg-white/30 dark:bg-white/5 px-2 py-1 rounded-lg shadow-sm">{e.name}: {e.status}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
