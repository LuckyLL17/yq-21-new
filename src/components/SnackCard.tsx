import { useNavigate } from 'react-router-dom';
import { ArrowRight, Flame, Heart } from 'lucide-react';
import type { Snack } from '../data/snacks';
import { getCaloriesLevel } from '../utils/calculator';
import { useFavorites } from '../utils/useFavorites';

interface SnackCardProps {
  snack: Snack;
  variant?: 'horizontal' | 'grid';
}

export function SnackCard({ snack, variant = 'grid' }: SnackCardProps) {
  const navigate = useNavigate();
  const caloriesLevel = getCaloriesLevel(snack.calories);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(snack.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(snack);
  };

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
      <div
        className="w-full p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4 card-hover card-shadow cursor-pointer"
        onClick={() => navigate(`/snack/${snack.id}`)}
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
        <button
          onClick={handleFavoriteClick}
          className={`p-2 rounded-full transition-colors ${
            favorited ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Heart className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} />
        </button>
        <ArrowRight className="w-5 h-5 text-gray-300" />
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/snack/${snack.id}`)}
      className="group p-5 bg-white rounded-2xl border border-gray-100 card-hover card-shadow text-left cursor-pointer relative"
    >
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${
          favorited 
            ? 'text-red-500 bg-red-50' 
            : 'text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100'
        }`}
      >
        <Heart className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} />
      </button>
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
    </div>
  );
}
