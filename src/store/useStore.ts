import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Employee {
    id: number;
    name: string;
    department: string | null;
    job_title: string;
}

interface AuthState {
    token: string | null;
    employee: Employee | null;
    isAuthenticated: boolean;
    login: (token: string, employee: Employee) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            employee: null,
            isAuthenticated: false,
            login: (token: string, employee: Employee) =>
                set({ token, employee, isAuthenticated: true }),
            logout: () =>
                set({ token: null, employee: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
