import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Firebase modules
vi.mock('../services/firebase', () => ({
  auth: {},
  db: {},
  isFirebaseConfigured: false,
}));

const mockUserStore: Record<string, unknown[]> = {};
vi.mock('../services/mock-database', () => ({
  mockDb: {
    getAll: vi.fn((collection: string) => {
      if (!mockUserStore[collection]) mockUserStore[collection] = [];
      return mockUserStore[collection];
    }),
  },
}));

import { authService } from '../services/auth.service';

describe('AuthService Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    Object.keys(mockUserStore).forEach(k => delete mockUserStore[k]);
  });

  describe('signUp', () => {
    it('should force Operator role in SANDBOX mode', async () => {
      const user = await authService.signUp('test@test.com', 'pass', 'Test', 'Admin');
      expect(user.role).toBe('Operator');
    });

    it('should store user in localStorage', async () => {
      await authService.signUp('test@test.com', 'pass', 'Test', 'Operator');
      const stored = localStorage.getItem('skn_current_user');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.email).toBe('test@test.com');
    });

    it('should return user with generated uid', async () => {
      const user = await authService.signUp('test@test.com', 'pass', 'Test', 'Operator');
      expect(user.uid).toBeDefined();
      expect(typeof user.uid).toBe('string');
    });

    it('should set createdAt timestamp', async () => {
      const user = await authService.signUp('test@test.com', 'pass', 'Test', 'Operator');
      expect(user.createdAt).toBeDefined();
    });
  });

  describe('login', () => {
    it('should return default user for unknown email in SANDBOX', async () => {
      const user = await authService.login('unknown@test.com', 'pass');
      expect(user).toBeDefined();
      expect(user?.email).toBe('unknown@test.com');
      expect(user?.displayName).toBe('Demo Controller');
    });

    it('should find existing user by email', async () => {
      await authService.signUp('existing@test.com', 'pass', 'Existing', 'Operator');
      const user = await authService.login('existing@test.com', 'pass');
      expect(user?.email).toBe('existing@test.com');
      expect(user?.displayName).toBe('Existing');
    });

    it('should store current user in localStorage on login', async () => {
      await authService.login('test@test.com', 'pass');
      const stored = localStorage.getItem('skn_current_user');
      expect(stored).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('should clear current user from localStorage', async () => {
      localStorage.setItem('skn_current_user', JSON.stringify({ email: 'test@test.com' }));
      await authService.logout();
      expect(localStorage.getItem('skn_current_user')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is stored', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });

    it('should return stored user', () => {
      const mockUser = { email: 'test@test.com', displayName: 'Test' };
      localStorage.setItem('skn_current_user', JSON.stringify(mockUser));
      const user = authService.getCurrentUser();
      expect(user?.email).toBe('test@test.com');
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('skn_current_user', '{invalid json');
      const user = authService.getCurrentUser();
      expect(user).toBeNull();
      expect(localStorage.getItem('skn_current_user')).toBeNull();
    });
  });

  describe('onAuthChanged', () => {
    it('should call callback with current user', () => {
      const callback = vi.fn();
      authService.onAuthChanged(callback);
      expect(callback).toHaveBeenCalled();
    });

    it('should return a cleanup function', () => {
      const cleanup = authService.onAuthChanged(vi.fn());
      expect(typeof cleanup).toBe('function');
    });

    it('cleanup function should remove storage listener', () => {
      const callback = vi.fn();
      const cleanup = authService.onAuthChanged(callback);
      cleanup?.();
      // After cleanup, storage events should not trigger callback again
      expect(typeof cleanup).toBe('function');
    });
  });
});
