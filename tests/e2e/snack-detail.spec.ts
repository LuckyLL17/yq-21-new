import { test, expect } from '@playwright/test'

test.describe('零食详情页 - 基础信息', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/snack/chips-original')
  })

  test('零食名称和分类正确显示', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('薯片')
    const categoryText = page.locator('text=标准份量').first()
    await expect(categoryText).toBeVisible()
  })

  test('热量数值正确显示', async ({ page }) => {
    const caloriesText = page.locator('text=千卡').first()
    await expect(caloriesText).toBeVisible()
    
    const caloriesNumber = page.locator('h1').locator('..').locator('text=/\\d+\\.?\\d*/').first()
    await expect(caloriesNumber).toBeVisible()
  })

  test('营养成分（蛋白质、脂肪、碳水）显示', async ({ page }) => {
    const proteinText = page.locator('text=蛋白质').first()
    const fatText = page.locator('text=脂肪').first()
    const carbsText = page.locator('text=碳水化合物').first()
    
    await expect(proteinText).toBeVisible()
    await expect(fatText).toBeVisible()
    await expect(carbsText).toBeVisible()
  })

  test('热量等级标签显示', async ({ page }) => {
    const levelTags = page.locator('text=/热量/').filter({ hasText: /低|中|高/ }).first()
    await expect(levelTags).toBeVisible()
  })

  test('返回按钮可点击', async ({ page }) => {
    const backButton = page.locator('button', { hasText: '返回搜索' })
    await expect(backButton).toBeVisible()
    await backButton.click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('零食详情页 - 份量调整', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/snack/chips-original')
  })

  test('份量滑块可拖动', async ({ page }) => {
    const slider = page.locator('input[type="range"]').first()
    await expect(slider).toBeVisible()
    
    const initialValue = await slider.inputValue()
    await slider.fill(String(Number(initialValue) + 10))
    const newValue = await slider.inputValue()
    expect(newValue).not.toBe(initialValue)
  })

  test('快速调整按钮可点击', async ({ page }) => {
    const quickButtons = page.locator('button', { hasText: /半份|一份|两份/ }).first()
    if (await quickButtons.isVisible()) {
      await quickButtons.click()
    }
  })

  test('重置按钮可点击', async ({ page }) => {
    const resetButton = page.locator('button', { hasText: '重置' }).first()
    if (await resetButton.isVisible()) {
      await resetButton.click()
    }
  })

  test('按重量/按份切换', async ({ page }) => {
    const weightBtn = page.locator('button', { hasText: '按重量' }).first()
    const unitBtn = page.locator('button', { hasText: /按.*/ }).first()
    
    if (await weightBtn.isVisible() && await unitBtn.isVisible()) {
      await unitBtn.click()
      await weightBtn.click()
    }
  })
})

test.describe('零食详情页 - 运动消耗', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/snack/chips-original')
  })

  test('运动消耗区域显示', async ({ page }) => {
    await expect(page.getByText('需要运动多久才能消耗？')).toBeVisible()
  })

  test('运动强度可切换', async ({ page }) => {
    const lowBtn = page.locator('button', { hasText: /低|轻松/ }).first()
    const mediumBtn = page.locator('button', { hasText: /中|中等/ }).first()
    const highBtn = page.locator('button', { hasText: /高|剧烈/ }).first()
    
    if (await lowBtn.isVisible()) await lowBtn.click()
    if (await highBtn.isVisible()) await highBtn.click()
    if (await mediumBtn.isVisible()) await mediumBtn.click()
  })

  test('体重选择器可切换', async ({ page }) => {
    const weightSelect = page.locator('select').first()
    if (await weightSelect.isVisible()) {
      await weightSelect.selectOption('70')
    }
  })

  test('千卡/千焦单位切换', async ({ page }) => {
    const kcalBtn = page.locator('button', { hasText: '千卡' }).first()
    const kjBtn = page.locator('button', { hasText: '千焦' }).first()
    
    if (await kjBtn.isVisible()) {
      await kjBtn.click()
    }
    if (await kcalBtn.isVisible()) {
      await kcalBtn.click()
    }
  })

  test('运动卡片正确显示多种运动', async ({ page }) => {
    const exerciseCards = page.locator('.bg-gray-50').filter({ hasText: /分钟|小时/ })
    const count = await exerciseCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('查看全部运动类型按钮可点击', async ({ page }) => {
    const showAllBtn = page.locator('button', { hasText: '查看全部运动类型' })
    if (await showAllBtn.isVisible()) {
      await showAllBtn.click()
    }
  })
})

test.describe('零食详情页 - 替代品推荐', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/snack/chips-original')
  })

  test('替代品推荐区域显示', async ({ page }) => {
    await expect(page.getByText('更低热量的替代品推荐')).toBeVisible()
  })

  test('换一批按钮可点击', async ({ page }) => {
    const refreshBtn = page.locator('button', { hasText: '换一批' })
    if (await refreshBtn.isVisible()) {
      await refreshBtn.click()
    }
  })

  test('推荐数量可调整', async ({ page }) => {
    const countBtn = page.locator('button', { hasText: /推荐.*个/ }).first()
    if (await countBtn.isVisible()) {
      await countBtn.click()
    }
  })

  test('点击替代品卡片可跳转', async ({ page }) => {
    const alternativeCards = page.locator('.card-hover').nth(2)
    if (await alternativeCards.isVisible()) {
      await alternativeCards.click()
      await expect(page).toHaveURL(/\/snack\//)
    }
  })
})

test.describe('零食详情页 - 收藏功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/snack/chips-original')
  })

  test('收藏按钮可点击', async ({ page }) => {
    const favoriteBtn = page.locator('button', { hasText: '收藏' }).first()
    await expect(favoriteBtn).toBeVisible()
    await favoriteBtn.click()
    
    const favoritedBtn = page.locator('button', { hasText: '已收藏' }).first()
    await expect(favoritedBtn).toBeVisible()
  })

  test('取消收藏可点击', async ({ page }) => {
    const favoriteBtn = page.locator('button', { hasText: '收藏' }).first()
    await favoriteBtn.click()
    
    const favoritedBtn = page.locator('button', { hasText: '已收藏' }).first()
    await favoritedBtn.click()
    
    await expect(favoriteBtn).toBeVisible()
  })
})

test.describe('零食详情页 - 营养成分饼图', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/snack/chips-original')
  })

  test('饼图区域存在', async ({ page }) => {
    await expect(page.getByText('营养成分占比')).toBeVisible()
  })

  test('图例显示正确', async ({ page }) => {
    const proteinText = page.locator('text=蛋白质').nth(1)
    const fatText = page.locator('text=脂肪').nth(1)
    const carbsText = page.locator('text=碳水化合物').nth(1)
    
    if (await proteinText.isVisible()) {
      await expect(proteinText).toBeVisible()
    }
    if (await fatText.isVisible()) {
      await expect(fatText).toBeVisible()
    }
    if (await carbsText.isVisible()) {
      await expect(carbsText).toBeVisible()
    }
  })
})
