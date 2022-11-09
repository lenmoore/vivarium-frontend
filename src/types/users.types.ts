import { TheatrePerformance } from '@/types/performances.types';

interface IUser {
    _id: '';
    name?: string;
    username?: string;
    accessToken?: string;
    refreshToken?: string;
}

export class User implements IUser {
    _id: '';
    name: string;
    username: string;
    accessToken: string;
    refreshToken: string;
    admin: boolean;

    constructor(user: any) {
        this._id = user._id;
        this.name = user.name;
        this.username = user.username;
        this.accessToken = user.accessToken;
        this.refreshToken = user.refreshToken;
        this.admin = user.admin;
    }

    static fromJSON(json: any): User {
        return new User({
            _id: json?._id,
            name: json?.name,
            username: json?.username,
            accessToken: json?.accessToken,
            refreshToken: json?.refreshToken,
        });
    }
}

export class Visitor implements IUser {
    accessToken: string;
    _id: '';
    visitorId: '';
    name: string;
    refreshToken: string;
    username: string;
    wardrobe_number: number;
    email: string;
    wants_newsletter: boolean;
    wants_summary: boolean;
    performance: TheatrePerformance;
    basket?: Basket;
    quiz_results?: [];

    constructor(user: any) {
        this._id = user._id;
        this.visitorId = user.visitorId;
        this.name = 'visitor';
        this.email = user.email || '';
        this.username = user.wardrobe_number + '_' + Date.now();
        this.accessToken = user.accessToken;
        this.refreshToken = user.refreshToken;
        this.performance = user.performance;
        this.wants_summary = user.wants_summary || false;
        this.wants_newsletter = user.wants_newsletter || false;
        this.wardrobe_number = user.wardrobe_number;
        this.basket = user.basket;
        this.quiz_results = user.quiz_results || [];
    }

    static fromJSON(json: any) {
        return new Visitor({
            _id: json.id,
            name: json?.name,
            email: json.email || '',
            username: json.username,
            accessToken: json.accessToken,
            refreshToken: json.refreshToken,
            performance: json.performance,
            wants_summary: json.wants_summary,
            wants_newsletter: json.wants_newsletter,
            wardrobe_number: json.wardrobe_number,
            basket: json.basket,
            quiz_results: json.quiz_results,
        });
    }

    static toJSON(visitor: Visitor): object {
        return {
            id: visitor._id,
            name: visitor?.name,
            email: visitor?.email || '',
            username: visitor?.username,
            performance: visitor?.performance,
            wants_summary: visitor?.wants_summary,
            wants_newsletter: visitor?.wants_newsletter,
            wardrobe_number: visitor?.wardrobe_number,
            basket: visitor?.basket,
            quiz_results: visitor?.quiz_results,
        };
    }
}
