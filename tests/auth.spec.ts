import { test, expect } from '@playwright/test'

test.describe('Autenticación', () => {
  test('Login exitoso con credenciales válidas', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[type="email"]', 'admin@decom.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL(/\/admin/)
  })

  test('Login fallido con credenciales inválidas', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[type="email"]', 'invalid@test.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=/error|incorrec|invalid/i')).toBeVisible()
  })

  test('Acceso denegado a rutas admin sin login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)
  })
})
