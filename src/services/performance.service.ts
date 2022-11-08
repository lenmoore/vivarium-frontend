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
        return await api
            .put(`/performances/${payload.performanceId}`, payload, {
                params: {
                    performanceId: payload.performanceId,
                },
            })
            .then(({ data }) => {
                return data;
            });
    }

    async editPhase(payload: any) {
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

    async deletePerformance() {}

    async addVisitor(newVisitor: Visitor) {
        return await api.post(`/visitors`, newVisitor).then(({ data }) => {
            return data;
        });
    }

    async getVisitor(id: string) {}
}
export default new PerformanceService();
