import { useState } from 'react';
import { Dumbbell, Plus, Minus, Check, Flame } from 'lucide-react';
import { getAllExercises, getIntensityLabel, type Exercise, type ExerciseIntensity } from '../data/exercises';
import { addExerciseRecord } from '../data/records';
import { calculateCaloriesBurned } from '../utils/exercise';
import { formatEnergy, type EnergyUnit, getEnergyRangeDescription } from '../utils/energy';
import { getWeightOptions } from '../utils/constants';

interface ExerciseRecordFormProps {
  onRecordAdded?: () => void;
  energyUnit?: EnergyUnit;
}

export function ExerciseRecordForm({ onRecordAdded, energyUnit = 'kcal' }: ExerciseRecordFormProps) {
  const exercises = getAllExercises().filter(e => e.id !== 'sitting');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [intensity, setIntensity] = useState<ExerciseIntensity>('medium');
  const [minutes, setMinutes] = useState(30);
  const [weight, setWeight] = useState(65);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);

  const caloriesBurned = selectedExercise
    ? calculateCaloriesBurned(selectedExercise, minutes, intensity, weight)
    : 0;

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseDropdown(false);
  };

  const handleSubmit = () => {
    if (!selectedExercise) return;

    addExerciseRecord({
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      intensity,
      minutes,
      caloriesBurned,
      weight,
      date,
      time,
      notes,
    });

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setSelectedExercise(null);
      setMinutes(30);
      setNotes('');
      onRecordAdded?.();
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
        <Dumbbell className="w-5 h-5 text-green-500" />
        添加运动记录
      </h3>

      {showSuccess && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>运动记录添加成功！</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            选择运动
          </label>
          <div
            className="w-full px-4 py-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors"
            onClick={() => setShowExerciseDropdown(!showExerciseDropdown)}
          >
            {selectedExercise ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  <selectedExercise.icon className="w-5 h-5 text-primary-600" />
                </div>
                <span className="font-medium text-gray-800">{selectedExercise.name}</span>
              </div>
            ) : (
              <span className="text-gray-400">点击选择运动类型...</span>
            )}
          </div>

          {showExerciseDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowExerciseDropdown(false)}
              />
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleSelectExercise(exercise)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                      <exercise.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{exercise.name}</div>
                      <div className="text-xs text-gray-500">
                        {getIntensityLabel('medium')} · 约 {Math.round(calculateCaloriesBurned(exercise, 30, 'medium', 65))} kcal/30分钟
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {selectedExercise && (
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                运动强度
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as ExerciseIntensity[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setIntensity(level)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      intensity === level
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {getIntensityLabel(level)}
                  </button>
                ))}
              </div>
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                运动时长
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMinutes(Math.max(5, minutes - 5))}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-2xl font-bold text-gray-800">{minutes}</span>
                  <span className="text-sm text-gray-500 ml-1">分钟</span>
                </div>
                <button
                  onClick={() => setMinutes(minutes + 5)}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                {[10, 20, 30, 45, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMinutes(m)}
                    className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${
                      minutes === m
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {m}分钟
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                你的体重（公斤）
              </label>
              <select
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                {getWeightOptions().map((w) => (
                  <option key={w} value={w}>
                    {w} 公斤
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">预计消耗</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    {formatEnergy(caloriesBurned, energyUnit)}
                  </div>
                  <div className="text-xs text-gray-500">
                    误差范围：{getEnergyRangeDescription(caloriesBurned, energyUnit)}
                  </div>
                </div>
              </div>
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              添加运动记录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
