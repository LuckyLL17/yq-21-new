import type { Snack } from '../data/snacks';
import type { Exercise } from '../data/exercises';
import { getAllExercises } from '../data/exercises';

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

export interface ExercisePlanItem {
  exercise: Exercise;
  minutes: number;
  caloriesBurned: number;
}

export interface ExercisePlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalMinutes: number;
  totalCalories: number;
  items: ExercisePlanItem[];
}

function getCaloriesPerMinute(metValue: number, weight: number): number {
  return (metValue * 3.5 * weight) / 200;
}

function generateQuickFatBurnPlan(targetCalories: number, weight: number): ExercisePlan {
  const exercises = getAllExercises().filter(e => e.metValue >= 7.0);
  const items: ExercisePlanItem[] = [];
  let remainingCalories = targetCalories;
  let totalMinutes = 0;

  for (const exercise of exercises.slice(0, 3)) {
    if (remainingCalories <= 0) break;
    const caloriesPerMin = getCaloriesPerMinute(exercise.metValue, weight);
    const minutes = Math.ceil((remainingCalories * 0.4) / caloriesPerMin);
    const actualCalories = minutes * caloriesPerMin;
    
    if (minutes >= 5) {
      items.push({
        exercise,
        minutes,
        caloriesBurned: Math.round(actualCalories)
      });
      totalMinutes += minutes;
      remainingCalories -= actualCalories;
    }
  }

  return {
    id: 'quick-fat-burn',
    name: '快速燃脂方案',
    description: '高强度间歇运动，快速消耗热量',
    difficulty: 'hard',
    totalMinutes,
    totalCalories: Math.round(targetCalories),
    items
  };
}

function generateBalancedPlan(targetCalories: number, weight: number): ExercisePlan {
  const allExercises = getAllExercises();
  const cardioExercises = allExercises.filter(e => e.metValue >= 6.0);
  const strengthExercises = allExercises.filter(e => e.id === 'weight-training' || e.id === 'yoga');
  
  const items: ExercisePlanItem[] = [];
  let totalMinutes = 0;

  const warmUp = allExercises.find(e => e.id === 'walking');
  if (warmUp) {
    const caloriesPerMin = getCaloriesPerMinute(warmUp.metValue, weight);
    items.push({ exercise: warmUp, minutes: 10, caloriesBurned: Math.round(10 * caloriesPerMin) });
    totalMinutes += 10;
  }

  const cardio = cardioExercises[Math.floor(Math.random() * cardioExercises.length)];
  const cardioCalories = targetCalories * 0.5;
  const cardioCaloriesPerMin = getCaloriesPerMinute(cardio.metValue, weight);
  const cardioMinutes = Math.ceil(cardioCalories / cardioCaloriesPerMin);
  items.push({
    exercise: cardio,
    minutes: cardioMinutes,
    caloriesBurned: Math.round(cardioMinutes * cardioCaloriesPerMin)
  });
  totalMinutes += cardioMinutes;

  const strength = strengthExercises[Math.floor(Math.random() * strengthExercises.length)];
  const strengthCalories = targetCalories * 0.3;
  const strengthCaloriesPerMin = getCaloriesPerMinute(strength.metValue, weight);
  const strengthMinutes = Math.ceil(strengthCalories / strengthCaloriesPerMin);
  items.push({
    exercise: strength,
    minutes: strengthMinutes,
    caloriesBurned: Math.round(strengthMinutes * strengthCaloriesPerMin)
  });
  totalMinutes += strengthMinutes;

  const coolDown = allExercises.find(e => e.id === 'yoga');
  if (coolDown && coolDown.id !== strength.id) {
    const coolDownCaloriesPerMin = getCaloriesPerMinute(coolDown.metValue, weight);
    items.push({ exercise: coolDown, minutes: 10, caloriesBurned: Math.round(10 * coolDownCaloriesPerMin) });
    totalMinutes += 10;
  }

  const totalCaloriesBurned = items.reduce((sum, item) => sum + item.caloriesBurned, 0);

  return {
    id: 'balanced',
    name: '均衡运动方案',
    description: '有氧与力量结合，科学健康燃脂',
    difficulty: 'medium',
    totalMinutes,
    totalCalories: totalCaloriesBurned,
    items
  };
}

function generateEasyPlan(targetCalories: number, weight: number): ExercisePlan {
  const allExercises = getAllExercises();
  const easyExercises = allExercises.filter(e => e.metValue < 6.0 && e.id !== 'sitting');
  
  const items: ExercisePlanItem[] = [];
  let totalMinutes = 0;
  let remainingCalories = targetCalories;

  for (let i = 0; i < Math.min(4, easyExercises.length); i++) {
    const exercise = easyExercises[i];
    const caloriesPerMin = getCaloriesPerMinute(exercise.metValue, weight);
    const minutes = Math.ceil((remainingCalories / (4 - i)) / caloriesPerMin);
    const actualCalories = minutes * caloriesPerMin;
    
    if (minutes >= 10) {
      items.push({
        exercise,
        minutes,
        caloriesBurned: Math.round(actualCalories)
      });
      totalMinutes += minutes;
      remainingCalories -= actualCalories;
    }
  }

  const totalCaloriesBurned = items.reduce((sum, item) => sum + item.caloriesBurned, 0);

  return {
    id: 'easy',
    name: '轻松运动方案',
    description: '低强度运动，适合新手或恢复训练',
    difficulty: 'easy',
    totalMinutes,
    totalCalories: totalCaloriesBurned,
    items
  };
}

function generateVarietyPlan(targetCalories: number, weight: number): ExercisePlan {
  const allExercises = getAllExercises().filter(e => e.id !== 'sitting');
  const shuffled = [...allExercises].sort(() => Math.random() - 0.5).slice(0, 5);
  
  const items: ExercisePlanItem[] = [];
  let totalMinutes = 0;
  const caloriesPerExercise = targetCalories / shuffled.length;

  for (const exercise of shuffled) {
    const caloriesPerMin = getCaloriesPerMinute(exercise.metValue, weight);
    const minutes = Math.ceil(caloriesPerExercise / caloriesPerMin);
    
    if (minutes >= 5) {
      items.push({
        exercise,
        minutes,
        caloriesBurned: Math.round(minutes * caloriesPerMin)
      });
      totalMinutes += minutes;
    }
  }

  const totalCaloriesBurned = items.reduce((sum, item) => sum + item.caloriesBurned, 0);

  return {
    id: 'variety',
    name: '趣味多样方案',
    description: '多种运动组合，告别单调',
    difficulty: 'medium',
    totalMinutes,
    totalCalories: totalCaloriesBurned,
    items
  };
}

export function generateExercisePlans(
  targetCalories: number,
  weight: number = DEFAULT_WEIGHT
): ExercisePlan[] {
  return [
    generateQuickFatBurnPlan(targetCalories, weight),
    generateBalancedPlan(targetCalories, weight),
    generateEasyPlan(targetCalories, weight),
    generateVarietyPlan(targetCalories, weight)
  ];
}
