interface IProduct {
    id?: number; // todo remove ? when db works
    name: string;
    price?: number;
    humanityValues?: {
        red?: number;
        blue?: number;
        green?: number;
        orange?: number;
    };
    imageUrl?: string;
    qrCode?: string;
}

interface Basket {
    id: number;
}

class Product implements IProduct {
    constructor(name: string) {
        this.name = name;
    }

    name: string;
}

class ProductVisualisation implements IProduct {
    constructor(name: string) {
        this.name = name;
    }

    name: string;
    humanityValuesFromQuestionnaire?: {
        red?: {
            averageValue: number;
            responses: number;
        };
        blue?: {
            averageValue: number;
            responses: number;
        };
        green?: {
            averageValue: number;
            responses: number;
        };
        orange?: {
            averageValue: number;
            responses: number;
        };
    };
}
