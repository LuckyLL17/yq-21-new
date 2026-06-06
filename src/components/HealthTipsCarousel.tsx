import { useState, useEffect, useCallback } from 'react'
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { getHealthTipByIndex, getHealthTipsCount } from '../utils/health'

interface HealthTipsCarouselProps {
  autoPlay?: boolean
  interval?: number
}

export function HealthTipsCarousel({ autoPlay = true, interval = 5000 }: HealthTipsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const totalTips = getHealthTipsCount()

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalTips)
  }, [totalTips])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalTips) % totalTips)
  }, [totalTips])

  const goToTip = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  useEffect(() => {
    if (!autoPlay || isHovered) return

    const timer = setInterval(() => {
      goToNext()
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, isHovered, interval, goToNext])

  const currentTip = getHealthTipByIndex(currentIndex)

  return (
    <div
      className="relative bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-6 md:p-8 text-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-poppins text-lg font-bold">每日健康小贴士</h3>
            <p className="text-sm text-white/70">
              第 {currentIndex + 1} / {totalTips} 条
            </p>
          </div>
        </div>

        <div className="min-h-[80px] flex items-center">
          <p className="text-lg md:text-xl leading-relaxed transition-all duration-500">
            {currentTip}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goToPrev}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="上一条"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(totalTips, 10) }).map((_, index) => {
              const displayIndex =
                totalTips > 10 ? Math.floor(currentIndex / 10) * 10 + index : index
              if (displayIndex >= totalTips) return null
              return (
                <button
                  key={displayIndex}
                  onClick={() => goToTip(displayIndex)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === displayIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`第 ${displayIndex + 1} 条小贴士`}
                />
              )
            })}
          </div>

          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="下一条"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
