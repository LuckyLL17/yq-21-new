export type SnackTag =
  | 'vegetarian'
  | 'gluten-free'
  | 'low-sugar'
  | 'low-fat'
  | 'high-protein'
  | 'fried'
  | 'non-fried'
  | 'low-calorie'
  | 'dairy-free'
  | 'nut-free'

export interface TagInfo {
  id: SnackTag
  name: string
  color: string
  bgColor: string
}

export const TAG_INFO: TagInfo[] = [
  { id: 'vegetarian', name: '素食', color: 'text-green-600', bgColor: 'bg-green-100' },
  { id: 'gluten-free', name: '无麸质', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  { id: 'low-sugar', name: '低糖', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { id: 'low-fat', name: '低脂', color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  { id: 'high-protein', name: '高蛋白', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { id: 'fried', name: '油炸', color: 'text-red-600', bgColor: 'bg-red-100' },
  { id: 'non-fried', name: '非油炸', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  { id: 'low-calorie', name: '低热量', color: 'text-teal-600', bgColor: 'bg-teal-100' },
  { id: 'dairy-free', name: '无乳制品', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { id: 'nut-free', name: '坚果过敏友好', color: 'text-pink-600', bgColor: 'bg-pink-100' },
]

export type ServingUnit = 'g' | 'piece' | 'bag' | 'cup' | 'can' | 'scoop' | 'bottle' | 'pack'

export interface Snack {
  id: string
  name: string
  category: string
  servingSize: string
  baseWeightGrams: number
  servingUnit: ServingUnit
  unitLabel: string
  calories: number
  protein: number
  fat: number
  carbs: number
  description?: string
  tags: SnackTag[]
}

export const snacks: Snack[] = [
  {
    id: 'chips-original',
    name: '薯片（原味）',
    category: '膨化食品',
    servingSize: '一袋（约100g）',
    baseWeightGrams: 100,
    servingUnit: 'bag',
    unitLabel: '袋',
    calories: 536,
    protein: 7,
    fat: 35,
    carbs: 50,
    description: '经典香脆薯片',
    tags: ['fried', 'vegetarian'],
  },
  {
    id: 'chips-bbq',
    name: '薯片（烧烤味）',
    category: '膨化食品',
    servingSize: '一袋（约100g）',
    baseWeightGrams: 100,
    servingUnit: 'bag',
    unitLabel: '袋',
    calories: 520,
    protein: 6.5,
    fat: 33,
    carbs: 52,
    description: '烧烤风味薯片',
    tags: ['fried', 'vegetarian'],
  },
  {
    id: 'chocolate-milk',
    name: '牛奶巧克力',
    category: '巧克力',
    servingSize: '一块（约100g）',
    baseWeightGrams: 100,
    servingUnit: 'piece',
    unitLabel: '块',
    calories: 539,
    protein: 7.6,
    fat: 30.7,
    carbs: 59.4,
    description: '丝滑牛奶巧克力',
    tags: ['vegetarian', 'nut-free'],
  },
  {
    id: 'chocolate-dark',
    name: '黑巧克力（70%）',
    category: '巧克力',
    servingSize: '一块（约100g）',
    baseWeightGrams: 100,
    servingUnit: 'piece',
    unitLabel: '块',
    calories: 604,
    protein: 7.8,
    fat: 43,
    carbs: 36,
    description: '浓郁黑巧克力',
    tags: ['vegetarian', 'low-sugar', 'dairy-free', 'nut-free'],
  },
  {
    id: 'cookie-chocolate',
    name: '巧克力曲奇',
    category: '饼干',
    servingSize: '一块（约30g）',
    baseWeightGrams: 30,
    servingUnit: 'piece',
    unitLabel: '块',
    calories: 150,
    protein: 2,
    fat: 7,
    carbs: 20,
    description: '香浓巧克力曲奇',
    tags: ['vegetarian', 'nut-free'],
  },
  {
    id: 'cookie-butter',
    name: '黄油曲奇',
    category: '饼干',
    servingSize: '一块（约30g）',
    baseWeightGrams: 30,
    servingUnit: 'piece',
    unitLabel: '块',
    calories: 140,
    protein: 1.8,
    fat: 6.5,
    carbs: 19,
    description: '酥脆黄油曲奇',
    tags: ['vegetarian', 'nut-free'],
  },
  {
    id: 'ice-cream-vanilla',
    name: '香草冰淇淋',
    category: '冰淇淋',
    servingSize: '一球（约100g）',
    baseWeightGrams: 100,
    servingUnit: 'scoop',
    unitLabel: '球',
    calories: 207,
    protein: 3.5,
    fat: 11,
    carbs: 24,
    description: '经典香草冰淇淋',
    tags: ['vegetarian', 'nut-free'],
  },
  {
    id: 'ice-cream-chocolate',
    name: '巧克力冰淇淋',
    category: '冰淇淋',
    servingSize: '一球（约100g）',
    baseWeightGrams: 100,
    servingUnit: 'scoop',
    unitLabel: '球',
    calories: 216,
    protein: 3.8,
    fat: 11.5,
    carbs: 25,
    description: '浓郁巧克力冰淇淋',
    tags: ['vegetarian', 'nut-free'],
  },
  {
    id: 'candy-gummy',
    name: '软糖',
    category: '糖果',
    servingSize: '一包（约100g）',
    baseWeightGrams: 100,
    servingUnit: 'pack',
    unitLabel: '包',
    calories: 326,
    protein: 6.5,
    fat: 0.3,
    carbs: 76,
    description: 'Q弹水果软糖',
    tags: ['low-fat', 'vegetarian', 'dairy-free', 'nut-free'],
  },
  {
    id: 'candy-lollipop',
    name: '棒棒糖',
    category: '糖果',
    servingSize: '一根（约20g）',
    baseWeightGrams: 20,
    servingUnit: 'piece',
    unitLabel: '根',
    calories: 78,
    protein: 0,
    fat: 0,
    carbs: 20,
    description: '甜蜜水果棒棒糖',
    tags: ['low-fat', 'low-calorie', 'vegetarian', 'dairy-free', 'nut-free'],
  },
  {
    id: 'nuts-mixed',
    name: '混合坚果',
    category: '坚果',
    servingSize: '一小袋（约30g）',
    baseWeightGrams: 30,
    servingUnit: 'bag',
    unitLabel: '小袋',
    calories: 180,
    protein: 5.5,
    fat: 15,
    carbs: 8,
    description: '健康混合坚果',
    tags: ['high-protein', 'gluten-free', 'dairy-free', 'vegetarian'],
  },
  {
    id: 'nuts-almond',
    name: '杏仁',
    category: '坚果',
    servingSize: '一小把（约30g）',
    baseWeightGrams: 30,
    servingUnit: 'piece',
    unitLabel: '把',
    calories: 174,
    protein: 6.3,
    fat: 15.5,
    carbs: 6,
    description: '营养加州杏仁',
    tags: ['high-protein', 'low-sugar', 'gluten-free', 'dairy-free', 'vegetarian'],
  },
  {
    id: 'popcorn-butter',
    name: '黄油爆米花',
    category: '膨化食品',
    servingSize: '一桶（约100g）',
    baseWeightGrams: 100,
    servingUnit: 'cup',
    unitLabel: '桶',
    calories: 480,
    protein: 8,
    fat: 28,
    carbs: 55,
    description: '电影院黄油爆米花',
    tags: ['non-fried', 'vegetarian', 'nut-free'],
  },
  {
    id: 'popcorn-plain',
    name: '原味爆米花',
    category: '膨化食品',
    servingSize: '一桶（约100g）',
    baseWeightGrams: 100,
    servingUnit: 'cup',
    unitLabel: '桶',
    calories: 387,
    protein: 12,
    fat: 4.5,
    carbs: 78,
    description: '无油原味爆米花',
    tags: [
      'non-fried',
      'low-fat',
      'high-protein',
      'gluten-free',
      'dairy-free',
      'vegetarian',
      'nut-free',
    ],
  },
  {
    id: 'pocky',
    name: '百奇巧克力棒',
    category: '饼干',
    servingSize: '一盒（约40g）',
    baseWeightGrams: 40,
    servingUnit: 'pack',
    unitLabel: '盒',
    calories: 200,
    protein: 2.5,
    fat: 9,
    carbs: 28,
    description: '巧克力涂层饼干棒',
    tags: ['vegetarian', 'nut-free'],
  },
  {
    id: 'potato-stick',
    name: '薯条（中份）',
    category: '油炸食品',
    servingSize: '一份（约110g）',
    baseWeightGrams: 110,
    servingUnit: 'piece',
    unitLabel: '份',
    calories: 365,
    protein: 4,
    fat: 17,
    carbs: 48,
    description: '金黄酥脆薯条',
    tags: ['fried', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free'],
  },
  {
    id: 'donut-glazed',
    name: '糖霜甜甜圈',
    category: '糕点',
    servingSize: '一个（约60g）',
    baseWeightGrams: 60,
    servingUnit: 'piece',
    unitLabel: '个',
    calories: 269,
    protein: 4,
    fat: 14,
    carbs: 31,
    description: '经典糖霜甜甜圈',
    tags: ['vegetarian', 'nut-free'],
  },
  {
    id: 'muffin-blueberry',
    name: '蓝莓马芬',
    category: '糕点',
    servingSize: '一个（约100g）',
    baseWeightGrams: 100,
    servingUnit: 'piece',
    unitLabel: '个',
    calories: 377,
    protein: 4.8,
    fat: 16,
    carbs: 55,
    description: '蓝莓果肉马芬蛋糕',
    tags: ['vegetarian', 'nut-free'],
  },
  {
    id: 'fruit-dried-mango',
    name: '芒果干',
    category: '果干',
    servingSize: '一袋（约100g）',
    baseWeightGrams: 100,
    servingUnit: 'bag',
    unitLabel: '袋',
    calories: 319,
    protein: 1.4,
    fat: 0.7,
    carbs: 80,
    description: '酸甜芒果干',
    tags: ['low-fat', 'gluten-free', 'dairy-free', 'vegetarian', 'nut-free'],
  },
  {
    id: 'yogurt-greek',
    name: '希腊酸奶',
    category: '乳制品',
    servingSize: '一杯（约170g）',
    baseWeightGrams: 170,
    servingUnit: 'cup',
    unitLabel: '杯',
    calories: 100,
    protein: 17,
    fat: 0.7,
    carbs: 6,
    description: '高蛋白希腊酸奶',
    tags: [
      'high-protein',
      'low-fat',
      'low-sugar',
      'low-calorie',
      'gluten-free',
      'vegetarian',
      'nut-free',
    ],
  },
  {
    id: 'milk-tea',
    name: '珍珠奶茶',
    category: '饮料',
    servingSize: '一杯（约500ml）',
    baseWeightGrams: 500,
    servingUnit: 'cup',
    unitLabel: '杯',
    calories: 450,
    protein: 2,
    fat: 8,
    carbs: 95,
    description: '经典珍珠奶茶',
    tags: ['vegetarian', 'nut-free'],
  },
  {
    id: 'cola',
    name: '可乐',
    category: '饮料',
    servingSize: '一罐（约330ml）',
    baseWeightGrams: 330,
    servingUnit: 'can',
    unitLabel: '罐',
    calories: 140,
    protein: 0,
    fat: 0,
    carbs: 35,
    description: '碳酸饮料',
    tags: ['low-fat', 'gluten-free', 'dairy-free', 'vegetarian', 'nut-free'],
  },
  {
    id: 'instant-noodles',
    name: '方便面',
    category: '方便食品',
    servingSize: '一包（约100g）',
    baseWeightGrams: 100,
    servingUnit: 'pack',
    unitLabel: '包',
    calories: 470,
    protein: 9,
    fat: 20,
    carbs: 65,
    description: '红烧牛肉方便面',
    tags: ['fried'],
  },
  {
    id: 'rice-cracker',
    name: '仙贝',
    category: '膨化食品',
    servingSize: '一袋（约50g）',
    baseWeightGrams: 50,
    servingUnit: 'bag',
    unitLabel: '袋',
    calories: 200,
    protein: 3,
    fat: 6,
    carbs: 34,
    description: '香脆米饼',
    tags: ['non-fried', 'vegetarian', 'nut-free'],
  },
]

export function findSnackByName(name: string): Snack[] {
  const searchLower = name.toLowerCase().trim()
  return snacks.filter(
    (snack) =>
      snack.name.toLowerCase().includes(searchLower) ||
      snack.id.toLowerCase().includes(searchLower),
  )
}

export function getSnackById(id: string): Snack | undefined {
  return snacks.find((snack) => snack.id === id)
}

export interface AlternativeRecommendation {
  snack: Snack
  similarityScore: number
  tasteSimilarity: '高' | '中' | '低'
  reasons: string[]
  isSameCategory: boolean
  caloriesSaved: number
  caloriesSavedPercent: number
}

function calculateTasteSimilarity(snack1: Snack, snack2: Snack): number {
  const tags1 = new Set(snack1.tags)
  const tags2 = new Set(snack2.tags)
  const intersection = new Set([...tags1].filter((x) => tags2.has(x)))
  const union = new Set([...tags1, ...tags2])
  return union.size === 0 ? 0 : intersection.size / union.size
}

function calculateNutritionSimilarity(snack1: Snack, snack2: Snack): number {
  const maxCalories = Math.max(snack1.calories, snack2.calories)
  const caloriesDiff = Math.abs(snack1.calories - snack2.calories) / maxCalories

  const maxProtein = Math.max(snack1.protein, snack2.protein) || 1
  const proteinDiff = Math.abs(snack1.protein - snack2.protein) / maxProtein

  const maxFat = Math.max(snack1.fat, snack2.fat) || 1
  const fatDiff = Math.abs(snack1.fat - snack2.fat) / maxFat

  const maxCarbs = Math.max(snack1.carbs, snack2.carbs) || 1
  const carbsDiff = Math.abs(snack1.carbs - snack2.carbs) / maxCarbs

  const avgDiff = caloriesDiff * 0.3 + proteinDiff * 0.25 + fatDiff * 0.25 + carbsDiff * 0.2
  return Math.max(0, 1 - avgDiff)
}

function getTasteSimilarityLabel(score: number): '高' | '中' | '低' {
  if (score >= 0.6) return '高'
  if (score >= 0.3) return '中'
  return '低'
}

function generateReasons(original: Snack, alternative: Snack, isSameCategory: boolean): string[] {
  const reasons: string[] = []

  if (isSameCategory) {
    reasons.push(`同属${original.category}，口味更接近`)
  }

  const commonTags = original.tags.filter((tag) => alternative.tags.includes(tag))
  if (commonTags.length > 0) {
    const tagNames = commonTags.slice(0, 3).map((tag) => {
      const info = TAG_INFO.find((t) => t.id === tag)
      return info ? info.name : tag
    })
    reasons.push(`共同特点：${tagNames.join('、')}`)
  }

  const caloriesSaved = original.calories - alternative.calories
  const savedPercent = Math.round((caloriesSaved / original.calories) * 100)
  reasons.push(`热量减少 ${savedPercent}%，少摄入 ${caloriesSaved} 千卡`)

  if (alternative.tags.includes('low-calorie')) {
    reasons.push('低热量更健康')
  }
  if (alternative.tags.includes('high-protein')) {
    reasons.push('高蛋白更饱腹')
  }
  if (alternative.tags.includes('low-fat')) {
    reasons.push('低脂更轻盈')
  }
  if (alternative.tags.includes('low-sugar')) {
    reasons.push('低糖无负担')
  }

  return reasons.slice(0, 3)
}

function calculateOverallScore(
  original: Snack,
  alternative: Snack,
  isSameCategory: boolean,
): number {
  const tasteScore = calculateTasteSimilarity(original, alternative)
  const nutritionScore = calculateNutritionSimilarity(original, alternative)

  const caloriesSaved = original.calories - alternative.calories
  const caloriesSavedPercent = caloriesSaved / original.calories

  const categoryBonus = isSameCategory ? 0.2 : 0

  const healthScore = Math.min(caloriesSavedPercent * 1.5, 0.5)

  const overallScore = tasteScore * 0.35 + nutritionScore * 0.25 + healthScore * 0.2 + categoryBonus

  return overallScore
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const arr = [...array]
  const random = seededRandom(seed)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function pickRandom<T>(array: T[], count: number, seed: number): T[] {
  if (array.length <= count) return array
  const shuffled = shuffleArray(array, seed)
  return shuffled.slice(0, count)
}

export function getAlternatives(
  snack: Snack,
  count: number = 3,
  options?: { shuffle?: boolean; seed?: number },
): AlternativeRecommendation[] {
  const candidates = snacks.filter((s) => s.id !== snack.id && s.calories < snack.calories)
  const seed = options?.seed ?? Date.now()

  const sameCategoryCandidates = candidates.filter((s) => s.category === snack.category)
  const otherCategoryCandidates = candidates.filter((s) => s.category !== snack.category)

  const scoredSame = sameCategoryCandidates.map((alt) => {
    const score = calculateOverallScore(snack, alt, true)
    const tasteSim = calculateTasteSimilarity(snack, alt)
    const caloriesSaved = snack.calories - alt.calories
    return {
      snack: alt,
      similarityScore: score,
      tasteSimilarity: getTasteSimilarityLabel(tasteSim),
      reasons: generateReasons(snack, alt, true),
      isSameCategory: true,
      caloriesSaved,
      caloriesSavedPercent: Math.round((caloriesSaved / snack.calories) * 100),
    }
  })

  const scoredOther = otherCategoryCandidates.map((alt) => {
    const score = calculateOverallScore(snack, alt, false)
    const tasteSim = calculateTasteSimilarity(snack, alt)
    const caloriesSaved = snack.calories - alt.calories
    return {
      snack: alt,
      similarityScore: score,
      tasteSimilarity: getTasteSimilarityLabel(tasteSim),
      reasons: generateReasons(snack, alt, false),
      isSameCategory: false,
      caloriesSaved,
      caloriesSavedPercent: Math.round((caloriesSaved / snack.calories) * 100),
    }
  })

  scoredSame.sort((a, b) => b.similarityScore - a.similarityScore)
  scoredOther.sort((a, b) => b.similarityScore - a.similarityScore)

  const sameCategoryTarget = Math.min(Math.ceil(count * 0.6), scoredSame.length)
  const otherCategoryTarget = count - sameCategoryTarget

  let sameCategoryPicks: AlternativeRecommendation[]
  let otherCategoryPicks: AlternativeRecommendation[]

  if (options?.shuffle) {
    const topSameCount = Math.max(
      Math.min(scoredSame.length, Math.ceil(count * 1.5)),
      sameCategoryTarget,
    )
    const topSame = scoredSame.slice(0, topSameCount)
    sameCategoryPicks = pickRandom(topSame, sameCategoryTarget, seed)

    const topOtherCount = Math.max(
      Math.min(scoredOther.length, Math.ceil(count * 1.5)),
      otherCategoryTarget,
    )
    const topOther = scoredOther.slice(0, topOtherCount)
    otherCategoryPicks = pickRandom(topOther, Math.max(0, otherCategoryTarget), seed + 1000)
  } else {
    sameCategoryPicks = scoredSame.slice(0, sameCategoryTarget)
    otherCategoryPicks = scoredOther.slice(0, Math.max(0, otherCategoryTarget))
  }

  let result = [...sameCategoryPicks, ...otherCategoryPicks]

  if (result.length < count) {
    const usedIds = new Set(result.map((r) => r.snack.id))
    const allRemaining = [...scoredSame, ...scoredOther].filter((r) => !usedIds.has(r.snack.id))
    allRemaining.sort((a, b) => b.similarityScore - a.similarityScore)

    if (options?.shuffle) {
      const remainingNeeded = count - result.length
      const topRemaining = allRemaining.slice(0, Math.min(allRemaining.length, remainingNeeded * 2))
      result.push(...pickRandom(topRemaining, remainingNeeded, seed + 2000))
    } else {
      result.push(...allRemaining.slice(0, count - result.length))
    }
  }

  if (options?.shuffle) {
    result = shuffleArray(result, seed + 3000)
  }

  return result.slice(0, count)
}

export function getPopularSnacks(count: number = 8): Snack[] {
  const popularIds = [
    'chips-original',
    'chocolate-milk',
    'ice-cream-vanilla',
    'candy-gummy',
    'nuts-mixed',
    'milk-tea',
    'cola',
    'instant-noodles',
  ]
  return popularIds
    .map((id) => snacks.find((s) => s.id === id)!)
    .filter(Boolean)
    .slice(0, count)
}

export function getHotSearchKeywords(): { keyword: string; count: number }[] {
  return [
    { keyword: '薯片', count: 2356 },
    { keyword: '巧克力', count: 1987 },
    { keyword: '奶茶', count: 1756 },
    { keyword: '冰淇淋', count: 1543 },
    { keyword: '可乐', count: 1324 },
    { keyword: '坚果', count: 1156 },
    { keyword: '饼干', count: 987 },
    { keyword: '方便面', count: 876 },
  ]
}

export function findSnacksGroupedByCategory(name: string): Record<string, Snack[]> {
  const searchLower = name.toLowerCase().trim()

  const matchingTagIds = TAG_INFO.filter((tag) => tag.name.toLowerCase().includes(searchLower)).map(
    (tag) => tag.id,
  )

  const results = snacks.filter(
    (snack) =>
      snack.name.toLowerCase().includes(searchLower) ||
      snack.id.toLowerCase().includes(searchLower) ||
      snack.category.toLowerCase().includes(searchLower) ||
      (matchingTagIds.length > 0 && matchingTagIds.some((tagId) => snack.tags.includes(tagId))),
  )

  const grouped: Record<string, Snack[]> = {}
  results.forEach((snack) => {
    if (!grouped[snack.category]) {
      grouped[snack.category] = []
    }
    grouped[snack.category].push(snack)
  })

  return grouped
}

export function getAllCategories(): string[] {
  return [...new Set(snacks.map((s) => s.category))]
}

export function getSnacksByCategory(category: string): Snack[] {
  if (category === '全部') {
    return snacks
  }
  return snacks.filter((s) => s.category === category)
}

export function filterSnacksByTags(snackList: Snack[], tags: SnackTag[]): Snack[] {
  if (tags.length === 0) return snackList
  return snackList.filter((snack) => tags.every((tag) => snack.tags.includes(tag)))
}

export function filterSnacksByCalories(
  snackList: Snack[],
  minCalories?: number,
  maxCalories?: number,
): Snack[] {
  return snackList.filter((snack) => {
    if (minCalories !== undefined && snack.calories < minCalories) return false
    if (maxCalories !== undefined && snack.calories > maxCalories) return false
    return true
  })
}

export interface FilterOptions {
  category?: string
  tags?: SnackTag[]
  minCalories?: number
  maxCalories?: number
}

export function filterSnacks(options: FilterOptions): Snack[] {
  let result = [...snacks]

  if (options.category && options.category !== '全部') {
    result = result.filter((s) => s.category === options.category)
  }

  if (options.tags && options.tags.length > 0) {
    result = filterSnacksByTags(result, options.tags)
  }

  if (options.minCalories !== undefined || options.maxCalories !== undefined) {
    result = filterSnacksByCalories(result, options.minCalories, options.maxCalories)
  }

  return result
}

export function getTagInfo(tagId: SnackTag): TagInfo | undefined {
  return TAG_INFO.find((t) => t.id === tagId)
}

export function findSnacksByTag(tag: SnackTag): Snack[] {
  return snacks.filter((snack) => snack.tags.includes(tag))
}
