
export type UserRole =
  | 'senior_leader'
  | 'mental_health'
  | 'climate_advocacy'
  | 'employee'
  | 'field_officer'
  | 'volunteer';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  supervisor?: string;
  avatarInitials: string;
  joinDate: string;
  location: string;
}

export interface KPI {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  changeDir: 'up' | 'down';
  icon: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  department: string;
  progress: number;
  status: 'active' | 'completed' | 'at_risk' | 'planned';
  lead: string;
  deadline: string;
  budget: number;
  spent: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  participants: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  decisions?: string;
  followUp?: string;
  attendance: Record<string, 'attended' | 'absent' | 'pending'>;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  project: string;
}

export interface StaffMember {
  id: string;
  fullName: string;
  role: UserRole;
  roleLabel: string;
  department: string;
  supervisor: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  avatarInitials: string;
  avatarColor: string;
  tasksCompleted: number;
  tasksTotal: number;
  attendanceRate: number;
  performanceScore: number;
  reportsSubmitted: number;
  projectsActive: number;
  activityLog: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  date: string;
  action: string;
  type: 'report' | 'meeting' | 'task' | 'field' | 'system';
}

export interface TraumaCase {
  month: string;
  cases: number;
  resolved: number;
  referred: number;
}

export interface ResilienceData {
  community: string;
  score: number;
  vulnerability: 'low' | 'medium' | 'high';
  population: number;
  lat: number;
  lng: number;
}

export interface FieldSubmission {
  id: string;
  submittedBy: string;
  date: string;
  type: 'activity' | 'report' | 'gis';
  title: string;
  location: string;
  status: 'pending' | 'reviewed' | 'approved';
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'alert';
}

// ─── Attendance Module Types ───────────────────────────────────────────────────

export type AttendanceRole =
  | 'program_lead'
  | 'dept_leadership'
  | 'coordinator'
  | 'field_officer'
  | 'volunteer';

export type AttendanceStatus = 'present' | 'absent' | 'late';

export type AttendanceVerificationStatus = 'pending' | 'verified' | 'rejected';

export type ActivityType =
  | 'meeting'
  | 'training'
  | 'workshop'
  | 'field_activity'
  | 'community_event';

export interface AttendanceRecord {
  id: string;
  userId: string;
  name: string;
  role: AttendanceRole;
  department: string;
  activity: string;
  activityType: ActivityType;
  date: string;
  time: string;
  status: AttendanceStatus;
  verificationStatus: AttendanceVerificationStatus;
  submittedAt: string;
  submissionNotes?: string | null;
  assignedSupervisorId?: string | null;
  assignedSupervisorName?: string | null;
  assignedSupervisorRole?: AttendanceRole | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  verificationComment?: string | null;
}

export interface AttendanceActivity {
  id: string;
  name: string;
  type: ActivityType;
  date: string;
  time: string;
  department: string;
  assignedRoles: AttendanceRole[];
  assignedUserIds: string[];
}
