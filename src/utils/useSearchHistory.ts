import { useState, useEffect } from 'react';

const SEARCH_HISTORY_KEY = 'snack_search_history';
const MAX_HISTORY_COUNT = 10;

export interface SearchHistoryItem {
  keyword: string;
  timestamp: number;
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addToHistory = (keyword: string) => {
    if (!keyword.trim()) return;

    const newHistory = history.filter(item => item.keyword !== keyword);
    newHistory.unshift({ keyword, timestamp: Date.now() });
    
    const trimmedHistory = newHistory.slice(0, MAX_HISTORY_COUNT);
    setHistory(trimmedHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmedHistory));
  };

  const removeFromHistory = (keyword: string) => {
    const newHistory = history.filter(item => item.keyword !== keyword);
    setHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  return {
    history: history.map(h => h.keyword),
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}