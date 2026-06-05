import { useState } from 'react';
import { Search, Plus, Minus, X, Check } from 'lucide-react';
import type { Snack } from '../data/snacks';
import { snacks, findSnackByName } from '../data/snacks';
import { addRecordFromSnack } from '../data/records';
import { getCaloriesLevel } from '../utils/calculator';

interface RecordFormProps {
  onRecordAdded?: () => void;
}

export function RecordForm({ onRecordAdded }: RecordFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Snack[]>([]);
  const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = findSnackByName(query);
      setSearchResults(results);
    } else {
      setSearchResults(snacks.slice(0, 10));
    }
    setShowDropdown(true);
  };

  const selectSnack = (snack: Snack) => {
    setSelectedSnack(snack);
    setSearchQuery(snack.name);
    setShowDropdown(false);
  };

  const handleSubmit = () => {
    if (!selectedSnack) return;

    addRecordFromSnack(selectedSnack, quantity, date, time, notes);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setSelectedSnack(null);
      setSearchQuery('');
      setQuantity(1);
      setNotes('');
      onRecordAdded?.();
    }, 1500);
  };

  const caloriesLevel = selectedSnack
    ? getCaloriesLevel(selectedSnack.calories * quantity)
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-lg text-gray-800 mb-4">
        添加热量记录
      </h3>

      {showSuccess && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>记录添加成功！</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            选择零食
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder="搜索零食名称..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {showDropdown && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
              {searchResults.map((snack) => (
                <button
                  key={snack.id}
                  onClick={() => selectSnack(snack)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {snack.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {snack.category} · {snack.servingSize}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary-600">
                      {snack.calories} kcal
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedSnack && (
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">
                  {selectedSnack.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {selectedSnack.category} · {selectedSnack.servingSize}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSnack(null);
                  setSearchQuery('');
                }}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  日期
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  时间
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                数量
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500">
                  份 × {selectedSnack.servingSize}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div
                    className={`text-xl font-bold ${caloriesLevel?.color || 'text-gray-800'}`}
                  >
                    {(selectedSnack.calories * quantity).toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-500">热量 (kcal)</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">
                    {(selectedSnack.protein * quantity).toFixed(1)}g
                  </div>
                  <div className="text-xs text-gray-500">蛋白质</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-yellow-600">
                    {(selectedSnack.fat * quantity).toFixed(1)}g
                  </div>
                  <div className="text-xs text-gray-500">脂肪</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {(selectedSnack.carbs * quantity).toFixed(1)}g
                  </div>
                  <div className="text-xs text-gray-500">碳水</div>
                </div>
              </div>
              {caloriesLevel && (
                <p className={`mt-3 text-sm text-center ${caloriesLevel.color}`}>
                  {caloriesLevel.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                备注 (可选)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="添加备注..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all"
            >
              添加记录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
