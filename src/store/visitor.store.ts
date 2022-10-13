import { defineStore } from 'pinia';
import { usePerformanceStore } from '@/store/performance.store';
const performanceStore = usePerformanceStore();

export type RootVisitorState = {
    visitor: {
        isLoggedIn: boolean;
        wardrobeNumber: number;
        email: string;
        wantsNewsletter: boolean;
        wantsSummary: boolean;
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
                wardrobeNumber: 0,
                email: '',
            },
        } as RootVisitorState),
    getters: {
        getVisitor(state) {
            return state.visitor;
        },
    },
    actions: {},
});
