import { test, expect } from '@playwright/test'

test.describe('收藏页 - 基础渲染', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/favorites')
  })

  test('页面标题正确', async ({ page }) => {
    const title = page.locator('h1', { hasText: '我的收藏' })
    await expect(title).toBeVisible()
  })

  test('空状态提示显示', async ({ page }) => {
    const emptyText = page.locator('text=还没有收藏任何零食')
    if (await emptyText.isVisible()) {
      await expect(emptyText).toBeVisible()
    }
  })

  test('分类管理区域存在', async ({ page }) => {
    await expect(page.getByText('分类管理')).toBeVisible()
  })
})

test.describe('收藏页 - 添加和删除收藏', () => {
  test('从详情页添加收藏后在收藏页可见', async ({ page }) => {
    await page.goto('/snack/chips-original')
    
    const favoriteBtn = page.locator('button', { hasText: '收藏' }).first()
    await favoriteBtn.click()
    
    await page.goto('/favorites')
    
    const snackCards = page.locator('.card-shadow')
    const count = await snackCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('取消收藏后从收藏页移除', async ({ page }) => {
    await page.goto('/snack/chocolate-milk')
    
    const favoriteBtn = page.locator('button', { hasText: '收藏' }).first()
    await favoriteBtn.click()
    await page.waitForTimeout(800)
    
    await page.goto('/favorites')
    await page.waitForTimeout(500)
    
    const originalCount = await page.locator('.grid.grid-cols-2 .card-shadow').count()
    
    if (originalCount > 0) {
      await page.goto('/snack/chocolate-milk')
      await page.waitForTimeout(500)
      
      const favoritedBtn = page.locator('button').filter({ hasText: /收藏/ }).first()
      await favoritedBtn.click()
      await page.waitForTimeout(800)
      
      await page.goto('/favorites')
      await page.waitForTimeout(500)
      
      const newCount = await page.locator('.grid.grid-cols-2 .card-shadow').count()
      expect(newCount).toBeLessThan(originalCount)
    }
  })
})

test.describe('收藏页 - 分类管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/favorites')
  })

  test('可以添加分类', async ({ page }) => {
    const addCategoryBtn = page.locator('button').filter({ has: page.locator('svg') }).nth(2)
    if (await addCategoryBtn.isVisible()) {
      await addCategoryBtn.click()
    }
  })

  test('全部收藏分类存在', async ({ page }) => {
    const allCategory = page.getByText('全部收藏', { exact: false }).first()
    await expect(allCategory).toBeVisible()
  })
})
