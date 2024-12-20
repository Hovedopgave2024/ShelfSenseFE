import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { clearStoresAndLogout } from '../../../util/user/clearStoresAndLogout.js';
import useSnackbarStore from '../../../stores/useSnackbarStore.js';

vi.mock('../../../stores/useSnackbarStore.js', () => ({
    default: {
        getState: vi.fn(() => ({
            showSnackbar: vi.fn(),
        })),
    },
}));

describe('clearStoresAndLogout', () => {
    let showSnackbarMock;

    beforeEach(() => {
        showSnackbarMock = vi.fn();
        useSnackbarStore.getState = vi.fn(() => ({ showSnackbar: showSnackbarMock }));

        // Mock localStorage
        global.localStorage = {
            removeItem: vi.fn(),
        };

        // Mock window.location.href
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: '' }, // Default value for href
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('successfully clears stores and redirects to the login page', async () => {
        await clearStoresAndLogout();

        // Validate snackbar message
        expect(showSnackbarMock).toHaveBeenCalledWith(
            'error',
            'Unauthorized! Logging out and navigating to login page.'
        );

        // Validate localStorage.removeItem calls
        expect(global.localStorage.removeItem).toHaveBeenCalledWith('apiUpdate-store');
        expect(global.localStorage.removeItem).toHaveBeenCalledWith('components-store');
        expect(global.localStorage.removeItem).toHaveBeenCalledWith('products-store');
        expect(global.localStorage.removeItem).toHaveBeenCalledWith('sales-orders-store');
        expect(global.localStorage.removeItem).toHaveBeenCalledWith('user-session');
        expect(global.localStorage.removeItem).toHaveBeenCalledWith('theme-storage');

        // Validate redirection
        expect(window.location.href).toBe('/');
    });

    it('handles localStorage error gracefully and still redirects', async () => {
        global.localStorage.removeItem.mockImplementation(() => {
            throw new Error('localStorage error');
        });

        await clearStoresAndLogout();

        // Validate snackbar message
        expect(showSnackbarMock).toHaveBeenCalledWith(
            'error',
            'Unauthorized! Logging out and navigating to login page.'
        );

        // Validate redirection still happens
        expect(window.location.href).toBe('');
    });
});