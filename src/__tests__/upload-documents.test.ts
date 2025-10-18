import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadDocuments } from '../lib/uploads';

// Mock Supabase client storage using hoisted variables to satisfy Vitest's hoisting behavior
const mockSupabaseStorage = vi.hoisted(() => ({
  from: vi.fn(() => ({
    upload: vi.fn(),
    getPublicUrl: vi.fn()
  }))
}));

// Ensure the storage mock is defined before using in vi.mock factory
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: mockSupabaseStorage as any,
  }
}));

// Mock file validation
vi.mock('../lib/validations', () => ({
  validateFile: vi.fn(() => ({ isValid: true }))
}));

describe('Upload Documents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockFile = (name: string, size: number, type: string): File => {
    const file = new Blob(['test content'], { type });
    Object.defineProperty(file, 'name', { value: name });
    Object.defineProperty(file, 'size', { value: size });
    return file as File;
  };

  it('should upload files successfully', async () => {
    const mockUpload = vi.fn().mockResolvedValue({
      data: { path: 'test/123_test.pdf' },
      error: null
    });

    const mockGetPublicUrl = vi.fn().mockReturnValue({
      data: { publicUrl: 'https://example.com/test.pdf' }
    });

    mockSupabaseStorage.from.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl
    });

    const files = [
      createMockFile('test.pdf', 1024, 'application/pdf')
    ];

    const onProgress = vi.fn();
    const userId = 'test-user-id';

    const results = await uploadDocuments(userId, files, onProgress);

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      name: 'test.pdf',
      path: 'test/123_test.pdf',
      size: 1024,
      type: 'application/pdf',
      url: 'https://example.com/test.pdf'
    });

    expect(onProgress).toHaveBeenCalledWith(0, 0); // Start
    expect(onProgress).toHaveBeenCalledWith(0, 50); // After upload
    expect(onProgress).toHaveBeenCalledWith(0, 100); // Complete
  });

  it('should handle upload errors', async () => {
    const mockUpload = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Upload failed' }
    });

    mockSupabaseStorage.from.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: vi.fn()
    });

    const files = [
      createMockFile('test.pdf', 1024, 'application/pdf')
    ];

    const userId = 'test-user-id';

    await expect(uploadDocuments(userId, files)).rejects.toThrow('Upload failed for test.pdf');
  });

  it('should sanitize filenames correctly', async () => {
    const mockUpload = vi.fn().mockResolvedValue({
      data: { path: 'test/123_my_test_file.pdf' },
      error: null
    });

    const mockGetPublicUrl = vi.fn().mockReturnValue({
      data: { publicUrl: 'https://example.com/file.pdf' }
    });

    mockSupabaseStorage.from.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl
    });

    const files = [
      createMockFile('My Test File!@#.pdf', 1024, 'application/pdf')
    ];

    const userId = 'test-user-id';

    await uploadDocuments(userId, files);

    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringMatching(/test-user-id\/\d+_my_test_file.pdf/),
      files[0],
      { cacheControl: '3600', upsert: false }
    );
  });

  it('should handle specific error types', async () => {
    const mockUpload = vi.fn().mockResolvedValue({
      data: null,
      error: { message: '413 Request Entity Too Large' }
    });

    mockSupabaseStorage.from.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: vi.fn()
    });

    const files = [
      createMockFile('large.pdf', 15 * 1024 * 1024, 'application/pdf')
    ];

    const userId = 'test-user-id';

    await expect(uploadDocuments(userId, files)).rejects.toThrow('too large');
  });

  it('should upload multiple files with progress tracking', async () => {
    const mockUpload = vi.fn()
      .mockResolvedValueOnce({
        data: { path: 'test/123_file1.pdf' },
        error: null
      })
      .mockResolvedValueOnce({
        data: { path: 'test/456_file2.pdf' },
        error: null
      });

    const mockGetPublicUrl = vi.fn()
      .mockReturnValueOnce({
        data: { publicUrl: 'https://example.com/file1.pdf' }
      })
      .mockReturnValueOnce({
        data: { publicUrl: 'https://example.com/file2.pdf' }
      });

    mockSupabaseStorage.from.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl
    });

    const files = [
      createMockFile('file1.pdf', 1024, 'application/pdf'),
      createMockFile('file2.pdf', 2048, 'image/png')
    ];

    const onProgress = vi.fn();
    const userId = 'test-user-id';

    const results = await uploadDocuments(userId, files, onProgress);

    expect(results).toHaveLength(2);
    
    // Check progress was tracked for both files
    expect(onProgress).toHaveBeenCalledWith(0, 0);
    expect(onProgress).toHaveBeenCalledWith(0, 50);
    expect(onProgress).toHaveBeenCalledWith(0, 100);
    expect(onProgress).toHaveBeenCalledWith(1, 0);
    expect(onProgress).toHaveBeenCalledWith(1, 50);
    expect(onProgress).toHaveBeenCalledWith(1, 100);
  });
});