import { defineStore } from 'pinia';
import PerformanceService from '@/services/performance.service';
export type RootPerformanceState = {
    performances: TheatrePerformance[];
    activePerformance: TheatrePerformance;
};
export const usePerformanceStore = defineStore({
    id: 'performance',
    state: () =>
        ({
            performances: [] as TheatrePerformance[],
            activePerformance: {},
        } as RootPerformanceState),

    getters: {
        statePerformances(state): TheatrePerformance[] {
            return state.performances;
        },
        getPerformance: (state) => {
            return (id: string) => state.performances.find((i) => i.id === id);
        },
        getActivePerformance(state): TheatrePerformance | undefined {
            return state.performances.find((p) => p.active);
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
        async setActivePerformance(
            p: TheatrePerformance
        ): Promise<TheatrePerformance> {
            // todo set all other performances as inactive
            p.active = true;
            return await PerformanceService.editPerformance(p);
        },
        async setInactivePerformance(
            p: TheatrePerformance
        ): Promise<TheatrePerformance> {
            p.active = false;
            return await PerformanceService.editPerformance(p);
        },
    },
});
