import type { BMICategory } from './bmi'

export function getCaloriesLevel(calories: number): {
  level: string
  color: string
  message: string
} {
  if (calories < 100) {
    return { level: '低', color: 'text-green-500', message: '热量较低，可以放心享用' }
  } else if (calories < 200) {
    return { level: '中低', color: 'text-emerald-500', message: '热量适中，适量食用' }
  } else if (calories < 350) {
    return { level: '中', color: 'text-yellow-500', message: '热量较高，注意控制份量' }
  } else if (calories < 500) {
    return { level: '高', color: 'text-orange-500', message: '热量偏高，建议偶尔食用' }
  } else {
    return { level: '很高', color: 'text-red-500', message: '热量很高，请谨慎食用' }
  }
}

export function getSnackCalorieLimit(bmiCategory: BMICategory): {
  limit: number
  description: string
} {
  switch (bmiCategory) {
    case 'underweight':
      return {
        limit: 500,
        description: '可以适当增加零食摄入，选择营养丰富的零食',
      }
    case 'normal':
      return {
        limit: 300,
        description: '建议每天零食热量控制在300千卡以内',
      }
    case 'overweight':
      return {
        limit: 200,
        description: '建议每天零食热量控制在200千卡以内',
      }
    case 'obese':
    case 'severely-obese':
      return {
        limit: 150,
        description: '建议每天零食热量控制在150千卡以内，尽量选择低热量零食',
      }
    default:
      return {
        limit: 300,
        description: '建议每天零食热量控制在300千卡以内',
      }
  }
}
