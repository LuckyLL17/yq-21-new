import { useState, useEffect } from 'react';
import {
  Flame,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Activity,
  Droplets,
  Zap,
} from 'lucide-react';
import type { DailySummary } from '../data/records';
import { getDailySummary } from '../data/records';
import { getCaloriesLevel } from '../utils/calculator';

interface DailyReportProps {
  date?: string;
  onDateChange?: (date: string) => void;
}

const DAILY_CALORIE_GOAL = 2000;

export function DailyReport({ date: propDate, onDateChange }: DailyReportProps) {
  const [selectedDate, setSelectedDate] = useState(
    propDate || new Date().toISOString().split('T')[0]
  );
  const [summary, setSummary] = useState<DailySummary | null>(null);

  useEffect(() => {
    const dailySummary = getDailySummary(selectedDate);
    setSummary(dailySummary);
  }, [selectedDate]);

  useEffect(() => {
    if (propDate && propDate !== selectedDate) {
      setSelectedDate(propDate);
    }
  }, [propDate, selectedDate]);

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    const newDate = date.toISOString().split('T')[0];
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    onDateChange?.(today);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return '今天';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return '昨天';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  };

  const getWeekday = (dateStr: string) => {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[new Date(dateStr).getDay()];
  };

  if (!summary) return null;

  const progress = Math.min(
    (summary.totalCalories / DAILY_CALORIE_GOAL) * 100,
    100
  );
  const remaining = DAILY_CALORIE_GOAL - summary.totalCalories;
  const caloriesLevel = getCaloriesLevel(summary.totalCalories);

  const proteinCalories = summary.totalProtein * 4;
  const fatCalories = summary.totalFat * 9;
  const carbsCalories = summary.totalCarbs * 4;
  const totalMacroCalories = proteinCalories + fatCalories + carbsCalories;

  const getMacroPercentage = (macroCalories: number) => {
    if (totalMacroCalories === 0) return 0;
    return (macroCalories / totalMacroCalories) * 100;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <div className="font-semibold text-gray-800">
              {formatDate(selectedDate)}
            </div>
            <div className="text-sm text-gray-500">
              {getWeekday(selectedDate)}
            </div>
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-3 py-1 text-sm text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
        >
          今天
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-500">今日摄入</div>
              <div className="text-2xl font-bold text-gray-800">
                {summary.totalCalories.toFixed(0)}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  kcal
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">目标</div>
            <div className="text-lg font-semibold text-gray-700">
              {DAILY_CALORIE_GOAL} kcal
            </div>
          </div>
        </div>

        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
              progress > 100
                ? 'bg-red-500'
                : 'bg-gradient-to-r from-primary-500 to-accent-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className={`text-sm ${caloriesLevel.color}`}>
            {caloriesLevel.message}
          </span>
          <span className="text-sm text-gray-500">
            {remaining > 0
              ? `还可摄入 ${remaining.toFixed(0)} kcal`
              : `已超标 ${Math.abs(remaining).toFixed(0)} kcal`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-xl text-center">
          <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-blue-500 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div className="text-xl font-bold text-blue-600">
            {summary.totalProtein.toFixed(1)}g
          </div>
          <div className="text-xs text-gray-500">蛋白质</div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-xl text-center">
          <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-yellow-500 flex items-center justify-center">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <div className="text-xl font-bold text-yellow-600">
            {summary.totalFat.toFixed(1)}g
          </div>
          <div className="text-xs text-gray-500">脂肪</div>
        </div>
        <div className="p-4 bg-green-50 rounded-xl text-center">
          <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-green-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="text-xl font-bold text-green-600">
            {summary.totalCarbs.toFixed(1)}g
          </div>
          <div className="text-xs text-gray-500">碳水化合物</div>
        </div>
      </div>

      {totalMacroCalories > 0 && (
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-600 mb-3">
            营养素分布
          </div>
          <div className="h-4 rounded-full overflow-hidden flex">
            <div
              className="bg-blue-500 transition-all duration-300"
              style={{ width: `${getMacroPercentage(proteinCalories)}%` }}
              title={`蛋白质 ${getMacroPercentage(proteinCalories).toFixed(1)}%`}
            />
            <div
              className="bg-yellow-500 transition-all duration-300"
              style={{ width: `${getMacroPercentage(fatCalories)}%` }}
              title={`脂肪 ${getMacroPercentage(fatCalories).toFixed(1)}%`}
            />
            <div
              className="bg-green-500 transition-all duration-300"
              style={{ width: `${getMacroPercentage(carbsCalories)}%` }}
              title={`碳水化合物 ${getMacroPercentage(carbsCalories).toFixed(1)}%`}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              蛋白质 {getMacroPercentage(proteinCalories).toFixed(0)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full" />
              脂肪 {getMacroPercentage(fatCalories).toFixed(0)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              碳水 {getMacroPercentage(carbsCalories).toFixed(0)}%
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-gray-600">记录数量</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {summary.recordCount}
            <span className="text-sm font-normal text-gray-500 ml-1">次</span>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent-500" />
            <span className="text-sm text-gray-600">平均每次</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {summary.recordCount > 0
              ? (summary.totalCalories / summary.recordCount).toFixed(0)
              : 0}
            <span className="text-sm font-normal text-gray-500 ml-1">kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
