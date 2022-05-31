import { Injectable } from '@nestjs/common';
import { AnalyticsEventDto } from "./dto/analytics-event.dto";

@Injectable()
export class AnalyticsService {
    private readonly n = Infinity;
    private readonly numberOfItemsToSelect = 10;
    private readonly reservoir: AnalyticsEventDto[] = [];
    private currentEventIndex = 0;
    private currentClickEventIndex = 0;

    getEachTenthEvent(event: AnalyticsEventDto): AnalyticsEventDto | null {
        if (event.type === 'click') {
            this.currentClickEventIndex++;
            return this.currentClickEventIndex % 10 === 0 ? event : null;
        } else {
            return null;
        }
    }

    getTenRandomEvents(event: AnalyticsEventDto): AnalyticsEventDto[] {
        return this.selectEvents(event);
    }

    private selectEvents(event) {
        if (this.currentEventIndex < this.numberOfItemsToSelect) {
            this.reservoir.push(event);
            this.currentEventIndex++;
        } else if (this.currentEventIndex < this.n) {
            let j = this.getRandomFromZeroTo(this.currentEventIndex);
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
        return Math.round(Math.random() * i);
    }
}
