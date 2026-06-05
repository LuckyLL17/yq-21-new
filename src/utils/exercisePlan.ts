import type { Exercise, ExerciseIntensity } from '../data/exercises';
import { getAllExercises } from '../data/exercises';
import { DEFAULT_WEIGHT } from './constants';
import { getCaloriesPerMinute } from './exercise';

export interface ExercisePlanItem {
  exercise: Exercise;
  minutes: number;
  caloriesBurned: number;
  intensity: ExerciseIntensity;
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

function generateQuickFatBurnPlan(targetCalories: number, weight: number): ExercisePlan {
  const exercises = getAllExercises().filter(e => e.metValues.high >= 7.0);
  const items: ExercisePlanItem[] = [];
  let remainingCalories = targetCalories;
  let totalMinutes = 0;

  for (const exercise of exercises.slice(0, 3)) {
    if (remainingCalories <= 0) break;
    const caloriesPerMin = getCaloriesPerMinute(exercise, 'high', weight);
    const minutes = Math.ceil((remainingCalories * 0.4) / caloriesPerMin);
    const actualCalories = minutes * caloriesPerMin;
    
    if (minutes >= 5) {
      items.push({
        exercise,
        minutes,
        caloriesBurned: Math.round(actualCalories),
        intensity: 'high'
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
  const cardioExercises = allExercises.filter(e => e.metValues.medium >= 6.0);
  const strengthExercises = allExercises.filter(e => e.id === 'weight-training' || e.id === 'yoga');
  
  const items: ExercisePlanItem[] = [];
  let totalMinutes = 0;

  const warmUp = allExercises.find(e => e.id === 'walking');
  if (warmUp) {
    const caloriesPerMin = getCaloriesPerMinute(warmUp, 'low', weight);
    items.push({ exercise: warmUp, minutes: 10, caloriesBurned: Math.round(10 * caloriesPerMin), intensity: 'low' });
    totalMinutes += 10;
  }

  const cardio = cardioExercises[Math.floor(Math.random() * cardioExercises.length)];
  const cardioCalories = targetCalories * 0.5;
  const cardioCaloriesPerMin = getCaloriesPerMinute(cardio, 'medium', weight);
  const cardioMinutes = Math.ceil(cardioCalories / cardioCaloriesPerMin);
  items.push({
    exercise: cardio,
    minutes: cardioMinutes,
    caloriesBurned: Math.round(cardioMinutes * cardioCaloriesPerMin),
    intensity: 'medium'
  });
  totalMinutes += cardioMinutes;

  const strength = strengthExercises[Math.floor(Math.random() * strengthExercises.length)];
  const strengthCalories = targetCalories * 0.3;
  const strengthCaloriesPerMin = getCaloriesPerMinute(strength, 'medium', weight);
  const strengthMinutes = Math.ceil(strengthCalories / strengthCaloriesPerMin);
  items.push({
    exercise: strength,
    minutes: strengthMinutes,
    caloriesBurned: Math.round(strengthMinutes * strengthCaloriesPerMin),
    intensity: 'medium'
  });
  totalMinutes += strengthMinutes;

  const coolDown = allExercises.find(e => e.id === 'yoga');
  if (coolDown && coolDown.id !== strength.id) {
    const coolDownCaloriesPerMin = getCaloriesPerMinute(coolDown, 'low', weight);
    items.push({ exercise: coolDown, minutes: 10, caloriesBurned: Math.round(10 * coolDownCaloriesPerMin), intensity: 'low' });
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
  const easyExercises = allExercises.filter(e => e.metValues.low < 6.0 && e.id !== 'sitting');
  
  const items: ExercisePlanItem[] = [];
  let totalMinutes = 0;
  let remainingCalories = targetCalories;

  for (let i = 0; i < Math.min(4, easyExercises.length); i++) {
    const exercise = easyExercises[i];
    const caloriesPerMin = getCaloriesPerMinute(exercise, 'low', weight);
    const minutes = Math.ceil((remainingCalories / (4 - i)) / caloriesPerMin);
    const actualCalories = minutes * caloriesPerMin;
    
    if (minutes >= 10) {
      items.push({
        exercise,
        minutes,
        caloriesBurned: Math.round(actualCalories),
        intensity: 'low'
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
    const caloriesPerMin = getCaloriesPerMinute(exercise, 'medium', weight);
    const minutes = Math.ceil(caloriesPerExercise / caloriesPerMin);
    
    if (minutes >= 5) {
      items.push({
        exercise,
        minutes,
        caloriesBurned: Math.round(minutes * caloriesPerMin),
        intensity: 'medium'
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
