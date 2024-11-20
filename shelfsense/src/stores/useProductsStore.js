import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProductsStore = create(
    persist(
        (set, get) => ({
            products: [],
            setProducts: (products) => set({ products }),
            addProduct: (newProduct) => set((state) => ({ products: [...state.products, newProduct] })),
            updateProduct: (updatedProduct) => set((state) => ({
                products: state.products.map((product) =>
                    product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
                ),
            })),
            deleteProduct: (productId) => set((state) => ({
                products: state.products.filter((product) => product.id !== productId),
            })),
            // Nested productComponent operations
            addProductComponent: (productId, newProductComponent) => set((state) => ({
                products: state.products.map((product) =>
                    product.id === productId
                        ? {
                            ...product,
                            productComponentList: [...product.productComponentList, newProductComponent],
                        }
                        : product
                ),
            })),
            updateProductComponent: (productId, updatedProductComponent) => set((state) => ({
                products: state.products.map((product) =>
                    product.id === productId
                        ? {
                            ...product,
                            productComponentList: product.productComponentList.map((productComponent) =>
                                productComponent.id === updatedProductComponent.id
                                    ? { ...productComponent, ...updatedProductComponent }
                                    : productComponent
                            ),
                        }
                        : product
                ),
            })),
            deleteProductComponent: (productId, productComponentId) => set((state) => ({
                products: state.products.map((product) =>
                    product.id === productId
                        ? {
                            ...product,
                            productComponentList: product.productComponentList.filter(
                                (productComponent) => productComponent.id !== productComponentId
                            ),
                        }
                        : product
                ),
            })),
        }),
        {
            name: 'products-store', // Key for localStorage
            getStorage: () => localStorage, // Persist state in localStorage
        }
    )
);

export default useProductsStore;