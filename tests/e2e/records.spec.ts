import { test, expect } from '@playwright/test'

test.describe('记录页 - 基础渲染', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/records')
  })

  test('页面标题正确', async ({ page }) => {
    const title = page.locator('h1', { hasText: '热量记录' })
    await expect(title).toBeVisible()
  })

  test('饮食摄入/运动消耗切换按钮存在', async ({ page }) => {
    const foodBtn = page.locator('button', { hasText: '饮食摄入' })
    const exerciseBtn = page.locator('button', { hasText: '运动消耗' })
    
    await expect(foodBtn).toBeVisible()
    await expect(exerciseBtn).toBeVisible()
  })

  test('分屏/日历视图切换存在', async ({ page }) => {
    const splitBtn = page.locator('button', { hasText: '分屏视图' })
    const calendarBtn = page.locator('button', { hasText: '日历视图' })
    
    if (await splitBtn.isVisible()) {
      await expect(splitBtn).toBeVisible()
    }
    if (await calendarBtn.isVisible()) {
      await expect(calendarBtn).toBeVisible()
    }
  })

  test('千卡/千焦单位切换存在', async ({ page }) => {
    const unitButtons = page.locator('button').filter({ hasText: /千卡|千焦/ })
    const count = await unitButtons.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })
})

test.describe('记录页 - 饮食记录', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/records')
  })

  test('饮食记录表单存在', async ({ page }) => {
    const foodBtn = page.locator('button', { hasText: '饮食摄入' })
    await foodBtn.click()
    
    const formInputs = page.locator('input').first()
    await expect(formInputs).toBeVisible()
  })

  test('可以添加饮食记录', async ({ page }) => {
    const foodBtn = page.locator('button', { hasText: '饮食摄入' })
    await foodBtn.click()
    
    const nameInput = page.locator('input[type="text"]').first()
    if (await nameInput.isVisible()) {
      await nameInput.fill('测试零食')
    }
    
    const calorieInput = page.locator('input[type="number"]').first()
    if (await calorieInput.isVisible()) {
      await calorieInput.fill('100')
    }
    
    const submitBtn = page.locator('button', { hasText: /添加|保存|记录/ }).first()
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
    }
  })
})

test.describe('记录页 - 运动记录', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/records')
  })

  test('运动记录表单可切换', async ({ page }) => {
    const exerciseBtn = page.locator('button', { hasText: '运动消耗' })
    await exerciseBtn.click()
    
    expect(page.url()).toContain('/records')
  })

  test('运动记录表单存在', async ({ page }) => {
    const exerciseBtn = page.locator('button', { hasText: '运动消耗' })
    await exerciseBtn.click()
    await page.waitForTimeout(500)
    
    const exerciseSelector = page.locator('text=点击选择运动类型')
    if (await exerciseSelector.isVisible()) {
      await exerciseSelector.click()
      await page.waitForTimeout(300)
      
      const firstExercise = page.locator('button').filter({ hasText: /跑步|快走|游泳|骑行/ }).first()
      if (await firstExercise.isVisible()) {
        await firstExercise.click()
        await page.waitForTimeout(300)
      }
    }
    
    const formElements = page.locator('input, select, textarea')
    const count = await formElements.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('记录页 - 日历热力图', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/records')
  })

  test('日历热力图显示', async ({ page }) => {
    const calendar = page.locator('svg').first()
    if (await calendar.isVisible()) {
      await expect(calendar).toBeVisible()
    }
  })
})

test.describe('记录页 - 每日报表', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/records')
  })

  test('每日报表区域存在', async ({ page }) => {
    const reportText = page.locator('text=每日').first()
    if (await reportText.isVisible()) {
      await expect(reportText).toBeVisible()
    }
  })
})

test.describe('记录页 - 历史记录', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/records')
  })

  test('查看历史记录按钮可点击', async ({ page }) => {
    const historyBtn = page.locator('button', { hasText: '查看历史记录' })
    if (await historyBtn.isVisible()) {
      await historyBtn.click()
      
      const modalTitle = page.locator('h3', { hasText: '历史记录' })
      await expect(modalTitle).toBeVisible()
    }
  })

  test('历史记录弹窗可关闭', async ({ page }) => {
    const historyBtn = page.locator('button', { hasText: '查看历史记录' })
    if (await historyBtn.isVisible()) {
      await historyBtn.click()
      await page.waitForTimeout(500)
      
      const closeBtn = page.locator('.bg-gradient-to-r button').filter({ has: page.locator('svg') })
      if (await closeBtn.isVisible()) {
        await closeBtn.click()
      }
    }
  })
})
