import type { Snack } from '../data/snacks'
import type { Exercise, ExerciseIntensity } from '../data/exercises'
import { getIntensityLabel } from '../data/exercises'
import { getExerciseComparison } from '../utils/exercise'
import { formatEnergy, type EnergyUnit } from '../utils/energy'
import { Info } from 'lucide-react'

interface ExerciseCardProps {
  snack: Snack
  exercise: Exercise
  weight: number
  intensity?: ExerciseIntensity
  energyUnit?: EnergyUnit
  isMain?: boolean
  showIntensity?: boolean
  showRange?: boolean
  onIntensityChange?: (intensity: ExerciseIntensity) => void
}

export function ExerciseCard({
  snack,
  exercise,
  weight,
  intensity = 'medium',
  energyUnit = 'kcal',
  isMain = false,
  showIntensity = false,
  showRange = false,
  onIntensityChange,
}: ExerciseCardProps) {
  const result = getExerciseComparison(snack, exercise, weight, intensity)
  const Icon = exercise.icon

  const intensities: ExerciseIntensity[] = ['low', 'medium', 'high']

  const handleIntensityClick = (newIntensity: ExerciseIntensity) => {
    onIntensityChange?.(newIntensity)
  }

  if (isMain) {
    return (
      <div className="w-full p-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl text-white">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Icon className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-white/80 text-sm mb-1">运动类型</p>
            <p className="font-semibold text-lg">{exercise.name}</p>
          </div>
        </div>
        <p className="text-center text-white/80 text-sm mb-2">消耗这些热量需要</p>
        <p className="text-center font-poppins font-bold text-4xl mb-2">{result.formatted}</p>
        <p className="text-center text-white/90 font-medium mb-4">{getIntensityLabel(intensity)}</p>

        {showIntensity && onIntensityChange && (
          <div className="flex justify-center gap-2 mb-4">
            {intensities.map((level) => (
              <button
                key={level}
                onClick={() => handleIntensityClick(level)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  intensity === level
                    ? 'bg-white text-primary-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {getIntensityLabel(level)}
              </button>
            ))}
          </div>
        )}

        {showRange && (
          <div className="text-center text-white/70 text-sm flex items-center justify-center gap-1">
            <Info className="w-4 h-4" />
            <span>
              消耗约 {formatEnergy(result.caloriesBurned, energyUnit)}
              （误差 ±15%）
            </span>
          </div>
        )}
      </div>
    )
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
          {showRange && (
            <p className="text-xs text-gray-400 mt-1">
              {formatEnergy(result.caloriesBurned, energyUnit)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
