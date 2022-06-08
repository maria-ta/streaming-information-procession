import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {join} from "path";
import {ServeStaticModule} from "@nestjs/serve-static";
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
