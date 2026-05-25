import { create } from 'zustand';
import type { AttendanceRecord } from '../types';
import { MOCK_ATTENDANCE_RECORDS } from '../data/mockData';

interface AttendanceState {
  records: AttendanceRecord[];
  setRecords: (r: AttendanceRecord[]) => void;
  addRecord: (r: AttendanceRecord) => void;
  updateRecord: (id: string, patch: Partial<AttendanceRecord>) => void;
  getRecordById: (id: string) => AttendanceRecord | undefined;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  records: MOCK_ATTENDANCE_RECORDS,
  setRecords: (r: AttendanceRecord[]) => set({ records: r }),
  addRecord: (r: AttendanceRecord) => set(state => ({ records: [r, ...state.records] })),
  updateRecord: (id: string, patch: Partial<AttendanceRecord>) => set(state => ({
    records: state.records.map(rec => rec.id === id ? { ...rec, ...patch } : rec),
  })),
  getRecordById: (id: string) => get().records.find(r => r.id === id),
}));
