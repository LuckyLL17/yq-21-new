import { useNavigate } from 'react-router-dom'
import { Flame, ArrowRight, TrendingDown, Sparkles, CheckCircle2 } from 'lucide-react'
import type { AlternativeRecommendation } from '../data/snacks'

interface AlternativeCardProps {
  recommendation: AlternativeRecommendation
}

export function AlternativeCard({ recommendation }: AlternativeCardProps) {
  const navigate = useNavigate()
  const { snack, tasteSimilarity, reasons, isSameCategory, caloriesSaved, caloriesSavedPercent } =
    recommendation

  const categoryEmojis: Record<string, string> = {
    膨化食品: '🍿',
    巧克力: '🍫',
    饼干: '🍪',
    冰淇淋: '🍦',
    糖果: '🍬',
    坚果: '🥜',
    油炸食品: '🍟',
    糕点: '🍩',
    果干: '🥭',
    乳制品: '🥛',
    饮料: '🧋',
    方便食品: '🍜',
  }

  const emoji = categoryEmojis[snack.category] || '🍴'

  const tasteSimilarityConfig = {
    高: { color: 'text-emerald-600', bgColor: 'bg-emerald-100', borderColor: 'border-emerald-200' },
    中: { color: 'text-amber-600', bgColor: 'bg-amber-100', borderColor: 'border-amber-200' },
    低: { color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-200' },
  }

  const similarityStyle = tasteSimilarityConfig[tasteSimilarity]

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

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-800">{snack.calories} 千卡</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full">
              <TrendingDown className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-600">少 {caloriesSavedPercent}%</span>
            </div>
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${similarityStyle.bgColor} ${similarityStyle.borderColor} border`}
            >
              <Sparkles className="w-3 h-3" style={{ color: 'inherit' }} />
              <span className={`text-xs font-medium ${similarityStyle.color}`}>
                口味相似度 {tasteSimilarity}
              </span>
            </div>
            {isSameCategory && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-primary-100 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-primary-600" />
                <span className="text-xs font-medium text-primary-600">同类推荐</span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-700 mb-1.5">推荐理由</p>
            <ul className="space-y-1">
              {reasons.map((reason, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-green-600 mt-2 font-medium">
            可减少约 {caloriesSaved} 千卡摄入
          </p>
        </div>
      </div>
    </button>
  )
}
