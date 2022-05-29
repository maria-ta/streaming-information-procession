import { EventType } from '../enums/event-type.enum';

export interface AnalyticsEventDto {
  type: EventType;
  url: string;
  targetId: string;
  timestamp: number;
}
