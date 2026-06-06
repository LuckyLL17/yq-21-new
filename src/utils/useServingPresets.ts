import { useState, useEffect, useCallback } from 'react';
import type { Snack } from '../data/snacks';
import { getDefaultPresets } from './serving';

export interface ServingPreset {
  id: string;
  name: string;
  weightGrams: number;
  createdAt: number;
}

const STORAGE_KEY = 'snack_serving_presets';

function loadPresets(): Record<string, ServingPreset[]> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load serving presets from localStorage');
  }
  return {};
}

function savePresets(presets: Record<string, ServingPreset[]>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (e) {
    console.error('Failed to save serving presets to localStorage');
  }
}

export function useServingPresets(snack?: Snack) {
  const [allPresets, setAllPresets] = useState<Record<string, ServingPreset[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const presets = loadPresets();
    setAllPresets(presets);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      savePresets(allPresets);
    }
  }, [allPresets, isLoaded]);

  const snackId = snack?.id || '';
  const snackPresets = allPresets[snackId] || [];
  const defaultPresets = snack ? getDefaultPresets(snack).map((p, i) => ({
    id: `default-${i}`,
    name: p.name,
    weightGrams: p.weightGrams,
    createdAt: 0,
    isDefault: true,
  })) : [];

  const allSnackPresets = [...defaultPresets, ...snackPresets];

  const addPreset = useCallback((name: string, weightGrams: number) => {
    if (!snackId) return;

    const newPreset: ServingPreset = {
      id: `preset_${Date.now()}`,
      name,
      weightGrams,
      createdAt: Date.now(),
    };

    setAllPresets(prev => ({
      ...prev,
      [snackId]: [...(prev[snackId] || []), newPreset],
    }));

    return newPreset;
  }, [snackId]);

  const removePreset = useCallback((presetId: string) => {
    if (!snackId) return;

    setAllPresets(prev => ({
      ...prev,
      [snackId]: (prev[snackId] || []).filter(p => p.id !== presetId),
    }));
  }, [snackId]);

  const updatePreset = useCallback((presetId: string, name: string, weightGrams: number) => {
    if (!snackId) return;

    setAllPresets(prev => ({
      ...prev,
      [snackId]: (prev[snackId] || []).map(p =>
        p.id === presetId ? { ...p, name, weightGrams } : p
      ),
    }));
  }, [snackId]);

  return {
    presets: allSnackPresets,
    customPresets: snackPresets,
    defaultPresets,
    addPreset,
    removePreset,
    updatePreset,
    isLoaded,
  };
}
