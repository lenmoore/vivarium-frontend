import api from '@/services/api';

class ProductService {
    async fetchProducts(): Promise<Product[]> {
        return await api.get(`/products`).then(({ data }) => {
            return data;
        });
    }
}

export default new ProductService();
