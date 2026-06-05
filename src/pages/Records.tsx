import { useState } from 'react';
import { Calendar, List, LayoutGrid, Flame } from 'lucide-react';
import { RecordForm } from '../components/RecordForm';
import { DailyReport } from '../components/DailyReport';
import { CalendarHeatmap } from '../components/CalendarHeatmap';
import { RecordList } from '../components/RecordList';

type ViewMode = 'split' | 'calendar' | 'list';

export function Records() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRecordAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
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
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List className="w-4 h-4" />
            列表视图
          </button>
        </div>

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <RecordForm onRecordAdded={handleRecordAdded} />
              <DailyReport
                date={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <CalendarHeatmap
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
              <RecordList date={selectedDate} refreshTrigger={refreshTrigger} />
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
              />
            </div>
            <div className="lg:col-span-2">
              <CalendarHeatmap
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <RecordForm onRecordAdded={handleRecordAdded} />
              <DailyReport
                date={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
            <div className="lg:col-span-2">
              <RecordList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
