import { vi, describe, it, expect } from 'vitest';
import { login } from './login'; // Adjust path if necessary

describe('login function', () => {
    it('returns true on successful login', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            })
        );

        const result = await login('testUser', 'testPassword');
        expect(result).toEqual({ success: true });
        vi.restoreAllMocks();
    });

    it('returns null on 401 error', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                status: 401,
            })
        );

        const result = await login('testUser', 'wrongPassword');
        expect(result).toBeNull();
        vi.restoreAllMocks();
    });

    it('returns null on network error', async () => {
        global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));

        const result = await login('testUser', 'testPassword');
        expect(result).toBeNull();
        vi.restoreAllMocks();
    });
});