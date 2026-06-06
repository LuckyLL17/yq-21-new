import type { Snack } from '../data/snacks'

export interface NutritionInfo {
  calories: number
  protein: number
  fat: number
  carbs: number
}

export function calculateNutritionByWeight(snack: Snack, weightGrams: number): NutritionInfo {
  const ratio = weightGrams / snack.baseWeightGrams
  return {
    calories: snack.calories * ratio,
    protein: snack.protein * ratio,
    fat: snack.fat * ratio,
    carbs: snack.carbs * ratio,
  }
}

export function calculateNutritionByUnits(snack: Snack, units: number): NutritionInfo {
  const weightGrams = snack.baseWeightGrams * units
  return calculateNutritionByWeight(snack, weightGrams)
}

export function getWeightFromUnits(snack: Snack, units: number): number {
  return snack.baseWeightGrams * units
}

export function getUnitsFromWeight(snack: Snack, weightGrams: number): number {
  return weightGrams / snack.baseWeightGrams
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`
  }
  return `${Math.round(grams)} g`
}

export function formatNutritionValue(value: number, decimals: number = 1): string {
  if (value >= 100) {
    return Math.round(value).toString()
  }
  return value.toFixed(decimals)
}

export function getDefaultPresets(snack: Snack): { name: string; weightGrams: number }[] {
  const base = snack.baseWeightGrams
  const presets: { name: string; weightGrams: number }[] = [
    { name: `标准${snack.unitLabel}（${base}g）`, weightGrams: base },
    { name: `半${snack.unitLabel}（${Math.round(base * 0.5)}g）`, weightGrams: base * 0.5 },
    { name: `两${snack.unitLabel}（${Math.round(base * 2)}g）`, weightGrams: base * 2 },
  ]

  if (base * 0.25 >= 5) {
    presets.push({ name: `小份（${Math.round(base * 0.25)}g）`, weightGrams: base * 0.25 })
  }
  if (base * 1.5 !== base && base * 1.5 !== base * 2) {
    presets.push({ name: `一份半（${Math.round(base * 1.5)}g）`, weightGrams: base * 1.5 })
  }

  presets.push({ name: '100g', weightGrams: 100 })
  presets.push({ name: '50g', weightGrams: 50 })

  return presets
}

export function getSliderRange(snack: Snack): { min: number; max: number; step: number } {
  const base = snack.baseWeightGrams
  const min = Math.max(1, Math.round(base * 0.1))
  const max = Math.round(base * 5)
  const step = Math.max(1, Math.round(base * 0.05))
  return { min, max, step }
}

export function getQuickAdjustOptions(): { label: string; multiplier: number }[] {
  return [
    { label: '0.25x', multiplier: 0.25 },
    { label: '0.5x', multiplier: 0.5 },
    { label: '1x', multiplier: 1 },
    { label: '1.5x', multiplier: 1.5 },
    { label: '2x', multiplier: 2 },
    { label: '3x', multiplier: 3 },
  ]
}
