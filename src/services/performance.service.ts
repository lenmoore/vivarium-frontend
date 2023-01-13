import api from '@/services/api';
import { Visitor } from '@/types/users.types';
import { Game, Phase, TheatrePerformance } from '@/types/performances.types';

class PerformanceService {
    async addPerformance(
        newPerformance: TheatrePerformance
    ): Promise<TheatrePerformance> {
        return await api
            .post(`/performances`, newPerformance)
            .then(({ data }) => {
                return data;
            });
    }

    async addPhase(newPhase: Phase): Promise<Phase> {
        return await api.post(`/phases`, newPhase).then(({ data }) => {
            return data;
        });
    }

    async addGame(newGame: Game): Promise<Game> {
        return await api.post(`/games`, newGame).then(({ data }) => {
            return data;
        });
    }

    async getPhases(): Promise<Phase[]> {
        return await api.get(`/phases`).then(({ data }) => {
            return data;
        });
    }

    async getGames(): Promise<Game[]> {
        return await api.get(`/games`).then(({ data }) => {
            return data;
        });
    }

    async getPerformances(): Promise<TheatrePerformance[]> {
        return await api.get(`/performances`).then(({ data }) => {
            return data;
        });
    }

    async getPerformanceById(id: string): Promise<TheatrePerformance> {
        return await api.get(`/performances/${id}`, {}).then(({ data }) => {
            return data;
        });
    }

    async getGameById(id: string): Promise<Game> {
        return await api.get(`/games/${id}`, {}).then(({ data }) => {
            return data;
        });
    }

    async editPerformance(payload: any) {
        console.log(payload);
        return await api
            .put(`/performances/${payload._id}`, payload, {
                params: {
                    performanceId: payload._id,
                },
            })
            .then(({ data }) => {
                console.log(data);
                return data;
            });
    }

    async archiveAudience(payload: any) {
        console.log(payload);
        return await api
            .put(`/performances/${payload._id}/archive-visitors`, payload, {
                params: {
                    performanceId: payload._id,
                },
            })
            .then(({ data }) => {
                console.log(data);
                return data;
            });
    }

    async editPhase(payload: any) {
        if (typeof payload.phase_game === 'object') {
            payload.phase_game = payload.phase_game._id;
        }
        return await api
            .put(`/phases/${payload.phaseId}`, payload, {
                params: {
                    phaseId: payload.phaseId,
                },
            })
            .then(({ data }) => {
                return data;
            });
    }

    async editGame(payload: any) {
        return await api
            .put(`/games/${payload.gameId}`, payload, {
                params: {
                    gameId: payload.gameId,
                },
            })
            .then(({ data }) => {
                return data;
            });
    }

    async editVisitor(payload: any) {
        if (payload.basket) {
            payload = {
                ...payload,
                basket: {
                    ...payload?.basket,
                    basket_id: payload?.basket && payload?.basket?.basketId,
                },
            };
        }
        console.log('------------------------payload', payload);

        return await api
            .put(
                `/visitors/${payload.visitorId}`,
                {
                    ...payload,
                },
                {
                    params: {
                        visitorId: payload.visitorId,
                    },
                }
            )
            .then(({ data }) => {
                console.log(data);
                return data;
            });
    }

    async editVisitorStep(payload: any) {
        console.log('------------------------payload', payload);
        return await api
            .put(
                `/visitors/${payload.visitorId}/quiz-results/${payload.step.stepId}`,
                {
                    ...payload,
                },
                {
                    params: {
                        visitorId: payload.visitorId,
                        stepId: payload.stepId,
                    },
                }
            )
            .then(({ data }) => {
                return data;
            });
    }

    async addVisitor(newVisitor: Visitor) {
        return await api.post(`/visitors`, newVisitor).then(({ data }) => {
            return data;
        });
    }

    async getVisitor(id: string) {
        return await api.get(`/visitors/${id}`).then(({ data }) => {
            return data;
        });
    }

    async getCurrentPerformanceVisitors(performance: string) {
        return await api
            .get(`/performance-visitors/${performance}`)
            .then(({ data }) => {
                return data;
            });
    }

    async updateVisitors(visitors: Array<Visitor>) {
        console.log(visitors);
        return await api
            .put('/visitors-update/colors', visitors)
            .then(({ data }) => {
                return data;
            });
    }

    async getVisitors() {
        return await api.get('/visitors').then(({ data }) => {
            return data;
        });
    }

    async deleteVisitor(visitor: Visitor): Promise<Visitor> {
        return await api
            .delete('/visitors/' + visitor.visitorId)
            .then(({ data }) => {
                return data;
            });
    }

    //     app.get(
    //     '/api/actor-state/audience-list',
    //     [requireUser],
    //     getActorStateAudienceListHandler
    // );
    async fetchActorCapsuleVisitors(colour: string) {
        return await api
            .get('/actor-state/audience-list?colour=' + colour)
            .then(({ data }) => {
                return data;
            });
    }

    async fetchActorState() {
        return await api.get('/actor-state').then(({ data }) => {
            return data;
        });
    }

    async editActorStateSetTimer(update: any) {
        return await api.put('/actor-state', update).then(({ data }) => {
            return data;
        });
    }

    async fetchActorCapsuleProducts(colour: string) {
        console.log(colour);
        return await api
            .get('/actor-state/products-in-capsule?colour=' + colour)
            .then(({ data }) => {
                console.log(data);
                return data;
            });
    }

    //     app.get(
    //     '/api/actor-state/products-in-capsule',
    //     [requireUser],
    //     getActorStateProductsHandler
    // );
    //
    //     app.get('/api/actor-state', [requireUser], getActorStateHandler);
    //     app.put('/api/actor-state', [requireUser], updateActorStateHandler);
    //     app.post('/api/actor-state', [requireUser], createActorStateHandler);
}

export default new PerformanceService();
