
import type {
  User, KPI, Project, Meeting, Task, StaffMember,
  TraumaCase, ResilienceData, FieldSubmission, Notification,
  AttendanceRecord, AttendanceActivity
} from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', fullName: 'Dr. Amara Osei-Bonsu', email: 'amara.osei@accrcc.org', role: 'senior_leader', department: 'Executive', supervisor: '', avatarInitials: 'AO', joinDate: '2019-03-01', location: 'Accra, Ghana' },
  { id: 'u2', fullName: 'Kwame Asante', email: 'kwame.asante@accrcc.org', role: 'mental_health', department: 'Mental Health & Resilience', supervisor: 'Dr. Amara Osei-Bonsu', avatarInitials: 'KA', joinDate: '2020-07-15', location: 'Kumasi, Ghana' },
  { id: 'u3', fullName: 'Fatima Al-Rashid', email: 'fatima.alrashid@accrcc.org', role: 'climate_advocacy', department: 'Climate Advocacy', supervisor: 'Dr. Amara Osei-Bonsu', avatarInitials: 'FA', joinDate: '2021-01-10', location: 'Tamale, Ghana' },
  { id: 'u4', fullName: 'Emmanuel Boateng', email: 'emmanuel.boateng@accrcc.org', role: 'employee', department: 'Programs', supervisor: 'Kwame Asante', avatarInitials: 'EB', joinDate: '2022-04-20', location: 'Accra, Ghana' },
  { id: 'u5', fullName: 'Abena Mensah', email: 'abena.mensah@accrcc.org', role: 'field_officer', department: 'Field Operations', supervisor: 'Emmanuel Boateng', avatarInitials: 'AM', joinDate: '2023-02-01', location: 'Cape Coast, Ghana' },
  { id: 'u6', fullName: 'Kofi Darko', email: 'kofi.darko@accrcc.org', role: 'volunteer', department: 'Community Engagement', supervisor: 'Abena Mensah', avatarInitials: 'KD', joinDate: '2024-01-15', location: 'Takoradi, Ghana' },
];

export const CREDENTIALS: Record<string, string> = {
  'amara.osei@accrcc.org': 'password123',
  'kwame.asante@accrcc.org': 'password123',
  'fatima.alrashid@accrcc.org': 'password123',
  'emmanuel.boateng@accrcc.org': 'password123',
  'abena.mensah@accrcc.org': 'password123',
  'kofi.darko@accrcc.org': 'password123',
};

export const ORG_KPIS: KPI[] = [
  { id: 'k1', label: 'Communities Reached', value: 247, unit: '', change: 12, changeDir: 'up', icon: 'Users', color: 'forest' },
  { id: 'k2', label: 'Active Projects', value: 34, unit: '', change: 3, changeDir: 'up', icon: 'FolderOpen', color: 'sky' },
  { id: 'k3', label: 'Field Reports', value: 1842, unit: '', change: 8, changeDir: 'up', icon: 'FileText', color: 'teal' },
  { id: 'k4', label: 'Staff Members', value: 128, unit: '', change: 5, changeDir: 'up', icon: 'UserCheck', color: 'earth' },
  { id: 'k5', label: 'Beneficiaries', value: 58400, unit: '', change: 14, changeDir: 'up', icon: 'Heart', color: 'forest' },
  { id: 'k6', label: 'Budget Utilization', value: 73, unit: '%', change: 2, changeDir: 'up', icon: 'TrendingUp', color: 'sky' },
];

export const MH_KPIS: KPI[] = [
  { id: 'mh1', label: 'Trauma Cases', value: 312, unit: '', change: 5, changeDir: 'down', icon: 'Brain', color: 'teal' },
  { id: 'mh2', label: 'Resilience Score', value: 74, unit: '%', change: 6, changeDir: 'up', icon: 'Shield', color: 'forest' },
  { id: 'mh3', label: 'Training Sessions', value: 89, unit: '', change: 11, changeDir: 'up', icon: 'BookOpen', color: 'sky' },
  { id: 'mh4', label: 'Gender Inclusion', value: 68, unit: '%', change: 4, changeDir: 'up', icon: 'Users', color: 'earth' },
];

export const PROJECTS: Project[] = [
  { id: 'p1', name: 'Green Corridor Restoration', department: 'Climate Advocacy', progress: 72, status: 'active', lead: 'Fatima Al-Rashid', deadline: '2025-12-31', budget: 120000, spent: 86400 },
  { id: 'p2', name: 'Community Resilience Hubs', department: 'Mental Health & Resilience', progress: 55, status: 'active', lead: 'Kwame Asante', deadline: '2025-09-30', budget: 85000, spent: 46750 },
  { id: 'p3', name: 'Climate Literacy Campaign', department: 'Climate Advocacy', progress: 90, status: 'active', lead: 'Fatima Al-Rashid', deadline: '2025-06-30', budget: 45000, spent: 40500 },
  { id: 'p4', name: 'Trauma Response Network', department: 'Mental Health & Resilience', progress: 38, status: 'at_risk', lead: 'Kwame Asante', deadline: '2025-08-15', budget: 60000, spent: 22800 },
  { id: 'p5', name: 'Wetland Biodiversity Survey', department: 'Field Operations', progress: 100, status: 'completed', lead: 'Abena Mensah', deadline: '2025-03-31', budget: 30000, spent: 29100 },
  { id: 'p6', name: 'Youth Climate Ambassadors', department: 'Community Engagement', progress: 20, status: 'planned', lead: 'Emmanuel Boateng', deadline: '2026-03-31', budget: 55000, spent: 11000 },
];

export const MEETINGS: Meeting[] = [
  {
    id: 'm1', title: 'Q2 Organizational Review', date: '2025-07-10', time: '09:00', duration: 120,
    participants: ['Dr. Amara Osei-Bonsu', 'Kwame Asante', 'Fatima Al-Rashid', 'Emmanuel Boateng'],
    status: 'completed',
    decisions: 'Approved budget reallocation for Trauma Response Network. Expanded Green Corridor scope.',
    followUp: 'Fatima to submit revised project plan by July 17.',
    attendance: { 'Dr. Amara Osei-Bonsu': 'attended', 'Kwame Asante': 'attended', 'Fatima Al-Rashid': 'attended', 'Emmanuel Boateng': 'absent' }
  },
  {
    id: 'm2', title: 'Mental Health Program Sync', date: '2025-07-15', time: '14:00', duration: 60,
    participants: ['Kwame Asante', 'Emmanuel Boateng', 'Abena Mensah'],
    status: 'scheduled',
    attendance: { 'Kwame Asante': 'pending', 'Emmanuel Boateng': 'pending', 'Abena Mensah': 'pending' }
  },
  {
    id: 'm3', title: 'Field Operations Debrief', date: '2025-07-18', time: '10:30', duration: 90,
    participants: ['Fatima Al-Rashid', 'Abena Mensah', 'Kofi Darko'],
    status: 'scheduled',
    attendance: { 'Fatima Al-Rashid': 'pending', 'Abena Mensah': 'pending', 'Kofi Darko': 'pending' }
  },
  {
    id: 'm4', title: 'Donor Reporting Preparation', date: '2025-07-22', time: '11:00', duration: 90,
    participants: ['Dr. Amara Osei-Bonsu', 'Fatima Al-Rashid'],
    status: 'scheduled',
    attendance: { 'Dr. Amara Osei-Bonsu': 'pending', 'Fatima Al-Rashid': 'pending' }
  },
];

export const TASKS: Task[] = [
  { id: 't1', title: 'Submit Q2 Field Activity Report', assignee: 'Abena Mensah', dueDate: '2025-07-12', priority: 'high', status: 'in_progress', project: 'Wetland Biodiversity Survey' },
  { id: 't2', title: 'Update Resilience Heatmap Data', assignee: 'Kwame Asante', dueDate: '2025-07-14', priority: 'high', status: 'todo', project: 'Community Resilience Hubs' },
  { id: 't3', title: 'Coordinate Volunteer Training', assignee: 'Emmanuel Boateng', dueDate: '2025-07-20', priority: 'medium', status: 'todo', project: 'Youth Climate Ambassadors' },
  { id: 't4', title: 'GPS Tag New Survey Sites', assignee: 'Kofi Darko', dueDate: '2025-07-11', priority: 'high', status: 'done', project: 'Green Corridor Restoration' },
  { id: 't5', title: 'Compile Trauma Case Statistics', assignee: 'Kwame Asante', dueDate: '2025-07-16', priority: 'medium', status: 'in_progress', project: 'Trauma Response Network' },
  { id: 't6', title: 'Draft Climate Literacy Module 4', assignee: 'Fatima Al-Rashid', dueDate: '2025-07-25', priority: 'low', status: 'todo', project: 'Climate Literacy Campaign' },
  { id: 't7', title: 'Attend Community Wellbeing Workshop', assignee: 'Abena Mensah', dueDate: '2025-07-13', priority: 'medium', status: 'done', project: 'Community Resilience Hubs' },
  { id: 't8', title: 'Review Budget Utilization Report', assignee: 'Dr. Amara Osei-Bonsu', dueDate: '2025-07-10', priority: 'high', status: 'done', project: 'Green Corridor Restoration' },
];

export const STAFF_MEMBERS: StaffMember[] = [
  {
    id: 's1', fullName: 'Dr. Amara Osei-Bonsu', role: 'senior_leader', roleLabel: 'Senior Climate & Mental Health Leader',
    department: 'Executive', supervisor: '—', email: 'amara.osei@accrcc.org', phone: '+233 24 100 0001',
    location: 'Accra, Ghana', joinDate: '2019-03-01', avatarInitials: 'AO', avatarColor: 'bg-forest-600',
    tasksCompleted: 48, tasksTotal: 52, attendanceRate: 96, performanceScore: 94, reportsSubmitted: 24, projectsActive: 6,
    activityLog: [
      { id: 'al1', date: '2025-07-08', action: 'Approved Q2 budget reallocation', type: 'system' },
      { id: 'al2', date: '2025-07-05', action: 'Chaired Q2 Organizational Review meeting', type: 'meeting' },
      { id: 'al3', date: '2025-07-01', action: 'Submitted H1 Executive Report', type: 'report' },
    ]
  },
  {
    id: 's2', fullName: 'Kwame Asante', role: 'mental_health', roleLabel: 'Mental Health & Resilience Lead',
    department: 'Mental Health & Resilience', supervisor: 'Dr. Amara Osei-Bonsu', email: 'kwame.asante@accrcc.org', phone: '+233 24 100 0002',
    location: 'Kumasi, Ghana', joinDate: '2020-07-15', avatarInitials: 'KA', avatarColor: 'bg-teal-600',
    tasksCompleted: 35, tasksTotal: 40, attendanceRate: 91, performanceScore: 88, reportsSubmitted: 18, projectsActive: 2,
    activityLog: [
      { id: 'al4', date: '2025-07-07', action: 'Updated resilience heatmap for Kumasi region', type: 'field' },
      { id: 'al5', date: '2025-07-03', action: 'Facilitated trauma response training', type: 'task' },
    ]
  },
  {
    id: 's3', fullName: 'Fatima Al-Rashid', role: 'climate_advocacy', roleLabel: 'Climate Advocacy Staff',
    department: 'Climate Advocacy', supervisor: 'Dr. Amara Osei-Bonsu', email: 'fatima.alrashid@accrcc.org', phone: '+233 24 100 0003',
    location: 'Tamale, Ghana', joinDate: '2021-01-10', avatarInitials: 'FA', avatarColor: 'bg-sky-600',
    tasksCompleted: 29, tasksTotal: 33, attendanceRate: 89, performanceScore: 85, reportsSubmitted: 15, projectsActive: 2,
    activityLog: [
      { id: 'al6', date: '2025-07-06', action: 'Submitted Green Corridor progress report', type: 'report' },
      { id: 'al7', date: '2025-07-02', action: 'Led community climate literacy session', type: 'field' },
    ]
  },
  {
    id: 's4', fullName: 'Emmanuel Boateng', role: 'employee', roleLabel: 'Programs Officer',
    department: 'Programs', supervisor: 'Kwame Asante', email: 'emmanuel.boateng@accrcc.org', phone: '+233 24 100 0004',
    location: 'Accra, Ghana', joinDate: '2022-04-20', avatarInitials: 'EB', avatarColor: 'bg-earth-500',
    tasksCompleted: 22, tasksTotal: 28, attendanceRate: 84, performanceScore: 79, reportsSubmitted: 11, projectsActive: 1,
    activityLog: [
      { id: 'al8', date: '2025-07-04', action: 'Coordinated volunteer onboarding session', type: 'task' },
    ]
  },
  {
    id: 's5', fullName: 'Abena Mensah', role: 'field_officer', roleLabel: 'Technical Field Officer',
    department: 'Field Operations', supervisor: 'Fatima Al-Rashid', email: 'abena.mensah@accrcc.org', phone: '+233 24 100 0005',
    location: 'Cape Coast, Ghana', joinDate: '2023-02-01', avatarInitials: 'AM', avatarColor: 'bg-forest-400',
    tasksCompleted: 18, tasksTotal: 20, attendanceRate: 95, performanceScore: 91, reportsSubmitted: 22, projectsActive: 1,
    activityLog: [
      { id: 'al9', date: '2025-07-08', action: 'GPS-tagged 4 new wetland survey sites', type: 'field' },
      { id: 'al10', date: '2025-07-06', action: 'Submitted community wellbeing data', type: 'report' },
    ]
  },
  {
    id: 's6', fullName: 'Kofi Darko', role: 'volunteer', roleLabel: 'Community Volunteer',
    department: 'Community Engagement', supervisor: 'Emmanuel Boateng', email: 'kofi.darko@accrcc.org', phone: '+233 24 100 0006',
    location: 'Takoradi, Ghana', joinDate: '2024-01-15', avatarInitials: 'KD', avatarColor: 'bg-teal-400',
    tasksCompleted: 12, tasksTotal: 15, attendanceRate: 80, performanceScore: 76, reportsSubmitted: 8, projectsActive: 1,
    activityLog: [
      { id: 'al11', date: '2025-07-07', action: 'Completed GPS tagging task', type: 'task' },
      { id: 'al12', date: '2025-07-05', action: 'Attended field operations debrief', type: 'meeting' },
    ]
  },
];

export const TRAUMA_CASES: TraumaCase[] = [
  { month: 'Jan', cases: 42, resolved: 35, referred: 7 },
  { month: 'Feb', cases: 38, resolved: 30, referred: 8 },
  { month: 'Mar', cases: 51, resolved: 44, referred: 7 },
  { month: 'Apr', cases: 47, resolved: 40, referred: 7 },
  { month: 'May', cases: 55, resolved: 48, referred: 7 },
  { month: 'Jun', cases: 44, resolved: 39, referred: 5 },
  { month: 'Jul', cases: 35, resolved: 32, referred: 3 },
];

export const RESILIENCE_DATA: ResilienceData[] = [
  { community: 'Accra Central', score: 82, vulnerability: 'low', population: 45000, lat: 5.5502, lng: -0.2174 },
  { community: 'Kumasi North', score: 68, vulnerability: 'medium', population: 32000, lat: 6.6885, lng: -1.6244 },
  { community: 'Tamale East', score: 54, vulnerability: 'high', population: 28000, lat: 9.4008, lng: -0.8393 },
  { community: 'Cape Coast', score: 71, vulnerability: 'medium', population: 19000, lat: 5.1053, lng: -1.2466 },
  { community: 'Takoradi', score: 77, vulnerability: 'low', population: 22000, lat: 4.8845, lng: -1.7554 },
  { community: 'Bolgatanga', score: 48, vulnerability: 'high', population: 15000, lat: 10.7856, lng: -0.8514 },
  { community: 'Ho', score: 63, vulnerability: 'medium', population: 17000, lat: 6.6011, lng: 0.4712 },
];

export const FIELD_SUBMISSIONS: FieldSubmission[] = [
  { id: 'fs1', submittedBy: 'Abena Mensah', date: '2025-07-08', type: 'gis', title: 'Wetland GPS Survey — Cape Coast Sector 3', location: 'Cape Coast', status: 'approved', description: 'Completed GPS tagging of 4 new wetland monitoring points. Vegetation density high.' },
  { id: 'fs2', submittedBy: 'Kofi Darko', date: '2025-07-07', type: 'activity', title: 'Community Outreach — Takoradi Ward 5', location: 'Takoradi', status: 'reviewed', description: 'Engaged 47 community members in climate awareness session. Distributed 30 resilience kits.' },
  { id: 'fs3', submittedBy: 'Abena Mensah', date: '2025-07-06', type: 'report', title: 'Monthly Field Activity Report — June 2025', location: 'Cape Coast', status: 'approved', description: 'Summary of all field activities conducted in June 2025 across Cape Coast district.' },
  { id: 'fs4', submittedBy: 'Kofi Darko', date: '2025-07-05', type: 'activity', title: 'Tree Planting Drive — Takoradi Coastal', location: 'Takoradi', status: 'pending', description: 'Planted 120 mangrove seedlings along coastal erosion zone. Photos attached.' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Meeting Reminder', message: 'Mental Health Program Sync in 2 hours', time: '2h ago', read: false, type: 'info' },
  { id: 'n2', title: 'Task Overdue', message: 'GPS Tag New Survey Sites was due yesterday', time: '1d ago', read: false, type: 'warning' },
  { id: 'n3', title: 'Report Approved', message: 'Your June field report has been approved', time: '2d ago', read: true, type: 'success' },
  { id: 'n4', title: 'New Task Assigned', message: 'Coordinate Volunteer Training assigned to you', time: '3d ago', read: true, type: 'info' },
  { id: 'n5', title: 'System Alert', message: 'Trauma Response Network project is at risk', time: '4d ago', read: true, type: 'alert' },
];

export const MONTHLY_ACTIVITY = [
  { month: 'Jan', reports: 120, activities: 85, meetings: 12 },
  { month: 'Feb', reports: 135, activities: 92, meetings: 14 },
  { month: 'Mar', reports: 148, activities: 110, meetings: 16 },
  { month: 'Apr', reports: 162, activities: 125, meetings: 18 },
  { month: 'May', reports: 178, activities: 140, meetings: 20 },
  { month: 'Jun', reports: 195, activities: 158, meetings: 22 },
  { month: 'Jul', reports: 210, activities: 172, meetings: 19 },
];

export const DEPT_PERFORMANCE = [
  { dept: 'Climate', kpi: 88, tasks: 92, attendance: 89 },
  { dept: 'Mental Health', kpi: 84, tasks: 87, attendance: 91 },
  { dept: 'Field Ops', kpi: 91, tasks: 95, attendance: 94 },
  { dept: 'Programs', kpi: 79, tasks: 82, attendance: 84 },
  { dept: 'Community', kpi: 76, tasks: 80, attendance: 80 },
];

export const GENDER_DATA = [
  { category: 'Leadership', female: 45, male: 55 },
  { category: 'Field Staff', female: 52, male: 48 },
  { category: 'Volunteers', female: 61, male: 39 },
  { category: 'Beneficiaries', female: 58, male: 42 },
];

// ─── Attendance Mock Data ──────────────────────────────────────────────────────

export const MOCK_ATTENDANCE_ACTIVITIES: AttendanceActivity[] = [
  { id: 'act1', name: 'Q3 Organizational Strategy Meeting', type: 'meeting', date: '2025-07-10', time: '09:00', department: 'Executive', assignedRoles: ['program_lead', 'dept_leadership'], assignedUserIds: ['u1', 'u2', 'u3'] },
  { id: 'act2', name: 'Trauma-Informed Care Training', type: 'training', date: '2025-07-11', time: '10:00', department: 'Mental Health & Resilience', assignedRoles: ['dept_leadership', 'coordinator'], assignedUserIds: ['u2', 'u4'] },
  { id: 'act3', name: 'Climate Resilience Workshop', type: 'workshop', date: '2025-07-12', time: '09:30', department: 'Climate Advocacy', assignedRoles: ['dept_leadership', 'coordinator', 'field_officer'], assignedUserIds: ['u3', 'u4', 'u5'] },
  { id: 'act4', name: 'Cape Coast Field Survey', type: 'field_activity', date: '2025-07-14', time: '07:00', department: 'Field Operations', assignedRoles: ['field_officer', 'volunteer'], assignedUserIds: ['u5', 'u6'] },
  { id: 'act5', name: 'Takoradi Community Outreach', type: 'community_event', date: '2025-07-15', time: '08:30', department: 'Community Engagement', assignedRoles: ['field_officer', 'volunteer'], assignedUserIds: ['u5', 'u6'] },
  { id: 'act6', name: 'GIS Data Collection Workshop', type: 'workshop', date: '2025-07-16', time: '10:00', department: 'Field Operations', assignedRoles: ['coordinator', 'field_officer'], assignedUserIds: ['u4', 'u5'] },
  { id: 'act7', name: 'Mental Health Program Review', type: 'meeting', date: '2025-07-17', time: '14:00', department: 'Mental Health & Resilience', assignedRoles: ['dept_leadership', 'coordinator'], assignedUserIds: ['u2', 'u4'] },
  { id: 'act8', name: 'Volunteer Orientation Session', type: 'training', date: '2025-07-18', time: '09:00', department: 'Community Engagement', assignedRoles: ['coordinator', 'volunteer'], assignedUserIds: ['u4', 'u6'] },
  { id: 'act9', name: 'Bolgatanga Community Forum', type: 'community_event', date: '2025-07-21', time: '10:00', department: 'Climate Advocacy', assignedRoles: ['field_officer', 'volunteer'], assignedUserIds: ['u5', 'u6'] },
  { id: 'act10', name: 'Donor Reporting Workshop', type: 'workshop', date: '2025-07-22', time: '11:00', department: 'Executive', assignedRoles: ['program_lead', 'dept_leadership'], assignedUserIds: ['u1', 'u3'] },
];

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  // Program Lead records
  { id: 'ar1', userId: 'u1', name: 'Dr. Amara Osei-Bonsu', role: 'program_lead', department: 'Executive', activity: 'Q3 Organizational Strategy Meeting', activityType: 'meeting', date: '2025-07-10', time: '09:02', status: 'present', verificationStatus: 'verified', verifiedBy: 'System Auto-Verify', verifiedAt: '2025-07-10T10:00:00Z', submittedAt: '2025-07-10T09:02:00Z' },
  { id: 'ar2', userId: 'u1', name: 'Dr. Amara Osei-Bonsu', role: 'program_lead', department: 'Executive', activity: 'Donor Reporting Workshop', activityType: 'workshop', date: '2025-07-22', time: '11:05', status: 'present', verificationStatus: 'pending', verifiedBy: null, verifiedAt: null, submittedAt: '2025-07-22T11:05:00Z' },

  // Dept Leadership — Mental Health
  { id: 'ar3', userId: 'u2', name: 'Kwame Asante', role: 'dept_leadership', department: 'Mental Health & Resilience', activity: 'Q3 Organizational Strategy Meeting', activityType: 'meeting', date: '2025-07-10', time: '09:15', status: 'late', verificationStatus: 'verified', verifiedBy: 'Dr. Amara Osei-Bonsu', verifiedAt: '2025-07-10T11:00:00Z', submittedAt: '2025-07-10T09:15:00Z' },
  { id: 'ar4', userId: 'u2', name: 'Kwame Asante', role: 'dept_leadership', department: 'Mental Health & Resilience', activity: 'Trauma-Informed Care Training', activityType: 'training', date: '2025-07-11', time: '10:00', status: 'present', verificationStatus: 'verified', verifiedBy: 'Dr. Amara Osei-Bonsu', verifiedAt: '2025-07-11T12:00:00Z', submittedAt: '2025-07-11T10:00:00Z' },
  { id: 'ar5', userId: 'u2', name: 'Kwame Asante', role: 'dept_leadership', department: 'Mental Health & Resilience', activity: 'Mental Health Program Review', activityType: 'meeting', date: '2025-07-17', time: '14:00', status: 'present', verificationStatus: 'pending', verifiedBy: null, verifiedAt: null, submittedAt: '2025-07-17T14:00:00Z' },

  // Dept Leadership — Climate Advocacy
  { id: 'ar6', userId: 'u3', name: 'Fatima Al-Rashid', role: 'dept_leadership', department: 'Climate Advocacy', activity: 'Q3 Organizational Strategy Meeting', activityType: 'meeting', date: '2025-07-10', time: '09:00', status: 'present', verificationStatus: 'verified', verifiedBy: 'Dr. Amara Osei-Bonsu', verifiedAt: '2025-07-10T11:00:00Z', submittedAt: '2025-07-10T09:00:00Z' },
  { id: 'ar7', userId: 'u3', name: 'Fatima Al-Rashid', role: 'dept_leadership', department: 'Climate Advocacy', activity: 'Climate Resilience Workshop', activityType: 'workshop', date: '2025-07-12', time: '09:30', status: 'present', verificationStatus: 'verified', verifiedBy: 'Dr. Amara Osei-Bonsu', verifiedAt: '2025-07-12T12:00:00Z', submittedAt: '2025-07-12T09:30:00Z' },
  { id: 'ar8', userId: 'u3', name: 'Fatima Al-Rashid', role: 'dept_leadership', department: 'Climate Advocacy', activity: 'Donor Reporting Workshop', activityType: 'workshop', date: '2025-07-22', time: '11:00', status: 'present', verificationStatus: 'pending', verifiedBy: null, verifiedAt: null, submittedAt: '2025-07-22T11:00:00Z' },

  // Coordinator records
  { id: 'ar9', userId: 'u4', name: 'Emmanuel Boateng', role: 'coordinator', department: 'Programs', activity: 'Trauma-Informed Care Training', activityType: 'training', date: '2025-07-11', time: '10:05', status: 'present', verificationStatus: 'verified', verifiedBy: 'Kwame Asante', verifiedAt: '2025-07-11T13:00:00Z', submittedAt: '2025-07-11T10:05:00Z' },
  { id: 'ar10', userId: 'u4', name: 'Emmanuel Boateng', role: 'coordinator', department: 'Programs', activity: 'Climate Resilience Workshop', activityType: 'workshop', date: '2025-07-12', time: '09:45', status: 'late', verificationStatus: 'verified', verifiedBy: 'Fatima Al-Rashid', verifiedAt: '2025-07-12T13:00:00Z', submittedAt: '2025-07-12T09:45:00Z' },
  { id: 'ar11', userId: 'u4', name: 'Emmanuel Boateng', role: 'coordinator', department: 'Programs', activity: 'GIS Data Collection Workshop', activityType: 'workshop', date: '2025-07-16', time: '10:00', status: 'present', verificationStatus: 'pending', verifiedBy: null, verifiedAt: null, submittedAt: '2025-07-16T10:00:00Z' },
  { id: 'ar12', userId: 'u4', name: 'Emmanuel Boateng', role: 'coordinator', department: 'Programs', activity: 'Mental Health Program Review', activityType: 'meeting', date: '2025-07-17', time: '14:00', status: 'absent', verificationStatus: 'verified', verifiedBy: 'Kwame Asante', verifiedAt: '2025-07-17T16:00:00Z', submittedAt: '2025-07-17T14:00:00Z' },
  { id: 'ar13', userId: 'u4', name: 'Emmanuel Boateng', role: 'coordinator', department: 'Programs', activity: 'Volunteer Orientation Session', activityType: 'training', date: '2025-07-18', time: '09:00', status: 'present', verificationStatus: 'pending', verifiedBy: null, verifiedAt: null, submittedAt: '2025-07-18T09:00:00Z' },

  // Field Officer records
  { id: 'ar14', userId: 'u5', name: 'Abena Mensah', role: 'field_officer', department: 'Field Operations', activity: 'Climate Resilience Workshop', activityType: 'workshop', date: '2025-07-12', time: '09:30', status: 'present', verificationStatus: 'verified', verifiedBy: 'Fatima Al-Rashid', verifiedAt: '2025-07-12T13:00:00Z', submittedAt: '2025-07-12T09:30:00Z' },
  { id: 'ar15', userId: 'u5', name: 'Abena Mensah', role: 'field_officer', department: 'Field Operations', activity: 'Cape Coast Field Survey', activityType: 'field_activity', date: '2025-07-14', time: '07:05', status: 'present', verificationStatus: 'verified', verifiedBy: 'Fatima Al-Rashid', verifiedAt: '2025-07-14T15:00:00Z', submittedAt: '2025-07-14T07:05:00Z' },
  { id: 'ar16', userId: 'u5', name: 'Abena Mensah', role: 'field_officer', department: 'Field Operations', activity: 'Takoradi Community Outreach', activityType: 'community_event', date: '2025-07-15', time: '08:30', status: 'present', verificationStatus: 'pending', verifiedBy: null, verifiedAt: null, submittedAt: '2025-07-15T08:30:00Z' },
  { id: 'ar17', userId: 'u5', name: 'Abena Mensah', role: 'field_officer', department: 'Field Operations', activity: 'GIS Data Collection Workshop', activityType: 'workshop', date: '2025-07-16', time: '10:00', status: 'present', verificationStatus: 'pending', verifiedBy: null, verifiedAt: null, submittedAt: '2025-07-16T10:00:00Z' },
  { id: 'ar18', userId: 'u5', name: 'Abena Mensah', role: 'field_officer', department: 'Field Operations', activity: 'Bolgatanga Community Forum', activityType: 'community_event', date: '2025-07-21', time: '10:00', status: 'absent', verificationStatus: 'verified', verifiedBy: 'Fatima Al-Rashid', verifiedAt: '2025-07-21T14:00:00Z', submittedAt: '2025-07-21T10:00:00Z' },

  // Volunteer records
  { id: 'ar19', userId: 'u6', name: 'Kofi Darko', role: 'volunteer', department: 'Community Engagement', activity: 'Cape Coast Field Survey', activityType: 'field_activity', date: '2025-07-14', time: '07:20', status: 'late', verificationStatus: 'verified', verifiedBy: 'Abena Mensah', verifiedAt: '2025-07-14T15:00:00Z', submittedAt: '2025-07-14T07:20:00Z' },
  { id: 'ar20', userId: 'u6', name: 'Kofi Darko', role: 'volunteer', department: 'Community Engagement', activity: 'Takoradi Community Outreach', activityType: 'community_event', date: '2025-07-15', time: '08:30', status: 'present', verificationStatus: 'verified', verifiedBy: 'Abena Mensah', verifiedAt: '2025-07-15T12:00:00Z', submittedAt: '2025-07-15T08:30:00Z' },
  { id: 'ar21', userId: 'u6', name: 'Kofi Darko', role: 'volunteer', department: 'Community Engagement', activity: 'Volunteer Orientation Session', activityType: 'training', date: '2025-07-18', time: '09:00', status: 'present', verificationStatus: 'pending', verifiedBy: null, verifiedAt: null, submittedAt: '2025-07-18T09:00:00Z' },
  { id: 'ar22', userId: 'u6', name: 'Kofi Darko', role: 'volunteer', department: 'Community Engagement', activity: 'Bolgatanga Community Forum', activityType: 'community_event', date: '2025-07-21', time: '10:05', status: 'present', verificationStatus: 'rejected', verifiedBy: 'Abena Mensah', verifiedAt: '2025-07-21T14:00:00Z', submittedAt: '2025-07-21T10:05:00Z' },
];
