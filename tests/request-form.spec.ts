import { test, expect } from '@playwright/test'

test.describe('Formulario de Solicitudes', () => {
  test('Crear solicitud completa - flujo 2 pasos', async ({ page }) => {
    await page.goto('/new-request')
    
    // Paso 1: Información básica
    await page.fill('input[name="event_name"]', 'Congreso de Jóvenes 2026')
    await page.fill('input[name="event_date"]', '2026-02-15')
    await page.selectOption('select[name="material_type"]', 'poster')
    await page.fill('input[name="quantity"]', '500')
    await page.selectOption('select[name="committee_id"]', { index: 1 })
    
    await page.click('button:has-text("Siguiente")')
    
    // Paso 2: Información de contacto
    await page.fill('input[name="contact_name"]', 'Juan Pérez')
    await page.fill('input[name="contact_email"]', 'juan@test.com')
    await page.fill('input[name="contact_whatsapp"]', '3001234567')
    await page.fill('textarea[name="special_instructions"]', 'Necesito diseño personalizado')
    
    await page.click('button[type="submit"]')
    
    // Verificar redirección a página de confirmación
    await expect(page).toHaveURL(/\/confirmation/)
    await expect(page.locator('text=/solicitud.*enviada|éxito/i')).toBeVisible()
  })

  test('Validación de campos requeridos - Paso 1', async ({ page }) => {
    await page.goto('/new-request')
    
    await page.click('button:has-text("Siguiente")')
    
    // Debe mostrar errores de validación
    await expect(page.locator('text=/requerido|obligatorio/i')).toBeVisible()
  })
})
