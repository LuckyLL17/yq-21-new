export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese' | 'severely-obese'

export interface BMIResult {
  bmi: number
  category: BMICategory
  categoryName: string
  color: string
  bgColor: string
  description: string
  suggestions: string[]
}

export function calculateBMI(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
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
      suggestions: [],
    }
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
        '保持规律作息，避免过度劳累',
      ],
    }
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
        '定期体检，关注身体健康指标',
      ],
    }
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
        '减少久坐时间，每小时起身活动',
      ],
    }
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
        '保持积极心态，减重是一个循序渐进的过程',
      ],
    }
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
        '关注血糖、血压、血脂等健康指标',
      ],
    }
  }
}

export function getIdealWeightRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100
  return {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(23.9 * heightM * heightM * 10) / 10,
  }
}
