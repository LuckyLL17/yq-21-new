import {
  Mountain,
  Footprints,
  Bike,
  Waves,
  Dumbbell,
  PersonStanding,
  Flame,
  Heart,
} from 'lucide-react'

export type ExerciseIntensity = 'low' | 'medium' | 'high'

export interface Exercise {
  id: string
  name: string
  metValues: Record<ExerciseIntensity, number>
  icon: typeof Mountain
  unit: string
}

export const exercises: Exercise[] = [
  {
    id: 'stairs',
    name: '爬楼梯',
    metValues: { low: 6.0, medium: 9.0, high: 12.0 },
    icon: Mountain,
    unit: '分钟',
  },
  {
    id: 'walking',
    name: '快走',
    metValues: { low: 3.0, medium: 4.3, high: 6.0 },
    icon: Footprints,
    unit: '分钟',
  },
  {
    id: 'running',
    name: '跑步',
    metValues: { low: 7.0, medium: 9.8, high: 13.0 },
    icon: Footprints,
    unit: '分钟',
  },
  {
    id: 'cycling',
    name: '骑自行车',
    metValues: { low: 4.0, medium: 6.8, high: 10.0 },
    icon: Bike,
    unit: '分钟',
  },
  {
    id: 'swimming',
    name: '游泳',
    metValues: { low: 5.0, medium: 7.0, high: 10.0 },
    icon: Waves,
    unit: '分钟',
  },
  {
    id: 'weight-training',
    name: '力量训练',
    metValues: { low: 3.0, medium: 5.0, high: 7.5 },
    icon: Dumbbell,
    unit: '分钟',
  },
  {
    id: 'yoga',
    name: '瑜伽',
    metValues: { low: 2.0, medium: 2.5, high: 4.0 },
    icon: PersonStanding,
    unit: '分钟',
  },
  {
    id: 'jumping-rope',
    name: '跳绳',
    metValues: { low: 9.0, medium: 12.3, high: 15.0 },
    icon: Heart,
    unit: '分钟',
  },
  {
    id: 'dancing',
    name: '跳舞',
    metValues: { low: 3.5, medium: 4.8, high: 7.0 },
    icon: Flame,
    unit: '分钟',
  },
  {
    id: 'sitting',
    name: '坐着',
    metValues: { low: 1.0, medium: 1.3, high: 1.5 },
    icon: PersonStanding,
    unit: '分钟',
  },
]

export function getExercisesForDisplay(count: number = 6): Exercise[] {
  const displayIds = ['stairs', 'walking', 'running', 'cycling', 'swimming', 'jumping-rope']
  return displayIds
    .map((id) => exercises.find((e) => e.id === id)!)
    .filter(Boolean)
    .slice(0, count)
}

export function getAllExercises(): Exercise[] {
  return exercises
}

export function getIntensityLabel(intensity: ExerciseIntensity): string {
  const labels: Record<ExerciseIntensity, string> = {
    low: '低强度',
    medium: '中等强度',
    high: '高强度',
  }
  return labels[intensity]
}

export function getExerciseMetValue(exercise: Exercise, intensity: ExerciseIntensity): number {
  return exercise.metValues[intensity]
}
