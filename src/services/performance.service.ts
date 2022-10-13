import api from '@/services/api';

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

    async getPerformances(): Promise<TheatrePerformance[]> {
        return await api.get(`/performances`).then(({ data }) => {
            return data;
        });
    }
    async getPerformanceById(id: string): Promise<TheatrePerformance> {
        return await api
            .get(`/performances/${id}`, {
                params: {
                    performanceId: id,
                },
            })
            .then(({ data }) => {
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

    async deletePerformance() {}
}
export default new PerformanceService();
