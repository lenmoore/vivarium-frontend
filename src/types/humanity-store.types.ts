interface IProduct {
    _id?: string;
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
    _id: string;
    products?: Product[];
}

class Basket implements IBasket {
    _id: string;
    products?: Product[];
    basketId?: string;
    constructor(basket: any) {
        this._id = basket._id;
        this.basketId = basket.basketId;
        this.products = basket?.products;
    }
}

class Product implements IProduct {
    constructor(product: any) {
        this.name = product.name;
        this._id = product.productId;
        this.humanity_values = product.humanity_values;
        this.price = product.price;
        this.qrCode = product.qr_code;
    }

    _id?: string;
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
