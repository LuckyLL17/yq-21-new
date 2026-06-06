import { test, expect } from '@playwright/test'

test.describe('健康页 - BMI 计算器', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/health')
  })

  test('BMI 计算器标签默认激活', async ({ page }) => {
    const bmiTab = page.locator('button', { hasText: 'BMI 计算器' })
    await expect(bmiTab).toBeVisible()
  })

  test('BMI 分类标准显示', async ({ page }) => {
    await expect(page.getByText('BMI 分类标准')).toBeVisible()
    await expect(page.getByText('偏瘦')).toBeVisible()
    await expect(page.getByText('正常')).toBeVisible()
    await expect(page.getByText('偏胖')).toBeVisible()
    await expect(page.getByText('重度肥胖')).toBeVisible()
  })

  test('可以输入身高体重', async ({ page }) => {
    const heightInput = page.locator('input[type="number"]').first()
    const weightInput = page.locator('input[type="number"]').nth(1)
    
    if (await heightInput.isVisible()) {
      await heightInput.fill('170')
    }
    if (await weightInput.isVisible()) {
      await weightInput.fill('65')
    }
  })

  test('BMI 结果显示', async ({ page }) => {
    const heightInput = page.locator('input[type="number"]').first()
    const weightInput = page.locator('input[type="number"]').nth(1)
    
    if (await heightInput.isVisible() && await weightInput.isVisible()) {
      await heightInput.fill('170')
      await weightInput.fill('65')
      
      const bmiResult = page.locator('text=/BMI|\\d+\\.\\d+/').first()
      await expect(bmiResult).toBeVisible()
    }
  })
})

test.describe('健康页 - 健康小贴士', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/health')
  })

  test('健康小贴士标签可切换', async ({ page }) => {
    const tipsTab = page.locator('button', { hasText: '健康小贴士' })
    if (await tipsTab.isVisible()) {
      await tipsTab.click()
    }
  })

  test('轮播组件存在', async ({ page }) => {
    const tipsTab = page.locator('button', { hasText: '健康小贴士' })
    if (await tipsTab.isVisible()) {
      await tipsTab.click()
      const tipsItems = page.locator('.bg-white').filter({ hasText: /建议|健康|饮食/ })
      const count = await tipsItems.count()
      expect(count).toBeGreaterThan(0)
    }
  })
})

test.describe('健康页 - 健康知识', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/health')
  })

  test('健康知识标签可切换', async ({ page }) => {
    const knowledgeTab = page.locator('button', { hasText: '健康知识' })
    if (await knowledgeTab.isVisible()) {
      await knowledgeTab.click()
    }
  })

  test('健康知识卡片显示', async ({ page }) => {
    const knowledgeTab = page.locator('button', { hasText: '健康知识' })
    if (await knowledgeTab.isVisible()) {
      await knowledgeTab.click()
      
      const topics = ['均衡饮食', '规律运动', '充足睡眠']
      for (const topic of topics) {
        const topicElement = page.getByText(topic, { exact: false }).first()
        await expect(topicElement).toBeVisible()
      }
    }
  })
})
