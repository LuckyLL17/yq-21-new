import { useState, useEffect } from 'react';
import type { Snack } from '../data/snacks';

const BROWSING_HISTORY_KEY = 'snack_browsing_history';
const MAX_HISTORY_COUNT = 10;

export interface BrowsingHistoryItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  servingSize: string;
  timestamp: number;
}

export function useBrowsingHistory() {
  const [history, setHistory] = useState<BrowsingHistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(BROWSING_HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addToHistory = (snack: Snack) => {
    const newHistory = history.filter(item => item.id !== snack.id);
    newHistory.unshift({
      id: snack.id,
      name: snack.name,
      category: snack.category,
      calories: snack.calories,
      servingSize: snack.servingSize,
      timestamp: Date.now(),
    });
    
    const trimmedHistory = newHistory.slice(0, MAX_HISTORY_COUNT);
    setHistory(trimmedHistory);
    localStorage.setItem(BROWSING_HISTORY_KEY, JSON.stringify(trimmedHistory));
  };

  const removeFromHistory = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem(BROWSING_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(BROWSING_HISTORY_KEY);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
