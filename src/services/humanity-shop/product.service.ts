import api from '@/services/api';

class ProductService {
    async fetchProducts(): Promise<Product[]> {
        return await api.get(`/products`).then(({ data }) => {
            return data;
        });
    }
    async fetchBaskets(): Promise<Basket[]> {
        return await api.get(`/baskets`).then(({ data }) => {
            return data;
        });
    }

    async fetchProductById(id: string): Promise<Product> {
        return await api.get(`/products/${id}`).then(({ data }) => {
            return data;
        });
    }
}

export default new ProductService();
