import api from '@/services/api';

class BasketService {
    async getBasketByVisitorId(visitorId: string): Promise<Basket> {
        return await api
            .get(`/baskets/visitor/${visitorId}`)
            .then(({ data }) => {
                console.log(data);
                return data;
            });
    }

    async updateBasket(basket: Basket): Promise<Basket> {
        return await api
            .put(`/baskets/${basket.basketId}`, basket)
            .then(({ data }) => {
                return data;
            });
    }
}

export default new BasketService();
