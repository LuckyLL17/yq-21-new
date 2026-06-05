import { useState } from 'react';
import { Heart, Apple, Dumbbell, Moon, Droplets, Leaf } from 'lucide-react';
import { BMICalculator } from '../components/BMICalculator';
import { HealthTipsCarousel } from '../components/HealthTipsCarousel';
import { getHealthTipByIndex } from '../utils/calculator';

export function Health() {
  const [activeTab, setActiveTab] = useState<'bmi' | 'tips' | 'knowledge'>('bmi');

  const healthKnowledge = [
    {
      icon: Apple,
      title: '均衡饮食',
      description: '每天摄入五谷杂粮、蔬菜水果、优质蛋白，保证营养全面均衡',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Dumbbell,
      title: '规律运动',
      description: '每周至少150分钟中等强度运动，结合有氧和力量训练',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: Moon,
      title: '充足睡眠',
      description: '成年人每天保证7-8小时睡眠，有利于身体恢复和新陈代谢',
      color: 'from-purple-400 to-violet-500'
    },
    {
      icon: Droplets,
      title: '多喝水',
      description: '每天饮用1500-2000ml水，促进新陈代谢和废物排出',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      icon: Leaf,
      title: '多吃蔬果',
      description: '每天摄入500g以上蔬菜水果，补充维生素和膳食纤维',
      color: 'from-lime-400 to-green-500'
    },
    {
      icon: Heart,
      title: '保持心态',
      description: '保持积极乐观的心态，减少压力，有益于身心健康',
      color: 'from-pink-400 to-rose-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 font-medium mb-4">
            <Heart className="w-4 h-4" />
            <span>健康生活</span>
          </div>
          <h1 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            你的健康，我们在乎
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            使用BMI计算器了解你的身体状况，获取个性化的健康建议和零食推荐
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab('bmi')}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'bmi'
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              BMI 计算器
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'tips'
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              健康小贴士
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'knowledge'
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              健康知识
            </button>
          </div>
        </div>

        {activeTab === 'bmi' && (
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <BMICalculator />
            </div>
            <div className="space-y-6">
              <HealthTipsCarousel />
              
              <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-6">
                <h3 className="font-semibold text-gray-800 mb-4">BMI 分类标准</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">偏瘦</div>
                      <div className="text-xs text-gray-500">BMI ＜ 18.5</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">正常</div>
                      <div className="text-xs text-gray-500">18.5 ≤ BMI ＜ 24</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">偏胖</div>
                      <div className="text-xs text-gray-500">24 ≤ BMI ＜ 28</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">肥胖</div>
                      <div className="text-xs text-gray-500">28 ≤ BMI ＜ 32</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">重度肥胖</div>
                      <div className="text-xs text-gray-500">BMI ≥ 32</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                  以上为中国成年人BMI标准，仅供参考。如有健康问题，请咨询专业医生。
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="max-w-3xl mx-auto">
            <HealthTipsCarousel interval={8000} />
            
            <div className="mt-8 grid gap-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 border border-gray-100 card-shadow flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {index + 1}. {getHealthTipByIndex(index)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthKnowledge.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 card-shadow card-hover"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-poppins text-xl font-semibold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-white rounded-3xl p-8 md:p-10 border border-gray-100 card-shadow">
              <div className="text-center mb-8">
                <h2 className="font-poppins text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  健康生活小建议
                </h2>
                <p className="text-gray-500">养成这些好习惯，让健康成为生活的一部分</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">三餐定时定量</h4>
                    <p className="text-sm text-gray-500">
                      保持规律的饮食习惯，早餐吃好，午餐吃饱，晚餐吃少，避免暴饮暴食。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">细嚼慢咽</h4>
                    <p className="text-sm text-gray-500">
                      每口食物咀嚼20-30次，用餐时间不少于20分钟，有助于消化和控制食量。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">适量运动</h4>
                    <p className="text-sm text-gray-500">
                      每天抽出30分钟运动，可以是散步、慢跑、游泳等，选择自己喜欢的方式。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">减少久坐</h4>
                    <p className="text-sm text-gray-500">
                      每坐1小时起身活动5分钟，伸展身体，保护颈椎和腰椎健康。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">充足睡眠</h4>
                    <p className="text-sm text-gray-500">
                      每天保证7-8小时睡眠，尽量在晚上11点前入睡，养成规律作息。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">6</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">保持心情愉悦</h4>
                    <p className="text-sm text-gray-500">
                      学会调节情绪，保持积极乐观的心态，心理健康同样重要。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
