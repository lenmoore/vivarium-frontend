import { defineStore } from 'pinia';
import { usePerformanceStore } from '@/store/performance.store';
import PerformanceService from '@/services/performance.service';
import { Visitor } from '@/types/users.types';

export type RootVisitorState = {
    visitor: Visitor;
};
export const useVisitorStore = defineStore({
    id: 'visitor',
    state: () =>
        ({
            visitor: {} as Visitor,
        } as RootVisitorState),
    getters: {
        getVisitor(state) {
            return state.visitor;
        },
    },
    actions: {
        async login(visitor: Visitor) {
            return await PerformanceService.addVisitor(visitor).then((data) => {
                console.log(data);
                localStorage.accessToken = data.accessToken;
                this.visitor = new Visitor(data);
                // todo add visitor to performance also
                return data;
            });
        },
        async editVisitor(visitor: Visitor): Promise<Visitor> {
            const result = await PerformanceService.editVisitor(visitor);
            console.log(result);
            this.visitor = new Visitor(result);
            return result;
        },
    },
    persist: true,
});
