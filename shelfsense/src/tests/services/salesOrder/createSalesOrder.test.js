import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createSalesOrder } from '../../../services/salesOrder/createSalesOrder.js';
import { clearStoresAndLogout } from '../../../util/user/clearStoresAndLogout.js';

vi.mock('../../../util/user/clearStoresAndLogout.js', () => ({
    clearStoresAndLogout: vi.fn(),
}));

describe('createSalesOrder', () => {
    let mockSalesOrderData;

    beforeEach(() => {
        mockSalesOrderData = {
            quantity: '10',
            price: '100.50',
            createdDate: '2025-01-01',
            productId: '123',
            productName: 'Sample Product',
        };

        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const BASE_URL = `${import.meta.env.VITE_API_URL}/salesOrders`;

    it('returns the created sales order on a successful creation (200)', async () => {
        const mockResponse = {
            id: 1,
            quantity: 10,
            createdDate: '2025-01-01',
            price: 100.5,
            productId: 123,
            productName: 'Sample Product',
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        const result = await createSalesOrder(mockSalesOrderData);

        expect(result).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                quantity: 10,
                price: 100.5,
                createdDate: '2025-01-01',
                productId: 123,
                productName: 'Sample Product',
            }),
        });
        expect(clearStoresAndLogout).not.toHaveBeenCalled();
    });

    it('calls clearStoresAndLogout and returns null on 401 error', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        const result = await createSalesOrder(mockSalesOrderData);

        expect(clearStoresAndLogout).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
    });

    it('returns null for any non-200 backend error', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        const result = await createSalesOrder(mockSalesOrderData);

        expect(result).toBeNull();
        expect(clearStoresAndLogout).not.toHaveBeenCalled();
    });

    it('returns null on network error', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network Error'));

        const result = await createSalesOrder(mockSalesOrderData);

        expect(result).toBeNull();
        expect(clearStoresAndLogout).not.toHaveBeenCalled();
    });
});