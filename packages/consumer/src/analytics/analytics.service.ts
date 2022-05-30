import { Injectable } from '@nestjs/common';
import {AnalyticsEventDto} from "./dto/analytics-event.dto";

@Injectable()
export class AnalyticsService {
    private readonly n = Infinity;
    private readonly numberOfItemsToSelect = 10;
    private readonly reservoir: AnalyticsEventDto[] = [];
    private currentEventIndex = 0;

    getTenRandomEvents(event: AnalyticsEventDto): AnalyticsEventDto[] {
        return this.selectEvents(event);
    }

    // A function to randomly select
    // k items from stream[0..n-1].
    private selectEvents(event) {
        if (this.currentEventIndex < this.numberOfItemsToSelect) {
            console.log(1);
            this.reservoir.push(event);
            this.currentEventIndex++;
        } else if (this.currentEventIndex < this.n) {
            console.log(2);
            let j = this.getRandomFromZeroTo(this.numberOfItemsToSelect);
            console.log(j, this.numberOfItemsToSelect);
            if (j < this.numberOfItemsToSelect) {
                console.log(JSON.stringify(this.reservoir[j]));
                this.reservoir[j] = event;
                console.log(JSON.stringify(this.reservoir[j]));
            }
        }
        return [...this.reservoir];
    }

    private getRandomFromZeroTo(i: number): number {
        return Math.floor(Math.random() * 100000000) % (i + 1);
    }
}
