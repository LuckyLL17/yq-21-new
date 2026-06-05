import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flame, Scale, Droplets, Wheat, ArrowLeft, Lightbulb, Dumbbell, User, X, Download, ChevronDown, Heart, Folder, Check } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import html2canvas from 'html2canvas';
import { getSnackById, getAlternatives } from '../data/snacks';
import { getAllExercises } from '../data/exercises';
import { getCaloriesLevel, getWeightOptions } from '../utils/calculator';
import { ExerciseCard } from '../components/ExerciseCard';
import { AlternativeCard } from '../components/AlternativeCard';
import { useBrowsingHistory } from '../utils/useBrowsingHistory';
import { useFavorites } from '../utils/useFavorites';

export function SnackDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [weight, setWeight] = useState(65);
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { addToHistory } = useBrowsingHistory();
  const { isFavorite, toggleFavorite, categories, setSnackCategories, favorites } = useFavorites();
  
  const snack = id ? getSnackById(id) : undefined;
  const alternatives = snack ? getAlternatives(snack, 3) : [];
  const allExercises = getAllExercises();
  const caloriesLevel = snack ? getCaloriesLevel(snack.calories) : null;
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
    { name: '蛋白质', value: snack.protein * 4, color: '#F97316' },
    { name: '脂肪', value: snack.fat * 9, color: '#EAB308' },
    { name: '碳水化合物', value: snack.carbs * 4, color: '#3B82F6' },
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
                    <p className="text-gray-500 mt-1">{snack.servingSize}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    caloriesLevel?.level === '低' ? 'bg-green-100 text-green-600' :
                    caloriesLevel?.level === '中低' ? 'bg-emerald-100 text-emerald-600' :
                    caloriesLevel?.level === '中' ? 'bg-yellow-100 text-yellow-600' :
                    caloriesLevel?.level === '高' ? 'bg-orange-100 text-orange-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {caloriesLevel?.level}热量
                  </span>
                </div>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <span className="font-poppins text-4xl font-bold text-gray-800">
                    {snack.calories}
                  </span>
                  <span className="text-xl text-gray-500">千卡</span>
                </div>
                
                <p className={`text-base ${caloriesLevel?.color} font-medium mb-6`}>
                  {caloriesLevel?.message}
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-orange-100 flex items-center justify-center mb-2">
                      <Dumbbell className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="font-poppins text-xl font-bold text-gray-800">{snack.protein}g</p>
                    <p className="text-xs text-gray-500">蛋白质</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-yellow-100 flex items-center justify-center mb-2">
                      <Droplets className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="font-poppins text-xl font-bold text-gray-800">{snack.fat}g</p>
                    <p className="text-xs text-gray-500">脂肪</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-2">
                      <Wheat className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="font-poppins text-xl font-bold text-gray-800">{snack.carbs}g</p>
                    <p className="text-xs text-gray-500">碳水化合物</p>
                  </div>
                </div>
              </div>
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-poppins text-xl font-bold text-gray-800">
                    需要运动多久才能消耗？
                  </h2>
                  <p className="text-sm text-gray-500">基于你的体重计算</p>
                </div>
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
            
            <div className="mb-6">
              <ExerciseCard snack={snack} exercise={allExercises[0]} weight={weight} isMain />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {allExercises.slice(1, 6).map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  snack={snack}
                  exercise={exercise}
                  weight={weight}
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
          </div>

          {alternatives.length > 0 && (
            <div className="bg-white rounded-3xl p-6 md:p-8 card-shadow">
              <div className="flex items-center gap-3 mb-6">
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
              
              <div className="grid md:grid-cols-3 gap-4">
                {alternatives.map((alt) => (
                  <AlternativeCard
                    key={alt.id}
                    snack={alt}
                    originalCalories={snack.calories}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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
                  <p className="text-sm text-gray-500">消耗 {snack.calories} 千卡所需时间</p>
                </div>
              </div>
              <button
                onClick={() => setShowAllExercises(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  snack={snack}
                  exercise={exercise}
                  weight={weight}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
