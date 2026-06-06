import type { ExerciseIntensity } from '../data/exercises'

export const DEFAULT_WEIGHT = 65

export const DEFAULT_INTENSITY: ExerciseIntensity = 'medium'

export const ERROR_MARGIN = 0.15

export const CALORIES_TO_KJ = 4.184

export const ERROR_MARGIN_DESCRIPTION = `计算结果基于MET（代谢当量）公式，实际消耗可能因个人体质、运动技巧、环境温度等因素存在约${Math.round(ERROR_MARGIN * 100)}%的误差范围。`

export function getWeightOptions(): number[] {
  return [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
}
