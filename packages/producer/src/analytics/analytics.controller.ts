import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ClientKafka } from '@nestjs/microservices';
import { AnalyticsEventDto } from './dto/analytics-event.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    @Inject('ANALYTICS_SERVICE') private readonly client: ClientKafka,
  ) {}

  @Post('event')
  testKafka(@Body() event: AnalyticsEventDto) {
    return this.client.emit('analytics', event);
  }
}
