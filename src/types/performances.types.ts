import { Visitor } from '@/types/users.types';

export class Phase {
    _id?: string;
    name?: string;
    orderNumber?: number;
    description?: string;
    active?: boolean;
    phase_game?: Game;
    startedAt?: Date;
    endedAt?: Date;
}

export class Step {
    question_text?: string;
    question_options?: [
        {
            option_text: '';
            humanity_values: {
                green: 0;
                red: 0;
                blue: 0;
                orange: 0;
            };
        }
    ];
}

export class Game {
    _id?: string;
    name?: string;
    pre_capsule?: boolean;
    open_for_colors?: string[];
    game_type?: string;
    game_steps?: Step[];
    game_players?: Visitor[];
}

interface IPerformance {
    _id?: string;
    title?: string;
    date?: Date;
    phases?: Phase[];
}

export class TheatrePerformance implements IPerformance {
    _id?: string;
    title?: string;
    date?: Date;
    phases?: Phase[];
    visitors?: Visitor[];
    active?: boolean;

    constructor(performance: any) {
        this.title = performance.title;
        this._id = performance._id;
        this.date = performance.date;
        this.phases = performance.phases;
        this.visitors = performance.visitors;
        this.active = performance.active;
    }

    static fromJSON(json: any): TheatrePerformance {
        return new TheatrePerformance({
            _id: json?.__id,
            title: json?.string,
            date: json?.Date,
            phases: json?.phases,
            visitors: json?.visitors,
            active: json?.active,
        });
    }
}
