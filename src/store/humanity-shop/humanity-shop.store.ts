import { defineStore } from 'pinia';
import ProductService from '@/services/humanity-shop/product.service';
import { useVisitorStore } from '@/store/visitor.store';
import BasketService from '@/services/humanity-shop/basket.service';

const visitorStore = useVisitorStore();
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
    getters: {
        getProducts: (state) => {
            return state.products;
        },
    },
    actions: {
        async fetchProducts() {
            this.products = await ProductService.fetchProducts();
        },
        async getVisitorBasket() {
            return await BasketService.getBasketByVisitorId(
                visitorStore.getVisitor.visitorId
            ).then((data) => {
                console.log(data);
                visitorStore.visitor.basket = data;
                return data;
            });
        },
    },
    persist: true,
});
