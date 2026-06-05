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

const HEALTH_TIPS = [
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

export function getHealthTipByIndex(index: number): string {
  return HEALTH_TIPS[index % HEALTH_TIPS.length];
}

export function getHealthTipsCount(): number {
  return HEALTH_TIPS.length;
}
