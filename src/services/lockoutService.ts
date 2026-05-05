const LOCKOUT_KEY = 'loginLockouts';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60_000; // 1 minute

interface LockoutEntry {
  attempts: number;
  lockedUntil: number | null;
  accountLocked: boolean;
}

export type LockoutStatus =
  | { type: 'ok'; attemptsLeft: number }
  | { type: 'temp_locked'; remainingMs: number }
  | { type: 'account_locked' };

const readAll = (): Record<string, LockoutEntry> => {
  const raw = localStorage.getItem(LOCKOUT_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw) as Record<string, LockoutEntry>; } catch { return {}; }
};

const writeAll = (data: Record<string, LockoutEntry>) => {
  localStorage.setItem(LOCKOUT_KEY, JSON.stringify(data));
};

const defaultEntry = (): LockoutEntry => ({ attempts: 0, lockedUntil: null, accountLocked: false });

export const getLockoutEntry = (username: string): LockoutEntry => {
  return readAll()[username] ?? defaultEntry();
};

export const checkLockout = (username: string): LockoutStatus => {
  const all = readAll();
  const entry = all[username] ?? defaultEntry();

  if (entry.accountLocked) return { type: 'account_locked' };

  if (entry.lockedUntil !== null) {
    const remaining = entry.lockedUntil - Date.now();
    if (remaining > 0) {
      return { type: 'temp_locked', remainingMs: remaining };
    }
    // Temp lock expired → permanently lock the account
    entry.accountLocked = true;
    entry.lockedUntil = null;
    all[username] = entry;
    writeAll(all);
    return { type: 'account_locked' };
  }

  const attemptsLeft = MAX_ATTEMPTS - entry.attempts;
  return { type: 'ok', attemptsLeft };
};

export const recordFailedAttempt = (username: string): LockoutStatus => {
  const all = readAll();
  const entry = all[username] ?? defaultEntry();

  entry.attempts += 1;

  if (entry.attempts >= MAX_ATTEMPTS && entry.lockedUntil === null && !entry.accountLocked) {
    entry.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }

  all[username] = entry;
  writeAll(all);
  return checkLockout(username);
};

export const clearAttempts = (username: string): void => {
  const all = readAll();
  delete all[username];
  writeAll(all);
};

export const adminUnlockAccount = (username: string): void => {
  const all = readAll();
  all[username] = defaultEntry();
  writeAll(all);
};

export const getLockedAccounts = (): string[] => {
  return Object.entries(readAll())
    .filter(([, entry]) => entry.accountLocked)
    .map(([username]) => username);
};
