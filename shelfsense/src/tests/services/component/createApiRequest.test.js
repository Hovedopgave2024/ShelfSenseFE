import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApiRequest } from '../../../services/component/createApiRequest.js';
import { clearStoresAndLogout } from '../../../util/user/clearStoresAndLogout.js';
import useApiUpdateStore from '../../../stores/useApiUpdateStore.js';

vi.mock('../../../util/user/clearStoresAndLogout.js', () => ({
    clearStoresAndLogout: vi.fn(),
}));

vi.mock('../../../stores/useSessionStore.js', () => ({
    default: {
        getState: vi.fn(() => ({
            user: { id: 1 },
        })),
    },
}));

vi.mock('../../../stores/useApiUpdateStore.js', () => ({
    default: {
        getState: vi.fn(),
    },
}));

describe('createApiRequest', () => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/components/mouser`;
    const fixedDate = '2024-12-20T11:09:55.921Z'; // Predefined ISO date for testing
    let setApiUpdateMock = null;

    beforeEach(() => {
        setApiUpdateMock = vi.fn();
        useApiUpdateStore.getState = vi.fn(() => ({
            setApiUpdate: setApiUpdateMock,
        }));

        global.fetch = vi.fn();

        // Mock system time
        vi.useFakeTimers();
        vi.setSystemTime(new Date(fixedDate));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('sends the API request and updates the store on success', async () => {
        const mockResponseData = { success: true, data: { id: 1, name: 'Component 1' } };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponseData),
        });

        const result = await createApiRequest();

        // Validate the response
        expect(result).toEqual(mockResponseData);

        // Validate fetch call
        expect(global.fetch).toHaveBeenCalledWith(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                userId: 1,
                apiKey: import.meta.env.VITE_API_KEY,
            }),
        });

        // Validate the store update
        const setApiUpdateMock = useApiUpdateStore.getState().setApiUpdate;
        expect(setApiUpdateMock).toHaveBeenCalledTimes(1);
        expect(setApiUpdateMock).toHaveBeenCalledWith({ lastUpdated: fixedDate });
    });

    it('calls clearStoresAndLogout and returns null on 401 error', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        const result = await createApiRequest();

        // Validate that clearStoresAndLogout was called
        expect(clearStoresAndLogout).toHaveBeenCalled();

        // Validate the function returns null
        expect(result).toBeNull();
    });

    it('logs error and returns null for any non-200 backend error', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
        });

        const result = await createApiRequest();

        // Validate the function returns null
        expect(result).toBeNull();

        // Ensure no store update occurs
        const setApiUpdateMock = useApiUpdateStore.getState().setApiUpdate;
        expect(setApiUpdateMock).not.toHaveBeenCalled();
    });

    it('handles network errors gracefully and returns null', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network Error'));

        const result = await createApiRequest();

        // Validate the function returns null
        expect(result).toBeNull();

        // Ensure no store update occurs
        const setApiUpdateMock = useApiUpdateStore.getState().setApiUpdate;
        expect(setApiUpdateMock).not.toHaveBeenCalled();
    });
});