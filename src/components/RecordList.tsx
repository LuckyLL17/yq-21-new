import { useState, useEffect, useMemo } from 'react';
import {
  Trash2,
  Filter,
  Search,
  Clock,
  UtensilsCrossed,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { CalorieRecord } from '../data/records';
import {
  getRecords,
  deleteRecord,
  getRecordsByDateRange,
} from '../data/records';
import { getCaloriesLevel } from '../utils/calculator';

interface RecordListProps {
  date?: string;
  refreshTrigger?: number;
}

export function RecordList({ date, refreshTrigger }: RecordListProps) {
  const [records, setRecords] = useState<CalorieRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  useEffect(() => {
    loadRecords();
  }, [date, dateRange, refreshTrigger]);

  const loadRecords = () => {
    let loadedRecords: CalorieRecord[];

    if (dateRange.start && dateRange.end) {
      loadedRecords = getRecordsByDateRange(dateRange.start, dateRange.end);
    } else if (date) {
      loadedRecords = getRecordsByDateRange(date, date);
    } else {
      loadedRecords = getRecords();
    }

    setRecords(loadedRecords);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteRecord(id);
      loadRecords();
    }
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    records.forEach((r) => cats.add(r.category));
    return Array.from(cats);
  }, [records]);

  const filteredRecords = useMemo(() => {
    let result = [...records];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.snackName.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.notes?.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter((r) => r.category === categoryFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return sortOrder === 'desc'
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    return result;
  }, [records, searchQuery, categoryFilter, sortOrder]);

  const totalCalories = filteredRecords.reduce((sum, r) => sum + r.calories, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            摄入记录
          </h3>
          <p className="text-sm text-gray-500">
            共 {filteredRecords.length} 条记录 ·{' '}
            {totalCalories.toFixed(0)} kcal
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-colors ${
            showFilters
              ? 'bg-primary-100 text-primary-600'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索记录..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                开始日期
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                结束日期
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                分类筛选
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">全部分类</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                排序
              </label>
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                }
                className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'desc' ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {sortOrder === 'desc' ? '最新' : '最早'}
                </span>
              </button>
            </div>
          </div>

          {(dateRange.start || dateRange.end) && (
            <button
              onClick={() => setDateRange({ start: '', end: '' })}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              清除日期筛选
            </button>
          )}
        </div>
      )}

      {filteredRecords.length === 0 ? (
        <div className="text-center py-12">
          <UtensilsCrossed className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">暂无记录</p>
          <p className="text-sm text-gray-400 mt-1">
            开始添加你的第一条热量记录吧
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {filteredRecords.map((record) => {
            const level = getCaloriesLevel(record.calories);
            return (
              <div
                key={record.id}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                      <UtensilsCrossed className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {record.snackName}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className="px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                          {record.category}
                        </span>
                        <span>×{record.quantity} 份</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {record.date} {record.time}
                        </span>
                      </div>
                      {record.notes && (
                        <p className="text-sm text-gray-500 mt-1">
                          {record.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`font-bold ${level.color}`}>
                        {record.calories.toFixed(0)} kcal
                      </div>
                      <div className="text-xs text-gray-500">
                        P: {record.protein.toFixed(1)}g · F:{' '}
                        {record.fat.toFixed(1)}g · C: {record.carbs.toFixed(1)}g
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
