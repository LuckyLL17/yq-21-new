import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getCalendarHeatmapData, getHeatmapLevel } from '../data/records';

interface CalendarHeatmapProps {
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  refreshTrigger?: number;
}

export function CalendarHeatmap({
  selectedDate,
  onDateSelect,
  refreshTrigger,
}: CalendarHeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [heatmapData, setHeatmapData] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      setCurrentMonth({
        year: date.getFullYear(),
        month: date.getMonth(),
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    const data = getCalendarHeatmapData(currentMonth.year, currentMonth.month);
    setHeatmapData(data);
  }, [currentMonth, refreshTrigger]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentMonth.year, currentMonth.month, 1);
    const lastDay = new Date(currentMonth.year, currentMonth.month + 1, 0);
    const startDayOfWeek = firstDay.getDay();

    const days: Array<{ date: string; day: number; isCurrentMonth: boolean }> =
      [];

    const prevMonthLastDay = new Date(
      currentMonth.year,
      currentMonth.month,
      0
    ).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(
        currentMonth.year,
        currentMonth.month - 1,
        day
      );
      days.push({
        date: date.toISOString().split('T')[0],
        day,
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentMonth.year, currentMonth.month, day);
      days.push({
        date: date.toISOString().split('T')[0],
        day,
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(
        currentMonth.year,
        currentMonth.month + 1,
        day
      );
      days.push({
        date: date.toISOString().split('T')[0],
        day,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  const maxCalories = useMemo(() => {
    let max = 0;
    heatmapData.forEach((calories) => {
      if (calories > max) max = calories;
    });
    return Math.max(max, 500);
  }, [heatmapData]);

  const getHeatmapColor = (date: string, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return 'bg-gray-50 text-gray-300';
    const calories = heatmapData.get(date) || 0;
    const level = getHeatmapLevel(calories, maxCalories);

    const colors = [
      'bg-gray-100 text-gray-500 hover:bg-gray-200',
      'bg-green-100 text-green-700 hover:bg-green-200',
      'bg-green-300 text-green-800 hover:bg-green-400',
      'bg-green-500 text-white hover:bg-green-600',
      'bg-green-700 text-white hover:bg-green-800',
    ];
    return colors[level];
  };

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => {
      let newMonth = prev.month - 1;
      let newYear = prev.year;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
      return { year: newYear, month: newMonth };
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      let newMonth = prev.month + 1;
      let newYear = prev.year;
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      return { year: newYear, month: newMonth };
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth({
      year: today.getFullYear(),
      month: today.getMonth(),
    });
  };

  const isSelected = (date: string) => {
    return selectedDate === date;
  };

  const isToday = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  };

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const monthNames = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-lg text-gray-800">
            日历热力图
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-medium text-gray-800 min-w-28 text-center">
            {currentMonth.year}年 {monthNames[currentMonth.month]}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
          >
            今天
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayInfo, index) => {
          const calories = heatmapData.get(dayInfo.date) || 0;
          return (
            <button
              key={index}
              onClick={() => dayInfo.isCurrentMonth && onDateSelect?.(dayInfo.date)}
              disabled={!dayInfo.isCurrentMonth}
              className={`relative aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                getHeatmapColor(dayInfo.date, dayInfo.isCurrentMonth)
              } ${
                isSelected(dayInfo.date) && dayInfo.isCurrentMonth
                  ? 'ring-2 ring-primary-500 ring-offset-2'
                  : ''
              } ${
                isToday(dayInfo.date) && dayInfo.isCurrentMonth
                  ? 'ring-2 ring-accent-500'
                  : ''
              } ${
                dayInfo.isCurrentMonth ? 'cursor-pointer' : 'cursor-default'
              }`}
              title={
                dayInfo.isCurrentMonth
                  ? `${dayInfo.date}: ${calories} kcal`
                  : ''
              }
            >
              {dayInfo.day}
              {isToday(dayInfo.date) && dayInfo.isCurrentMonth && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <span className="text-sm text-gray-500">少</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((level) => {
            const colors = [
              'bg-gray-100',
              'bg-green-100',
              'bg-green-300',
              'bg-green-500',
              'bg-green-700',
            ];
            return (
              <div
                key={level}
                className={`w-6 h-6 rounded ${colors[level]}`}
              />
            );
          })}
        </div>
        <span className="text-sm text-gray-500">多</span>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        {selectedDate && (
          <span>
            选中日期: {selectedDate} · {heatmapData.get(selectedDate) || 0} kcal
          </span>
        )}
      </div>
    </div>
  );
}
