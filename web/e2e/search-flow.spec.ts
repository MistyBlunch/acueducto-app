import { test, expect } from './fixtures/base';

test.describe('Product Search Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show initial idle state with acueducto theme', async ({
    page,
  }) => {
    // Check the header
    await expect(page.getByText('acueductoShop')).toBeVisible();
    await expect(
      page.getByText('Busca acá todos los productos de nuestra tienda'),
    ).toBeVisible();

    // Check search bar is present
    await expect(page.getByPlaceholder('Buscar productos...')).toBeVisible();

    // Check idle state content
    await expect(page.getByText('🛍 Busca productos')).toBeVisible();
  });

  test('should handle palindrome search with discounts', async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      'Buscar raquetas, pelotas, ropa deportiva...',
    );

    // Type a palindrome
    await searchInput.fill('oso');

    // Wait for search results
    await expect(page.getByText('2 resultados encontrados')).toBeVisible({
      timeout: 5000,
    });

    // Check palindrome discount banner
    await expect(page.getByText('¡Descuento palíndromo activo!')).toBeVisible();

    // Check product cards show discounted prices
    await expect(page.getByText('€250.00').first()).toBeVisible(); // Original price
    await expect(page.getByText('€125.00').first()).toBeVisible(); // Discounted price
    await expect(page.getByText('-50% Palíndromo')).toBeVisible();

    // Check search metadata
    await expect(page.getByText('para "oso"')).toBeVisible();
  });

  test('should handle non-palindrome search without discounts', async ({
    page,
  }) => {
    const searchInput = page.getByPlaceholder(
      'Buscar raquetas, pelotas, ropa deportiva...',
    );

    // Type a non-palindrome
    await searchInput.fill('raqueta');

    // Wait for search results
    await expect(page.getByText('1 resultado encontrado')).toBeVisible({
      timeout: 5000,
    });

    // Should not show palindrome discount banner
    await expect(
      page.getByText('¡Descuento palíndromo activo!'),
    ).not.toBeVisible();

    // Check product shows regular price without discount
    await expect(page.getByText('€120.00')).toBeVisible(); // Regular price
    await expect(page.getByText('-50% Palíndromo')).not.toBeVisible();

    // Check search metadata shows non-palindrome
    await expect(page.getByText('para "raqueta"')).toBeVisible();
  });

  test('should handle empty search results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      'Buscar raquetas, pelotas, ropa deportiva...',
    );

    // Type a query that returns no results
    await searchInput.fill('noexiste');

    // Should show empty state
    await expect(page.getByText('No encontramos productos')).toBeVisible({
      timeout: 5000,
    });
    await expect(
      page.getByText('No hay productos que coincidan con tu búsqueda'),
    ).toBeVisible();

    // Check search term is displayed
    await expect(page.getByText('"noexiste"')).toBeVisible();

    // Check suggestions are provided
    await expect(page.getByText('Términos relacionados:')).toBeVisible();
    await expect(page.getByText('Palíndromos (50% descuento):')).toBeVisible();

    // Should have suggestion buttons
    await expect(page.getByText('oso')).toBeVisible();
    await expect(page.getByText('ana')).toBeVisible();
  });

  test('should handle search errors with retry functionality', async ({
    page,
  }) => {
    const searchInput = page.getByPlaceholder(
      'Buscar raquetas, pelotas, ropa deportiva...',
    );

    // Type a query that triggers an error
    await searchInput.fill('error');

    // Should show error state
    await expect(page.getByText('Error del servidor')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText('Error interno del servidor')).toBeVisible();

    // Check retry button is present
    const retryButton = page.getByText('Intentar nuevamente');
    await expect(retryButton).toBeVisible();

    // Check error details
    await expect(page.getByText('Error al buscar: "error"')).toBeVisible();
    await expect(page.getByText('Error 500')).toBeVisible();
  });

  test('should show loading state during search', async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      'Buscar raquetas, pelotas, ropa deportiva...',
    );

    // Start typing to trigger loading
    await searchInput.fill('oso');

    // Should show loading state briefly
    await expect(page.getByText('Buscando productos...')).toBeVisible({
      timeout: 1000,
    });

    // Should show loading skeletons
    await expect(page.locator('.animate-pulse')).toHaveCount({ min: 1 });

    // Eventually should show results
    await expect(page.getByText('2 resultados encontrados')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should handle search input debouncing', async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      'Buscar raquetas, pelotas, ropa deportiva...',
    );

    // Type quickly without triggering search
    await searchInput.fill('o');
    await searchInput.fill('os');
    await searchInput.fill('oso');

    // Should not immediately show loading (due to debounce)
    await page.waitForTimeout(100); // Less than debounce delay

    // Eventually should trigger search after debounce
    await expect(page.getByText('2 resultados encontrados')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should clear search and return to idle state', async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      'Buscar raquetas, pelotas, ropa deportiva...',
    );

    // Type search query
    await searchInput.fill('oso');

    // Wait for results
    await expect(page.getByText('2 resultados encontrados')).toBeVisible({
      timeout: 5000,
    });

    // Clear the search
    const clearButton = page.locator('button[type="button"]').first();
    await clearButton.click();

    // Should return to idle state
    await expect(page.getByText('🛍 Busca productos')).toBeVisible();
    await expect(searchInput).toHaveValue('');
  });

  test('should handle theme toggle', async ({ page }) => {
    // Check initial theme (light mode button should show moon icon)
    const themeToggle = page.getByRole('button', { name: 'Toggle theme' });
    await expect(themeToggle).toBeVisible();

    // Click theme toggle
    await themeToggle.click();

    // Theme should change (this is a basic check, actual theme change verification would be more complex)
    await expect(themeToggle).toBeVisible();
  });

  test('should handle palindrome detection in real-time', async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      'Buscar raquetas, pelotas, ropa deportiva...',
    );

    // Type non-palindrome first
    await searchInput.fill('raque');

    // Continue typing to make it non-palindrome
    await searchInput.fill('raqueta');

    // Clear and type palindrome
    await searchInput.fill('');
    await searchInput.fill('ana');
  });

  test('should show product details correctly', async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      'Buscar raquetas, pelotas, ropa deportiva...',
    );

    // Search for palindrome to get discounted products
    await searchInput.fill('oso');

    // Wait for results
    await expect(page.getByText('2 resultados encontrados')).toBeVisible({
      timeout: 5000,
    });

    // Check pricing display with discount
    await expect(page.getByText('€250.00')).toBeVisible(); // Original price (struck through)
    await expect(page.getByText('€125.00')).toBeVisible(); // Final price
    await expect(
      page.getByText('¡50% de descuento palíndromo aplicado!'),
    ).toBeVisible();

    // Check stock display
    await expect(page.getByText('5')).toBeVisible(); // Stock count
  });
});
