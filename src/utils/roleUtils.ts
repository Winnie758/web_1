import { MOCK_USERS } from '../data/mockData';
import type { UserRole, AttendanceRole, User } from '../types';

export function toAttendanceRole(userRole: UserRole): AttendanceRole {
  if (userRole === 'senior_leader') return 'program_lead';
  if (userRole === 'mental_health' || userRole === 'climate_advocacy') return 'dept_leadership';
  if (userRole === 'employee') return 'coordinator';
  if (userRole === 'field_officer') return 'field_officer';
  return 'volunteer';
}

export const ROLE_HIERARCHY: Record<AttendanceRole, number> = {
  program_lead: 1,
  dept_leadership: 2,
  coordinator: 3,
  field_officer: 4,
  volunteer: 5,
};

export function getHierarchyLevel(role: AttendanceRole) {
  return ROLE_HIERARCHY[role] ?? 999;
}

export function canMonitor(monitorRole: AttendanceRole, targetRole: AttendanceRole) {
  return getHierarchyLevel(monitorRole) < getHierarchyLevel(targetRole);
}

const USER_BY_ID = Object.fromEntries(MOCK_USERS.map(u => [u.id, u] as const));
const USER_ID_BY_FULLNAME = Object.fromEntries(MOCK_USERS.map(u => [u.fullName, u.id] as const));

export function getDirectSupervisorId(userId: string): string | null {
  const user = USER_BY_ID[userId] as User | undefined;
  if (!user || !user.supervisor) return null;
  return USER_ID_BY_FULLNAME[user.supervisor] ?? null;
}

export function isDirectSupervisee(supervisorId: string, subordinateId: string) {
  return getDirectSupervisorId(subordinateId) === supervisorId;
}

export function getAssignedSupervisor(userId: string) {
  const supervisorId = getDirectSupervisorId(userId);
  if (!supervisorId) return null;
  const supervisor = USER_BY_ID[supervisorId] as User | undefined;
  if (!supervisor) return null;
  return {
    id: supervisorId,
    name: supervisor.fullName,
    role: toAttendanceRole(supervisor.role),
  };
}
