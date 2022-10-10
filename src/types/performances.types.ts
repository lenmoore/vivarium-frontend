class Phase {
    id?: number;
    name?: string;
    orderNumber?: number;
    description?: string;
    isActive?: boolean;
    startedAt?: Date;
    endedAt?: Date;
}

interface IPerformance {
    id?: number;
    title: string;
    date?: Date;
    phases?: Phase[];
}

class TheatrePerformance implements IPerformance {
    id?: number;
    title: string;
    date?: Date;
    phases?: Phase[];

    constructor(title: string) {
        this.title = title;
    }
}
