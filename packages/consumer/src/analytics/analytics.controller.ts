import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {ClientKafka, Ctx, KafkaContext, MessagePattern, Payload} from '@nestjs/microservices';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    @Inject('ANALYTICS_SERVICE') private readonly client: ClientKafka,
  ) {}

  @MessagePattern('analytics')
  readAllMessages(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const event = originalMessage.value as any;
    const response =
        `New event: ${event.type} on ${event.targetId}`;
    console.log(response);
    console.log('-------------------------------');
    return response;
  }

  @MessagePattern('analytics')
  readTenRandomMessages(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const event = originalMessage.value as any;
    const tenRandomEvents = this.analyticsService.getTenRandomEvents(event);
    const response =
        `10 random messages: ` + tenRandomEvents.map((event) => {
          return `        ${event.type} on ${event.targetId}, ${new Date(event.timestamp)}`;
        }).join(';\n');
    console.log(response);
    console.log('-------------------------------');
    return response;
  }
}
