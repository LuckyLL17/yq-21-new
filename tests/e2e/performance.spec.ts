import { test, expect } from '@playwright/test'

test.describe('性能测试 - 页面加载', () => {
  test('首页加载时间 < 3秒', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime
    
    console.log(`首页加载时间: ${loadTime}ms`)
    expect(loadTime).toBeLessThan(3000)
  })

  test('零食详情页加载时间 < 3秒', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/snack/chips-original')
    const loadTime = Date.now() - startTime
    
    console.log(`零食详情页加载时间: ${loadTime}ms`)
    expect(loadTime).toBeLessThan(3000)
  })

  test('记录页加载时间 < 3秒', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/records')
    const loadTime = Date.now() - startTime
    
    console.log(`记录页加载时间: ${loadTime}ms`)
    expect(loadTime).toBeLessThan(3000)
  })

  test('健康页加载时间 < 3秒', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/health')
    const loadTime = Date.now() - startTime
    
    console.log(`健康页加载时间: ${loadTime}ms`)
    expect(loadTime).toBeLessThan(3000)
  })
})

test.describe('性能测试 - 首屏渲染', () => {
  test('首页 FCP (First Contentful Paint) 指标', async ({ page }) => {
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcpEntry = entries.find((e) => e.name === 'first-contentful-paint')
          if (fcpEntry) {
            observer.disconnect()
            resolve(fcpEntry.startTime)
          }
        })
        observer.observe({ type: 'paint', buffered: true })
        setTimeout(() => resolve(0), 5000)
      })
    })
    console.log(`首页 FCP: ${fcp}ms`)
  })

  test('首页 DOMContentLoaded 时间', async ({ page }) => {
    const metrics: any = {}
    
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    
    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as any
      return {
        domContentLoaded: nav?.domContentLoadedEventEnd || 0,
        loadEvent: nav?.loadEventEnd || 0,
        domInteractive: nav?.domInteractive || 0,
      }
    })
    
    console.log('首页性能指标:', timing)
    metrics.domContentLoaded = timing.domContentLoaded
    
    expect(timing.domContentLoaded).toBeLessThan(3000)
  })
})

test.describe('性能测试 - 交互响应', () => {
  test('搜索输入响应时间', async ({ page }) => {
    await page.goto('/')
    
    const searchInput = page.locator('input[type="text"]').first()
    await searchInput.click()
    
    const startTime = Date.now()
    await searchInput.fill('巧克力')
    await page.waitForTimeout(200)
    const fillTime = Date.now() - startTime
    
    console.log(`搜索输入响应时间: ${fillTime}ms`)
    expect(fillTime).toBeLessThan(1000)
  })

  test('分类切换响应时间', async ({ page }) => {
    await page.goto('/')
    
    const categoryBtn = page.locator('button', { hasText: '巧克力' }).first()
    
    const startTime = Date.now()
    await categoryBtn.click()
    await page.waitForTimeout(100)
    const clickTime = Date.now() - startTime
    
    console.log(`分类切换响应时间: ${clickTime}ms`)
    expect(clickTime).toBeLessThan(500)
  })

  test('份量滑块拖动响应时间', async ({ page }) => {
    await page.goto('/snack/chips-original')
    
    const slider = page.locator('input[type="range"]').first()
    
    const startTime = Date.now()
    await slider.fill('150')
    await page.waitForTimeout(100)
    const changeTime = Date.now() - startTime
    
    console.log(`份量滑块响应时间: ${changeTime}ms`)
    expect(changeTime).toBeLessThan(500)
  })
})

test.describe('性能测试 - 网络资源', () => {
  test('首页资源请求数量', async ({ page }) => {
    const requests: string[] = []
    
    page.on('request', (request) => {
      requests.push(request.url())
    })
    
    await page.goto('/')
    
    const uniqueRequests = [...new Set(requests)]
    console.log(`首页资源请求数量: ${uniqueRequests.length}`)
    
    expect(uniqueRequests.length).toBeLessThan(100)
  })

  test('首页总传输大小', async ({ page }) => {
    let totalSize = 0
    
    page.on('response', async (response) => {
      try {
        const headers = response.headers()
        if (headers['content-length']) {
          totalSize += parseInt(headers['content-length'], 10)
        }
      } catch (e) {
      }
    })
    
    await page.goto('/')
    
    console.log(`首页总传输大小: ${(totalSize / 1024).toFixed(2)} KB`)
  })
})
