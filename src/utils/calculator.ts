import type { Snack } from '../data/snacks';
import type { Exercise, ExerciseIntensity } from '../data/exercises';
import { getAllExercises } from '../data/exercises';

const DEFAULT_WEIGHT = 65;
const DEFAULT_INTENSITY: ExerciseIntensity = 'medium';
const ERROR_MARGIN = 0.15;
const CALORIES_TO_KJ = 4.184;

export type EnergyUnit = 'kcal' | 'kJ';

export function kcalToKj(kcal: number): number {
  return kcal * CALORIES_TO_KJ;
}

export function kJToKcal(kj: number): number {
  return kj / CALORIES_TO_KJ;
}

export function formatEnergy(value: number, unit: EnergyUnit = 'kcal'): string {
  if (unit === 'kJ') {
    return `${Math.round(kcalToKj(value))} 千焦`;
  }
  return `${Math.round(value)} 千卡`;
}

export function getCaloriesBurnedRange(calories: number): { min: number; max: number } {
  return {
    min: Math.round(calories * (1 - ERROR_MARGIN)),
    max: Math.round(calories * (1 + ERROR_MARGIN))
  };
}

export function getEnergyRangeDescription(calories: number, unit: EnergyUnit = 'kcal'): string {
  const range = getCaloriesBurnedRange(calories);
  if (unit === 'kJ') {
    return `${Math.round(kcalToKj(range.min))} - ${Math.round(kcalToKj(range.max))} 千焦`;
  }
  return `${range.min} - ${range.max} 千卡`;
}

export function getMetValue(exercise: Exercise, intensity: ExerciseIntensity = DEFAULT_INTENSITY): number {
  return exercise.metValues[intensity];
}

export function calculateExerciseTime(
  calories: number,
  exercise: Exercise,
  intensity: ExerciseIntensity = DEFAULT_INTENSITY,
  weight: number = DEFAULT_WEIGHT
): number {
  const metValue = getMetValue(exercise, intensity);
  const caloriesPerMinute = (metValue * 3.5 * weight) / 200;
  return Math.ceil(calories / caloriesPerMinute);
}

export function calculateCaloriesBurned(
  exercise: Exercise,
  minutes: number,
  intensity: ExerciseIntensity = DEFAULT_INTENSITY,
  weight: number = DEFAULT_WEIGHT
): number {
  const metValue = getMetValue(exercise, intensity);
  const caloriesPerMinute = (metValue * 3.5 * weight) / 200;
  return Math.round(minutes * caloriesPerMinute);
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
  weight: number = DEFAULT_WEIGHT,
  intensity: ExerciseIntensity = DEFAULT_INTENSITY
): {
  minutes: number;
  formatted: string;
  description: string;
  caloriesBurned: number;
  caloriesRange: { min: number; max: number };
} {
  const minutes = calculateExerciseTime(snack.calories, exercise, intensity, weight);
  const formatted = formatTime(minutes);
  const description = `${snack.servingSize}${snack.name} = ${exercise.name}${formatted}`;
  const caloriesBurned = calculateCaloriesBurned(exercise, minutes, intensity, weight);
  const caloriesRange = getCaloriesBurnedRange(caloriesBurned);
  
  return { minutes, formatted, description, caloriesBurned, caloriesRange };
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

function getCaloriesPerMinute(
  exercise: Exercise,
  intensity: ExerciseIntensity,
  weight: number
): number {
  const metValue = getMetValue(exercise, intensity);
  return (metValue * 3.5 * weight) / 200;
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

export function sumExerciseCalories(items: Array<{ caloriesBurned: number }>): number {
  return items.reduce((sum, item) => sum + item.caloriesBurned, 0);
}

export const ERROR_MARGIN_DESCRIPTION = `计算结果基于MET（代谢当量）公式，实际消耗可能因个人体质、运动技巧、环境温度等因素存在约${Math.round(ERROR_MARGIN * 100)}%的误差范围。`;

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese' | 'severely-obese';

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  categoryName: string;
  color: string;
  bgColor: string;
  description: string;
  suggestions: string[];
}

export function calculateBMI(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): BMIResult {
  if (bmi <= 0) {
    return {
      bmi: 0,
      category: 'normal',
      categoryName: '未知',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      description: '请输入有效的身高和体重',
      suggestions: []
    };
  }
  
  if (bmi < 18.5) {
    return {
      bmi,
      category: 'underweight',
      categoryName: '偏瘦',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      description: '体重低于正常范围，建议适当增加营养摄入',
      suggestions: [
        '适当增加热量摄入，选择营养丰富的食物',
        '增加优质蛋白质摄入，如鸡蛋、牛奶、瘦肉',
        '配合力量训练，增加肌肉量',
        '保持规律作息，避免过度劳累'
      ]
    };
  } else if (bmi < 24) {
    return {
      bmi,
      category: 'normal',
      categoryName: '正常',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      description: '体重在正常范围内，继续保持健康的生活方式',
      suggestions: [
        '保持均衡饮食，适量摄入各类营养素',
        '坚持规律运动，每周至少150分钟中等强度运动',
        '保持充足睡眠，每天7-8小时',
        '定期体检，关注身体健康指标'
      ]
    };
  } else if (bmi < 28) {
    return {
      bmi,
      category: 'overweight',
      categoryName: '偏胖',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      description: '体重略高于正常范围，建议适当控制饮食并增加运动',
      suggestions: [
        '控制总热量摄入，减少高热量零食',
        '增加蔬菜水果摄入，保持饮食均衡',
        '增加有氧运动，如快走、慢跑、游泳',
        '减少久坐时间，每小时起身活动'
      ]
    };
  } else if (bmi < 32) {
    return {
      bmi,
      category: 'obese',
      categoryName: '肥胖',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
      description: '体重高于正常范围较多，建议制定科学的减重计划',
      suggestions: [
        '制定合理的减重目标，每周减重0.5-1kg为宜',
        '控制碳水化合物和脂肪摄入',
        '坚持每天30-60分钟有氧运动',
        '可咨询专业营养师或医生的建议',
        '保持积极心态，减重是一个循序渐进的过程'
      ]
    };
  } else {
    return {
      bmi,
      category: 'severely-obese',
      categoryName: '重度肥胖',
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      description: '体重严重超标，建议尽快咨询专业医生制定减重方案',
      suggestions: [
        '尽快就医，进行全面健康检查',
        '在医生指导下制定科学的减重计划',
        '严格控制饮食，避免高热量食物',
        '选择适合自己的低强度运动开始',
        '关注血糖、血压、血脂等健康指标'
      ]
    };
  }
}

export function getIdealWeightRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100;
  return {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(23.9 * heightM * heightM * 10) / 10
  };
}

export function getDailyCalorieNeeds(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
): number {
  let bmr: number;
  
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
  }
  
  const activityMultipliers: Record<string, number> = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
}

export function getSnackCalorieLimit(bmiCategory: BMICategory): { limit: number; description: string } {
  switch (bmiCategory) {
    case 'underweight':
      return {
        limit: 500,
        description: '可以适当增加零食摄入，选择营养丰富的零食'
      };
    case 'normal':
      return {
        limit: 300,
        description: '建议每天零食热量控制在300千卡以内'
      };
    case 'overweight':
      return {
        limit: 200,
        description: '建议每天零食热量控制在200千卡以内'
      };
    case 'obese':
    case 'severely-obese':
      return {
        limit: 150,
        description: '建议每天零食热量控制在150千卡以内，尽量选择低热量零食'
      };
    default:
      return {
        limit: 300,
        description: '建议每天零食热量控制在300千卡以内'
      };
  }
}

export function getHealthTipByIndex(index: number): string {
  const tips = [
    '每天喝足够的水，建议每天饮用1500-2000ml水',
    '三餐规律，早餐一定要吃，晚餐不宜过饱',
    '每坐1小时，起身活动5分钟，保护颈椎和腰椎',
    '每天摄入蔬菜水果不少于500g，补充维生素和膳食纤维',
    '保证充足睡眠，成年人每天需要7-8小时睡眠',
    '饭后散步15分钟，有助于消化和控制血糖',
    '减少精制糖摄入，选择天然甜味的水果代替甜点',
    '每周至少进行3次有氧运动，每次30分钟以上',
    '细嚼慢咽，每餐用餐时间不少于20分钟',
    '保持积极乐观的心态，笑口常开有益健康',
    '多吃全谷物，减少精米白面的摄入',
    '控制盐的摄入，每天不超过6g',
    '适量补充优质蛋白质，如鱼、蛋、奶、豆制品',
    '戒烟限酒，保护心脑血管健康',
    '定期体检，及早发现和预防健康问题'
  ];
  return tips[index % tips.length];
}

export function getHealthTipsCount(): number {
  return 15;
}
