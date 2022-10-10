import { defineStore } from 'pinia';
import ProductService from '@/services/humanity-shop/product.service';

export type RootHumanityShopState = {
    products: Product[];
    baskets: Basket[];
};

export const useHumanityShopStore = defineStore({
    id: 'humanity-shop',
    state: () =>
        ({
            products: [] as Product[],
            baskets: [] as Basket[],
        } as RootHumanityShopState),
    getters: {},
    actions: {
        async getProducts() {
            this.products = await ProductService.getProducts();
        },
    },
});
