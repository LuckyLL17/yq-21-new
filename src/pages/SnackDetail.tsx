import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flame, Scale, Droplets, Wheat, ArrowLeft, Lightbulb, Dumbbell, User, X, Download, ChevronDown, Heart, Folder, Check, Tag, Plus, Edit2, Trash2, Zap, RefreshCw, Settings, Save, TrendingUp, TrendingDown, Equal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import html2canvas from 'html2canvas';
import { getSnackById, getAlternatives, TAG_INFO, getTagInfo, type AlternativeRecommendation } from '../data/snacks';
import { getAllExercises, getIntensityLabel, type ExerciseIntensity } from '../data/exercises';
import { getCaloriesLevel } from '../utils/snack';
import { getWeightOptions } from '../utils/constants';
import { kcalToKj, type EnergyUnit } from '../utils/energy';
import { ERROR_MARGIN_DESCRIPTION } from '../utils/constants';
import { ExerciseCard } from '../components/ExerciseCard';
import { AlternativeCard } from '../components/AlternativeCard';
import { useBrowsingHistory } from '../utils/useBrowsingHistory';
import { useFavorites } from '../utils/useFavorites';
import { useCustomTags } from '../utils/useCustomTags';
import { useServingPresets } from '../utils/useServingPresets';
import {
  calculateNutritionByWeight,
  getSliderRange,
  getQuickAdjustOptions,
  formatNutritionValue,
  getUnitsFromWeight,
  type NutritionInfo,
} from '../utils/serving';

export function SnackDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [weight, setWeight] = useState(65);
  const [intensity, setIntensity] = useState<ExerciseIntensity>('medium');
  const [energyUnit, setEnergyUnit] = useState<EnergyUnit>('kcal');
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [recommendationCount, setRecommendationCount] = useState(3);
  const [refreshSeed, setRefreshSeed] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCountMenu, setShowCountMenu] = useState(false);
  const [currentWeightGrams, setCurrentWeightGrams] = useState<number | null>(null);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [servingUnitMode, setServingUnitMode] = useState<'weight' | 'unit'>('weight');
  const contentRef = useRef<HTMLDivElement>(null);
  const countMenuRef = useRef<HTMLDivElement>(null);
  const presetMenuRef = useRef<HTMLDivElement>(null);
  const { addToHistory } = useBrowsingHistory();
  const { isFavorite, toggleFavorite, categories, setSnackCategories, favorites } = useFavorites();
  const { 
    customTags, 
    addCustomTag, 
    removeCustomTag, 
    updateCustomTag,
    getSnackTags, 
    toggleTagOnSnack,
    defaultColors 
  } = useCustomTags();
  
  const snack = id ? getSnackById(id) : undefined;
  
  const { presets, addPreset, removePreset } = useServingPresets(snack);

  const effectiveWeight = currentWeightGrams ?? snack?.baseWeightGrams ?? 100;

  const currentNutrition: NutritionInfo = useMemo(() => {
    if (!snack) return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    return calculateNutritionByWeight(snack, effectiveWeight);
  }, [snack, effectiveWeight]);

  const baseNutrition: NutritionInfo = useMemo(() => {
    if (!snack) return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    return calculateNutritionByWeight(snack, snack.baseWeightGrams);
  }, [snack]);

  const caloriesDiff = currentNutrition.calories - baseNutrition.calories;
  const caloriesDiffPercent = baseNutrition.calories > 0 
    ? ((currentNutrition.calories - baseNutrition.calories) / baseNutrition.calories) * 100 
    : 0;

  const sliderRange = snack ? getSliderRange(snack) : { min: 1, max: 500, step: 1 };
  const quickAdjustOptions = getQuickAdjustOptions();
  const currentUnits = snack ? getUnitsFromWeight(snack, effectiveWeight) : 1;

  const currentCaloriesLevel = getCaloriesLevel(currentNutrition.calories);

  const handleWeightChange = (weight: number) => {
    setCurrentWeightGrams(Math.max(sliderRange.min, Math.min(sliderRange.max, weight)));
  };

  const handleQuickAdjust = (multiplier: number) => {
    if (!snack) return;
    const newWeight = snack.baseWeightGrams * multiplier;
    setCurrentWeightGrams(newWeight);
  };

  const handlePresetSelect = (weightGrams: number) => {
    setCurrentWeightGrams(weightGrams);
    setShowPresetMenu(false);
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    addPreset(newPresetName.trim(), effectiveWeight);
    setNewPresetName('');
    setShowSavePresetModal(false);
  };

  const handleRemovePreset = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个预设吗？')) {
      removePreset(presetId);
    }
  };

  const handleResetWeight = () => {
    if (snack) {
      setCurrentWeightGrams(snack.baseWeightGrams);
    }
  };
  
  const alternatives: AlternativeRecommendation[] = useMemo(() => {
    if (!snack) return [];
    return getAlternatives(snack, recommendationCount, { shuffle: true, seed: refreshSeed });
  }, [snack, recommendationCount, refreshSeed]);

  const handleRefreshRecommendations = () => {
    setIsRefreshing(true);
    setRefreshSeed(Date.now());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCountChange = (count: number) => {
    setRecommendationCount(count);
    setShowCountMenu(false);
  };

  const countOptions = [3, 5, 8, 10];
  const allExercises = getAllExercises();
  const favorited = snack ? isFavorite(snack.id) : false;
  const favoriteItem = snack ? favorites.find(f => f.snackId === snack.id) : null;
  const selectedCategoryIds = favoriteItem?.categoryIds || [];

  useEffect(() => {
    if (snack) {
      addToHistory(snack);
    }
  }, [snack, addToHistory]);

  const handleToggleFavorite = () => {
    if (snack) {
      toggleFavorite(snack);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    if (!snack) return;
    const newIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter(id => id !== categoryId)
      : [...selectedCategoryIds, categoryId];
    setSnackCategories(snack.id, newIds);
  };

  const handleAddCustomTag = () => {
    if (!newTagName.trim()) return;
    const newTag = addCustomTag(newTagName.trim(), newTagColor);
    if (snack) {
      toggleTagOnSnack(snack.id, newTag.id);
    }
    setNewTagName('');
    setNewTagColor(defaultColors[(customTags.length + 1) % defaultColors.length]);
  };

  const handleStartEditTag = (tagId: string) => {
    const tag = customTags.find(t => t.id === tagId);
    if (tag) {
      setEditingTagId(tagId);
      setNewTagName(tag.name);
      setNewTagColor(tag.color);
    }
  };

  const handleSaveEditTag = () => {
    if (!editingTagId || !newTagName.trim()) return;
    updateCustomTag(editingTagId, newTagName.trim(), newTagColor);
    setEditingTagId(null);
    setNewTagName('');
  };

  const handleCancelEditTag = () => {
    setEditingTagId(null);
    setNewTagName('');
    setNewTagColor(defaultColors[0]);
  };

  const handleToggleSnackTag = (tagId: string) => {
    if (snack) {
      toggleTagOnSnack(snack.id, tagId);
    }
  };

  const snackCustomTagIds = snack ? getSnackTags(snack.id) : [];

  if (!snack) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-poppins text-2xl font-bold text-gray-800 mb-2">
            未找到该零食
          </h2>
          <p className="text-gray-500 mb-6">请返回首页重新搜索</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const categoryEmojis: Record<string, string> = {
    '膨化食品': '🍿',
    '巧克力': '🍫',
    '饼干': '🍪',
    '冰淇淋': '🍦',
    '糖果': '🍬',
    '坚果': '🥜',
    '油炸食品': '🍟',
    '糕点': '🍩',
    '果干': '🥭',
    '乳制品': '🥛',
    '饮料': '🧋',
    '方便食品': '🍜',
  };

  const emoji = categoryEmojis[snack.category] || '🍴';

  const nutritionData = [
    { name: '蛋白质', value: currentNutrition.protein * 4, color: '#F97316' },
    { name: '脂肪', value: currentNutrition.fat * 9, color: '#EAB308' },
    { name: '碳水化合物', value: currentNutrition.carbs * 4, color: '#3B82F6' },
  ];

  const handleGenerateImage = async () => {
    if (!contentRef.current) return;
    
    setIsGeneratingImage(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#F9FAFB',
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `${snack.name}-热量分析.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('生成图片失败:', error);
      alert('生成图片失败，请重试');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回搜索</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={handleToggleFavorite}
                className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-xl transition-colors ${
                  favorited
                    ? 'bg-red-50 text-red-500 hover:bg-red-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} />
                <span>{favorited ? '已收藏' : '收藏'}</span>
              </button>
              
              {favorited && (
                <button
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="ml-1 p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  title="管理分类"
                >
                  <Folder className="w-5 h-5" />
                </button>
              )}

              {showCategoryMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCategoryMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">选择分类</p>
                    </div>
                    {categories.filter(c => c.id !== 'all').map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm text-gray-700">{category.name}</span>
                        </div>
                        {selectedCategoryIds.includes(category.id) && (
                          <Check className="w-4 h-4 text-primary-500" />
                        )}
                      </button>
                    ))}
                    {categories.filter(c => c.id !== 'all').length === 0 && (
                      <div className="px-4 py-3 text-center text-sm text-gray-500">
                        暂无自定义分类
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImage}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              <span>{isGeneratingImage ? '生成中...' : '保存分析'}</span>
            </button>
          </div>
        </div>

        <div ref={contentRef}>
          <div className="bg-white rounded-3xl p-6 md:p-8 card-shadow mb-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="w-full md:w-48 h-48 md:h-48 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
                <span className="text-7xl">{emoji}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h1 className="font-poppins text-2xl md:text-3xl font-bold text-gray-800">
                      {snack.name}
                    </h1>
                    <p className="text-gray-500 mt-1">
                      标准份量：{snack.servingSize}
                      {caloriesDiff !== 0 && (
                        <span className={`ml-2 text-sm font-medium ${caloriesDiff > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                          (当前 {caloriesDiff > 0 ? '+' : ''}{formatNutritionValue(caloriesDiff)} 千卡)
                        </span>
                      )}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    currentCaloriesLevel?.level === '低' ? 'bg-green-100 text-green-600' :
                    currentCaloriesLevel?.level === '中低' ? 'bg-emerald-100 text-emerald-600' :
                    currentCaloriesLevel?.level === '中' ? 'bg-yellow-100 text-yellow-600' :
                    currentCaloriesLevel?.level === '高' ? 'bg-orange-100 text-orange-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {currentCaloriesLevel?.level}热量
                  </span>
                </div>
                
                <div className="flex items-baseline gap-2 mb-2">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <span className="font-poppins text-4xl font-bold text-gray-800">
                    {formatNutritionValue(currentNutrition.calories)}
                  </span>
                  <span className="text-xl text-gray-500">千卡</span>
                </div>

                {caloriesDiff !== 0 && (
                  <div className={`flex items-center gap-2 mb-4 text-sm font-medium`}>
                    {caloriesDiff > 0 ? (
                      <TrendingUp className="w-4 h-4 text-orange-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                    <span className={caloriesDiff > 0 ? 'text-orange-500' : 'text-green-500'}>
                      比标准份量{caloriesDiff > 0 ? '多' : '少'} {formatNutritionValue(Math.abs(caloriesDiff))} 千卡 ({caloriesDiffPercent > 0 ? '+' : ''}{caloriesDiffPercent.toFixed(1)}%)
                    </span>
                  </div>
                )}
                
                <p className={`text-base ${currentCaloriesLevel?.color} font-medium mb-6`}>
                  {currentCaloriesLevel?.message}
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-orange-100 flex items-center justify-center mb-2">
                      <Dumbbell className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="font-poppins text-xl font-bold text-gray-800">{formatNutritionValue(currentNutrition.protein)}g</p>
                    <p className="text-xs text-gray-500">蛋白质</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-yellow-100 flex items-center justify-center mb-2">
                      <Droplets className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="font-poppins text-xl font-bold text-gray-800">{formatNutritionValue(currentNutrition.fat)}g</p>
                    <p className="text-xs text-gray-500">脂肪</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-2">
                      <Wheat className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="font-poppins text-xl font-bold text-gray-800">{formatNutritionValue(currentNutrition.carbs)}g</p>
                    <p className="text-xs text-gray-500">碳水化合物</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-poppins text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary-500" />
                  份量调整
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setServingUnitMode('weight')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        servingUnitMode === 'weight'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      按重量
                    </button>
                    <button
                      onClick={() => setServingUnitMode('unit')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        servingUnitMode === 'unit'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      按{snack?.unitLabel || '份'}
                    </button>
                  </div>
                  <button
                    onClick={handleResetWeight}
                    className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    重置
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    当前份量：
                    <span className="font-semibold text-gray-800">
                      {servingUnitMode === 'weight' 
                        ? `${Math.round(effectiveWeight)} g`
                        : `${currentUnits.toFixed(2)} ${snack?.unitLabel || '份'}`
                      }
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative" ref={presetMenuRef}>
                      <button
                        onClick={() => setShowPresetMenu(!showPresetMenu)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        预设
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {showPresetMenu && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowPresetMenu(false)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-80 overflow-y-auto">
                            <div className="px-4 py-2 border-b border-gray-100">
                              <p className="text-xs font-medium text-gray-500">常用份量</p>
                            </div>
                            {presets.map((preset) => (
                              <button
                                key={preset.id}
                                onClick={() => handlePresetSelect(preset.weightGrams)}
                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between transition-colors group"
                              >
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{preset.name}</p>
                                  <p className="text-xs text-gray-500">{Math.round(preset.weightGrams)}g · {formatNutritionValue(calculateNutritionByWeight(snack!, preset.weightGrams).calories)} 千卡</p>
                                </div>
                                {!(preset as any).isDefault && (
                                  <button
                                    onClick={(e) => handleRemovePreset(preset.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </button>
                            ))}
                            {presets.length === 0 && (
                              <div className="px-4 py-3 text-center text-sm text-gray-500">
                                暂无预设
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => setShowSavePresetModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-lg hover:bg-primary-200 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      保存
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min={sliderRange.min}
                  max={sliderRange.max}
                  step={sliderRange.step}
                  value={servingUnitMode === 'weight' ? effectiveWeight : currentUnits}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (servingUnitMode === 'weight') {
                      handleWeightChange(value);
                    } else {
                      setCurrentWeightGrams(snack!.baseWeightGrams * value);
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{sliderRange.min}g</span>
                  <span>{Math.round(sliderRange.max / 2)}g</span>
                  <span>{sliderRange.max}g</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {quickAdjustOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleQuickAdjust(option.multiplier)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      Math.abs(currentUnits - option.multiplier) < 0.01
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    value={servingUnitMode === 'weight' ? Math.round(effectiveWeight) : currentUnits.toFixed(2)}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (servingUnitMode === 'weight') {
                        handleWeightChange(value);
                      } else {
                        setCurrentWeightGrams(snack!.baseWeightGrams * Math.max(0.01, value));
                      }
                    }}
                    className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-primary-200"
                    min={sliderRange.min}
                    max={sliderRange.max}
                    step={sliderRange.step}
                  />
                  <span className="text-sm text-gray-500">
                    {servingUnitMode === 'weight' ? '克 (g)' : `${snack?.unitLabel || '份'}`}
                  </span>
                </div>
              </div>
            </div>

            {caloriesDiff !== 0 && (
              <div className="mt-6 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Equal className="w-5 h-5 text-primary-500" />
                  热量对比
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">标准份量</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatNutritionValue(baseNutrition.calories)}
                      <span className="text-sm font-normal text-gray-500 ml-1">千卡</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{snack?.baseWeightGrams}g</p>
                  </div>
                  <div className={`p-4 rounded-xl ${caloriesDiff > 0 ? 'bg-orange-50' : 'bg-green-50'}`}>
                    <p className="text-sm text-gray-500 mb-1">当前份量</p>
                    <p className={`text-2xl font-bold ${caloriesDiff > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {formatNutritionValue(currentNutrition.calories)}
                      <span className="text-sm font-normal text-gray-500 ml-1">千卡</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{Math.round(effectiveWeight)}g</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">差异</span>
                    <span className={`font-semibold ${caloriesDiff > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {caloriesDiff > 0 ? '+' : ''}{formatNutritionValue(caloriesDiff)} 千卡
                      <span className="text-gray-400 font-normal ml-1">
                        ({caloriesDiffPercent > 0 ? '+' : ''}{caloriesDiffPercent.toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-poppins text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary-500" />
                  属性标签
                </h3>
                <button
                  onClick={() => setShowTagManager(!showTagManager)}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  管理标签
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {snack.tags.length === 0 && snackCustomTagIds.length === 0 ? (
                  <p className="text-sm text-gray-400">暂无标签</p>
                ) : (
                  <>
                    {snack.tags.map((tagId) => {
                      const tagInfo = getTagInfo(tagId);
                      return tagInfo ? (
                        <span
                          key={tagId}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${tagInfo.bgColor} ${tagInfo.color}`}
                        >
                          {tagInfo.name}
                        </span>
                      ) : null;
                    })}
                    {snackCustomTagIds.map((tagId) => {
                      const tag = customTags.find(t => t.id === tagId);
                      return tag ? (
                        <span
                          key={tagId}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ) : null;
                    })}
                  </>
                )}
              </div>

              {showTagManager && (
                <div className="mt-6 p-5 bg-gray-50 rounded-2xl">
                  <h4 className="font-semibold text-gray-700 mb-4">为零食添加标签</h4>
                  
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">系统标签</p>
                    <div className="flex flex-wrap gap-2">
                      {TAG_INFO.map((tag) => {
                        const isSelected = snack.tags.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            onClick={() => {}}
                            disabled
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              isSelected
                                ? `${tag.bgColor} ${tag.color} ring-2 ring-offset-1 ring-current`
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                            }`}
                            title="系统标签无法手动修改"
                          >
                            {tag.name}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">系统标签由平台预设</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2">自定义标签</p>
                    
                    {editingTagId ? (
                      <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="标签名称"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 mb-3"
                          autoFocus
                        />
                        <div className="flex flex-wrap gap-2 mb-3">
                          {defaultColors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setNewTagColor(color)}
                              className={`w-7 h-7 rounded-full transition-transform ${
                                newTagColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEditTag}
                            className="flex-1 px-3 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
                          >
                            保存
                          </button>
                          <button
                            onClick={handleCancelEditTag}
                            className="px-3 py-2 bg-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4 flex gap-2">
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="输入新标签名称"
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddCustomTag();
                            }
                          }}
                        />
                        <button
                          onClick={handleAddCustomTag}
                          className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          添加
                        </button>
                      </div>
                    )}

                    {customTags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {customTags.map((tag) => {
                          const isSelected = snackCustomTagIds.includes(tag.id);
                          return (
                            <div key={tag.id} className="relative group">
                              <button
                                onClick={() => handleToggleSnackTag(tag.id)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                  isSelected
                                    ? 'text-white ring-2 ring-offset-1 ring-opacity-50'
                                    : 'text-white opacity-60 hover:opacity-80'
                                }`}
                                style={{ backgroundColor: tag.color }}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 inline mr-1" />}
                                {tag.name}
                              </button>
                              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartEditTag(tag.id);
                                  }}
                                  className="w-5 h-5 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 text-gray-500"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`确定要删除标签"${tag.name}"吗？`)) {
                                      removeCustomTag(tag.id);
                                    }
                                  }}
                                  className="w-5 h-5 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 text-red-500"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">暂无自定义标签，快去创建一个吧～</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-poppins text-lg font-bold text-gray-800 mb-4">营养成分占比</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={nutritionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(1)}%`}
                    >
                      {nutritionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} 千卡`, '热量']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 card-shadow mb-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-poppins text-xl font-bold text-gray-800">
                    需要运动多久才能消耗？
                  </h2>
                  <p className="text-sm text-gray-500">基于你的体重和运动强度计算</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setEnergyUnit('kcal')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      energyUnit === 'kcal'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    千卡
                  </button>
                  <button
                    onClick={() => setEnergyUnit('kJ')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      energyUnit === 'kJ'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    千焦
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <select
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  >
                    {getWeightOptions().map((w) => (
                      <option key={w} value={w}>{w} kg</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">选择运动强度</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['low', 'medium', 'high'] as ExerciseIntensity[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setIntensity(level)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      intensity === level
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {getIntensityLabel(level)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <ExerciseCard
                snack={{ ...snack, calories: currentNutrition.calories, servingSize: `${Math.round(effectiveWeight)}g` }}
                exercise={allExercises[0]}
                weight={weight}
                intensity={intensity}
                energyUnit={energyUnit}
                isMain
                showRange
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {allExercises.slice(1, 6).map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  snack={{ ...snack, calories: currentNutrition.calories, servingSize: `${Math.round(effectiveWeight)}g` }}
                  exercise={exercise}
                  weight={weight}
                  intensity={intensity}
                  energyUnit={energyUnit}
                  showRange
                />
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowAllExercises(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                <span>查看全部运动类型</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                {ERROR_MARGIN_DESCRIPTION}
              </p>
            </div>
          </div>

          {alternatives.length > 0 && (
            <div className="bg-white rounded-3xl p-6 md:p-8 card-shadow">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-poppins text-xl font-bold text-gray-800">
                      更低热量的替代品推荐
                    </h2>
                    <p className="text-sm text-gray-500">满足口腹之欲的同时减少热量摄入</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative" ref={countMenuRef}>
                    <button
                      onClick={() => setShowCountMenu(!showCountMenu)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">推荐 {recommendationCount} 个</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showCountMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowCountMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-xs font-medium text-gray-500">推荐数量</p>
                          </div>
                          {countOptions.map((count) => (
                            <button
                              key={count}
                              onClick={() => handleCountChange(count)}
                              className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between transition-colors ${
                                recommendationCount === count ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                              }`}
                            >
                              <span className="text-sm">{count} 个</span>
                              {recommendationCount === count && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={handleRefreshRecommendations}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-medium rounded-xl hover:bg-green-200 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="text-sm">换一批</span>
                  </button>
                </div>
              </div>
              
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                {alternatives.map((alt) => (
                  <AlternativeCard
                    key={alt.snack.id + '-' + refreshSeed}
                    recommendation={alt}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showSavePresetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800">保存份量预设</h3>
              <button
                onClick={() => setShowSavePresetModal(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">当前份量</p>
              <p className="text-lg font-semibold text-gray-800">
                {Math.round(effectiveWeight)}g · {formatNutritionValue(currentNutrition.calories)} 千卡
              </p>
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1.5 block">预设名称</label>
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="例如：下午茶份量"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSavePreset();
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSavePresetModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSavePreset}
                disabled={!newPresetName.trim()}
                className="flex-1 px-4 py-2.5 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {showAllExercises && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-poppins text-xl font-bold text-gray-800">
                    全部运动类型
                  </h2>
                  <p className="text-sm text-gray-500">
                    {energyUnit === 'kJ' 
                      ? `消耗约 ${Math.round(kcalToKj(currentNutrition.calories))} 千焦所需时间`
                      : `消耗 ${formatNutritionValue(currentNutrition.calories)} 千卡所需时间`
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAllExercises(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="mb-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setEnergyUnit('kcal')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    energyUnit === 'kcal'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  千卡
                </button>
                <button
                  onClick={() => setEnergyUnit('kJ')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    energyUnit === 'kJ'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  千焦
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <select
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  {getWeightOptions().map((w) => (
                    <option key={w} value={w}>{w} kg</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">运动强度</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['low', 'medium', 'high'] as ExerciseIntensity[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setIntensity(level)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      intensity === level
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {getIntensityLabel(level)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  snack={{ ...snack, calories: currentNutrition.calories, servingSize: `${Math.round(effectiveWeight)}g` }}
                  exercise={exercise}
                  weight={weight}
                  intensity={intensity}
                  energyUnit={energyUnit}
                  showRange
                />
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                {ERROR_MARGIN_DESCRIPTION}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
