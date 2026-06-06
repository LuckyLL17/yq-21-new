import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface CustomTag {
  id: string
  name: string
  color: string
}

interface SnackTagsMap {
  [snackId: string]: string[]
}

const TAGS_STORAGE_KEY = 'snack_custom_tags'
const SNACK_TAGS_STORAGE_KEY = 'snack_tags_mapping'

const defaultColors = [
  '#EF4444',
  '#F97316',
  '#EAB308',
  '#22C55E',
  '#14B8A6',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#F43F5E',
  '#6B7280',
]

interface CustomTagsContextType {
  customTags: CustomTag[]
  addCustomTag: (name: string, color?: string) => CustomTag
  removeCustomTag: (tagId: string) => void
  updateCustomTag: (tagId: string, name: string, color: string) => void
  getSnackTags: (snackId: string) => string[]
  addTagToSnack: (snackId: string, tagId: string) => void
  removeTagFromSnack: (snackId: string, tagId: string) => void
  toggleTagOnSnack: (snackId: string, tagId: string) => void
  hasTagOnSnack: (snackId: string, tagId: string) => boolean
  getSnacksByTag: (tagId: string) => string[]
  defaultColors: string[]
}

const CustomTagsContext = createContext<CustomTagsContextType | undefined>(undefined)

export function CustomTagsProvider({ children }: { children: ReactNode }) {
  const [customTags, setCustomTags] = useState<CustomTag[]>([])
  const [snackTagsMap, setSnackTagsMap] = useState<SnackTagsMap>({})

  useEffect(() => {
    const savedTags = localStorage.getItem(TAGS_STORAGE_KEY)
    const savedMappings = localStorage.getItem(SNACK_TAGS_STORAGE_KEY)

    if (savedTags) {
      try {
        setCustomTags(JSON.parse(savedTags))
      } catch (e) {
        console.error('Failed to parse custom tags from localStorage')
      }
    }

    if (savedMappings) {
      try {
        setSnackTagsMap(JSON.parse(savedMappings))
      } catch (e) {
        console.error('Failed to parse snack tags from localStorage')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(customTags))
  }, [customTags])

  useEffect(() => {
    localStorage.setItem(SNACK_TAGS_STORAGE_KEY, JSON.stringify(snackTagsMap))
  }, [snackTagsMap])

  const addCustomTag = useCallback(
    (name: string, color?: string): CustomTag => {
      const newTag: CustomTag = {
        id: `custom_${Date.now()}`,
        name: name.trim(),
        color: color || defaultColors[customTags.length % defaultColors.length],
      }
      setCustomTags((prev) => [...prev, newTag])
      return newTag
    },
    [customTags.length],
  )

  const removeCustomTag = useCallback((tagId: string) => {
    setCustomTags((prev) => prev.filter((t) => t.id !== tagId))
    setSnackTagsMap((prev) => {
      const newMap = { ...prev }
      Object.keys(newMap).forEach((snackId) => {
        newMap[snackId] = newMap[snackId].filter((id) => id !== tagId)
      })
      return newMap
    })
  }, [])

  const updateCustomTag = useCallback((tagId: string, name: string, color: string) => {
    setCustomTags((prev) =>
      prev.map((t) => (t.id === tagId ? { ...t, name: name.trim(), color } : t)),
    )
  }, [])

  const getSnackTags = useCallback(
    (snackId: string): string[] => {
      return snackTagsMap[snackId] || []
    },
    [snackTagsMap],
  )

  const addTagToSnack = useCallback((snackId: string, tagId: string) => {
    setSnackTagsMap((prev) => {
      const currentTags = prev[snackId] || []
      if (currentTags.includes(tagId)) return prev
      return {
        ...prev,
        [snackId]: [...currentTags, tagId],
      }
    })
  }, [])

  const removeTagFromSnack = useCallback((snackId: string, tagId: string) => {
    setSnackTagsMap((prev) => {
      const currentTags = prev[snackId] || []
      return {
        ...prev,
        [snackId]: currentTags.filter((id) => id !== tagId),
      }
    })
  }, [])

  const toggleTagOnSnack = useCallback((snackId: string, tagId: string) => {
    setSnackTagsMap((prev) => {
      const currentTags = prev[snackId] || []
      if (currentTags.includes(tagId)) {
        return {
          ...prev,
          [snackId]: currentTags.filter((id) => id !== tagId),
        }
      } else {
        return {
          ...prev,
          [snackId]: [...currentTags, tagId],
        }
      }
    })
  }, [])

  const hasTagOnSnack = useCallback(
    (snackId: string, tagId: string): boolean => {
      return snackTagsMap[snackId]?.includes(tagId) || false
    },
    [snackTagsMap],
  )

  const getSnacksByTag = useCallback(
    (tagId: string): string[] => {
      return Object.entries(snackTagsMap)
        .filter(([, tags]) => tags.includes(tagId))
        .map(([snackId]) => snackId)
    },
    [snackTagsMap],
  )

  return (
    <CustomTagsContext.Provider
      value={{
        customTags,
        addCustomTag,
        removeCustomTag,
        updateCustomTag,
        getSnackTags,
        addTagToSnack,
        removeTagFromSnack,
        toggleTagOnSnack,
        hasTagOnSnack,
        getSnacksByTag,
        defaultColors,
      }}
    >
      {children}
    </CustomTagsContext.Provider>
  )
}

export function useCustomTags() {
  const context = useContext(CustomTagsContext)
  if (context === undefined) {
    throw new Error('useCustomTags must be used within a CustomTagsProvider')
  }
  return context
}
