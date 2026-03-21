const SESSION_KEY = 'psi_session';

export interface UserSession {
  email: string;
  govId?: string;
}

export function getSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(user: UserSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function signIn(email: string, password: string): { error: string | null } {
  if (!email || !password) return { error: 'Email and password are required' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters' };
  saveSession({ email });
  return { error: null };
}

export function signUp(email: string, password: string, govId: string): { error: string | null } {
  if (!email || !password || !govId) return { error: 'All fields are required' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters' };
  saveSession({ email, govId });
  return { error: null };
}

export function signOut(): void {
  clearSession();
}
