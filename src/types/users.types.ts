interface IUser {
    id: '';
    name?: string;
    username?: string;
    accessToken?: string;
    refreshToken?: string;
}

class User implements IUser {
    id: '';
    name: string;
    username: string;
    accessToken: string;
    refreshToken: string;

    constructor(user: any) {
        this.id = user.id;
        this.name = user.name;
        this.username = user.username;
        this.accessToken = user.accessToken;
        this.refreshToken = user.refreshToken;
    }

    static fromJSON(json: any): User {
        return new User({
            id: json?.id,
            name: json?.name,
            username: json?.username,
            accessToken: json?.accessToken,
            refreshToken: json?.refreshToken,
        });
    }
}

class Visitor implements IUser {
    accessToken: string;
    id: '';
    name: string;
    refreshToken: string;
    username: string;
    wardrobeNumber: number;
    email: string;
    wantsNewsletter: boolean;
    wantsSummary: boolean;
    performance: TheatrePerformance;
    basket?: Basket;

    constructor(user: any) {
        this.id = user.id;
        this.name = 'visitor';
        this.email = user.email || '';
        this.username =
            user.wardrobeNumber + '_' + user.performance.date.toString();
        this.accessToken = user.accessToken;
        this.refreshToken = user.refreshToken;
        this.performance = user.performance;
        this.wantsSummary = user.wantsSummary || false;
        this.wantsNewsletter = user.wantsNewsletter || false;
        this.wardrobeNumber = user.wardrobeNumber;
        this.basket = user.basket;
    }

    static fromJSON(json: any) {
        return new Visitor({
            id: json.id,
            name: json?.name,
            email: json.email || '',
            username: json.username,
            accessToken: json.accessToken,
            refreshToken: json.refreshToken,
            performance: json.performance,
            wantsSummary: json.wants_summary,
            wantsNewsletter: json.wants_newsletter,
            wardrobeNumber: json.wardrobe_number,
            basket: json.basket,
        });
    }
}
