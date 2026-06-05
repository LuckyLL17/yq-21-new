import { useState } from 'react';
import { Target, Clock, Flame, Dumbbell, ChevronDown, ChevronUp, Zap, Leaf, Sparkles } from 'lucide-react';
import { generateExercisePlans, formatTime, getWeightOptions, type ExercisePlan } from '../utils/calculator';

const difficultyConfig = {
  easy: { label: '简单', color: 'bg-green-100 text-green-700', icon: Leaf },
  medium: { label: '中等', color: 'bg-yellow-100 text-yellow-700', icon: Zap },
  hard: { label: '困难', color: 'bg-red-100 text-red-700', icon: Flame }
};

const planIcons: Record<string, typeof Dumbbell> = {
  'quick-fat-burn': Flame,
  'balanced': Dumbbell,
  'easy': Leaf,
  'variety': Sparkles
};

export function ExercisePlan() {
  const [targetCalories, setTargetCalories] = useState<number>(300);
  const [weight, setWeight] = useState<number>(65);
  const [plans, setPlans] = useState<ExercisePlan[]>([]);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = () => {
    const generatedPlans = generateExercisePlans(targetCalories, weight);
    setPlans(generatedPlans);
    setHasGenerated(true);
  };

  const calorieOptions = [100, 200, 300, 400, 500, 600, 800, 1000];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative gradient-bg py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200/50 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-200/50 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-primary-700 font-medium mb-6">
            <Target className="w-4 h-4" />
            <span>智能运动方案</span>
          </div>
          
          <h1 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4">
            根据目标热量
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {' '}生成运动方案{' '}
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            输入你想要消耗的热量，为你生成个性化的运动组合方案
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 card-shadow mb-8">
            <h2 className="font-poppins text-xl font-semibold text-gray-800 mb-6">
              设置你的目标
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  目标消耗热量（千卡）
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {calorieOptions.map((cal) => (
                    <button
                      key={cal}
                      onClick={() => setTargetCalories(cal)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        targetCalories === cal
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cal}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(Math.max(50, Number(e.target.value) || 0))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="或输入自定义热量"
                  min="50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  你的体重（公斤）
                </label>
                <select
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                >
                  {getWeightOptions().map((w) => (
                    <option key={w} value={w}>
                      {w} 公斤
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  用于更精确地计算运动消耗
                </p>
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg hover:shadow-xl"
            >
              生成运动方案
            </button>
          </div>

          {hasGenerated && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-poppins text-2xl font-bold text-gray-800">
                    推荐方案
                  </h2>
                  <p className="text-gray-500">共 {plans.length} 种运动方案可选</p>
                </div>
              </div>
              
              {plans.map((plan) => {
                const Icon = planIcons[plan.id] || Dumbbell;
                const DifficultyIcon = difficultyConfig[plan.difficulty].icon;
                const isExpanded = expandedPlan === plan.id;
                
                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-2xl card-shadow overflow-hidden transition-all"
                  >
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="font-poppins text-lg font-semibold text-gray-800 mb-1">
                              {plan.name}
                            </h3>
                            <p className="text-gray-500 text-sm mb-3">
                              {plan.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${difficultyConfig[plan.difficulty].color}`}>
                                <DifficultyIcon className="w-3.5 h-3.5" />
                                {difficultyConfig[plan.difficulty].label}
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                {formatTime(plan.totalMinutes)}
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                                <Flame className="w-4 h-4" />
                                约 {plan.totalCalories} 千卡
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 py-4">详细安排</h4>
                        <div className="space-y-3">
                          {plan.items.map((item, index) => {
                            const ExerciseIcon = item.exercise.icon;
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <ExerciseIcon className="w-5 h-5 text-primary-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {item.exercise.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {item.minutes} {item.exercise.unit}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-primary-600">
                                    +{item.caloriesBurned}
                                  </p>
                                  <p className="text-xs text-gray-500">千卡</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">总计</span>
                            <div className="text-right">
                              <p className="font-poppins font-bold text-lg text-gray-800">
                                {formatTime(plan.totalMinutes)}
                              </p>
                              <p className="text-sm text-primary-600 font-medium">
                                消耗 {plan.totalCalories} 千卡
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <h3 className="font-poppins text-2xl font-bold mb-3">温馨提示</h3>
              <p className="text-white/80 leading-relaxed">
                运动消耗计算基于MET（代谢当量）公式，实际消耗可能因个人体质、运动强度、环境因素等有所差异。
                建议运动前做好热身，根据自身情况合理调整运动强度。如有健康问题，请先咨询专业医生。
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 零食热量计算器 · 让健康饮食更简单
          </p>
        </div>
      </footer>
    </div>
  );
}
