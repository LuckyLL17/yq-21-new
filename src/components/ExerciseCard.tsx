import type { Snack } from '../data/snacks';
import type { Exercise } from '../data/exercises';
import { getExerciseComparison } from '../utils/calculator';

interface ExerciseCardProps {
  snack: Snack;
  exercise: Exercise;
  weight: number;
  isMain?: boolean;
}

export function ExerciseCard({ snack, exercise, weight, isMain = false }: ExerciseCardProps) {
  const result = getExerciseComparison(snack, exercise, weight);
  const Icon = exercise.icon;

  if (isMain) {
    return (
      <div className="w-full p-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl text-white">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Icon className="w-8 h-8" />
          </div>
        </div>
        <p className="text-center text-white/80 text-sm mb-2">消耗这些热量需要</p>
        <p className="text-center font-poppins font-bold text-4xl mb-2">
          {result.formatted}
        </p>
        <p className="text-center text-white/90 font-medium">
          {exercise.name}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 card-shadow">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-800">{exercise.name}</p>
          <p className="text-sm text-gray-500">{result.formatted}</p>
        </div>
      </div>
    </div>
  );
}
