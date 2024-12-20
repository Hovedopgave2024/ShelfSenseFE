import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { updateProduct } from '../../../services/product/updateProduct.js';
import { clearStoresAndLogout } from '../../../util/user/clearStoresAndLogout.js';

vi.mock('../../../util/user/clearStoresAndLogout.js', () => ({
    clearStoresAndLogout: vi.fn(),
}));

describe('updateProduct', () => {
    let mockProduct;

    beforeEach(() => {
        // Define mockProduct once
        mockProduct = {
            id: 2,
            name: 'LED Module',
            price: 5,
            productComponentList: [
                { id: 4, componentId: 1, productId: 2, quantity: 15 },
                { id: 5, componentId: 2, productId: 2, quantity: 10 },
                { id: 6, componentId: 3, productId: 2, quantity: 20 },
            ],
        };

        global.fetch = vi.fn(); // Mock fetch globally
    });

    afterEach(() => {
        vi.restoreAllMocks(); // Clean up mocks
    });

    const BASE_URL = `${import.meta.env.VITE_API_URL}/products`;

    it('returns the updated product on a successful update (200)', async () => {
        const mockResponse = { ...mockProduct, updated: true };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        const result = await updateProduct(mockProduct);

        // Validate the response
        expect(result).toEqual(mockResponse);

        // Validate fetch call
        expect(global.fetch).toHaveBeenCalledWith(BASE_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(mockProduct),
        });
    });

    it('calls clearStoresAndLogout and returns null on 401 error', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        const result = await updateProduct(mockProduct);

        // Validate that clearStoresAndLogout was called
        expect(clearStoresAndLogout).toHaveBeenCalled();

        // Validate the function returns null
        expect(result).toBeNull();
    });

    it('throws generic error and returns null for any non-200 backend error', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
        });

        const result = await updateProduct(mockProduct);

        // Assert the function returns null
        expect(result).toBeNull();
    });

    it('throws network error and returns null on network error', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network Error'));

        const result = await updateProduct(mockProduct);

        // Assert the function returns null
        expect(result).toBeNull();
    });
});