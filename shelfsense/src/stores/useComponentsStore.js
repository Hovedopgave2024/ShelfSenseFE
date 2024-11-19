import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useComponentsStore = create(
    persist(
        (set, get) => ({
            components: [],
            setComponents: (components) => set({ components }),
            addComponent: (newComponent) => set((state) => ({ components: [...state.components, newComponent] })),
            updateComponent: (updatedComponent) => set((state) => ({
                components: state.components.map((component) =>
                    component.id === updatedComponent.id ? { ...component, ...updatedComponent } : component
                ),
            })),
            deleteComponent: (componentId) => set((state) => ({
                components: state.components.filter((component) => component.id !== componentId),
            })),
        }),
        {
            name: 'components-store', // Key for localStorage
            getStorage: () => localStorage, // Persist state in localStorage
        }
    )
);

export default useComponentsStore;