import type { Snack } from '../data/snacks';
import type { Exercise } from '../data/exercises';

const DEFAULT_WEIGHT = 65;

export function calculateExerciseTime(
  calories: number,
  metValue: number,
  weight: number = DEFAULT_WEIGHT
): number {
  const caloriesPerMinute = (metValue * 3.5 * weight) / 200;
  return Math.ceil(calories / caloriesPerMinute);
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}小时`;
  }
  return `${hours}小时${mins}分钟`;
}

export function getExerciseComparison(
  snack: Snack,
  exercise: Exercise,
  weight: number = DEFAULT_WEIGHT
): { minutes: number; formatted: string; description: string } {
  const minutes = calculateExerciseTime(snack.calories, exercise.metValue, weight);
  const formatted = formatTime(minutes);
  const description = `${snack.servingSize}${snack.name} = ${exercise.name}${formatted}`;
  
  return { minutes, formatted, description };
}

export function getCaloriesLevel(calories: number): { level: string; color: string; message: string } {
  if (calories < 100) {
    return { level: '低', color: 'text-green-500', message: '热量较低，可以放心享用' };
  } else if (calories < 200) {
    return { level: '中低', color: 'text-emerald-500', message: '热量适中，适量食用' };
  } else if (calories < 350) {
    return { level: '中', color: 'text-yellow-500', message: '热量较高，注意控制份量' };
  } else if (calories < 500) {
    return { level: '高', color: 'text-orange-500', message: '热量偏高，建议偶尔食用' };
  } else {
    return { level: '很高', color: 'text-red-500', message: '热量很高，请谨慎食用' };
  }
}

export function getWeightOptions(): number[] {
  return [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
}
