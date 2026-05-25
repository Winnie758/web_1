import React from 'react';
import clsx from 'clsx';
import { MOCK_USERS } from '../../data/mockData';
import type { User } from '../../types';

export default function SuperviseePanel({ user }: { user: User }) {
  const supervisees = MOCK_USERS.filter(u => u.supervisor === user.fullName);

  if (supervisees.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">Supervisee Monitoring</div>
        <div className="text-xs text-gray-500">{supervisees.length} supervisee{supervisees.length>1?'s':''}</div>
      </div>
      <div className="flex flex-col gap-2">
        {supervisees.map(s => (
          <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-white/40 dark:bg-white/5">
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{s.fullName}</div>
              <div className="text-xs text-gray-500">{s.role} · {s.department}</div>
            </div>
            <div className="text-xs text-gray-500">{s.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
