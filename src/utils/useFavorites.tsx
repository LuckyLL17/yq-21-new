import { useState, useEffect, useCallback } from 'react';
import type { Snack } from '../data/snacks';

export interface FavoriteItem {
  snackId: string;
  snack: Snack;
  favoritedAt: number;
  categoryIds: string[];
}

export interface FavoriteCategory {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export type SortField = 'name' | 'calories' | 'favoritedAt';
export type SortOrder = 'asc' | 'desc';

const STORAGE_KEY = 'snack_favorites';
const CATEGORIES_KEY = 'snack_favorite_categories';

const defaultCategories: FavoriteCategory[] = [
  {
    id: 'all',
    name: '全部收藏',
    color: '#3B82F6',
    createdAt: Date.now()
  }
];

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [categories, setCategories] = useState<FavoriteCategory[]>(defaultCategories);
  const [sortField, setSortField] = useState<SortField>('favoritedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    const savedFavorites = localStorage.getItem(STORAGE_KEY);
    const savedCategories = localStorage.getItem(CATEGORIES_KEY);
    
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites from localStorage');
      }
    }
    
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        setCategories([...defaultCategories, ...parsed]);
      } catch (e) {
        console.error('Failed to parse categories from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const customCategories = categories.filter(c => c.id !== 'all');
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(customCategories));
  }, [categories]);

  const isFavorite = useCallback((snackId: string) => {
    return favorites.some(f => f.snackId === snackId);
  }, [favorites]);

  const addFavorite = useCallback((snack: Snack, categoryIds: string[] = []) => {
    setFavorites(prev => {
      if (prev.some(f => f.snackId === snack.id)) {
        return prev;
      }
      return [...prev, {
        snackId: snack.id,
        snack,
        favoritedAt: Date.now(),
        categoryIds
      }];
    });
  }, []);

  const removeFavorite = useCallback((snackId: string) => {
    setFavorites(prev => prev.filter(f => f.snackId !== snackId));
  }, []);

  const toggleFavorite = useCallback((snack: Snack) => {
    if (isFavorite(snack.id)) {
      removeFavorite(snack.id);
    } else {
      addFavorite(snack);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const addCategory = useCallback((name: string, color: string) => {
    const newCategory: FavoriteCategory = {
      id: `cat_${Date.now()}`,
      name,
      color,
      createdAt: Date.now()
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const removeCategory = useCallback((categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    setFavorites(prev => prev.map(f => ({
      ...f,
      categoryIds: f.categoryIds.filter(id => id !== categoryId)
    })));
  }, []);

  const updateCategory = useCallback((categoryId: string, name: string, color: string) => {
    setCategories(prev => prev.map(c => 
      c.id === categoryId ? { ...c, name, color } : c
    ));
  }, []);

  const setSnackCategories = useCallback((snackId: string, categoryIds: string[]) => {
    setFavorites(prev => prev.map(f => 
      f.snackId === snackId ? { ...f, categoryIds } : f
    ));
  }, []);

  const getFavoritesByCategory = useCallback((categoryId: string) => {
    let filtered: FavoriteItem[];
    
    if (categoryId === 'all') {
      filtered = [...favorites];
    } else {
      filtered = favorites.filter(f => f.categoryIds.includes(categoryId));
    }

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.snack.name.localeCompare(b.snack.name);
          break;
        case 'calories':
          comparison = a.snack.calories - b.snack.calories;
          break;
        case 'favoritedAt':
          comparison = a.favoritedAt - b.favoritedAt;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [favorites, sortField, sortOrder]);

  return {
    favorites,
    categories,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    addCategory,
    removeCategory,
    updateCategory,
    setSnackCategories,
    getFavoritesByCategory
  };
}
