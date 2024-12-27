import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fetchAllData } from '../../../services/user/fetchAllData.js';
import { getRequest } from '../../../services/getRequestService.js';
import useSessionStore from '../../../stores/useSessionStore.js';
import useSnackbarStore from '../../../stores/useSnackbarStore.js';
import useProductsStore from '../../../stores/useProductsStore.js';
import useComponentsStore from '../../../stores/useComponentsStore.js';
import useSalesOrdersStore from '../../../stores/useSalesOrdersStore.js';
import useApiUpdateStore from '../../../stores/useApiUpdateStore.js';

vi.mock('../../../services/getRequestService.js', () => ({
    getRequest: vi.fn(),
}));

vi.mock('../../../stores/useSessionStore.js', () => ({
    default: {
        getState: vi.fn(),
    },
}));

vi.mock('../../../stores/useSnackbarStore.js', () => ({
    default: {
        getState: vi.fn(),
    },
}));

vi.mock('../../../stores/useProductsStore.js', () => ({
    default: {
        getState: vi.fn(),
    },
}));

vi.mock('../../../stores/useComponentsStore.js', () => ({
    default: {
        getState: vi.fn(),
    },
}));

vi.mock('../../../stores/useSalesOrdersStore.js', () => ({
    default: {
        getState: vi.fn(),
    },
}));

vi.mock('../../../stores/useApiUpdateStore.js', () => ({
    default: {
        getState: vi.fn(),
    },
}));

describe('fetchAllData', () => {
    let showSnackbarMock = null;
    let setProductsMock = [];
    let setComponentsMock = [];
    let setSalesOrdersMock = [];
    let setApiUpdateMock = null;

    beforeEach(() => {
        showSnackbarMock = vi.fn();
        setProductsMock = vi.fn();
        setComponentsMock = vi.fn();
        setSalesOrdersMock = vi.fn();
        setApiUpdateMock = vi.fn();

        useSessionStore.getState = vi.fn(() => ({
            user: { id: 1 },
        }));

        useSnackbarStore.getState = vi.fn(() => ({
            showSnackbar: showSnackbarMock,
        }));

        useProductsStore.getState = vi.fn(() => ({
            setProducts: setProductsMock,
        }));

        useComponentsStore.getState = vi.fn(() => ({
            setComponents: setComponentsMock,
        }));

        useSalesOrdersStore.getState = vi.fn(() => ({
            setSalesOrders: setSalesOrdersMock,
        }));

        useApiUpdateStore.getState = vi.fn(() => ({
            setApiUpdate: setApiUpdateMock,
        }));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('fetches and sets data correctly when userData is valid', async () => {
        const mockUserData = {
            productList: [{ id: 1, name: 'Product 1' }],
            componentList: [{ id: 1, name: 'Component 1' }],
            salesOrderList: [{ id: 1, quantity: 100 }],
            apiUpdate: { lastUpdate: '2023-12-01T12:00:00Z' },
        };

        getRequest.mockResolvedValueOnce(mockUserData);

        await fetchAllData();

        // Validate that stores are updated correctly
        expect(setProductsMock).toHaveBeenCalledWith([{ id: 1, name: 'Product 1' }]);
        expect(setComponentsMock).toHaveBeenCalledWith([{ id: 1, name: 'Component 1' }]);
        expect(setSalesOrdersMock).toHaveBeenCalledWith([{ id: 1, quantity: 100 }]);
        expect(setApiUpdateMock).toHaveBeenCalledWith({ lastUpdate: '2023-12-01T12:00:00Z' });
    });

    it('shows snackbar error when userData is null', async () => {
        getRequest.mockResolvedValueOnce(null);

        await fetchAllData();

        // Validate snackbar call
        expect(showSnackbarMock).toHaveBeenCalledWith(
            'error',
            'Error while fetching user data. Please logout and login again or contact Support.'
        );

        // Ensure stores are saved with default values
        expect(setProductsMock).toHaveBeenCalledWith([]);
        expect(setComponentsMock).toHaveBeenCalledWith([]);
        expect(setSalesOrdersMock).toHaveBeenCalledWith([]);
        expect(setApiUpdateMock).toHaveBeenCalledWith(null);
    });

    it('sets empty lists and null values when userData properties are missing', async () => {

        // Simulating a userData object with empty or missing properties
        const mockUserData = {
            componentList: [{ id: 'c1', name: 'Component 1' }],
            productsList: [{}],
        };

        getRequest.mockResolvedValueOnce(mockUserData);

        await fetchAllData();

        // Validate stores are updated with default values
        expect(setProductsMock).toHaveBeenCalledWith([]);
        expect(setComponentsMock).toHaveBeenCalledWith([{ id: 'c1', name: 'Component 1' }]);
        expect(setSalesOrdersMock).toHaveBeenCalledWith([]);
        expect(setApiUpdateMock).toHaveBeenCalledWith(null);
    });
});