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
                localStorage.visitorId = data.visitorId;
                this.visitor = new Visitor(data);

                location.replace('/visitor/intro');
                return data;
            });
        },
        async editVisitor(visitor: Visitor): Promise<Visitor> {
            console.log('Payload->', visitor);
            const result = await PerformanceService.editVisitor(visitor);
            console.log('editvisitor result', result);
            this.visitor = new Visitor(result);
            return result;
        },
        async editVisitorStep(visitor: Visitor): Promise<Visitor> {
            const result = await PerformanceService.editVisitorStep(visitor);
            console.log('editvisitor step result', result);
            this.visitor = new Visitor(result);
            return result;
        },
        async fetchVisitor(id: string): Promise<Visitor> {
            console.log(id);
            return await PerformanceService.getVisitor(id).then((data) => {
                this.visitor = new Visitor(data);
                localStorage.visitor = this.visitor;
                localStorage.setItem(
                    'confirmed_humanity_value',
                    data.confirmed_humanity_value
                );
                console.log(data);
                return data;
            });
        },
        async fetchVisitorByDateAndNumber(
            date: string,
            wardrobeNumber: number
        ): Promise<Visitor> {
            console.log(date, wardrobeNumber);
            return await PerformanceService.getVisitorByDateNumber(
                date,
                wardrobeNumber
            ).then((data) => {
                console.log(data);
                return data;
            });
        },
        async fetchVisitorsByDate(date: string): Promise<Visitor> {
            return await PerformanceService.getVisitorByDate(date).then(
                (data) => {
                    console.log(data);
                    return data;
                }
            );
        },
    },
    persist: true,
});
