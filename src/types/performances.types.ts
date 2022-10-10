class Phase {
    id?: string;
    name?: string;
    orderNumber?: number;
    description?: string;
    isActive?: boolean;
    startedAt?: Date;
    endedAt?: Date;
}

interface IPerformance {
    id?: string;
    title: string;
    date?: Date;
    phases?: Phase[];
}

class TheatrePerformance implements IPerformance {
    id?: string;
    title: string;
    date?: Date;
    phases?: Phase[];

    constructor(performance: any) {
        this.title = performance.title;
        this.id = performance.id;
        this.date = performance.date;
        this.phases = performance.phases;
    }

    static fromJSON(json: any): TheatrePerformance {
        return new TheatrePerformance({
            id: json?._id,
            title: json?.string,
            date: json?.Date,
            phases: json?.phases,
        });
    }
}
