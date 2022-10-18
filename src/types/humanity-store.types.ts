interface IProduct {
    id?: string; // todo remove ? when db works
    name: string;
    price?: number;
    humanity_values?: {
        green: { average: number; entries: [] };
        red: { average: number; entries: [] };
        blue: { average: number; entries: [] };
        orange: { average: number; entries: [] };
    };
    imageUrl?: string;
    qrCode?: string;
}

interface IBasket {
    id: string;
    products?: Product[];
}

class Basket implements IBasket {
    id: string;
    products?: Product[];
    basketId?: string;
    constructor(basket: any) {
        this.id = basket.id;
        this.basketId = basket.basketId;
        this.products = basket?.products;
    }
}

class Product implements IProduct {
    constructor(product: any) {
        this.name = product.name;
        this.id = product.productId;
        this.humanity_values = product.humanity_values;
        this.price = product.price;
        this.qrCode = product.qr_code;
    }

    id?: string;
    name: string;
    price?: number;
    humanity_values?: {
        green: { average: number; entries: [] };
        red: { average: number; entries: [] };
        blue: { average: number; entries: [] };
        orange: { average: number; entries: [] };
    };
    imageUrl?: string;
    qrCode?: string;
}
