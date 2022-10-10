import { defineStore } from 'pinia';
import PerformanceService from '@/services/performance.service';

export const usePerformanceStore = defineStore({
    id: 'performance',
    state: () => ({
        performances: [] as TheatrePerformance[],
    }),
    getters: {
        statePerformances(state): TheatrePerformance[] {
            return state.performances;
        },
    },
    actions: {
        getPerformanceById(id: number): TheatrePerformance | undefined {
            return this.statePerformances.find((p) => p.id === id);
        },
        async addPerformance(newPerformance: TheatrePerformance) {
            const performance: TheatrePerformance =
                await PerformanceService.addPerformance(newPerformance);
            performance.date = newPerformance.date;
            console.log('added performance', performance);
            this.performances.push(performance);
        },
        async getPerformances() {
            this.performances = await PerformanceService.getPerformances();
        },
    },
});
