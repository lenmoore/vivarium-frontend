import { defineStore } from 'pinia';
import { usePerformanceStore } from '@/store/performance.store';
import PerformanceService from '@/services/performance.service';
import { Visitor } from '@/types/users.types';
const performanceStore = usePerformanceStore();

export type RootVisitorState = {
    visitor: {
        isLoggedIn: boolean;
        wardrobe_number: number;
        email: string;
        wants_newsletter: boolean;
        wants_summary: boolean;
        performance: TheatrePerformance;
        basket?: Basket;
    };
};
export const useVisitorStore = defineStore({
    id: 'visitor',
    state: () =>
        ({
            visitor: {
                isLoggedIn: false,
                wardrobe_number: 0,
                email: '',
            },
        } as RootVisitorState),
    getters: {
        getVisitor(state) {
            return state.visitor;
        },
    },
    actions: {
        async login(visitor: Visitor) {
            // todo this just creates the visitor every time, we also need to login
            return await PerformanceService.addVisitor(visitor);
        },
    },
});
