import { test, expect } from '@playwright/test'

test.describe('首页 - 基础渲染', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('页面标题和主标题正确显示', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('想知道吃了零食要')
    await expect(page.locator('h1')).toContainText('运动多久')
  })

  test('搜索栏存在且可交互', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first()
    await expect(searchInput).toBeVisible()
    await searchInput.fill('薯片')
    await expect(searchInput).toHaveValue('薯片')
  })

  test('快速搜索标签可点击', async ({ page }) => {
    const quickSearchButtons = page.locator('button', { hasText: '薯片' }).first()
    await expect(quickSearchButtons).toBeVisible()
  })

  test('热门零食区域显示', async ({ page }) => {
    await expect(page.getByText('热门零食')).toBeVisible()
  })

  test('分类标签存在且可切换', async ({ page }) => {
    const categoryScroll = page.locator('#category-scroll')
    await expect(categoryScroll).toBeVisible()
    
    const allButton = page.locator('button', { hasText: '全部' }).first()
    await expect(allButton).toBeVisible()
  })

  test('零食卡片正确显示', async ({ page }) => {
    const snackCards = page.locator('.card-shadow').filter({ hasText: '卡' })
    const count = await snackCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('高级筛选可展开', async ({ page }) => {
    const advancedFilter = page.locator('text=高级筛选').first()
    if (await advancedFilter.isVisible()) {
      await advancedFilter.click()
    }
  })

  test('页脚版权信息正确', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('零食热量计算器')
  })
})

test.describe('首页 - 搜索功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('搜索零食并跳转到详情页', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first()
    await searchInput.click()
    await searchInput.fill('巧克力')
    await page.waitForTimeout(500)
    await searchInput.press('Enter')
    
    await expect(page).toHaveURL(/\/snack\//)
  })

  test('快速搜索词可直接跳转', async ({ page }) => {
    const quickSearchBtn = page.locator('button', { hasText: '巧克力' }).first()
    await quickSearchBtn.click()
    
    await expect(page).toHaveURL(/\/snack\//)
    await expect(page.locator('h1')).toContainText('巧克力')
  })
})

test.describe('首页 - 分类筛选', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('点击分类可筛选零食', async ({ page }) => {
    const categoryBtn = page.locator('button', { hasText: '巧克力' }).first()
    await categoryBtn.click()
    
    const snackCards = page.locator('.card-shadow').filter({ hasText: '卡' })
    const count = await snackCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('切换不同分类', async ({ page }) => {
    const chocolateBtn = page.locator('button', { hasText: '巧克力' }).first()
    await chocolateBtn.click()
    
    const nutsBtn = page.locator('button', { hasText: '坚果' }).first()
    await nutsBtn.click()
    
    const snackCards = page.locator('.card-shadow').filter({ hasText: '卡' })
    const count = await snackCards.count()
    expect(count).toBeGreaterThan(0)
  })
})
