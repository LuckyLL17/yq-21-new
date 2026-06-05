import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { findSnacksGroupedByCategory, getHotSearchKeywords, type Snack } from '../data/snacks';
import { useSearchHistory } from '../utils/useSearchHistory';

interface SearchBarProps {
  variant?: 'hero' | 'normal';
}

function HighlightText({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword.trim()) return <span>{text}</span>;
  
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.map((part, index) => 
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={index} className="text-primary-600 font-semibold bg-primary-50 px-0.5 rounded">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}

export function SearchBar({ variant = 'hero' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [groupedResults, setGroupedResults] = useState<Record<string, Snack[]>>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'hot' | 'results'>('history');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  const hotKeywords = getHotSearchKeywords();

  useEffect(() => {
    if (query.trim()) {
      const results = findSnacksGroupedByCategory(query);
      setGroupedResults(results);
      setActiveTab('results');
    } else {
      setGroupedResults({});
      setActiveTab('history');
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (snack?: Snack) => {
    if (snack) {
      addToHistory(snack.name);
      navigate(`/snack/${snack.id}`);
    } else if (query.trim()) {
      addToHistory(query);
    }
    setShowDropdown(false);
    setQuery('');
  };

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
    addToHistory(keyword);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setQuery('');
    setGroupedResults({});
  };

  const totalResults = Object.values(groupedResults).reduce((sum, arr) => sum + arr.length, 0);
  const isHero = variant === 'hero';

  return (
    <div className="relative w-full">
      <div className={`relative flex items-center ${isHero ? 'h-14 md:h-16' : 'h-12'}`} ref={inputRef}>
        <Search className={`absolute left-4 ${isHero ? 'w-6 h-6' : 'w-5 h-5'} text-gray-400`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const firstCategory = Object.keys(groupedResults)[0];
              if (firstCategory && groupedResults[firstCategory].length > 0) {
                handleSearch(groupedResults[firstCategory][0]);
              } else {
                handleSearch();
              }
            }
          }}
          placeholder={isHero ? '输入零食名称，如：薯片' : '搜索零食...'}
          className={`w-full h-full pl-12 pr-12 rounded-2xl border-2 ${
            isHero ? 'text-lg rounded-3xl' : 'text-base'
          } border-gray-200 bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none placeholder:text-gray-400`}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className={`${isHero ? 'w-5 h-5' : 'w-4 h-4'} text-gray-400`} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          style={{ maxHeight: '500px', overflowY: 'auto' }}
        >
          {!query && (
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  搜索历史
                </span>
              </button>
              <button
                onClick={() => setActiveTab('hot')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'hot'
                    ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  热门搜索
                </span>
              </button>
            </div>
          )}

          {activeTab === 'history' && !query && (
            <div className="p-4">
              {history.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">最近搜索</span>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      清空
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {history.map((item) => (
                      <div key={item} className="flex items-center gap-1">
                        <button
                          onClick={() => handleKeywordClick(item)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3 text-gray-400" />
                          {item}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(item);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无搜索历史</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'hot' && !query && (
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-3">热门搜索榜</div>
              <div className="space-y-1">
                {hotKeywords.map((item, index) => (
                  <button
                    key={item.keyword}
                    onClick={() => handleKeywordClick(item.keyword)}
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      index < 3 
                        ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="flex-1 text-gray-700 font-medium">{item.keyword}</span>
                    <span className="text-xs text-gray-400">{item.count.toLocaleString()} 次搜索</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'results' && query && (
            <div>
              {totalResults > 0 ? (
                <div className="p-2">
                  <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    找到 {totalResults} 个结果
                  </div>
                  {Object.entries(groupedResults).map(([category, snacks]) => (
                    <div key={category} className="mb-2">
                      <div className="px-3 py-2 text-xs font-semibold text-primary-600 bg-primary-50/50 rounded-lg mx-2 mb-1">
                        {category} ({snacks.length})
                      </div>
                      {snacks.map((snack) => (
                        <button
                          key={snack.id}
                          onClick={() => handleSearch(snack)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left rounded-xl mx-2 w-[calc(100%-16px)]"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">🍪</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              <HighlightText text={snack.name} keyword={query} />
                            </p>
                            <p className="text-sm text-gray-500">
                              {snack.servingSize} · {snack.calories} 千卡
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-600 font-medium">未找到相关零食</p>
                  <p className="text-sm text-gray-400 mt-1">试试其他关键词，如"薯片"、"巧克力"</p>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                    {['薯片', '巧克力', '奶茶'].map((item) => (
                      <button
                        key={item}
                        onClick={() => handleKeywordClick(item)}
                        className="px-3 py-1 bg-primary-50 text-primary-600 text-sm rounded-full hover:bg-primary-100 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}