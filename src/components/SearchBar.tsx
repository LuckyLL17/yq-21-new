import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { findSnackByName, type Snack } from '../data/snacks';

interface SearchBarProps {
  variant?: 'hero' | 'normal';
}

export function SearchBar({ variant = 'hero' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Snack[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      const results = findSnackByName(query);
      setSuggestions(results.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (snack?: Snack) => {
    if (snack) {
      navigate(`/snack/${snack.id}`);
    } else if (suggestions.length > 0) {
      navigate(`/snack/${suggestions[0].id}`);
    }
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const isHero = variant === 'hero';

  return (
    <div className="relative w-full" ref={inputRef}>
      <div className={`relative flex items-center ${
        isHero 
          ? 'h-14 md:h-16' 
          : 'h-12'
      }`}>
        <Search className={`absolute left-4 ${isHero ? 'w-6 h-6' : 'w-5 h-5'} text-gray-400`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={isHero ? '输入零食名称，如：薯片' : '搜索零食...'}
          className={`w-full h-full pl-12 pr-12 rounded-2xl border-2 ${
            isHero 
              ? 'text-lg rounded-3xl' 
              : 'text-base'
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

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {suggestions.map((snack) => (
            <button
              key={snack.id}
              onClick={() => handleSearch(snack)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-primary-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                <span className="text-lg">🍪</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{snack.name}</p>
                <p className="text-sm text-gray-500">{snack.servingSize} · {snack.calories} 千卡</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && query && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center z-50">
          <p className="text-gray-500">未找到相关零食</p>
          <p className="text-sm text-gray-400 mt-1">试试其他关键词，如"薯片"、"巧克力"</p>
        </div>
      )}
    </div>
  );
}
