import { defineStore } from 'pinia';
import api from '@/services/api';

export const useDataVisStore = defineStore('dataVis', {
    state: () => {
        return {
            productsQuestionnaireResults: [] as Product[],
        };
    },
    getters: {},
    actions: {
        async getQuestionnaireResultsFromCSV() {
            return await api.get('/products-vis').then((data) => {
                return data;
            });
        },
    },
});
