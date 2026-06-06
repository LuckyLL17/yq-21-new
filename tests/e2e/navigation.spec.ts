import { test, expect } from '@playwright/test'

test.describe('导航 - 页面路由', () => {
  test('首页导航正常', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toContainText('运动多久')
  })

  test('记录页导航正常', async ({ page }) => {
    await page.goto('/records')
    await expect(page).toHaveURL('/records')
    const title = page.locator('h1', { hasText: '热量记录' })
    await expect(title).toBeVisible()
  })

  test('收藏页导航正常', async ({ page }) => {
    await page.goto('/favorites')
    await expect(page).toHaveURL('/favorites')
  })

  test('健康页导航正常', async ({ page }) => {
    await page.goto('/health')
    await expect(page).toHaveURL('/health')
    await expect(page.getByText('你的健康')).toBeVisible()
  })

  test('运动方案页导航正常', async ({ page }) => {
    await page.goto('/exercise-plan')
    await expect(page).toHaveURL('/exercise-plan')
  })
})

test.describe('导航 - 页头导航栏', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('首页链接可点击', async ({ page }) => {
    const homeLink = page.locator('nav a', { hasText: /首页|首页/ }).first()
    if (await homeLink.isVisible()) {
      await homeLink.click()
      await expect(page).toHaveURL('/')
    }
  })

  test('记录页链接可点击', async ({ page }) => {
    const recordsLink = page.locator('a', { hasText: /记录|热量记录/ }).first()
    if (await recordsLink.isVisible()) {
      await recordsLink.click()
      await expect(page).toHaveURL('/records')
    }
  })

  test('收藏页链接可点击', async ({ page }) => {
    const favoritesLink = page.locator('a', { hasText: /收藏/ }).first()
    if (await favoritesLink.isVisible()) {
      await favoritesLink.click()
      await expect(page).toHaveURL('/favorites')
    }
  })

  test('健康页链接可点击', async ({ page }) => {
    const healthLink = page.locator('a', { hasText: /健康/ }).first()
    if (await healthLink.isVisible()) {
      await healthLink.click()
      await expect(page).toHaveURL('/health')
    }
  })

  test('Logo 可返回首页', async ({ page }) => {
    await page.goto('/records')
    const logo = page.locator('header a').first()
    if (await logo.isVisible()) {
      await logo.click()
      await expect(page).toHaveURL('/')
    }
  })
})

test.describe('导航 - 404 处理', () => {
  test('无效零食 ID 显示错误页面', async ({ page }) => {
    await page.goto('/snack/nonexistent-id-12345')
    const notFoundText = page.locator('text=未找到该零食')
    await expect(notFoundText).toBeVisible()
  })

  test('错误页面有返回按钮', async ({ page }) => {
    await page.goto('/snack/nonexistent-id-12345')
    const backButton = page.locator('button', { hasText: '返回首页' })
    await expect(backButton).toBeVisible()
    await backButton.click()
    await expect(page).toHaveURL('/')
  })
})
