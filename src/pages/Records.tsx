import { useState } from 'react';
import { Calendar, List, LayoutGrid, Flame, History, X } from 'lucide-react';
import { RecordForm } from '../components/RecordForm';
import { DailyReport } from '../components/DailyReport';
import { CalendarHeatmap } from '../components/CalendarHeatmap';
import { RecordList } from '../components/RecordList';

type ViewMode = 'split' | 'calendar';

export function Records() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showRecordList, setShowRecordList] = useState(false);

  const handleRecordAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-poppins text-3xl font-bold text-gray-800">
                  热量记录
                </h1>
                <p className="text-gray-500">记录你的热量摄入，追踪健康饮食</p>
              </div>
            </div>
            <button
              onClick={() => setShowRecordList(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-medium hover:from-primary-600 hover:to-accent-600 transition-all shadow-md"
            >
              <History className="w-4 h-4" />
              查看历史记录
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'split'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            分屏视图
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            日历视图
          </button>
        </div>

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <RecordForm onRecordAdded={handleRecordAdded} />
              <DailyReport
                date={selectedDate}
                onDateChange={setSelectedDate}
                refreshTrigger={refreshTrigger}
              />
            </div>
            <div className="lg:col-span-2">
              <CalendarHeatmap
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <RecordForm onRecordAdded={handleRecordAdded} />
              <DailyReport
                date={selectedDate}
                onDateChange={setSelectedDate}
                refreshTrigger={refreshTrigger}
              />
            </div>
            <div className="lg:col-span-2">
              <CalendarHeatmap
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        )}
      </div>

      {showRecordList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRecordList(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">历史记录</h3>
                    <p className="text-white/80 text-sm">查看和管理所有热量摄入记录</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRecordList(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <RecordList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
