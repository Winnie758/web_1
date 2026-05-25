
import React from 'react';
import clsx from 'clsx';
import AttendanceTable from './AttendanceTable';
import ParticipationSummary from './ParticipationSummary';
import AttendanceKPIChart from './AttendanceKPIChart';
import VerificationPanel from './VerificationPanel';
import AttendanceTimeline from '../shared/AttendanceTimeline';
import type { AttendanceRecord, AttendanceRole } from '../../types';

interface AttendanceDashboardProps {
  role: AttendanceRole;
  records: AttendanceRecord[];
  currentUserId: string;
  currentUserName: string;
  onVerify: (id: string, status: 'verified' | 'rejected', verifierName: string, comment?: string | null) => void;
  canVerify: boolean;
  canActOnRecord: (record: AttendanceRecord) => boolean;
  isDemoMode: boolean;
}

const TIER_LABELS: Record<AttendanceRole, string> = {
  program_lead: 'Program Lead / Executive Leadership',
  dept_leadership: 'Department Leadership',
  coordinator: 'Program & Technical Coordinator',
  field_officer: 'Field Officer / Community Coordinator',
  volunteer: 'Volunteer / Grassroots Community',
};

const TIER_COLORS: Record<AttendanceRole, string> = {
  program_lead: 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300',
  dept_leadership: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  coordinator: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  field_officer: 'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300',
  volunteer: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export default function AttendanceDashboard({
  role,
  records,
  currentUserId,
  currentUserName,
  onVerify,
  canVerify,
  canActOnRecord,
  isDemoMode,
}: AttendanceDashboardProps) {
  const myRecords = records.filter(r => r.userId === currentUserId);
  const pendingCount = records.filter(r => r.verificationStatus === 'pending').length;
  const verifiedCount = records.filter(r => r.verificationStatus === 'verified').length;
  const rejectedCount = records.filter(r => r.verificationStatus === 'rejected').length;

  const workflowSummary = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="glass-card rounded-2xl p-4 border border-forest-100 dark:border-forest-900/40">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.18em]">Pending Review</div>
        <div className="mt-3 text-3xl font-bold text-amber-700 dark:text-amber-300">{pendingCount}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Attendance submissions awaiting supervisor verification.</div>
      </div>
      <div className="glass-card rounded-2xl p-4 border border-forest-100 dark:border-forest-900/40">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.18em]">Verified</div>
        <div className="mt-3 text-3xl font-bold text-forest-700 dark:text-forest-200">{verifiedCount}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Confirmed attendances powering KPI and performance analytics.</div>
      </div>
      <div className="glass-card rounded-2xl p-4 border border-forest-100 dark:border-forest-900/40">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.18em]">Rejected</div>
        <div className="mt-3 text-3xl font-bold text-red-700 dark:text-red-300">{rejectedCount}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Rejected records excluded from trusted organisational analytics.</div>
      </div>
    </div>
  );

  // Personal timeline (recent submissions & verification notes)
  const personalTimeline = <AttendanceTimeline records={records.filter(r => r.userId === currentUserId)} />;

  const scrollToVerification = () => {
    const section = document.getElementById('attendance-verification-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const verificationReminderCard = (
    <div className="glass-card rounded-2xl p-4 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-amber-900 dark:text-amber-200">Action required</div>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">You should verify your immediate lower staff.</p>
        </div>
        <a
          href="#attendance-verification-section"
          onClick={(event) => {
            event.preventDefault();
            scrollToVerification();
          }}
          className="inline-flex items-center justify-center rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Go to verification
        </a>
      </div>
    </div>
  );

  // ── Tier 1: Program Lead ──────────────────────────────────────────────────
  if (role === 'program_lead') {
    const verifiedRecords = records.filter(r => r.verificationStatus === 'verified');
    const pendingCount = records.filter(r => r.verificationStatus === 'pending').length;

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={clsx('text-xs font-semibold px-3 py-1 rounded-full', TIER_COLORS[role])}>
            Tier 1 — {TIER_LABELS[role]}
          </span>
          {pendingCount > 0 && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              {pendingCount} pending verification{pendingCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {workflowSummary}
        {personalTimeline}
        <ParticipationSummary records={records} title="Organisation-Wide Attendance Overview" />
        <AttendanceKPIChart records={records} showDeptBreakdown />

        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">All Staff Attendance Records</div>
          <AttendanceTable records={records} />
        </div>

        {verificationReminderCard}

        {canVerify ? (
          <div id="attendance-verification-section" className="glass-card rounded-2xl p-4">
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Verification Management</div>
            <VerificationPanel records={records} verifierName={currentUserName} onVerify={onVerify} canActOnRecord={canActOnRecord} isDemoMode={isDemoMode} />
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <div className="text-sm font-semibold text-amber-900 dark:text-amber-200">Verification preview only</div>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-2">
              Demo preview mode disables approval actions and verification workflows.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-4">
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Present Staff</div>
            <div className="flex flex-col gap-1.5">
              {records.filter(r => r.status === 'present').map(r => (
                <div key={r.id} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-forest-500 shrink-0" />
                  <span className="font-medium text-gray-800 dark:text-gray-100">{r.name}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500 dark:text-gray-400">{r.activity}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Absent Staff</div>
            <div className="flex flex-col gap-1.5">
              {records.filter(r => r.status === 'absent').map(r => (
                <div key={r.id} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className="font-medium text-gray-800 dark:text-gray-100">{r.name}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500 dark:text-gray-400">{r.activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Verified Records Feed</div>
          <AttendanceTable records={verifiedRecords} />
        </div>
      </div>
    );
  }

  // ── Tier 2: Dept Leadership ───────────────────────────────────────────────
  if (role === 'dept_leadership') {
    const deptRecords = records; // already filtered by dept in parent
    const pendingCount = deptRecords.filter(r => r.verificationStatus === 'pending').length;

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={clsx('text-xs font-semibold px-3 py-1 rounded-full', TIER_COLORS[role])}>
            Tier 2 — {TIER_LABELS[role]}
          </span>
          {pendingCount > 0 && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              {pendingCount} pending verification{pendingCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {workflowSummary}
        {personalTimeline}

        <ParticipationSummary records={deptRecords} title="Department Attendance Summary" />
        <AttendanceKPIChart records={deptRecords} showDeptBreakdown={false} />

        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Team Attendance Monitoring</div>
          <AttendanceTable records={deptRecords} />
        </div>

        {verificationReminderCard}

        <div id="attendance-verification-section" className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Verify Team Attendance</div>
          {canVerify ? (
            <VerificationPanel records={deptRecords} verifierName={currentUserName} onVerify={onVerify} canActOnRecord={canActOnRecord} isDemoMode={isDemoMode} />
          ) : (
            <div className="text-xs text-gray-500 dark:text-gray-400">Verification workflows are disabled in demo preview mode.</div>
          )}
        </div>
      </div>
    );
  }

  // ── Tier 3: Coordinator ───────────────────────────────────────────────────
  if (role === 'coordinator') {
    const teamRecords = records; // already filtered to team scope in parent

    return (
      <div className="flex flex-col gap-6">
        <span className={clsx('text-xs font-semibold px-3 py-1 rounded-full w-fit', TIER_COLORS[role])}>
          Tier 3 — {TIER_LABELS[role]}
        </span>
        {workflowSummary}
        {personalTimeline}

        <ParticipationSummary records={teamRecords} title="Team Activity Tracking" />
        <AttendanceKPIChart records={teamRecords} />

        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Technical Team Attendance</div>
          <AttendanceTable records={teamRecords} />
        </div>

        {canVerify && verificationReminderCard}

        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
            GIS & Workshop Participation
          </div>
          <AttendanceTable
            records={teamRecords.filter(r => r.activityType === 'workshop' || r.activityType === 'field_activity')}
          />
        </div>

        <div id="attendance-verification-section" className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Verify Team Attendance</div>
          {canVerify ? (
            <VerificationPanel records={teamRecords} verifierName={currentUserName} onVerify={onVerify} canActOnRecord={canActOnRecord} isDemoMode={isDemoMode} />
          ) : (
            <div className="text-xs text-gray-500 dark:text-gray-400">Verification workflows are disabled in demo preview mode.</div>
          )}
        </div>
      </div>
    );
  }

  // ── Tier 4: Field Officer ─────────────────────────────────────────────────
  if (role === 'field_officer') {
    const communityRecords = records.filter(r => r.activityType === 'community_event' || r.activityType === 'field_activity');

    return (
      <div className="flex flex-col gap-6">
        <span className={clsx('text-xs font-semibold px-3 py-1 rounded-full w-fit', TIER_COLORS[role])}>
          Tier 4 — {TIER_LABELS[role]}
        </span>
        {workflowSummary}
        {personalTimeline}

        <ParticipationSummary records={myRecords} title="My Attendance Status" />

        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">My Attendance Records</div>
          <AttendanceTable records={myRecords} />
        </div>

        {canVerify && verificationReminderCard}

        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Community & Field Participation</div>
          <AttendanceTable records={communityRecords} />
        </div>

        <div id="attendance-verification-section" className="glass-card rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Verify Assigned Group Attendance</div>
          {canVerify ? (
            <VerificationPanel records={records} verifierName={currentUserName} onVerify={onVerify} canActOnRecord={canActOnRecord} isDemoMode={isDemoMode} />
          ) : (
            <div className="text-xs text-gray-500 dark:text-gray-400">Verification workflows are disabled in demo preview mode.</div>
          )}
        </div>
      </div>
    );
  }

  // ── Tier 5: Volunteer ─────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      <span className={clsx('text-xs font-semibold px-3 py-1 rounded-full w-fit', TIER_COLORS[role])}>
        Tier 5 — {TIER_LABELS[role]}
      </span>
      {workflowSummary}
      {personalTimeline}
      <AttendanceTable records={myRecords} />

      <div className="glass-card rounded-2xl p-4">
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Community Workshop Participation</div>
        <AttendanceTable
          records={myRecords.filter(r => r.activityType === 'workshop' || r.activityType === 'community_event')}
        />
      </div>

      {canVerify && verificationReminderCard}
    </div>
  );
}
