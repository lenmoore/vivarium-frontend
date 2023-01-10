import { defineStore } from 'pinia';
import PerformanceService from '@/services/performance.service';
import { Game, Phase, TheatrePerformance } from '@/types/performances.types';
import { Visitor } from '@/types/users.types';

export type RootPerformanceState = {
    performances: TheatrePerformance[];
    activePerformance: TheatrePerformance;
    phases: Phase[];
    games: Game[];
    activePhase: Phase;
    sortedProducts?: [];
    visitors: Visitor[];
};
export const usePerformanceStore = defineStore({
    id: 'performance',
    state: () =>
        ({
            performances: [] as TheatrePerformance[],
            phases: [] as Phase[],
            games: [] as Game[],
            activePerformance: {},
            activePhase: {},
            visitors: [] as Visitor[],
            sortedProducts: [],
        } as RootPerformanceState),

    getters: {
        statePerformances(state): TheatrePerformance[] {
            return state.performances;
        },
        getPerformance: (state) => {
            return (id: string) => state.performances.find((i) => i._id === id);
        },
        getGame: (state) => {
            return (id: string) => state.games.find((i) => i._id === id);
        },
        getActivePerformance: (state) => {
            return state.performances.find((p) => p.active) || undefined;
        },
        getActivePhase: (state) => {
            return state.phases.find((p) => p.active) || undefined;
        },
        getVisitors: (state) => {
            return state.visitors;
        },
    },
    actions: {
        async getPerformanceById(id: string): Promise<TheatrePerformance> {
            return await PerformanceService.getPerformanceById(id);
        },
        async getGameById(id: string): Promise<TheatrePerformance> {
            return await PerformanceService.getGameById(id);
        },
        async addPerformance(newPerformance: TheatrePerformance) {
            const performance: TheatrePerformance =
                await PerformanceService.addPerformance(newPerformance);
            this.performances.push(performance);
            return performance;
        },
        async getPerformances() {
            this.performances = await PerformanceService.getPerformances();
            this.getActivePerformance;
        },
        async getPhases() {
            this.phases = await PerformanceService.getPhases();
            return this.phases;
        },
        async getGames() {
            this.games = await PerformanceService.getGames();
            return this.games;
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
        async archiveWholeAudience(
            p: TheatrePerformance
        ): Promise<TheatrePerformance> {
            return await PerformanceService.archiveAudience(p);
        },
        async addPhase(newPhase: Phase) {
            const phase: Phase = await PerformanceService.addPhase(newPhase);
            console.log(phase);
            return phase;
        },

        async addGame(newGame: Game) {
            const game: Game = await PerformanceService.addGame(newGame);
            return game;
        },

        async editPhase(p: Phase): Promise<Phase> {
            p.active = !p.active;
            return await PerformanceService.editPhase(p);
        },

        async editGame(g: Game): Promise<Game> {
            console.log('game in editGame performance.store', g);
            return await PerformanceService.editGame(g);
        },

        async getCurrentPerformanceVisitors(id: string): Promise<Visitor[]> {
            this.visitors =
                await PerformanceService.getCurrentPerformanceVisitors(id);
            return this.visitors;
        },

        async updateVisitors(visitors: Array<any>): Promise<Visitor[]> {
            console.log(visitors);
            this.visitors = await PerformanceService.updateVisitors(visitors);
            return this.visitors;
        },

        async getActorCapsuleVisitors(colour: string) {
            console.log('HALLO');
            this.visitors = await PerformanceService.fetchActorCapsuleVisitors(
                colour
            );
            return this.visitors;
        },
        async getActorCapsuleProducts(colour: string): Promise<any> {
            this.sortedProducts =
                await PerformanceService.fetchActorCapsuleProducts(colour);
            return this.sortedProducts;
        },
    },
});
