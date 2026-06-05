import { useState, useEffect, useMemo } from 'react';
import {
  Trash2,
  Filter,
  Search,
  Clock,
  UtensilsCrossed,
  ChevronDown,
  ChevronUp,
  X,
  Flame,
  Activity,
  Droplets,
  Zap,
  Calendar,
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
  const [selectedRecord, setSelectedRecord] = useState<CalorieRecord | null>(null);

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
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
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

  const closeModal = () => setSelectedRecord(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            摄入记录
          </h3>
          <p className="text-sm text-gray-500">
            共 {filteredRecords.length} 条记录 ·{' '}
            <span className="font-medium text-primary-600">
              {totalCalories.toFixed(0)} kcal
            </span>
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
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <UtensilsCrossed className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">暂无记录</p>
          <p className="text-sm text-gray-400 mt-1">
            开始添加你的第一条热量记录吧
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {filteredRecords.map((record) => {
            const level = getCaloriesLevel(record.calories);
            return (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <UtensilsCrossed className="w-6 h-6 text-white" />
                    </div>
                    <div className="pt-1">
                      <div className="font-semibold text-gray-800 text-base">
                        {record.snackName}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                          {record.category}
                        </span>
                        <span>×{record.quantity} 份</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {record.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {record.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-xl font-bold ${level.color}`}>
                        {record.calories.toFixed(0)}
                        <span className="text-sm font-normal ml-1">kcal</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        P: {record.protein.toFixed(1)}g · F:{' '}
                        {record.fat.toFixed(1)}g · C: {record.carbs.toFixed(1)}g
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(record.id);
                      }}
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

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <UtensilsCrossed className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedRecord.snackName}</h3>
                    <p className="text-white/80 text-sm">{selectedRecord.category}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{selectedRecord.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{selectedRecord.time}</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-lg font-bold text-orange-600">
                      {selectedRecord.calories.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-500">kcal</div>
                  </div>
                  <div>
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {selectedRecord.protein.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">蛋白质(g)</div>
                  </div>
                  <div>
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="text-lg font-bold text-yellow-600">
                      {selectedRecord.fat.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">脂肪(g)</div>
                  </div>
                  <div>
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-green-100 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {selectedRecord.carbs.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">碳水(g)</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">份量</span>
                  <span className="font-medium text-gray-800">
                    {selectedRecord.quantity} × {selectedRecord.servingSize}
                  </span>
                </div>
                {selectedRecord.notes && (
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500 block mb-1">备注</span>
                    <p className="text-gray-800">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleDelete(selectedRecord.id)}
                  className="flex-1 py-3 px-4 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-colors"
                >
                  删除记录
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:from-primary-600 hover:to-accent-600 font-medium transition-all"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
