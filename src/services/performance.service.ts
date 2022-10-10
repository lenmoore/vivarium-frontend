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

    async editPerformance() {}

    async deletePerformance() {}
}
export default new PerformanceService();
