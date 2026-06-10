import { describe, it, expect } from 'vitest';
import { isAuthError } from './errorHandler';

describe('errorHandler', () => {
  describe('isAuthError', () => {
    it('returns true for 401 error message', () => {
      expect(isAuthError(new Error('Request failed with status code 401'))).toBe(true);
    });

    it('returns true for unauthorized message', () => {
      expect(isAuthError(new Error('Unauthorized access'))).toBe(true);
    });

    it('returns true for session expired message', () => {
      expect(isAuthError(new Error('Session expired'))).toBe(true);
    });

    it('returns true for access token message', () => {
      expect(isAuthError(new Error('Access token is required'))).toBe(true);
    });

    it('returns false for non-auth errors', () => {
      expect(isAuthError(new Error('Network error'))).toBe(false);
    });

    it('returns false for non-Error objects', () => {
      expect(isAuthError('string error')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isAuthError(null)).toBe(false);
    });
  });
});
