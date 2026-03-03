import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();

describe('authStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    localStorageMock.clear();
    useAuthStore.setState({
      token: null,
      id: null,
      displayName: null,
      email: null,
      hydrated: false,
    });
  });

  describe('hydrate', () => {
    it('reads token and user from localStorage and sets hydrated', () => {
      localStorageMock.setItem('token', 'abc');
      localStorageMock.setItem('userId', 'u1');
      localStorageMock.setItem('displayName', 'Alice');
      localStorageMock.setItem('email', 'alice@example.com');

      useAuthStore.getState().hydrate();

      expect(useAuthStore.getState()).toMatchObject({
        token: 'abc',
        id: 'u1',
        displayName: 'Alice',
        email: 'alice@example.com',
        hydrated: true,
      });
    });

    it('sets null when localStorage keys are missing', () => {
      useAuthStore.getState().hydrate();
      expect(useAuthStore.getState()).toMatchObject({
        token: null,
        id: null,
        displayName: null,
        email: null,
        hydrated: true,
      });
    });
  });

  describe('login', () => {
    it('persists token and user to localStorage and state', () => {
      useAuthStore.getState().login('xyz', {
        id: 'u2',
        displayName: 'Bob',
        email: 'bob@example.com',
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'xyz');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userId', 'u2');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'displayName',
        'Bob',
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'email',
        'bob@example.com',
      );
      expect(useAuthStore.getState()).toMatchObject({
        token: 'xyz',
        id: 'u2',
        displayName: 'Bob',
        email: 'bob@example.com',
      });
    });
  });

  describe('logout', () => {
    it('removes all auth keys from localStorage and clears state', () => {
      useAuthStore
        .getState()
        .login('t', { id: 'u', displayName: 'U', email: 'u@e.com' });
      useAuthStore.getState().logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('displayName');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('email');
      expect(useAuthStore.getState()).toMatchObject({
        token: null,
        id: null,
        displayName: null,
        email: null,
      });
    });
  });
});
