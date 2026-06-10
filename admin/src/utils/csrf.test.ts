import { describe, it, expect } from 'vitest';
import { getCsrfToken, isMutationMethod } from './csrf';

describe('csrf utils', () => {
  describe('isMutationMethod', () => {
    it('returns true for POST', () => {
      expect(isMutationMethod('POST')).toBe(true);
    });

    it('returns true for PUT', () => {
      expect(isMutationMethod('PUT')).toBe(true);
    });

    it('returns true for PATCH', () => {
      expect(isMutationMethod('PATCH')).toBe(true);
    });

    it('returns true for DELETE', () => {
      expect(isMutationMethod('DELETE')).toBe(true);
    });

    it('returns false for GET', () => {
      expect(isMutationMethod('GET')).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isMutationMethod(undefined)).toBe(false);
    });

    it('is case insensitive', () => {
      expect(isMutationMethod('post')).toBe(true);
      expect(isMutationMethod('Post')).toBe(true);
    });
  });

  describe('getCsrfToken', () => {
    it('returns null when no token exists', () => {
      document.cookie = '';
      document.head.innerHTML = '';
      expect(getCsrfToken()).toBeNull();
    });
  });
});
