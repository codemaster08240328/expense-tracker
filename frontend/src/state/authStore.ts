import { create } from 'zustand';

type AuthState = {
  token: string | null;
  id: string | null;
  displayName: string | null;
  email: string | null;
  hydrated: boolean;
  hydrate: () => void;
  login: (
    token: string,
    user: { id: string; displayName: string; email: string },
  ) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  id: null,
  displayName: null,
  email: null,
  hydrated: false,

  hydrate: () => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    const displayName = localStorage.getItem('displayName');
    const email = localStorage.getItem('email');
    set({ token, id, displayName, email, hydrated: true });
  },

  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('displayName', user.displayName);
    localStorage.setItem('email', user.email);
    set({
      token,
      id: user.id,
      displayName: user.displayName,
      email: user.email,
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('displayName');
    localStorage.removeItem('email');
    set({ token: null, id: null, displayName: null, email: null });
  },
}));
