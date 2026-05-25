
import React, { useEffect, useState } from 'react';
import { ClipboardList, UserCheck, BarChart2, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../store/authStore';
import AttendanceForm from './AttendanceForm';
import AttendanceDashboard from './AttendanceDashboard';
import VerificationPanel from './VerificationPanel';
import { MOCK_ATTENDANCE_ACTIVITIES, MOCK_USERS } from '../../data/mockData';
import type { AttendanceRecord, AttendanceRole, UserRole, Notification } from '../../types';
import { toAttendanceRole, canMonitor, getDirectSupervisorId, isDirectSupervisee, getAssignedSupervisor } from '../../utils/roleUtils';
import { useAttendanceStore } from '../../store/attendanceStore';

interface AttendanceModuleProps {
  userRole: UserRole;
  userId: string;
  userName: string;
  userDept: string;
  initialTab?: Tab;
}

const ROLE_SWITCHER_OPTIONS: { value: AttendanceRole; label: string }[] = [
  { value: 'program_lead', label: 'Program Lead (Tier 1)' },
  { value: 'dept_leadership', label: 'Dept. Leadership (Tier 2)' },
  { value: 'coordinator', label: 'Coordinator (Tier 3)' },
  { value: 'field_officer', label: 'Field Officer (Tier 4)' },
  { value: 'volunteer', label: 'Volunteer (Tier 5)' },
];

const DEPT_BY_ROLE: Record<AttendanceRole, string> = {
  program_lead: 'Executive',
  dept_leadership: 'Mental Health & Resilience',
  coordinator: 'Programs',
  field_officer: 'Field Operations',
  volunteer: 'Community Engagement',
};


type Tab = 'dashboard' | 'mark' | 'verify';

export default function AttendanceModule({ userRole, userId, userName, userDept, initialTab = 'dashboard' }: AttendanceModuleProps) {
  const { isDemoMode, addNotificationForUser } = useAuthStore();
  const activeRole = toAttendanceRole(userRole);
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const records = useAttendanceStore(s => s.records);
  const addRecord = useAttendanceStore(s => s.addRecord);
  const updateRecord = useAttendanceStore(s => s.updateRecord);
  const [actionToast, setActionToast] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Resolve effective user context from authenticated login
  const effectiveUserId = userId;
  const effectiveUserName = userName;
  const effectiveDept = userDept;

  

  // Role-based data filtering (RoleAttendanceGuard logic)
  function getFilteredRecords(role: AttendanceRole): AttendanceRecord[] {
    if (role === 'program_lead') return records;
    if (role === 'dept_leadership') {
      return records.filter(r =>
        r.userId === effectiveUserId ||
        r.department === effectiveDept ||
        r.assignedSupervisorId === effectiveUserId ||
        isDirectSupervisee(effectiveUserId, r.userId)
      );
    }
    if (role === 'coordinator') {
      return records.filter(r =>
        r.userId === effectiveUserId ||
        isDirectSupervisee(effectiveUserId, r.userId) ||
        r.role === 'volunteer'
      );
    }
    if (role === 'field_officer') {
      return records.filter(r =>
        r.userId === effectiveUserId ||
        isDirectSupervisee(effectiveUserId, r.userId)
      );
    }
    return records.filter(r => r.userId === effectiveUserId);
  }

  const filteredRecords = getFilteredRecords(activeRole);

  function canVerifyRecord(record: AttendanceRecord) {
    if (record.userId === effectiveUserId) return false;
    if (isDemoMode) return false;
    // supervisor can verify if they are assigned supervisor or direct supervisee relationship
    return record.assignedSupervisorId === effectiveUserId || isDirectSupervisee(effectiveUserId, record.userId);
  }

  function handleMarkAttendance(record: Omit<AttendanceRecord, 'id'>) {
    const assignedSupervisor = getAssignedSupervisor(userId);
    const newRecord: AttendanceRecord = {
      ...record,
      id: `ar-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      assignedSupervisorId: assignedSupervisor?.id ?? null,
      assignedSupervisorName: assignedSupervisor?.name ?? null,
      assignedSupervisorRole: assignedSupervisor?.role ?? null,
      verificationComment: null,
    };

    addRecord(newRecord);

    // notify assigned supervisor
    if (assignedSupervisor?.id) {
      addNotificationForUser(assignedSupervisor.id, {
        id: `notif-${Date.now()}`,
        title: `Pending attendance from ${record.name}`,
        message: `${record.name} submitted attendance for ${record.activity} on ${record.date}. Awaiting your review.`,
        time: 'Just now',
        read: false,
        type: 'info',
      });
    }
  }

  function handleVerify(id: string, status: 'verified' | 'rejected', verifierName: string, comment?: string | null) {
    const record = records.find(r => r.id === id);
    if (!record || !canVerifyRecord(record) || isDemoMode) return;

    const patch = {
      verificationStatus: status === 'verified' ? 'verified' : 'rejected',
      verifiedBy: verifierName,
      verifiedAt: new Date().toISOString(),
      verificationComment: comment ?? null,
    } as Partial<AttendanceRecord>;

    updateRecord(id, patch);

    // notify the submitter
    addNotificationForUser(record.userId, {
      id: `notif-${Date.now()}`,
      title: `Attendance ${status === 'verified' ? 'Verified' : 'Rejected'}`,
      message: `${verifierName} has ${status === 'verified' ? 'verified' : 'rejected'} your attendance for ${record.activity} on ${record.date}.${comment ? ` Note: ${comment}` : ''}`,
      time: 'Just now',
      read: false,
      type: status === 'verified' ? 'success' : 'warning',
    });

    // update KPIs / participation (in-memory recalculation happens when dashboards read `records`)
    setActionToast(`Attendance ${status === 'verified' ? 'verified' : 'rejected'} successfully.`);
    setTimeout(() => setActionToast(null), 4000);
  }

  const canVerify = !isDemoMode && (activeRole === 'program_lead' || activeRole === 'dept_leadership' || activeRole === 'coordinator' || activeRole === 'field_officer');
  const isAttendanceActionDisabled = isDemoMode;
  const pendingCount = filteredRecords.filter(r => r.verificationStatus === 'pending').length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={14} /> },
    { id: 'mark', label: 'Mark Attendance', icon: <ClipboardList size={14} /> },
    ...(canVerify ? [{ id: 'verify' as Tab, label: 'Verify', icon: <UserCheck size={14} />, badge: pendingCount }] : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList size={20} className="text-forest-500" />
            Attendance Management
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Role-based attendance tracking, verification, and analytics
          </p>
        </div>

        <div>
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300">
            Current Role View: {ROLE_SWITCHER_OPTIONS.find(o => o.value === activeRole)?.label}
          </span>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 flex-wrap border-b border-gray-100 dark:border-gray-800 pb-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-forest-600 text-forest-700 dark:text-forest-300 bg-forest-50 dark:bg-forest-900/20'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-1 bg-amber-400 text-white text-xs rounded-full px-1.5 py-0.5 font-bold leading-none">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'dashboard' && (
        <AttendanceDashboard
          role={activeRole}
          records={filteredRecords}
          currentUserId={effectiveUserId}
          currentUserName={effectiveUserName}
          onVerify={handleVerify}
          canVerify={canVerify}
          canActOnRecord={canVerifyRecord}
          isDemoMode={isDemoMode}
        />
      )}

      {activeTab === 'mark' && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Mark Your Attendance
          </div>
          <AttendanceForm
            activities={MOCK_ATTENDANCE_ACTIVITIES}
            existingRecords={records}
            currentUserId={effectiveUserId}
            currentUserName={effectiveUserName}
            currentUserRole={activeRole}
            currentUserDept={effectiveDept}
            isDemoMode={isDemoMode}
            onMarkAttendance={handleMarkAttendance}
          />
        </div>
      )}

      {activeTab === 'verify' && canVerify && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Attendance Verification Panel
          </div>
          <VerificationPanel
            records={filteredRecords}
            verifierName={effectiveUserName}
            onVerify={handleVerify}
            canActOnRecord={canVerifyRecord}
            isDemoMode={isDemoMode}
          />
        </div>
      )}
    </div>
  );
}
