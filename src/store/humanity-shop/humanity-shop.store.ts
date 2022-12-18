import { defineStore } from 'pinia';
import ProductService from '@/services/humanity-shop/product.service';
import { useVisitorStore } from '@/store/visitor.store';
import BasketService from '@/services/humanity-shop/basket.service';

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
        getBaskets: (state) => {
            return state.baskets;
        },
    },
    actions: {
        async getProductById(id: string): Promise<Product> {
            return await ProductService.fetchProductById(id);
        },
        async fetchProducts() {
            this.products = await ProductService.fetchProducts();
        },
        async fetchBaskets() {
            this.baskets = await ProductService.fetchBaskets();
        },
        async getVisitorBasket() {
            const visitorStore = useVisitorStore();

            console.log(
                'visitorStore.getVisitor._id',
                visitorStore.getVisitor._id
            );
            return await BasketService.getBasketByVisitorId(
                visitorStore.getVisitor._id
            ).then((data) => {
                // console.log(data);
                visitorStore.visitor.basket = data;
                return data;
            });
        },
        async updateBasket(basket: Basket) {
            const b = await BasketService.updateBasket(basket);
            return b;
        },
        async updateProduct(product: any) {
            console.log(product);
            return await BasketService.updateProduct(product);
        },
        async updateProductFuchsia(fuchsia: any, product: any) {
            console.log(product);
            return await BasketService.updateProductFuchsia(fuchsia, product);
        },
    },
    persist: true,
});
