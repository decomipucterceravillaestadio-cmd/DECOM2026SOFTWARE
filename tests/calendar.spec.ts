import { test, expect } from '@playwright/test'

test.describe('Calendario Público', () => {
  test('Acceso sin autenticación', async ({ page }) => {
    await page.goto('/calendar')
    
    // Debe cargar sin redirección a login
    await expect(page).toHaveURL('/calendar')
    await expect(page.locator('text=/calendario|calendar/i')).toBeVisible()
  })

  test('Navegación entre meses', async ({ page }) => {
    await page.goto('/calendar')
    
    // Debe tener botones de navegación
    await expect(page.locator('button:has-text("←")')).toBeVisible()
    await expect(page.locator('button:has-text("→")')).toBeVisible()
    
    // Click en mes siguiente
    await page.click('button:has-text("→")')
    
    // Grid debe actualizarse
    await expect(page.locator('.calendar-grid, [class*="grid"]')).toBeVisible()
  })

  test('Mostrar estadísticas públicas', async ({ page }) => {
    await page.goto('/calendar')
    
    // Debe mostrar totales sin datos sensibles
    await expect(page.locator('text=/total|solicitudes/i')).toBeVisible()
  })

  test('Link a crear nueva solicitud', async ({ page }) => {
    await page.goto('/calendar')
    
    const link = page.locator('a[href="/new-request"], button:has-text("Nueva Solicitud")')
    await expect(link).toBeVisible()
  })
})
