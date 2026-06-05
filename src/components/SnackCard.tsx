import { useNavigate } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import type { Snack } from '../data/snacks';
import { getCaloriesLevel } from '../utils/calculator';

interface SnackCardProps {
  snack: Snack;
  variant?: 'horizontal' | 'grid';
}

export function SnackCard({ snack, variant = 'grid' }: SnackCardProps) {
  const navigate = useNavigate();
  const caloriesLevel = getCaloriesLevel(snack.calories);

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

  if (variant === 'horizontal') {
    return (
      <button
        onClick={() => navigate(`/snack/${snack.id}`)}
        className="w-full p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4 card-hover card-shadow"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
          <span className="text-3xl">{emoji}</span>
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-gray-800">{snack.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{snack.servingSize}</p>
          <div className="flex items-center gap-2 mt-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className={`text-sm font-medium ${caloriesLevel.color}`}>
              {snack.calories} 千卡
            </span>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-300" />
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate(`/snack/${snack.id}`)}
      className="group p-5 bg-white rounded-2xl border border-gray-100 card-hover card-shadow text-left"
    >
      <div className="w-full h-24 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mb-4">
        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{emoji}</span>
      </div>
      <h3 className="font-semibold text-gray-800 text-lg">{snack.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{snack.servingSize}</p>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-gray-800">{snack.calories}</span>
          <span className="text-sm text-gray-500">千卡</span>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          caloriesLevel.level === '低' ? 'bg-green-100 text-green-600' :
          caloriesLevel.level === '中低' ? 'bg-emerald-100 text-emerald-600' :
          caloriesLevel.level === '中' ? 'bg-yellow-100 text-yellow-600' :
          caloriesLevel.level === '高' ? 'bg-orange-100 text-orange-600' :
          'bg-red-100 text-red-600'
        }`}>
          {caloriesLevel.level}热量
        </span>
      </div>
    </button>
  );
}
