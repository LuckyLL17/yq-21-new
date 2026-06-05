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
  | 'nut-free';

export interface TagInfo {
  id: SnackTag;
  name: string;
  color: string;
  bgColor: string;
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
];

export interface Snack {
  id: string;
  name: string;
  category: string;
  servingSize: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  description?: string;
  tags: SnackTag[];
}

export const snacks: Snack[] = [
  {
    id: 'chips-original',
    name: '薯片（原味）',
    category: '膨化食品',
    servingSize: '一袋（约100g）',
    calories: 536,
    protein: 7,
    fat: 35,
    carbs: 50,
    description: '经典香脆薯片',
    tags: ['fried', 'vegetarian']
  },
  {
    id: 'chips-bbq',
    name: '薯片（烧烤味）',
    category: '膨化食品',
    servingSize: '一袋（约100g）',
    calories: 520,
    protein: 6.5,
    fat: 33,
    carbs: 52,
    description: '烧烤风味薯片',
    tags: ['fried', 'vegetarian']
  },
  {
    id: 'chocolate-milk',
    name: '牛奶巧克力',
    category: '巧克力',
    servingSize: '一块（约100g）',
    calories: 539,
    protein: 7.6,
    fat: 30.7,
    carbs: 59.4,
    description: '丝滑牛奶巧克力',
    tags: ['vegetarian', 'nut-free']
  },
  {
    id: 'chocolate-dark',
    name: '黑巧克力（70%）',
    category: '巧克力',
    servingSize: '一块（约100g）',
    calories: 604,
    protein: 7.8,
    fat: 43,
    carbs: 36,
    description: '浓郁黑巧克力',
    tags: ['vegetarian', 'low-sugar', 'dairy-free', 'nut-free']
  },
  {
    id: 'cookie-chocolate',
    name: '巧克力曲奇',
    category: '饼干',
    servingSize: '一块（约30g）',
    calories: 150,
    protein: 2,
    fat: 7,
    carbs: 20,
    description: '香浓巧克力曲奇',
    tags: ['vegetarian', 'nut-free']
  },
  {
    id: 'cookie-butter',
    name: '黄油曲奇',
    category: '饼干',
    servingSize: '一块（约30g）',
    calories: 140,
    protein: 1.8,
    fat: 6.5,
    carbs: 19,
    description: '酥脆黄油曲奇',
    tags: ['vegetarian', 'nut-free']
  },
  {
    id: 'ice-cream-vanilla',
    name: '香草冰淇淋',
    category: '冰淇淋',
    servingSize: '一球（约100g）',
    calories: 207,
    protein: 3.5,
    fat: 11,
    carbs: 24,
    description: '经典香草冰淇淋',
    tags: ['vegetarian', 'nut-free']
  },
  {
    id: 'ice-cream-chocolate',
    name: '巧克力冰淇淋',
    category: '冰淇淋',
    servingSize: '一球（约100g）',
    calories: 216,
    protein: 3.8,
    fat: 11.5,
    carbs: 25,
    description: '浓郁巧克力冰淇淋',
    tags: ['vegetarian', 'nut-free']
  },
  {
    id: 'candy-gummy',
    name: '软糖',
    category: '糖果',
    servingSize: '一包（约100g）',
    calories: 326,
    protein: 6.5,
    fat: 0.3,
    carbs: 76,
    description: 'Q弹水果软糖',
    tags: ['low-fat', 'vegetarian', 'dairy-free', 'nut-free']
  },
  {
    id: 'candy-lollipop',
    name: '棒棒糖',
    category: '糖果',
    servingSize: '一根（约20g）',
    calories: 78,
    protein: 0,
    fat: 0,
    carbs: 20,
    description: '甜蜜水果棒棒糖',
    tags: ['low-fat', 'low-calorie', 'vegetarian', 'dairy-free', 'nut-free']
  },
  {
    id: 'nuts-mixed',
    name: '混合坚果',
    category: '坚果',
    servingSize: '一小袋（约30g）',
    calories: 180,
    protein: 5.5,
    fat: 15,
    carbs: 8,
    description: '健康混合坚果',
    tags: ['high-protein', 'gluten-free', 'dairy-free', 'vegetarian']
  },
  {
    id: 'nuts-almond',
    name: '杏仁',
    category: '坚果',
    servingSize: '一小把（约30g）',
    calories: 174,
    protein: 6.3,
    fat: 15.5,
    carbs: 6,
    description: '营养加州杏仁',
    tags: ['high-protein', 'low-sugar', 'gluten-free', 'dairy-free', 'vegetarian']
  },
  {
    id: 'popcorn-butter',
    name: '黄油爆米花',
    category: '膨化食品',
    servingSize: '一桶（约100g）',
    calories: 480,
    protein: 8,
    fat: 28,
    carbs: 55,
    description: '电影院黄油爆米花',
    tags: ['non-fried', 'vegetarian', 'nut-free']
  },
  {
    id: 'popcorn-plain',
    name: '原味爆米花',
    category: '膨化食品',
    servingSize: '一桶（约100g）',
    calories: 387,
    protein: 12,
    fat: 4.5,
    carbs: 78,
    description: '无油原味爆米花',
    tags: ['non-fried', 'low-fat', 'high-protein', 'gluten-free', 'dairy-free', 'vegetarian', 'nut-free']
  },
  {
    id: 'pocky',
    name: '百奇巧克力棒',
    category: '饼干',
    servingSize: '一盒（约40g）',
    calories: 200,
    protein: 2.5,
    fat: 9,
    carbs: 28,
    description: '巧克力涂层饼干棒',
    tags: ['vegetarian', 'nut-free']
  },
  {
    id: 'potato-stick',
    name: '薯条（中份）',
    category: '油炸食品',
    servingSize: '一份（约110g）',
    calories: 365,
    protein: 4,
    fat: 17,
    carbs: 48,
    description: '金黄酥脆薯条',
    tags: ['fried', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free']
  },
  {
    id: 'donut-glazed',
    name: '糖霜甜甜圈',
    category: '糕点',
    servingSize: '一个（约60g）',
    calories: 269,
    protein: 4,
    fat: 14,
    carbs: 31,
    description: '经典糖霜甜甜圈',
    tags: ['vegetarian', 'nut-free']
  },
  {
    id: 'muffin-blueberry',
    name: '蓝莓马芬',
    category: '糕点',
    servingSize: '一个（约100g）',
    calories: 377,
    protein: 4.8,
    fat: 16,
    carbs: 55,
    description: '蓝莓果肉马芬蛋糕',
    tags: ['vegetarian', 'nut-free']
  },
  {
    id: 'fruit-dried-mango',
    name: '芒果干',
    category: '果干',
    servingSize: '一袋（约100g）',
    calories: 319,
    protein: 1.4,
    fat: 0.7,
    carbs: 80,
    description: '酸甜芒果干',
    tags: ['low-fat', 'gluten-free', 'dairy-free', 'vegetarian', 'nut-free']
  },
  {
    id: 'yogurt-greek',
    name: '希腊酸奶',
    category: '乳制品',
    servingSize: '一杯（约170g）',
    calories: 100,
    protein: 17,
    fat: 0.7,
    carbs: 6,
    description: '高蛋白希腊酸奶',
    tags: ['high-protein', 'low-fat', 'low-sugar', 'low-calorie', 'gluten-free', 'vegetarian', 'nut-free']
  },
  {
    id: 'milk-tea',
    name: '珍珠奶茶',
    category: '饮料',
    servingSize: '一杯（约500ml）',
    calories: 450,
    protein: 2,
    fat: 8,
    carbs: 95,
    description: '经典珍珠奶茶',
    tags: ['vegetarian', 'nut-free']
  },
  {
    id: 'cola',
    name: '可乐',
    category: '饮料',
    servingSize: '一罐（约330ml）',
    calories: 140,
    protein: 0,
    fat: 0,
    carbs: 35,
    description: '碳酸饮料',
    tags: ['low-fat', 'gluten-free', 'dairy-free', 'vegetarian', 'nut-free']
  },
  {
    id: 'instant-noodles',
    name: '方便面',
    category: '方便食品',
    servingSize: '一包（约100g）',
    calories: 470,
    protein: 9,
    fat: 20,
    carbs: 65,
    description: '红烧牛肉方便面',
    tags: ['fried']
  },
  {
    id: 'rice-cracker',
    name: '仙贝',
    category: '膨化食品',
    servingSize: '一袋（约50g）',
    calories: 200,
    protein: 3,
    fat: 6,
    carbs: 34,
    description: '香脆米饼',
    tags: ['non-fried', 'vegetarian', 'nut-free']
  }
];

export function findSnackByName(name: string): Snack[] {
  const searchLower = name.toLowerCase().trim();
  return snacks.filter(snack => 
    snack.name.toLowerCase().includes(searchLower) ||
    snack.id.toLowerCase().includes(searchLower)
  );
}

export function getSnackById(id: string): Snack | undefined {
  return snacks.find(snack => snack.id === id);
}

export function getAlternatives(snack: Snack, count: number = 3): Snack[] {
  const sameCategoryAlternatives = snacks
    .filter(s => s.id !== snack.id && s.category === snack.category && s.calories < snack.calories)
    .sort((a, b) => Math.abs(a.calories - snack.calories / 2) - Math.abs(b.calories - snack.calories / 2));
  
  if (sameCategoryAlternatives.length >= count) {
    return sameCategoryAlternatives.slice(0, count);
  }
  
  const otherAlternatives = snacks
    .filter(s => s.id !== snack.id && s.category !== snack.category && s.calories < snack.calories)
    .sort((a, b) => Math.abs(a.calories - snack.calories / 2) - Math.abs(b.calories - snack.calories / 2));
  
  return [...sameCategoryAlternatives, ...otherAlternatives].slice(0, count);
}

export function getPopularSnacks(count: number = 8): Snack[] {
  const popularIds = ['chips-original', 'chocolate-milk', 'ice-cream-vanilla', 'candy-gummy', 'nuts-mixed', 'milk-tea', 'cola', 'instant-noodles'];
  return popularIds.map(id => snacks.find(s => s.id === id)!).filter(Boolean).slice(0, count);
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
  ];
}

export function findSnacksGroupedByCategory(name: string): Record<string, Snack[]> {
  const searchLower = name.toLowerCase().trim();
  
  const matchingTagIds = TAG_INFO
    .filter(tag => tag.name.toLowerCase().includes(searchLower))
    .map(tag => tag.id);
  
  const results = snacks.filter(snack => 
    snack.name.toLowerCase().includes(searchLower) ||
    snack.id.toLowerCase().includes(searchLower) ||
    snack.category.toLowerCase().includes(searchLower) ||
    (matchingTagIds.length > 0 && matchingTagIds.some(tagId => snack.tags.includes(tagId)))
  );
  
  const grouped: Record<string, Snack[]> = {};
  results.forEach(snack => {
    if (!grouped[snack.category]) {
      grouped[snack.category] = [];
    }
    grouped[snack.category].push(snack);
  });
  
  return grouped;
}

export function getAllCategories(): string[] {
  return [...new Set(snacks.map(s => s.category))];
}

export function getSnacksByCategory(category: string): Snack[] {
  if (category === '全部') {
    return snacks;
  }
  return snacks.filter(s => s.category === category);
}

export function filterSnacksByTags(snackList: Snack[], tags: SnackTag[]): Snack[] {
  if (tags.length === 0) return snackList;
  return snackList.filter(snack => 
    tags.every(tag => snack.tags.includes(tag))
  );
}

export function filterSnacksByCalories(
  snackList: Snack[], 
  minCalories?: number, 
  maxCalories?: number
): Snack[] {
  return snackList.filter(snack => {
    if (minCalories !== undefined && snack.calories < minCalories) return false;
    if (maxCalories !== undefined && snack.calories > maxCalories) return false;
    return true;
  });
}

export interface FilterOptions {
  category?: string;
  tags?: SnackTag[];
  minCalories?: number;
  maxCalories?: number;
}

export function filterSnacks(options: FilterOptions): Snack[] {
  let result = [...snacks];
  
  if (options.category && options.category !== '全部') {
    result = result.filter(s => s.category === options.category);
  }
  
  if (options.tags && options.tags.length > 0) {
    result = filterSnacksByTags(result, options.tags);
  }
  
  if (options.minCalories !== undefined || options.maxCalories !== undefined) {
    result = filterSnacksByCalories(result, options.minCalories, options.maxCalories);
  }
  
  return result;
}

export function getTagInfo(tagId: SnackTag): TagInfo | undefined {
  return TAG_INFO.find(t => t.id === tagId);
}

export function findSnacksByTag(tag: SnackTag): Snack[] {
  return snacks.filter(snack => snack.tags.includes(tag));
}
