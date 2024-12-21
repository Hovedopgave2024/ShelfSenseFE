import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { login } from '../../../services/user/login.js';
import useSnackbarStore from '../../../stores/useSnackbarStore.js';

vi.mock('../../../stores/useSnackbarStore.js', () => ({
    default: {
        getState: vi.fn(() => ({
            showSnackbar: vi.fn(),
        })),
    },
}));

describe('login function', () => {
    let showSnackbarMock;

    beforeEach(() => {
        showSnackbarMock = vi.fn();
        useSnackbarStore.getState = vi.fn(() => ({ showSnackbar: showSnackbarMock }));
        global.fetch = vi.fn(); // Setup fetch mock here, overridden in each test as needed
    });

    afterEach(() => {
        vi.restoreAllMocks(); // Restore mocks after each test
    });

    it('returns userDTO on successful login (200)', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ name: 'Jens', id: 123123 }),
        });

        const result = await login('validUser', 'validPassword');
        expect(result).toEqual({ name: 'Jens', id: 123123 });
        expect(global.fetch).toHaveBeenCalledWith(
            `${import.meta.env.VITE_API_URL}/login`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: 'validUser', password: 'validPassword' }),
            }
        );
    });

    it('shows error snackbar and returns null on 401 error', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        const result = await login('invalidUser', 'wrongPassword');
        expect(result).toBeNull();
        expect(showSnackbarMock).toHaveBeenCalledWith(
            'error',
            'Username or password is wrong, please try again.'
        );
    });

    it('shows generic error snackbar and returns null for any non-200 backend error', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false, // Triggers the !response.ok block
        });

        const result = await login('testUser', 'testPassword');

        // Assert snackbar was called with the generic error message
        expect(showSnackbarMock).toHaveBeenCalledWith(
            'error',
            'Unexpected error. Please try again, check your network connection or contact Support.'
        );

        // Assert the function returns null
        expect(result).toBeNull();
    });


    it('shows error snackbar and returns null on network error', async () => {
        const showSnackbarMock = vi.fn();
        useSnackbarStore.getState = vi.fn(() => ({ showSnackbar: showSnackbarMock }));

        // Simulate network error (Failed to fetch)
        global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

        const result = await login('testUser', 'testPassword');
        expect(result).toBeNull();

        // Ensure the snackbar is called with the correct error message
        expect(showSnackbarMock).toHaveBeenCalledWith(
            'error',
            'Network error or server is not responding. Please try again, check your network connection or contact Support.'
        );
    });
});