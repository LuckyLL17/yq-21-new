import { useNavigate } from 'react-router-dom';
import { Flame, ArrowRight, TrendingDown } from 'lucide-react';
import type { Snack } from '../data/snacks';

interface AlternativeCardProps {
  snack: Snack;
  originalCalories: number;
}

export function AlternativeCard({ snack, originalCalories }: AlternativeCardProps) {
  const navigate = useNavigate();
  const savedCalories = originalCalories - snack.calories;
  const savedPercent = Math.round((savedCalories / originalCalories) * 100);

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
    <button
      onClick={() => navigate(`/snack/${snack.id}`)}
      className="w-full p-5 bg-white rounded-2xl border border-gray-100 card-hover card-shadow text-left group"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-gray-800 truncate">{snack.name}</h4>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{snack.servingSize}</p>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-800">{snack.calories} 千卡</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full">
              <TrendingDown className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-600">少 {savedPercent}%</span>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            可减少约 {savedCalories} 千卡摄入
          </p>
        </div>
      </div>
    </button>
  );
}
