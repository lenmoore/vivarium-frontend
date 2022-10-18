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

interface Basket {
    id: string;
    products?: Product[];
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
