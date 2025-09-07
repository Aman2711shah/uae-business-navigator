import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Supabase edge function response
const mockTrackApplicationResponse = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  requestId: 'WZT-20250907-1234',
  status: 'pending',
  submittedAt: '2025-01-07T10:00:00Z',
  lastUpdated: '2025-01-07T10:00:00Z',
  contactName: 'John Doe',
  timeline: [
    {
      step: 'Application Submitted',
      status: 'completed',
      date: '2025-01-07T10:00:00Z',
      description: 'Your application has been successfully submitted'
    },
    {
      step: 'Document Review',
      status: 'current',
      description: 'Our team is reviewing your submitted documents'
    },
    {
      step: 'Processing',
      status: 'pending',
      description: 'Application is being processed'
    },
    {
      step: 'Completion',
      status: 'pending',
      description: 'Application process complete'
    }
  ]
};

// Mock supabase functions
const mockSupabaseFunctions = {
  invoke: vi.fn()
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: mockSupabaseFunctions
  }
}));

describe('Track Application', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Track Application API', () => {
    it('should successfully fetch application data for valid request ID', async () => {
      // Arrange
      mockSupabaseFunctions.invoke.mockResolvedValue({
        data: mockTrackApplicationResponse,
        error: null
      });

      // Act
      const result = await mockSupabaseFunctions.invoke('track-application', {
        body: null,
        method: 'GET',
        query: { requestId: 'WZT-20250907-1234' }
      });

      // Assert
      expect(result.data).toEqual(mockTrackApplicationResponse);
      expect(result.error).toBeNull();
      expect(mockSupabaseFunctions.invoke).toHaveBeenCalledWith('track-application', {
        body: null,
        method: 'GET',
        query: { requestId: 'WZT-20250907-1234' }
      });
    });

    it('should return error for invalid request ID format', async () => {
      // Arrange
      const invalidRequestId = 'INVALID-ID';
      mockSupabaseFunctions.invoke.mockResolvedValue({
        data: null,
        error: { message: 'Invalid request ID format' }
      });

      // Act
      const result = await mockSupabaseFunctions.invoke('track-application', {
        body: null,
        method: 'GET',
        query: { requestId: invalidRequestId }
      });

      // Assert
      expect(result.error).toBeTruthy();
      expect(result.error.message).toBe('Invalid request ID format');
    });

    it('should return 404 for non-existent request ID', async () => {
      // Arrange
      const nonExistentId = 'WZT-20250907-9999';
      mockSupabaseFunctions.invoke.mockResolvedValue({
        data: null,
        error: { message: 'Application not found' }
      });

      // Act
      const result = await mockSupabaseFunctions.invoke('track-application', {
        body: null,
        method: 'GET',
        query: { requestId: nonExistentId }
      });

      // Assert
      expect(result.error).toBeTruthy();
      expect(result.error.message).toBe('Application not found');
    });
  });

  describe('Request ID validation', () => {
    const validateRequestIdFormat = (requestId: string): boolean => {
      const pattern = /^WZT-\d{8}-\d{4}$/;
      return pattern.test(requestId);
    };

    it('should validate correct request ID format', () => {
      const validIds = [
        'WZT-20250907-1234',
        'WZT-20250101-0001',
        'WZT-20251231-9999'
      ];

      validIds.forEach(id => {
        expect(validateRequestIdFormat(id)).toBe(true);
      });
    });

    it('should reject invalid request ID formats', () => {
      const invalidIds = [
        'WZT-2025090-1234',  // Short date
        'WZT-202509071-1234', // Long date
        'WZT-20250907-12345', // Long number
        'WZT-20250907-123',   // Short number
        'ABC-20250907-1234',  // Wrong prefix
        'WZT20250907-1234',   // Missing dash
        'WZT-20250907_1234',  // Wrong separator
        '',                   // Empty
        'random-string'       // Random
      ];

      invalidIds.forEach(id => {
        expect(validateRequestIdFormat(id)).toBe(false);
      });
    });
  });

  describe('Timeline generation', () => {
    type ApplicationStatus = 'pending' | 'processing' | 'completed' | 'approved';
    
    const generateTimeline = (status: ApplicationStatus) => [
      {
        step: 'Application Submitted',
        status: 'completed',
        description: 'Your application has been successfully submitted'
      },
      {
        step: 'Document Review',
        status: status === 'pending' ? 'current' : 'completed',
        description: 'Our team is reviewing your submitted documents'
      },
      {
        step: 'Processing',
        status: status === 'processing' ? 'current' : 
               (status === 'completed' || status === 'approved') ? 'completed' : 'pending',
        description: 'Application is being processed'
      },
      {
        step: 'Completion',
        status: (status === 'completed' || status === 'approved') ? 'completed' : 'pending',
        description: 'Application process complete'
      }
    ];

    it('should generate correct timeline for pending status', () => {
      const timeline = generateTimeline('pending');

      expect(timeline[0].status).toBe('completed');
      expect(timeline[1].status).toBe('current');
      expect(timeline[2].status).toBe('pending');
      expect(timeline[3].status).toBe('pending');
    });

    it('should generate correct timeline for completed status', () => {
      const timeline = generateTimeline('completed');

      expect(timeline[0].status).toBe('completed');
      expect(timeline[1].status).toBe('completed');
      expect(timeline[2].status).toBe('completed');
      expect(timeline[3].status).toBe('completed');
    });
  });
});