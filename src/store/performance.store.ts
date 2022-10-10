import { defineStore } from 'pinia';
import PerformanceService from '@/services/performance.service';
export type RootPerformanceState = {
    performances: TheatrePerformance[];
};
export const usePerformanceStore = defineStore({
    id: 'performance',
    state: () =>
        ({
            performances: [] as TheatrePerformance[],
        } as RootPerformanceState),

    getters: {
        statePerformances(state): TheatrePerformance[] {
            return state.performances;
        },
        getPerformance: (state) => {
            return (id: string) => state.performances.find((i) => i.id === id);
        },
    },
    actions: {
        async getPerformanceById(id: string): Promise<TheatrePerformance> {
            return await PerformanceService.getPerformanceById(id);
        },
        async addPerformance(newPerformance: TheatrePerformance) {
            const performance: TheatrePerformance =
                await PerformanceService.addPerformance(newPerformance);
            this.performances.push(performance);
            return performance;
        },
        async getPerformances() {
            this.performances = await PerformanceService.getPerformances();
        },
    },
});
