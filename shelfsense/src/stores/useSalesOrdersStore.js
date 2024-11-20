import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSalesOrdersStore = create(
    persist(
        (set, get) => ({
            salesOrders: [],
            setSalesOrders: (salesOrders) => set({ salesOrders }),
            addSalesOrder: (newOrder) => set((state) => ({ salesOrders: [...state.salesOrders, newOrder] })),
            updateSalesOrder: (updatedOrder) => set((state) => ({
                salesOrders: state.salesOrders.map((order) =>
                    order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
                ),
            })),
            deleteSalesOrder: (orderId) => set((state) => ({
                salesOrders: state.salesOrders.filter((order) => order.id !== orderId),
            })),
        }),
        {
            name: 'sales-orders-store', // Key for localStorage
            getStorage: () => localStorage, // Persist state in localStorage
        }
    )
);

export default useSalesOrdersStore;