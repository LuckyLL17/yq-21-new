import type { Snack } from './snacks';

export interface CalorieRecord {
  id: string;
  snackId?: string;
  snackName: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  quantity: number;
  servingSize: string;
  date: string;
  time: string;
  category: string;
  notes?: string;
  createdAt: string;
}

export interface DailySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  recordCount: number;
  records: CalorieRecord[];
}

const STORAGE_KEY = 'snack_calorie_records';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getRecords(): CalorieRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRecords(records: CalorieRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addRecord(record: Omit<CalorieRecord, 'id' | 'createdAt'>): CalorieRecord {
  const records = getRecords();
  const newRecord: CalorieRecord = {
    ...record,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  records.unshift(newRecord);
  saveRecords(records);
  return newRecord;
}

export function addRecordFromSnack(
  snack: Snack,
  quantity: number = 1,
  date?: string,
  time?: string,
  notes?: string
): CalorieRecord {
  const now = new Date();
  return addRecord({
    snackId: snack.id,
    snackName: snack.name,
    calories: snack.calories * quantity,
    protein: snack.protein * quantity,
    fat: snack.fat * quantity,
    carbs: snack.carbs * quantity,
    quantity,
    servingSize: snack.servingSize,
    date: date || now.toISOString().split('T')[0],
    time: time || now.toTimeString().slice(0, 5),
    category: snack.category,
    notes,
  });
}

export function deleteRecord(id: string): boolean {
  const records = getRecords();
  const filtered = records.filter((r) => r.id !== id);
  if (filtered.length !== records.length) {
    saveRecords(filtered);
    return true;
  }
  return false;
}

export function updateRecord(
  id: string,
  updates: Partial<CalorieRecord>
): CalorieRecord | null {
  const records = getRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index !== -1) {
    records[index] = { ...records[index], ...updates };
    saveRecords(records);
    return records[index];
  }
  return null;
}

export function getRecordsByDateRange(
  startDate: string,
  endDate: string
): CalorieRecord[] {
  const records = getRecords();
  return records.filter((r) => r.date >= startDate && r.date <= endDate);
}

export function getRecordsByDate(date: string): CalorieRecord[] {
  const records = getRecords();
  return records.filter((r) => r.date === date);
}

export function getDailySummary(date: string): DailySummary {
  const records = getRecordsByDate(date);
  return calculateDailySummary(records, date);
}

function calculateDailySummary(
  records: CalorieRecord[],
  date: string
): DailySummary {
  return {
    date,
    totalCalories: records.reduce((sum, r) => sum + r.calories, 0),
    totalProtein: records.reduce((sum, r) => sum + r.protein, 0),
    totalFat: records.reduce((sum, r) => sum + r.fat, 0),
    totalCarbs: records.reduce((sum, r) => sum + r.carbs, 0),
    recordCount: records.length,
    records,
  };
}

export function getDailySummariesByDateRange(
  startDate: string,
  endDate: string
): Map<string, DailySummary> {
  const records = getRecordsByDateRange(startDate, endDate);
  const summaries = new Map<string, DailySummary>();

  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    summaries.set(dateStr, calculateDailySummary([], dateStr));
  }

  records.forEach((record) => {
    const summary = summaries.get(record.date);
    if (summary) {
      summary.totalCalories += record.calories;
      summary.totalProtein += record.protein;
      summary.totalFat += record.fat;
      summary.totalCarbs += record.carbs;
      summary.recordCount += 1;
      summary.records.push(record);
    }
  });

  return summaries;
}

export function getCalendarHeatmapData(
  year: number,
  month: number
): Map<string, number> {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const summaries = getDailySummariesByDateRange(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );

  const heatmap = new Map<string, number>();
  summaries.forEach((summary, date) => {
    heatmap.set(date, summary.totalCalories);
  });
  return heatmap;
}

export function getHeatmapLevel(
  calories: number,
  maxCalories: number = 2000
): number {
  if (calories === 0) return 0;
  const ratio = calories / maxCalories;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

export function getRecentRecords(days: number = 30): CalorieRecord[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return getRecordsByDateRange(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );
}
