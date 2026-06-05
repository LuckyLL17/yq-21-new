import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Flame } from 'lucide-react';
import { TAG_INFO, type SnackTag, getAllCategories } from '../data/snacks';
import { useCustomTags } from '../utils/useCustomTags';

interface AdvancedFilterProps {
  selectedTags: string[];
  selectedCategory: string;
  minCalories?: number;
  maxCalories?: number;
  onTagsChange: (tags: string[]) => void;
  onCategoryChange: (category: string) => void;
  onCaloriesChange: (min?: number, max?: number) => void;
}

export function AdvancedFilter({
  selectedTags,
  selectedCategory,
  minCalories,
  maxCalories,
  onTagsChange,
  onCategoryChange,
  onCaloriesChange,
}: AdvancedFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const categories = ['全部', ...getAllCategories()];
  const { customTags } = useCustomTags();
  
  const calorieRanges = [
    { label: '全部', min: undefined, max: undefined },
    { label: '100以下', min: undefined, max: 100 },
    { label: '100-200', min: 100, max: 200 },
    { label: '200-400', min: 200, max: 400 },
    { label: '400以上', min: 400, max: undefined },
  ];

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(t => t !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const clearAllFilters = () => {
    onTagsChange([]);
    onCategoryChange('全部');
    onCaloriesChange(undefined, undefined);
  };

  const activeFiltersCount = 
    selectedTags.length + 
    (selectedCategory !== '全部' ? 1 : 0) + 
    ((minCalories !== undefined || maxCalories !== undefined) ? 1 : 0);

  const getCurrentCalorieLabel = () => {
    const range = calorieRanges.find(
      r => r.min === minCalories && r.max === maxCalories
    );
    return range?.label || '自定义';
  };

  const getTagDisplayInfo = (tagId: string) => {
    const systemTag = TAG_INFO.find(t => t.id === tagId);
    if (systemTag) {
      return { name: systemTag.name, bgColor: systemTag.bgColor, color: systemTag.color, isCustom: false };
    }
    const customTag = customTags.find(t => t.id === tagId);
    if (customTag) {
      return { name: customTag.name, bgColor: '', color: customTag.color, isCustom: true };
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <Filter className="w-5 h-5 text-primary-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">高级筛选</h3>
            <p className="text-sm text-gray-500">
              {activeFiltersCount > 0 
                ? `已选择 ${activeFiltersCount} 个筛选条件` 
                : '按标签、分类、热量范围筛选'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAllFilters();
              }}
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              清除全部
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-6 border-t border-gray-100 pt-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <span>分类</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <span>系统属性标签</span>
              <span className="text-xs text-gray-400">（可多选，同时满足）</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {TAG_INFO.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                    selectedTags.includes(tag.id)
                      ? `${tag.bgColor} ${tag.color} ring-2 ring-offset-1 ring-current shadow-sm`
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {selectedTags.includes(tag.id) && (
                    <X className="w-3.5 h-3.5" />
                  )}
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {customTags.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <span>自定义标签</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {customTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'text-white ring-2 ring-offset-1 ring-opacity-50 shadow-sm'
                          : 'text-white opacity-60 hover:opacity-80'
                      }`}
                      style={{ backgroundColor: tag.color }}
                    >
                      {isSelected && (
                        <X className="w-3.5 h-3.5" />
                      )}
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>热量范围（千卡）</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {calorieRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => onCaloriesChange(range.min, range.max)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    minCalories === range.min && maxCalories === range.max
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeFiltersCount > 0 && !isExpanded && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {selectedCategory !== '全部' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {selectedCategory}
              <button
                onClick={() => onCategoryChange('全部')}
                className="hover:text-red-500 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedTags.map((tagId) => {
            const tagInfo = getTagDisplayInfo(tagId);
            if (!tagInfo) return null;
            return (
              <span
                key={tagId}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  tagInfo.isCustom ? 'text-white' : `${tagInfo.bgColor} ${tagInfo.color}`
                }`}
                style={tagInfo.isCustom ? { backgroundColor: tagInfo.color } : {}}
              >
                {tagInfo.name}
                <button
                  onClick={() => handleTagToggle(tagId)}
                  className="hover:opacity-70 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            );
          })}
          {(minCalories !== undefined || maxCalories !== undefined) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
              {getCurrentCalorieLabel()} 千卡
              <button
                onClick={() => onCaloriesChange(undefined, undefined)}
                className="hover:text-red-500 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
