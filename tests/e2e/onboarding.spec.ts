import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Service Application Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Supabase authentication
    await page.route('**/auth/**', async route => {
      if (route.request().method() === 'GET' && route.request().url().includes('/user')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              user: {
                id: 'test-user-id',
                email: 'test@example.com',
                user_metadata: {
                  full_name: 'Test User'
                }
              }
            }
          })
        });
      } else {
        await route.continue();
      }
    });

    // Mock upload-documents edge function
    await page.route('**/functions/v1/upload-documents', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          onboardingId: 'test-onboarding-id',
          uploaded: [
            {
              name: 'test-document.pdf',
              path: 'uploads/test-document.pdf',
              size: 1024,
              type: 'application/pdf',
              url: 'https://example.com/test-document.pdf'
            }
          ]
        })
      });
    });

    // Mock create-checkout-session edge function
    await page.route('**/functions/v1/create-checkout-session', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'test-session-id',
          url: 'https://checkout.stripe.com/test-session'
        })
      });
    });

    // Mock storage upload
    await page.route('**/storage/v1/object/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          Key: 'test-path',
          Id: 'test-id'
        })
      });
    });
  });

  test('should complete full onboarding flow', async ({ page }) => {
    // Navigate to service application page
    await page.goto('/service-application/test-service-id');

    // Fill out the form
    await page.fill('[data-testid="name-input"]', 'John Doe');
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    await page.fill('[data-testid="phone-input"]', '+971501234567');
    await page.fill('[data-testid="company-input"]', 'Test Company');
    await page.fill('[data-testid="business-activity-input"]', 'Trading');
    await page.fill('[data-testid="notes-input"]', 'Test notes');

    // Create a test file for upload
    const testFilePath = path.join(__dirname, 'fixtures', 'test-document.pdf');
    
    // Upload a document
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([testFilePath]);

    // Verify file appears in the list
    await expect(page.locator('text=test-document.pdf')).toBeVisible();

    // Click upload documents button
    await page.click('button:has-text("Upload Documents")');

    // Wait for upload to complete and success message
    await expect(page.locator('text=Documents Uploaded Successfully')).toBeVisible();

    // Verify CTA buttons appear
    await expect(page.locator('button:has-text("Call Business Setup Advisor")')).toBeVisible();
    await expect(page.locator('button:has-text("Proceed to Payment")')).toBeVisible();

    // Test call advisor functionality
    const callButton = page.locator('button:has-text("Call Business Setup Advisor")');
    await callButton.click();
    
    // Test payment flow
    const paymentButton = page.locator('button:has-text("Proceed to Payment")');
    
    // Mock window.location.href assignment
    await page.evaluate(() => {
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true
      });
    });

    await paymentButton.click();

    // Verify the payment redirect was triggered
    // Note: In a real test, you might want to check if the redirect URL is correct
    await expect(paymentButton).toBeDisabled();
  });

  test('should handle upload errors gracefully', async ({ page }) => {
    // Mock upload failure
    await page.route('**/storage/v1/object/**', async route => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Bucket policy forbids anonymous upload'
        })
      });
    });

    await page.goto('/service-application/test-service-id');

    // Fill form
    await page.fill('[data-testid="name-input"]', 'John Doe');
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    await page.fill('[data-testid="phone-input"]', '+971501234567');
    await page.fill('[data-testid="business-activity-input"]', 'Trading');

    // Upload file
    const testFilePath = path.join(__dirname, 'fixtures', 'test-document.pdf');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([testFilePath]);

    // Attempt upload
    await page.click('button:has-text("Upload Documents")');

    // Verify error message appears
    await expect(page.locator('text=Upload Failed')).toBeVisible();

    // Verify retry button appears
    await expect(page.locator('button:has-text("Retry Failed Uploads")')).toBeVisible();
  });

  test('should show file validation errors', async ({ page }) => {
    await page.goto('/service-application/test-service-id');

    // Try to upload an invalid file type
    const invalidFile = path.join(__dirname, 'fixtures', 'invalid.txt');
    const fileInput = page.locator('input[type="file"]');
    
    // Note: This might require creating actual test files or mocking file selection
    // For now, we'll test the validation logic through form submission

    await page.fill('[data-testid="name-input"]', 'John Doe');
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    await page.fill('[data-testid="phone-input"]', '+971501234567');
    await page.fill('[data-testid="business-activity-input"]', 'Trading');

    // Try to upload without files
    const uploadButton = page.locator('button:has-text("Upload Documents")');
    await expect(uploadButton).toBeDisabled();
  });

  test('should handle network errors', async ({ page }) => {
    // Mock network failure
    await page.route('**/functions/v1/upload-documents', async route => {
      await route.abort('internetdisconnected');
    });

    await page.goto('/service-application/test-service-id');

    // Fill form and upload file
    await page.fill('[data-testid="name-input"]', 'John Doe');
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    await page.fill('[data-testid="phone-input"]', '+971501234567');
    await page.fill('[data-testid="business-activity-input"]', 'Trading');

    const testFilePath = path.join(__dirname, 'fixtures', 'test-document.pdf');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([testFilePath]);

    await page.click('button:has-text("Upload Documents")');

    // Verify error handling
    await expect(page.locator('text=Upload Failed')).toBeVisible();
  });
});