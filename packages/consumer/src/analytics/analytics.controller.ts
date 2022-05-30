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
  readMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const response =
        `Receiving a new message from topic: analytics: ` +
        JSON.stringify(originalMessage.value);
    console.log(response);
    return response;
  }
}
