import { useNavigate } from 'react-router-dom';
import { Flame, Zap, Heart, ArrowRight, Info } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { SnackCard } from '../components/SnackCard';
import { getPopularSnacks, findSnackByName } from '../data/snacks';

export function Home() {
  const navigate = useNavigate();
  const popularSnacks = getPopularSnacks(8);

  const handleQuickSearch = (keyword: string) => {
    const results = findSnackByName(keyword);
    if (results.length > 0) {
      navigate(`/snack/${results[0].id}`);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative gradient-bg py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200/50 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-200/50 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-primary-700 font-medium mb-6">
            <Heart className="w-4 h-4" />
            <span>健康饮食，从了解开始</span>
          </div>
          
          <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
            想知道吃了零食要
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {' '}运动多久{' '}
            </span>
            才能消耗？
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            输入你想吃的零食，立即查看热量信息、运动消耗对比，以及更健康的低热量替代品推荐
          </p>
          
          <div className="max-w-xl mx-auto">
            <SearchBar variant="hero" />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-gray-500">
            <span>试试：</span>
            {['薯片', '巧克力', '冰淇淋', '珍珠奶茶'].map((item) => (
              <button
                key={item}
                onClick={() => handleQuickSearch(item)}
                className="px-3 py-1 bg-white/70 rounded-full cursor-pointer hover:bg-white transition-colors hover:text-primary-600"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-poppins text-2xl md:text-3xl font-bold text-gray-800">
                热门零食
              </h2>
              <p className="text-gray-500 mt-2">点击查看详细热量信息</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {popularSnacks.map((snack) => (
              <SnackCard key={snack.id} snack={snack} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-gray-800">
              为什么使用零食热量计算器？
            </h2>
            <p className="text-gray-500 mt-2">帮助你做出更明智的饮食选择</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 md:p-8 bg-white rounded-3xl card-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-5">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-poppins text-xl font-semibold text-gray-800 mb-3">
                真实数据
              </h3>
              <p className="text-gray-500 leading-relaxed">
                所有热量数据来源于权威营养数据库，确保信息准确可靠，帮助你了解真实的热量摄入
              </p>
            </div>
            
            <div className="p-6 md:p-8 bg-white rounded-3xl card-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-5">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-poppins text-xl font-semibold text-gray-800 mb-3">
                直观对比
              </h3>
              <p className="text-gray-500 leading-relaxed">
                将零食热量转化为具体的运动时间，让你直观感受到"一袋薯片 = 爬楼梯15分钟"的概念
              </p>
            </div>
            
            <div className="p-6 md:p-8 bg-white rounded-3xl card-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-5">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-poppins text-xl font-semibold text-gray-800 mb-3">
                健康推荐
              </h3>
              <p className="text-gray-500 leading-relaxed">
                智能推荐热量更低的同类零食，在满足口腹之欲的同时，减少不必要的热量摄入
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-poppins text-2xl font-bold mb-2">数据说明</h3>
                  <p className="text-white/80 leading-relaxed">
                    运动消耗计算基于65kg体重的成年人，使用MET（代谢当量）公式计算。
                    实际消耗可能因个人体重、运动强度、身体状况等因素有所差异。
                    本工具仅供参考，不构成专业医疗建议。
                  </p>
                </div>
              </div>
              
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-white/90 transition-colors">
                了解更多
                <ArrowRight className="w-5 h-5" />
              </button>
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
