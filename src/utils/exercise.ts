import type { Exercise, ExerciseIntensity } from '../data/exercises'
import type { Snack } from '../data/snacks'
import { DEFAULT_WEIGHT, DEFAULT_INTENSITY } from './constants'
import { getCaloriesBurnedRange } from './energy'

export function getMetValue(
  exercise: Exercise,
  intensity: ExerciseIntensity = DEFAULT_INTENSITY,
): number {
  return exercise.metValues[intensity]
}

export function getCaloriesPerMinute(
  exercise: Exercise,
  intensity: ExerciseIntensity,
  weight: number,
): number {
  const metValue = getMetValue(exercise, intensity)
  return (metValue * 3.5 * weight) / 200
}

export function calculateExerciseTime(
  calories: number,
  exercise: Exercise,
  intensity: ExerciseIntensity = DEFAULT_INTENSITY,
  weight: number = DEFAULT_WEIGHT,
): number {
  const caloriesPerMinute = getCaloriesPerMinute(exercise, intensity, weight)
  return Math.ceil(calories / caloriesPerMinute)
}

export function calculateCaloriesBurned(
  exercise: Exercise,
  minutes: number,
  intensity: ExerciseIntensity = DEFAULT_INTENSITY,
  weight: number = DEFAULT_WEIGHT,
): number {
  const caloriesPerMinute = getCaloriesPerMinute(exercise, intensity, weight)
  return Math.round(minutes * caloriesPerMinute)
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) {
    return `${hours}小时`
  }
  return `${hours}小时${mins}分钟`
}

export function getExerciseComparison(
  snack: Snack,
  exercise: Exercise,
  weight: number = DEFAULT_WEIGHT,
  intensity: ExerciseIntensity = DEFAULT_INTENSITY,
): {
  minutes: number
  formatted: string
  description: string
  caloriesBurned: number
  caloriesRange: { min: number; max: number }
} {
  const minutes = calculateExerciseTime(snack.calories, exercise, intensity, weight)
  const formatted = formatTime(minutes)
  const description = `${snack.servingSize}${snack.name} = ${exercise.name}${formatted}`
  const caloriesBurned = calculateCaloriesBurned(exercise, minutes, intensity, weight)
  const caloriesRange = getCaloriesBurnedRange(caloriesBurned)

  return { minutes, formatted, description, caloriesBurned, caloriesRange }
}

export function sumExerciseCalories(items: Array<{ caloriesBurned: number }>): number {
  return items.reduce((sum, item) => sum + item.caloriesBurned, 0)
}
