import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flame, Scale, Cookie, Droplets, Wheat, ArrowLeft, Lightbulb, Dumbbell, User } from 'lucide-react';
import { getSnackById, getAlternatives } from '../data/snacks';
import { getExercisesForDisplay } from '../data/exercises';
import { getCaloriesLevel, getWeightOptions } from '../utils/calculator';
import { ExerciseCard } from '../components/ExerciseCard';
import { AlternativeCard } from '../components/AlternativeCard';

export function SnackDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [weight, setWeight] = useState(65);
  
  const snack = id ? getSnackById(id) : undefined;
  const alternatives = snack ? getAlternatives(snack, 3) : [];
  const exercises = getExercisesForDisplay(6);
  const caloriesLevel = snack ? getCaloriesLevel(snack.calories) : null;

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回搜索</span>
          </button>
        </div>

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
            <ExerciseCard snack={snack} exercise={exercises[0]} weight={weight} isMain />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {exercises.slice(1).map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                snack={snack}
                exercise={exercise}
                weight={weight}
              />
            ))}
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
  );
}
