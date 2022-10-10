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
