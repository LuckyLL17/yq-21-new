import { useState, useMemo } from 'react';
import { Scale, Ruler, Target, Lightbulb, ArrowRight } from 'lucide-react';
import {
  calculateBMI,
  getBMICategory,
  getIdealWeightRange,
  type BMIResult
} from '../utils/bmi';
import { getSnackCalorieLimit } from '../utils/snack';
import { snacks } from '../data/snacks';
import { useNavigate } from 'react-router-dom';

export function BMICalculator() {
  const navigate = useNavigate();
  const [height, setHeight] = useState<string>('170');
  const [weight, setWeight] = useState<string>('65');
  const [showResult, setShowResult] = useState(false);

  const bmiResult: BMIResult = useMemo(() => {
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    if (isNaN(heightNum) || isNaN(weightNum) || heightNum <= 0 || weightNum <= 0) {
      return getBMICategory(0);
    }
    const bmi = calculateBMI(heightNum, weightNum);
    return getBMICategory(bmi);
  }, [height, weight]);

  const idealWeightRange = useMemo(() => {
    const heightNum = parseFloat(height);
    if (isNaN(heightNum) || heightNum <= 0) {
      return { min: 0, max: 0 };
    }
    return getIdealWeightRange(heightNum);
  }, [height]);

  const snackCalorieLimit = useMemo(() => {
    return getSnackCalorieLimit(bmiResult.category);
  }, [bmiResult.category]);

  const recommendedSnacks = useMemo(() => {
    return snacks
      .filter(s => s.calories <= snackCalorieLimit.limit)
      .sort((a, b) => b.calories - a.calories)
      .slice(0, 4);
  }, [snackCalorieLimit.limit]);

  const handleCalculate = () => {
    setShowResult(true);
  };

  const getBMIProgress = (bmi: number) => {
    if (bmi <= 0) return 0;
    if (bmi < 15) return 0;
    if (bmi > 40) return 100;
    return ((bmi - 15) / 25) * 100;
  };

  const getBMIProgressColor = (category: string) => {
    switch (category) {
      case 'underweight': return 'from-blue-400 to-blue-500';
      case 'normal': return 'from-green-400 to-green-500';
      case 'overweight': return 'from-yellow-400 to-yellow-500';
      case 'obese': return 'from-orange-400 to-orange-500';
      case 'severely-obese': return 'from-red-400 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 card-shadow overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-poppins text-xl md:text-2xl font-bold text-gray-800">
              BMI 计算器
            </h2>
            <p className="text-sm text-gray-500">了解您的身体质量指数</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-gray-400" />
                身高 (cm)
              </span>
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => {
                setHeight(e.target.value);
                setShowResult(false);
              }}
              placeholder="请输入身高"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-gray-400" />
                体重 (kg)
              </span>
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                setShowResult(false);
              }}
              placeholder="请输入体重"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-lg"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-200 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Target className="w-5 h-5" />
          计算 BMI
        </button>

        {showResult && bmiResult.bmi > 0 && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className={`w-32 h-32 rounded-full ${bmiResult.bgColor} flex items-center justify-center`}>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${bmiResult.color}`}>
                      {bmiResult.bmi}
                    </div>
                    <div className={`text-sm font-medium ${bmiResult.color}`}>
                      {bmiResult.categoryName}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{bmiResult.description}</p>
            </div>

            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-blue-200" />
                <div className="flex-1 bg-green-200" />
                <div className="flex-1 bg-yellow-200" />
                <div className="flex-1 bg-orange-200" />
                <div className="flex-1 bg-red-200" />
              </div>
              <div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getBMIProgressColor(bmiResult.category)} rounded-full transition-all duration-700`}
                style={{ width: `${getBMIProgress(bmiResult.bmi)}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-primary-500 transition-all duration-700"
                style={{ left: `calc(${getBMIProgress(bmiResult.bmi)}% - 8px)` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 -mt-4">
              <span>15</span>
              <span>18.5</span>
              <span>24</span>
              <span>28</span>
              <span>32</span>
              <span>40</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="text-sm text-gray-500 mb-1">理想体重范围</div>
                <div className="text-lg font-bold text-gray-800">
                  {idealWeightRange.min} - {idealWeightRange.max} kg
                </div>
              </div>
              <div className={`p-4 ${bmiResult.bgColor} rounded-2xl`}>
                <div className="text-sm text-gray-500 mb-1">每日零食热量建议</div>
                <div className={`text-lg font-bold ${bmiResult.color}`}>
                  ≤ {snackCalorieLimit.limit} 千卡
                </div>
              </div>
            </div>

            <div className="p-5 bg-primary-50 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-primary-800">健康建议</span>
              </div>
              <ul className="space-y-2">
                {bmiResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-primary-700">
                    <span className="text-primary-400 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {recommendedSnacks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">推荐零食</h3>
                  <button
                    onClick={() => navigate('/')}
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    查看更多
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {recommendedSnacks.map((snack) => (
                    <div
                      key={snack.id}
                      onClick={() => navigate(`/snack/${snack.id}`)}
                      className="p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-gray-800 text-sm truncate">
                        {snack.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {snack.calories} 千卡
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
