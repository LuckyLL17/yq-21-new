import { CALORIES_TO_KJ, ERROR_MARGIN } from './constants';

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
