import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {join} from "path";
import {ServeStaticModule} from "@nestjs/serve-static";
import {AnalyticsModule} from "./analytics/analytics.module";

@Module({
  imports: [
      AnalyticsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
