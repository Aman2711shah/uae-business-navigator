import { describe, it, expect } from 'vitest';
import { 
  serviceApplicationSchema, 
  uploadDocumentsRequestSchema,
  createCheckoutSessionSchema,
  validateFile,
  formatValidationErrors
} from '../lib/validations';

describe('Service Application Validation', () => {
  describe('serviceApplicationSchema', () => {
    it('should validate correct form data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+971501234567',
        company: 'Test Company',
        businessActivity: 'Trading',
        notes: 'Some notes'
      };

      const result = serviceApplicationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '+971501234567',
        businessActivity: 'Trading'
      };

      const result = serviceApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(e => e.path.includes('email'))).toBe(true);
      }
    });

    it('should reject short name', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        phone: '+971501234567',
        businessActivity: 'Trading'
      };

      const result = serviceApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(e => e.path.includes('name'))).toBe(true);
      }
    });

    it('should reject missing business activity', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+971501234567',
        businessActivity: ''
      };

      const result = serviceApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(e => e.path.includes('businessActivity'))).toBe(true);
      }
    });
  });

  describe('uploadDocumentsRequestSchema', () => {
    it('should validate correct upload request', () => {
      const validData = {
        userName: 'John Doe',
        userEmail: 'john@example.com',
        contactInfo: {
          phone: '+971501234567',
          company: 'Test Company',
          businessActivity: 'Trading',
          notes: 'Some notes'
        },
        documents: [{
          name: 'test.pdf',
          path: 'uploads/test.pdf',
          size: 1024,
          type: 'application/pdf',
          url: 'https://example.com/test.pdf'
        }]
      };

      const result = uploadDocumentsRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty documents array', () => {
      const invalidData = {
        userName: 'John Doe',
        userEmail: 'john@example.com',
        contactInfo: {
          phone: '+971501234567',
          businessActivity: 'Trading'
        },
        documents: []
      };

      const result = uploadDocumentsRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(e => e.path.includes('documents'))).toBe(true);
      }
    });
  });

  describe('createCheckoutSessionSchema', () => {
    it('should validate correct checkout session request', () => {
      const validData = {
        onboardingId: '550e8400-e29b-41d4-a716-446655440000',
        customerEmail: 'john@example.com',
        amount: 4999,
        currency: 'usd'
      };

      const result = createCheckoutSessionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const invalidData = {
        onboardingId: 'invalid-uuid',
        customerEmail: 'john@example.com'
      };

      const result = createCheckoutSessionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(e => e.path.includes('onboardingId'))).toBe(true);
      }
    });

    it('should reject negative amount', () => {
      const invalidData = {
        onboardingId: '550e8400-e29b-41d4-a716-446655440000',
        customerEmail: 'john@example.com',
        amount: -100
      };

      const result = createCheckoutSessionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(e => e.path.includes('amount'))).toBe(true);
      }
    });
  });
});

describe('File Validation', () => {
  // Mock File constructor for testing
  const createMockFile = (name: string, size: number, type: string): File => {
    const file = new Blob(['test content'], { type });
    Object.defineProperty(file, 'name', { value: name });
    Object.defineProperty(file, 'size', { value: size });
    return file as File;
  };

  it('should validate correct PDF file', () => {
    const file = createMockFile('test.pdf', 1024 * 1024, 'application/pdf');
    const result = validateFile(file);
    expect(result.isValid).toBe(true);
  });

  it('should validate correct PNG file', () => {
    const file = createMockFile('test.png', 1024 * 1024, 'image/png');
    const result = validateFile(file);
    expect(result.isValid).toBe(true);
  });

  it('should validate correct JPEG file', () => {
    const file = createMockFile('test.jpg', 1024 * 1024, 'image/jpeg');
    const result = validateFile(file);
    expect(result.isValid).toBe(true);
  });

  it('should reject file too large', () => {
    const file = createMockFile('large.pdf', 15 * 1024 * 1024, 'application/pdf');
    const result = validateFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('10MB limit');
  });

  it('should reject invalid file type', () => {
    const file = createMockFile('test.doc', 1024, 'application/msword');
    const result = validateFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('not allowed');
  });
});

describe('Error Formatting', () => {
  it('should format validation errors correctly', () => {
    const invalidData = {
      name: '',
      email: 'invalid'
    };

    const result = serviceApplicationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const formatted = formatValidationErrors(result.error);
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    }
  });
});